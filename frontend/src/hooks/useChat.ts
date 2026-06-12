import { useState } from "react";
import type {
  ChatMessage,
} from "@/types/chat";

import {
  streamAI,
  askAI,
} from "@/services/api";

export function useChat() {
  const [
    messages,
    setMessages,
  ] = useState<
    ChatMessage[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const sendMessage =
    async (
      text: string
    ) => {
      if (!text.trim())
        return;

      const userMessage: ChatMessage =
        {
          id: crypto.randomUUID(),
          role: "user",
          text,
        };

      setMessages(
        (prev) => [
          ...prev,
          userMessage,
        ]
      );

      setLoading(true);

      try {
        const assistantId =
          crypto.randomUUID();

        setMessages(
          (prev) => [
            ...prev,
            {
              id: assistantId,
              role:
                "assistant",
              text: "",
              sources: [],
            },
          ]
        );

        // STREAM RESPONSE
        const response =
          await streamAI(
            text
          );

        if (
          !response.body
        ) {
          throw new Error(
            "No stream body"
          );
        }

        const reader =
          response.body.getReader();

        const decoder =
          new TextDecoder();

        let answer =
          "";

        while (true) {
          const {
            done,
            value,
          } =
            await reader.read();

          if (done)
            break;

          const chunk =
            decoder.decode(
              value,
              {
                stream: true,
              }
            );

          answer += chunk;

          setMessages(
            (prev) =>
              prev.map(
                (msg) =>
                  msg.id ===
                  assistantId
                    ? {
                        ...msg,
                        text: answer,
                      }
                    : msg
              )
          );
        }

        // FETCH SOURCES
        const citationData =
          await askAI(
            text
          );

        setMessages(
          (prev) =>
            prev.map(
              (msg) =>
                msg.id ===
                assistantId
                  ? {
                      ...msg,
                      sources:
                        citationData.sources ||
                        [],
                    }
                  : msg
            )
        );
      } catch (
        error
      ) {
        console.error(
          error
        );

        setMessages(
          (prev) => [
            ...prev,
            {
              id:
                crypto.randomUUID(),
              role:
                "assistant",
              text:
                "Something went wrong.",
            },
          ]
        );
      } finally {
        setLoading(false);
      }
    };

  return {
    messages,
    loading,
    sendMessage,
  };
}