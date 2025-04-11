"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tutors } from "@/utils/tutors";
import { useUser } from "@clerk/nextjs";
import { SendHorizonal } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Message = {
  role: "user" | "model" | "system";
  text: string;
};

export default function DiscussionRoom() {
  const searchParams = useSearchParams();
  const tutorName = searchParams.get("tutor");
  const { user } = useUser();
  const username = user?.firstName || "User";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const tutor = tutors.find((t) => t.name === tutorName);
  const greeting =
    tutor?.greeting.replace("{username}", username) || "Tutor not found";
  const prompt = tutor?.prompt;
  const endingMessage = tutor?.ending;

  useEffect(() => {
    if (prompt) {
      setMessages([{ role: "system", text: prompt }]);
    }
  }, [prompt]);

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

  const handleDisconnectClick = () => {
    if (endingMessage) {
      setMessages((prev) => [...prev, { role: "model", text: endingMessage }]);
    }
    setTimeout(() => {
      setShowDialog(true);
    }, 2000);
  };

  const handleGoHome = () => {
    setShowDialog(false);
    router.push("/");
  };

  const handleCheckoutCourse = () => {
    if (tutor?.link) {
      window.open(tutor.link, "_blank");
    } else {
      console.error("No checkout link found for this tutor.");
    }
  };

  return (
    <>
      <div className="bg-gray-100 h-[80vh] w-full max-w-3xl mx-auto mt-25 rounded-xl border dark:bg-gray-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b-2 flex items-center justify-between p-4">
          <div className="flex gap-2 items-center">
            <Image
              src={tutor?.image ?? "/logo.svg"}
              alt={tutorName || "Tutor"}
              height={40}
              width={40}
              className="rounded-full h-[30px] w-[30px] border-2"
            />
            <span className="text-xl font-bold">{tutorName}</span>
          </div>
          <Button variant="destructive" onClick={handleDisconnectClick}>
            Disconnect
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="p-3 rounded-md shadow max-w-[80%] bg-yellow-100 text-gray-800">
            {greeting}
          </div>

          {messages
            .filter((m) => m.role !== "system")
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
          <div ref={bottomRef} />
        </div>

        {/* Input */}
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

      {/* Disconnect Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thanks for chatting!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <Image
              src={tutor?.course ?? "/logo.svg"}
              alt="Course Promo"
              width={300}
              height={180}
              className="rounded-lg object-cover"
            />
            <p className="text-center text-sm text-muted-foreground">
              Want to dive deeper? Check out our full course.
            </p>
          </div>
          <DialogFooter className="flex justify-between pt-4">
            <Button onClick={handleCheckoutCourse}>🎓 Checkout Course</Button>
            <Button variant="outline" onClick={handleGoHome}>
              🏠 Go to Homepage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
