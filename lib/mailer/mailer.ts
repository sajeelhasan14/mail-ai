import nodemailer from "nodemailer";

export async function sendEmail(
  from: string,
  refreshToken: string,
  to: string,
  subject: string,
  body: string,
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: from,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken,
    },
  });
  const info = await transporter.sendMail({ from, to, subject, text: body });
  return info.messageId;
}
