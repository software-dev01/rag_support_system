import { useState } from "react";
import {
  SendHorizonal,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onSend: (text: string) => void;
  loading: boolean;
}

export default function MessageInput({
  onSend,
  loading,
}: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || loading) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="border-t bg-background p-6">
      <div className="mx-auto max-w-5xl">
        <div className="relative rounded-3xl border bg-background shadow-lg">
          <Textarea
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            placeholder="Ask about policies, manuals, FAQs or PDFs..."
            className="
              
              resize-none
              border-0
              bg-transparent
              pr-32
              pt-4
              shadow-none
              focus-visible:ring-0
            "
          />

          <div className="absolute bottom-3 right-3">
            <Button
              onClick={handleSend}
              disabled={!text.trim() || loading}
              size="lg"
              className="
                h-11
                rounded-2xl
                px-5
                shadow-md
              "
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking
                </>
              ) : (
                <>
                  <SendHorizonal className="mr-2 h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          AI answers are generated from uploaded documents and include source citations.
        </p>
      </div>
    </div>
  );
}