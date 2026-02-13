import crypto from "crypto";

export const generateUniqueCode = (prefix = "") => {
  const timestamp = Date.now().toString(36);
  const randomStr = crypto.randomBytes(4).toString("hex");
  return `${prefix}${timestamp}-${randomStr}`.toUpperCase();
};