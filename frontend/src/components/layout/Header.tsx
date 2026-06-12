import { Bot } from "lucide-react";
import DocumentUpload from "@/components/upload/DocumentUpload";

export default function Header() {
  return (
    <header className="border-b bg-background px-6 py-5">
 <div className="flex items-center justify-between">
  <div className="flex items-center gap-4">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
      <Bot className="h-6 w-6" />
    </div>

    <div>
      <h1 className="text-2xl font-bold">
        Support Knowledge Assistant
      </h1>

      <p className="text-sm text-muted-foreground">
        Search manuals, FAQs, policies and PDFs
      </p>
    </div>
  </div>

  <DocumentUpload />
</div>
    </header>
  );
}