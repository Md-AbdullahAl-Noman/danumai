import { query } from "@/lib/db";

// Submissions are the "people" side of the site: job applications from the
// careers page and messages from the contact form. They share the same shape
// in the admin panel (someone reaching out, plus a read flag), so the read/
// list/delete helpers for both live together here.

export type Application = {
  id: string;
  jobTitle: string;
  name: string;
  email: string;
  portfolio: string;
  note: string;
  read: boolean;
  createdAt: string;
};

type ApplicationRow = {
  id: string;
  job_title: string;
  name: string;
  email: string;
  portfolio: string;
  note: string;
  read: boolean;
  created_at: string;
};

function mapApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    jobTitle: row.job_title,
    name: row.name,
    email: row.email,
    portfolio: row.portfolio,
    note: row.note,
    read: row.read,
    createdAt: row.created_at,
  };
}

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  read: boolean;
  created_at: string;
};

function mapContactMessage(row: ContactMessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    topic: row.topic,
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
  };
}

// --- Applications ---------------------------------------------------------

export async function createApplication(input: {
  jobTitle: string;
  name: string;
  email: string;
  portfolio: string;
  note: string;
}): Promise<void> {
  await query(
    `INSERT INTO applications (job_title, name, email, portfolio, note)
     VALUES ($1, $2, $3, $4, $5)`,
    [input.jobTitle, input.name, input.email, input.portfolio, input.note]
  );
}

export async function listApplications(): Promise<Application[]> {
  const res = await query<ApplicationRow>(
    `SELECT * FROM applications ORDER BY created_at DESC`
  );
  return res.rows.map(mapApplication);
}

export async function setApplicationRead(id: string, read: boolean): Promise<void> {
  await query(`UPDATE applications SET read = $2 WHERE id = $1`, [id, read]);
}

export async function deleteApplication(id: string): Promise<void> {
  await query(`DELETE FROM applications WHERE id = $1`, [id]);
}

// --- Contact messages -----------------------------------------------------

export async function createContactMessage(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
}): Promise<void> {
  await query(
    `INSERT INTO contact_messages (name, email, topic, message)
     VALUES ($1, $2, $3, $4)`,
    [input.name, input.email, input.topic, input.message]
  );
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  const res = await query<ContactMessageRow>(
    `SELECT * FROM contact_messages ORDER BY created_at DESC`
  );
  return res.rows.map(mapContactMessage);
}

export async function setContactMessageRead(id: string, read: boolean): Promise<void> {
  await query(`UPDATE contact_messages SET read = $2 WHERE id = $1`, [id, read]);
}

export async function deleteContactMessage(id: string): Promise<void> {
  await query(`DELETE FROM contact_messages WHERE id = $1`, [id]);
}
