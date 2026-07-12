"use server";

import { createContactMessage } from "@/lib/data/submissions";
import { sendMail } from "@/lib/mailer";

export type ContactState = {
  status: "success" | "error";
  message?: string;
};

export async function sendContactMessage(
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const topic = String(formData.get("topic") ?? "General").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in every field." };
  }

  try {
    await createContactMessage({ name, email, topic, message });

    // Notify the site inbox. Don't fail the submission if the email can't be
    // delivered — the message is already stored and visible in the admin panel.
    try {
      await sendMail({
        to: process.env.GMAIL_USER!,
        replyTo: email,
        subject: `New contact message: ${topic}`,
        text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
      });
    } catch (mailErr) {
      console.error("contact notification email failed", mailErr);
    }

    return { status: "success" };
  } catch (err) {
    console.error("createContactMessage failed", err);
    return {
      status: "error",
      message: "Something went wrong. Try again.",
    };
  }
}
