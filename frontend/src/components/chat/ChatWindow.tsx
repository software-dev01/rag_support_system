import type { ChatMessage } from "@/types/chat";
import {
  Bot,
  User,
  FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
}

export default function ChatWindow({
  messages,
  loading,
}: Props) {
  if (!messages.length && !loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="max-w-xl text-center">
          <Bot className="mx-auto mb-6 h-16 w-16 text-slate-400" />

          <h1 className="text-4xl font-bold">
            Support Knowledge Assistant
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            Ask questions about manuals,
            FAQs, policies and PDF
            documents.
          </p>

          <div className="mt-10 space-y-3">
            <div className="rounded-xl border bg-white p-4 text-left shadow-sm">
              How do I reset my password?
            </div>

            <div className="rounded-xl border bg-white p-4 text-left shadow-sm">
              What is the refund policy?
            </div>

            <div className="rounded-xl border bg-white p-4 text-left shadow-sm">
              How long does shipping take?
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {messages.map((message, index) => {
          const isLast =
            index === messages.length - 1;

          return (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === "user"
                  ? "justify-end"
                  : "justify-start"
                }`}
            >
              {message.role === "assistant" && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
              )}

              <div className="max-w-3xl">
                <div
                  className={`rounded-2xl px-5 py-4 shadow-sm ${message.role === "user"
                      ? "bg-black text-white"
                      : "bg-white"
                    }`}
                >
                  <p className="whitespace-pre-wrap leading-7">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>
                        {message.text}
                      </ReactMarkdown>
                    </div>

                    {loading &&
                      isLast &&
                      message.role ===
                      "assistant" && (
                        <span className="ml-1 animate-pulse">
                          ▋
                        </span>
                      )}
                  </p>
                </div>

                {message.sources?.length ? (
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Sources
                    </div>

                    <div className="space-y-2">
                      {message.sources.map(
                        (source) => (
                          <div
                            key={
                              source.document
                            }
                            className="rounded-xl border bg-white p-4 shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 font-medium">
                                <FileText className="h-4 w-4" />

                                {
                                  source.document
                                }
                              </div>

                              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">
                                {Math.round(
                                  source.score *
                                  100
                                )}
                                % match
                              </span>
                            </div>

                            <p className="mt-3 text-sm text-muted-foreground">
                              {
                                source.excerpt
                              }
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              {message.role === "user" && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}