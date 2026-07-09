"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProject,
  updateProject,
  deleteProject,
  type ProjectInput,
} from "@/lib/data/projects";
import { uploadImage, deleteImage } from "@/lib/storage";
import { slugify } from "@/lib/slugify";
import { requireAdmin } from "@/lib/auth";

export type ProjectFormState = {
  error?: string;
};

function parseFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);
}

async function readInput(formData: FormData, existingImageUrl: string | null): Promise<ProjectInput> {
  const name = String(formData.get("name") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const accent = String(formData.get("accent") ?? "#d99a4e").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const features = parseFeatures(String(formData.get("features") ?? ""));

  if (!name) throw new Error("Name is required.");

  let imageUrl = existingImageUrl;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    imageUrl = await uploadImage(file, "projects");
    if (existingImageUrl) await deleteImage(existingImageUrl);
  } else if (formData.get("removeImage") === "on" && existingImageUrl) {
    await deleteImage(existingImageUrl);
    imageUrl = null;
  }

  return {
    slug: slugify(slugRaw || name),
    name,
    tagline,
    description,
    status,
    features,
    accent,
    imageUrl,
    sortOrder,
  };
}

export async function createProjectAction(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();
  try {
    const input = await readInput(formData, null);
    await createProject(input);
  } catch (err) {
    console.error("createProjectAction failed", err);
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProjectAction(
  id: string,
  existingImageUrl: string | null,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();
  try {
    const input = await readInput(formData, existingImageUrl);
    await updateProject(id, input);
  } catch (err) {
    console.error("updateProjectAction failed", err);
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string, imageUrl: string | null) {
  await requireAdmin();
  await deleteProject(id);
  if (imageUrl) await deleteImage(imageUrl);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}
