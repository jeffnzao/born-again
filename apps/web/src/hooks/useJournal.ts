"use client";

import { useState } from "react";

export interface JournalEntry {
  id: string;
  date: string;
  mood: "joyful" | "peaceful" | "struggling" | "victorious";
  content: string;
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const addEntry = (entry: JournalEntry) => {
    setEntries([...entries, entry]);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  return { entries, addEntry, deleteEntry };
}
