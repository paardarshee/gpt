import { useState, useRef, useCallback } from "react";
import {
  StreamingRequestBody,
  StartStreamingArgs,
  StreamEvent,
} from "@/types/streaming";

export function useStreamingAI() {
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const accumulatedTextRef = useRef("");
  const bufferRef = useRef("");

  const processLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return;

    const jsonStr = trimmed.replace(/^data:\s*/, "");
    if (jsonStr === "[DONE]") return;

    try {
      const event: StreamEvent = JSON.parse(jsonStr);
      if (event.type === "text-delta" && event.delta) {
        accumulatedTextRef.current += event.delta;
        setStreamingText(accumulatedTextRef.current);
      }
    } catch (err) {
      console.warn("Failed to parse JSON:", jsonStr, err);
    }
  };

  const startStreaming = useCallback(async (args: StartStreamingArgs) => {
    const { msgId, content } = args;

    setStreamingText("");
    accumulatedTextRef.current = "";
    bufferRef.current = "";

    try {
      let body: StreamingRequestBody;
      let url = "/api/chat";

      if (args.isEdit) {
        body = { msgId, message: content };
        url = "/api/chat"; // or PUT endpoint
      } else {
        body = {
          msgId,
          message: content,
          conversationId: args.conversationId,
          attachments: args.attachments ?? [],
          temporary: args.temporary ?? false,
        };
        if (args.temporary) url += "?temporary=true";
      }

      const res = await fetch(url, {
        method: args.isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.body) {
        setStreamingText(null);
        return "";
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        bufferRef.current += decoder.decode(value, { stream: true });
        const lines = bufferRef.current.split("\n");
        bufferRef.current = lines.pop() || "";

        for (const line of lines) processLine(line);
      }

      if (bufferRef.current) processLine(bufferRef.current);

      const finalMessage = accumulatedTextRef.current;
      setStreamingText(null);
      return finalMessage;
    } catch (error) {
      console.error("Streaming error:", error);
      setStreamingText(null);
      return "";
    }
  }, []);

  return { streamingText, startStreaming };
}
