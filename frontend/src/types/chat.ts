export interface Source {
  document: string;
  excerpt: string;
  score: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
}