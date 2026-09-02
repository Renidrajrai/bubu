import bcrypt from "bcryptjs";
import { loadEnvLocal } from "../lib/env";
import { connectDB } from "../lib/mongodb";
import { Settings } from "../models/Settings";

loadEnvLocal();

async function main() {
  await connectDB();
  const newPassword = process.env.ADMIN_PASSWORD || "Patake98";
  const hash = await bcrypt.hash(newPassword, 12);
  const hex = Buffer.from(hash, "utf8").toString("hex");
  await Settings.findOneAndUpdate({}, { adminPasswordHashHex: hex }, { upsert: true });
  console.log("admin password updated in database");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("set-admin-password failed:", err);
    process.exit(1);
  });
