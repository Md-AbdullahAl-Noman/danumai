"use server";

import { createApplication } from "@/lib/data/submissions";
import { sendMail } from "@/lib/mailer";

export type ApplyState = {
  status: "success" | "error";
  message?: string;
};

export async function sendApplication(
  jobTitle: string,
  formData: FormData
): Promise<ApplyState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const portfolio = String(formData.get("portfolio") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!name || !email || !note) {
    return { status: "error", message: "Please fill in every field." };
  }

  try {
    await createApplication({ jobTitle, name, email, portfolio, note });

    // Notify the site inbox. Don't fail the submission if the email can't be
    // delivered — the application is already stored and visible in the admin panel.
    try {
      await sendMail({
        to: process.env.GMAIL_USER!,
        replyTo: email,
        subject: `New application: ${jobTitle}`,
        text: `Job: ${jobTitle}\nName: ${name}\nEmail: ${email}\nPortfolio: ${portfolio || "—"}\n\n${note}`,
      });
    } catch (mailErr) {
      console.error("application notification email failed", mailErr);
    }

    return { status: "success" };
  } catch (err) {
    console.error("createApplication failed", err);
    return {
      status: "error",
      message: "Something went wrong. Try again.",
    };
  }
}
