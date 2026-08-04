import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.APP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, body: string,) {
  const info = await transporter.sendMail({
    from: process.env.MY_EMAIL,
    to, // short hand for (to : to) or what we pass as parameter ex: recipient so it become (to:recipient)
    subject,
    text: body,
  });
  return info.messageId;
}