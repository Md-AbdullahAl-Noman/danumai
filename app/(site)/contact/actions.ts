"use server";

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

  try {
    await createContactMessage({ name, email, topic, message });
    return { status: "success" };
  } catch (err) {
    console.error("createContactMessage failed", err);
    return {
      status: "error",
      message: "Something went wrong. Try again.",
    };
  }
}
