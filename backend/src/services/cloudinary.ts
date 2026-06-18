import { SupabaseStorageService } from "./supabase.js";

export class CloudinaryService {
  static async uploadImage(fileBuffer: Buffer, folder: string = "maaya"): Promise<string> {
    return SupabaseStorageService.uploadImage(fileBuffer, folder);
  }
}
