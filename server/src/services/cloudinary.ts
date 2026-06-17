import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary if CLOUDINARY_URL is available
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.includes("mock_cloud")) {
  cloudinary.config({
    secure: true,
  });
}

export class CloudinaryService {
  static async uploadImage(fileBuffer: Buffer, folder: string = "maaya"): Promise<string> {
    if (!process.env.CLOUDINARY_URL || process.env.CLOUDINARY_URL.includes("mock_cloud")) {
      console.log(`[Cloudinary Mock] Uploaded image to folder: ${folder}`);
      // Return a random beautiful unsplash image as mock URL
      return "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800";
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, resource_type: "image" }, (error: any, result: any) => {
          if (error || !result) {
            return reject(error || new Error("Failed to upload image to Cloudinary"));
          }
          resolve(result.secure_url);
        })
        .end(fileBuffer);
    });
  }
}
