import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { getSupabaseClient } from "../services/supabase.js";
import { logger } from "./logger.js";

export async function runDatabaseBackup(): Promise<string | null> {
  logger.info("[Backup] Initiating database backup...");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFilename = `drapeva_backup_${timestamp}.sql`;
  const tempPath = path.join("/tmp", backupFilename);

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1") || dbUrl === "url") {
    logger.info("[Backup] Database is local or mock — saving a simulated dump.");
    fs.writeFileSync(
      tempPath,
      `-- Drapeva Simulated Database Dump --\n-- Date: ${new Date().toISOString()}\nSELECT 1;`,
    );
  } else {
    // Run pg_dump
    await new Promise<void>((resolve, reject) => {
      exec(`pg_dump "${dbUrl}" -f "${tempPath}"`, (error) => {
        if (error) {
          logger.error("[Backup] pg_dump failed", { message: error.message });
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  // Upload to Supabase Storage if configured
  try {
    const supabase = await getSupabaseClient();
    if (supabase) {
      const fileBuffer = fs.readFileSync(tempPath);
      const { error } = await supabase.storage.from("backups").upload(backupFilename, fileBuffer, {
        contentType: "application/sql",
        upsert: true,
      });

      if (error) {
        logger.error("[Backup] Failed to upload to Supabase Storage", { message: error.message });
      } else {
        logger.info(`[Backup] Uploaded successfully: backups/${backupFilename}`);
      }
    } else {
      logger.info(`[Backup] Saved locally to: ${tempPath}`);
    }
  } catch (err: unknown) {
    logger.error("[Backup] Storage upload error", {
      message: err instanceof Error ? err.message : String(err),
    });
  } finally {
    // Clean up local temp file
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch {
        // Ignore cleanup error
      }
    }
  }

  return backupFilename;
}

// Schedule daily database backup (every 24 hours)
export function startBackupScheduler() {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  setInterval(() => {
    runDatabaseBackup().catch((err: unknown) => {
      logger.error("[Backup] Scheduled backup failed", {
        message: err instanceof Error ? err.message : String(err),
      });
    });
  }, TWENTY_FOUR_HOURS);
}
