"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { tutors } from "@/utils/tutors";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedTutor, setSelectedTutor] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    if (selectedTutor) {
      setIsClicked(true); // Disable button
      router.push(`/discussionroom?tutor=${encodeURIComponent(selectedTutor)}`);
    }
  };

  return (
    <div className="mt-25">
      <div className="p-6 max-w-4xl mx-auto">
        <label className="block mb-2 text-lg font-medium">Select a Tutor</label>
        <select
          value={selectedTutor}
          onChange={(e) => setSelectedTutor(e.target.value)}
          className="border px-3 py-2 rounded mb-6"
        >
          <option value="">-- Choose a tutor --</option>
          {tutors.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        <Button
          onClick={handleStart}
          disabled={!selectedTutor || isClicked}
          className={`ml-2 ${
            !selectedTutor || isClicked ? "cursor-not-allowed" : "cursor-pointer"
          },font-bold dark:text-white bg-primary`}
        >
          Start Discussion
        </Button>
      </div>
    </div>
  );
}
