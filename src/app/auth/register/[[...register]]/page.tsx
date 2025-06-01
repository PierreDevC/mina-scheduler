import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border-0 rounded-2xl",
            }
          }}
        />
      </div>
    </div>
  );
} 