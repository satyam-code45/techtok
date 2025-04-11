import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";
import { ModeToggle } from "./ToggleButton";
import { checkUser } from "@/utils/checkUser";

const Navbar = async () => {
    await checkUser();
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md  z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex  items-center justify-center mx-auto">
            <Image
              src="/logo.svg"
              alt="TechTok"
              height={40}
              width={80}
              className="h-[40px] w-[80px] py-1 "
            ></Image>
            <div className="-ml-3">
              <span className="text-2xl font-bold text-[#007AFF]">
                Tech
                <span className="text-[#312ECB]">Tok</span>
              </span>
            </div>
          </div>
        </Link>

        <div className="flex gap-3 items-center justify-center">
          <SignedOut>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          <ModeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
