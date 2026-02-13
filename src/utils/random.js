import crypto from "crypto";

export const createSecureToken = () => crypto.randomBytes(32).toString("hex");
export const createTicketCode = () => `TCK-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
