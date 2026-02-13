export const sendPasswordRecoveryEmail = async ({ to, resetLink }) => {
  const preview = `Para: ${to}\nAsunto: Recuperación de contraseña\nLink: ${resetLink}`;
  console.log("📧 Simulación de envío de email:\n" + preview);
};
