"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Github, Gitlab } from "lucide-react"; 

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/repos"); 
    }
  }, [session]);

  const handleLogin = async (provider) => {
    await signIn(provider, { callbackUrl: "/repos" });
  };

  return (
    <div className="flex justify-center items-center min-h-[92vh] bg-gray-950 text-white px-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg text-center border border-white/20 max-w-md w-full relative">
        
        {/* Logo Section */}
        <div className="flex justify-center gap-3 mb-5">
          <Github size={40} className="text-gray-300" />
          <Gitlab size={40} className="text-gray-400" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold mb-2">Sign in to Git Manager</h1>
        <p className="text-gray-400 text-sm mb-6">Manage your repositories seamlessly.</p>

        {/* Login Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => handleLogin("github")}
            className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 w-full border border-gray-600 shadow-md"
          >
            <Github size={19} /> Sign in with GitHub
          </button>

          <button
            onClick={() => handleLogin("gitlab")}
            className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 w-full border border-red-500 shadow-md"
          >
            <Gitlab size={19} /> Sign in with GitLab
          </button>
        </div>
      </div>
    </div>
  );
}
