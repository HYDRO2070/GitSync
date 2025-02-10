"use client";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Star, GitBranch, ArrowLeft, Eye, Lock } from "lucide-react";

export default function RepoDetails() {
  const { data: session } = useSession();
  const [repoDetails, setRepoDetails] = useState(null);
  const [numLines, setNumLines] = useState(0);
  const router = useRouter();
  const { repoName } = useParams();
  const [provider, setProvider] = useState("");

  useEffect(() => {
    if (session?.accessToken) {
      const isGitHub = session.user.provider == "github";
      setProvider(isGitHub ? "github" : "gitlab");

      let apiUrl = "";
      if (isGitHub) {
        apiUrl = `https://api.github.com/repos/${session.user.login}/${repoName}`;
      } else {
        apiUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(repoName)}`;
      }

      fetch(apiUrl, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setRepoDetails(data);
          calculateLines(isGitHub, data);
        });
    }
  }, [session, repoName]);

  // Function to calculate lines in the repo
  const calculateLines = (isGitHub, repoData) => {
    if (isGitHub) {
      // GitHub: Fetch contents and count lines for source code files
      const contentsUrl = `https://api.github.com/repos/${session.user.login}/${repoName}/contents`;
      fetch(contentsUrl, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
        .then((res) => res.json())
        .then((files) => {
          let totalLines = 0;
          const filePromises = files.map((file) => {
            if (file.type === "file" && (file.name.endsWith(".js") || file.name.endsWith(".ts") || file.name.endsWith(".py") || file.name.endsWith(".html") || file.name.endsWith(".css") || file.name.endsWith(".json") || file.name.endsWith(".cpp") || file.name.endsWith(".jsx"))) {
              return fetch(file.download_url)
                .then((res) => res.text())
                .then((content) => {
                  const lines = content.split("\n").length;
                  totalLines += lines;
                });
            }
            return Promise.resolve();
          });

          Promise.all(filePromises).then(() => {
            setNumLines(totalLines); 
          });
        });
    } else {
      // GitLab: Fetch repository file list and count lines for source code files
      const contentsUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(repoData.id)}/repository/tree?recursive=true`;
      fetch(contentsUrl, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
        .then((res) => res.json())
        .then((files) => {
          let totalLines = 0;
          const filePromises = files.map((file) => {
            if (file.type === "blob" && (file.name.endsWith(".js") || file.name.endsWith(".ts") || file.name.endsWith(".py"))) {
              const fileUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(repoData.id)}/repository/files/${encodeURIComponent(file.path)}/raw`;
              return fetch(fileUrl, {
                headers: { Authorization: `Bearer ${session.accessToken}` },
              })
                .then((res) => res.text())
                .then((content) => {
                  const lines = content.split("\n").length;
                  totalLines += lines;
                });
            }
            return Promise.resolve();
          });

          Promise.all(filePromises).then(() => {
            setNumLines(totalLines); 
          });
        });
    }
  };

  if (!repoDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Loading repository details...
      </div>
    );
  }

  return (
    <div className="min-h-[92vh] bg-gray-950 flex justify-center items-center px-4 py-6">
      <div className="w-full max-w-2xl bg-gray-900 rounded-lg shadow-md p-5 border border-gray-800 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/repos")}
          className="flex items-center gap-2 text-white text-sm hover:text-gray-400 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Repo Title */}
        <h1 className="text-xl font-semibold text-white my-4 text-left">
          Repo: {provider === "github" ? repoDetails.name : repoDetails.path_with_namespace}
        </h1>

        {/* Repo Details */}
        <div className="space-y-3">
          {/* Stars */}
          <div>
            <span className="text-gray-300">Stars</span>
            <div className="bg-gray-800 p-2 rounded-md mt-1">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400" size={16} />
                <span className="text-gray-300">
                  {provider === "github" ? repoDetails.stargazers_count : repoDetails.star_count}
                </span>
              </div>
            </div>
          </div>

          {/* Default Branch */}
          <div>
            <span className="text-gray-300">Default Branch</span>
            <div className="bg-gray-800 p-2 rounded-md mt-1">
              <div className="flex items-center gap-2">
                <GitBranch className="text-blue-400" size={16} />
                <span className="text-gray-300">
                  {provider === "github" ? repoDetails.default_branch : repoDetails.default_branch || "main"}
                </span>
              </div>
            </div>
          </div>

          {/* Auto Review */}
          <div>
            <span className="text-gray-300">Auto Review</span>
            <div className="bg-gray-800 p-2 rounded-md mt-1">
              <span className={`text-sm ${repoDetails.auto_review_enabled ? "text-green-400" : "text-red-400"}`}>
                {repoDetails.auto_review_enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <span className="text-gray-300">Visibility</span>
            <div className="bg-gray-800 p-2 rounded-md mt-1">
              <div className="flex items-center gap-2">
                {provider === "github"
                  ? repoDetails.private
                    ? <Lock className="text-red-400" size={16} />
                    : <Eye className="text-green-400" size={16} />
                  : repoDetails.visibility === "private"
                    ? <Lock className="text-red-400" size={16} />
                    : <Eye className="text-green-400" size={16} />}
                <span className="text-gray-300">
                  {provider === "github"
                    ? repoDetails.private ? "Private" : "Public"
                    : repoDetails.visibility === "private" ? "Private" : "Public"}
                </span>
              </div>
            </div>
          </div>

          {/* Number of Lines */}
          <div>
            <span className="text-gray-300">Number of Lines</span>
            <div className="bg-gray-800 p-2 rounded-md mt-1">
              <span className="text-gray-300">{numLines} Lines</span>
            </div>
          </div>

          {/* Last Updated */}
          <div>
            <span className="text-gray-300">Last Updated</span>
            <div className="bg-gray-800 p-2 rounded-md mt-1">
              <span className="text-gray-300">
                {new Date(repoDetails.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
