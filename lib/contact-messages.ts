import { promises as fs } from "fs";
import path from "path";
import type { ContactMessage } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const messagesPath = path.join(dataDir, "contact-messages.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(messagesPath);
  } catch {
    await fs.writeFile(messagesPath, "[]", "utf8");
  }
}

export async function saveContactMessage(
  message: Omit<ContactMessage, "id" | "created_at">
) {
  await ensureStore();
  const file = await fs.readFile(messagesPath, "utf8");
  const messages = JSON.parse(file) as ContactMessage[];
  const nextMessage: ContactMessage = {
    ...message,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  };

  messages.unshift(nextMessage);
  await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2), "utf8");
  return nextMessage;
}
