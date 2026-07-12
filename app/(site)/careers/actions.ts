"use server";

import { createApplication } from "@/lib/data/submissions";

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
    return { status: "success" };
  } catch (err) {
    console.error("createApplication failed", err);
    return {
      status: "error",
      message: "Something went wrong. Try again.",
    };
  }
}
