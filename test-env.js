import dotenv from "dotenv";
dotenv.config();

console.log("=== Variables de Email ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS existe:", !!process.env.EMAIL_PASS);
console.log("EMAIL_PASS longitud:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
