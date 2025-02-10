"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Calendar, ClipboardCheck, FolderOpen } from "lucide-react"; // Icons

export default function ReposPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState("");

  useEffect(() => {
    if (session?.accessToken) {
      const isGitHub = session.user.provider === "github";
      setProvider(isGitHub ? "github" : "gitlab");

      const apiUrl = isGitHub
        ? "https://api.github.com/user/repos"
        : "https://gitlab.com/api/v4/projects?membership=true&order_by=updated_at";

      fetch(apiUrl, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setRepos(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching repos:", err);
          setLoading(false);
        });
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Loading your repositories...
      </div>
    );
  }

  if (!repos.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        No repositories found.
      </div>
    );
  }

  return (
    <div className="min-h-[92vh] bg-gray-950 py-6 px-4 flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-xl font-semibold text-white mb-6 text-center">
          Your {provider === "github" ? "GitHub" : "GitLab"} Repositories
        </h1>

        {/* Repository List */}
        <div className="space-y-4">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="bg-gray-900 p-5 rounded-lg border border-gray-800 text-gray-300 shadow-md hover:shadow-lg hover:border-gray-700 transition-all cursor-pointer group"
              onClick={() =>
                router.push(provider === "github" ? `/repo/${repo.name}` : `/repo/${repo.id}`)
              }
            >
              {/* Repo Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  <FolderOpen size={18} className="text-yellow-400" />
                  {repo.name || repo.path_with_namespace}
                </h2>
              </div>

              {/* Repo Description*/}
              {repo.description && (
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{repo.description}</p>
              )}

              {/* Repo Details */}
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 text-sm text-gray-400">
                {/* Visibility & Updated Date */}
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    {repo.private || repo.visibility === "private" ? (
                      <span className="text-red-500 flex items-center gap-1">
                        <XCircle size={16} /> Private
                      </span>
                    ) : (
                      <span className="text-green-500 flex items-center gap-1">
                        <CheckCircle size={16} /> Public
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} className="text-gray-500" />
                    Updated: {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Right - Auto Review */}
                <div>
                  <label
                    className="flex items-center gap-2 cursor-pointer bg-gray-800 px-3 py-1 rounded-md text-gray-400 group-hover:bg-gray-700 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input type="checkbox" className="cursor-pointer accent-blue-500" />
                    <ClipboardCheck size={16} className="text-blue-400" />
                    Auto Review
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
