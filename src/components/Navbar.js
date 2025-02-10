"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownOpen && !e.target.closest(".dropdown-menu")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [dropdownOpen]);

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center border-b border-gray-800 shadow-md h-[8vh]">
      
      {/* Logo */}
      <h1 className="text-lg font-semibold flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/repos")}>
        <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="Git Manager Logo" className="w-8 h-8 invert" />
        <span>Git Manager</span>
      </h1>

      {/* User Info & Dropdown */}
      {session ? (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 dropdown-menu"
          >
            <img
              src={session.user.image}
              alt="User Avatar"
              className="w-9 h-9 rounded-full border border-gray-700"
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-gray-800 text-gray-300 rounded-lg shadow-lg border border-gray-700 dropdown-menu">
              <p className="px-4 py-3 text-sm border-b border-gray-700">
                {session.user.name}
              </p>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-700 transition"
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/profile");
                }}
              >
                Profile
              </button>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-700 transition"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => router.push("/signin")}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Login
        </button>
      )}
    </nav>
  );
}
