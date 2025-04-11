"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { tutors } from "@/utils/tutors";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const [selectedTutor, setSelectedTutor] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const selectedTutorData = tutors.find((t) => t.name === selectedTutor);

  const handleStart = () => {
    if (selectedTutor) {
      setIsClicked(true);
      router.push(`/discussionroom?tutor=${encodeURIComponent(selectedTutor)}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4">
      <div className="p-8 rounded-2xl shadow-xl border max-w-lg w-full bg-white dark:bg-zinc-900">
        <label className="block mb-4 text-xl font-semibold text-zinc-800 dark:text-white">
          Select a Tutor
        </label>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-left px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {selectedTutorData ? (
                  <>
                    <Image
                      src={selectedTutorData.image}
                      alt={selectedTutorData.name}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium">
                      {selectedTutorData.name}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Choose a tutor
                  </span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-[var(--radix-dropdown-menu-trigger-width)] px-2 py-1"
          >
            {tutors.map((tutor) => (
              <DropdownMenuItem
                key={tutor.name}
                onSelect={() => setSelectedTutor(tutor.name)}
                className="flex items-center gap-3 px-2 py-2 cursor-pointer"
              >
                <Image
                  src={tutor.image}
                  alt={tutor.name}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <span>{tutor.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedTutorData && (
          <div className="flex items-center gap-3 mt-6 mb-4 p-3 bg-muted rounded-xl">
            <Image
              src={selectedTutorData.image}
              alt={selectedTutorData.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="text-base font-semibold">
                {selectedTutorData.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Ready to chat with you!
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={handleStart}
          disabled={!selectedTutor || isClicked}
          className="w-full mt-2 font-bold dark:text-white"
        >
          Start Discussion
        </Button>
      </div>
    </div>
  );
}
