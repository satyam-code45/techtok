import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center h-[100vh] justify-center">
      <SignIn />
    </div>
  );
}
