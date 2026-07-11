"use server";

import { resend } from "@/lib/resend";
import { createContactMessage } from "@/lib/data/submissions";

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

  // Persist first so the message is recorded in the admin panel even if the
  // notification email later fails to send.
  try {
    await createContactMessage({ name, email, topic, message });
  } catch (err) {
    console.error("createContactMessage failed", err);
  }

  try {
    const { error } = await resend.emails.send({
      from: "Danumai Site <site@danumai.com>",
      to: "hello@danumai.com",
      replyTo: email,
      subject: `[${topic}] Message from ${name}`,
      text: `${message}\n\n—\n${name}\n${email}`,
    });
    if (error) throw error;
    return { status: "success" };
  } catch (err) {
    console.error("sendContactMessage failed", err);
    return {
      status: "error",
      message: "Something went wrong. Try again or email us directly.",
    };
  }
}
