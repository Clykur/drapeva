import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const Route = createFileRoute("/auth/otp")({
  head: () => ({
    meta: [
      { title: "OTP Verification — Maaya Couture" },
      { name: "description", content: "Verify your phone number with a one-time passcode." },
    ],
  }),
  component: OtpVerification,
});

function OtpVerification() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return toast.error("Phone number is required");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.success("OTP sent to your phone number (Use 123456 to test)");
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.auth.otpVerify({ phone, code });
      toast.success("Phone verified successfully");
      router.navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75svh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md border border-border bg-champagne/30 p-8 md:p-10 shadow-soft">
        <div className="text-center">
          <p className="eyebrow text-gold">Verification</p>
          <h1 className="mt-3 font-display text-3xl">OTP Verification</h1>
          <span className="gold-divider mt-4 block mx-auto" />
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="mt-8 space-y-5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Verify your mobile number to receive shipping status SMS logs or finalize consultation
              schedules.
            </p>
            <label className="block">
              <span className="eyebrow mb-2 block">Phone Number</span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                placeholder="e.g. +91 98765 43210"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground py-4 text-xs font-medium tracking-[0.25em] uppercase text-background transition-colors hover:bg-gold hover:text-gold-foreground disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              A 6-digit code has been dispatched to +{phone.replace(/[^0-9]/g, "")}. Enter the pin
              to finalize setup.
            </p>
            <label className="block">
              <span className="eyebrow mb-2 block">6-Digit Code</span>
              <input
                type="text"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-center text-lg tracking-[0.5em] focus:border-foreground focus:outline-none"
                placeholder="000000"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground py-4 text-xs font-medium tracking-[0.25em] uppercase text-background transition-colors hover:bg-gold hover:text-gold-foreground disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-muted-foreground hover:text-foreground border-b border-dashed border-muted-foreground pb-0.5"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
