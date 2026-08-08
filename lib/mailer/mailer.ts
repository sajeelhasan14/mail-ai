import MailComposer from "nodemailer/lib/mail-composer";
import { getGmailClient } from "../gmail";

type Attachment = { filename: string; content: string };

export async function sendEmail(
  from: string,
  refreshToken: string,
  to: string,
  subject: string,
  body: string,
  attachements: Attachment[] = [],
) {
  const mail = new MailComposer({
    from,
    to,
    subject,
    text: body,
    attachments: attachements.map((a) => ({
      filename: a.filename,
      content: a.content,
      encoding: "base64",
    })),
  });
  const raw = (await mail.compile().build()).toString("base64url");
  const gmail = getGmailClient(refreshToken);

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw }
  });
  return res.data.id
}
