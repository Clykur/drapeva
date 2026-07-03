import crypto from "crypto";

export class TotpService {
  // Generate random base32-like hex secret
  static generateSecret(): string {
    return crypto.randomBytes(10).toString("hex").toUpperCase();
  }

  static getOtpauthUrl(email: string, secret: string): string {
    return `otpauth://totp/Drapeva:${email}?secret=${secret}&issuer=Drapeva&algorithm=SHA1&digits=6&period=30`;
  }

  // Simple TOTP validator
  static verifyToken(secret: string, token: string): boolean {
    const period = 30;
    const digits = 6;
    const epoch = Math.round(Date.now() / 1000);
    const counter = Math.floor(epoch / period);

    // Allow window of 1 step before/after to account for clock drift
    for (let i = -1; i <= 1; i++) {
      if (this.generateTOTP(secret, counter + i, digits) === token) {
        return true;
      }
    }
    return false;
  }

  private static generateTOTP(secret: string, counter: number, digits: number): string {
    // Convert secret hex string to buffer
    const key = Buffer.from(secret, "hex");

    // Convert counter to 8-byte buffer
    const buf = Buffer.alloc(8);
    let tmp = counter;
    for (let i = 7; i >= 0; i--) {
      buf[i] = tmp & 0xff;
      tmp = tmp >> 8;
    }

    const hmac = crypto.createHmac("sha1", key);
    hmac.update(buf);
    const hmacResult = hmac.digest();

    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const code =
      ((hmacResult[offset] & 0x7f) << 24) |
      ((hmacResult[offset + 1] & 0xff) << 16) |
      ((hmacResult[offset + 2] & 0xff) << 8) |
      (hmacResult[offset + 3] & 0xff);

    const otp = code % Math.pow(10, digits);
    return otp.toString().padStart(digits, "0");
  }
}
