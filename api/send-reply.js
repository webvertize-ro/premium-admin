import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, subject, message, fromName } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text: message,
      html: `
      
      <div style="font-family: sans-serif; max-width: 600px;">
          <p>${message.replace(/\n/g, "<br/>")}</p>
          <hr/>
          <p style="color: #6b7280; font-size: 12px;">
            Acest email a fost trimis ca răspuns la solicitarea dumneavoastră.
          </p>
        </div>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email send error: ", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
