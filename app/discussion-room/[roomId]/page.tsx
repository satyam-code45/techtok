"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tutors } from "@/utils/tutors";
import { SendHorizonal } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "model" | "system";
  text: string;
};

export default function DiscussionRoom() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const name = "Hitesh";
  const tutor = tutors.find((t) => t.name.includes(name));
  const greeting = tutor?.greeting.replace("{username}", name) || "Tutor not found";
  const prompt = tutor?.prompt;
  const endingMessage = tutor?.ending;

  // Initialize prompt once on mount
  useEffect(() => {
    if (prompt) {
      setMessages([{ role: "system", text: prompt }]);
    }
  }, [prompt]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { role: "user", text: trimmed };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: updatedMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          message: trimmed,
        }),
      });

      const { resp, error } = await res.json();
      if (error) throw new Error(error);
      setMessages((prev) => [...prev, { role: "model", text: resp }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "⚠️ Oops! Something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (endingMessage) {
      setMessages((prev) => [...prev, { role: "model", text: endingMessage }]);
    }
  };

  return (
    <div className="bg-gray-100 h-[80vh] w-full max-w-3xl mx-auto mt-25 rounded-xl border dark:bg-gray-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b-2 flex items-center justify-between p-4">
        <div className="flex gap-2 items-center">
          <Image
            src="/logo.svg"
            alt="harkirat"
            height={40}
            width={40}
            className="rounded-full h-[30px] w-[30px] border-2"
          />
          <span className="text-xl font-bold">{name}</span>
        </div>
        <Button variant="destructive" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Static greeting */}
        <div className="p-3 rounded-md shadow max-w-[80%] bg-yellow-100 text-gray-800">
          {greeting}
        </div>

        {messages
          .filter((m) => m.role !== "system") // Don't show system messages like the prompt
          .map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-md shadow max-w-[80%] ${
                m.role === "user"
                  ? "bg-blue-100 self-end text-gray-900"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              <ReactMarkdown>{m.text}</ReactMarkdown>
            </div>
          ))}

        {/* Scroll target */}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="border-t flex items-center space-x-2 p-4 bg-white dark:bg-gray-800">
        <Input
          type="text"
          placeholder="Message"
          className="w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={isLoading}
        />
        <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          {isLoading ? "Sending…" : "Send"}
          <SendHorizonal className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
