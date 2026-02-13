import nodemailer from "nodemailer";

export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "benitezlucasebastian@gmail.com",
        pass: "xkvttjrmylwuokdo"
      }
    });
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
      from: "benitezlucasebastian@gmail.com",
      to: email,
      subject: "Recuperación de Contraseña - E-Commerce",
      html: `
        <!DOCTYPE html>
        <html>
        <body>
          <h1>Recuperación de Contraseña</h1>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Este enlace expirará en 1 hora.</p>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Email enviado exitosamente:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Error al enviar email:", error.message);
      return { success: false, error: error.message };
    }
  }

  async sendPurchaseConfirmation(email, ticket) {
    const mailOptions = {
      from: "benitezlucasebastian@gmail.com",
      to: email,
      subject: `Confirmación de Compra - Ticket ${ticket.code}`,
      html: `
        <h1>¡Compra Confirmada!</h1>
        <p>Código: ${ticket.code}</p>
        <p>Total: $${ticket.amount}</p>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Email de confirmación enviado:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Error al enviar email:", error.message);
      return { success: false, error: error.message };
    }
  }
}
