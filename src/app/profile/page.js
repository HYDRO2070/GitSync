"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react"; // Logout Icon from Lucide

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [reposCount, setReposCount] = useState(0);
  const [starredCount, setStarredCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchProfile = async () => {
      let userApi, reposApi, starredApi, followersApi, followingApi;

      if (session.user.provider === "gitlab") {
        userApi = "https://gitlab.com/api/v4/user";
        reposApi = "https://gitlab.com/api/v4/projects?membership=true";
        starredApi = "https://gitlab.com/api/v4/projects?starred=true";
        followersApi = `https://gitlab.com/api/v4/users/${session.user.id}/followers`;
        followingApi = null;
      } else {
        userApi = `https://api.github.com/users/${session.user.login}`;
        reposApi = `https://api.github.com/users/${session.user.login}/repos`;
        starredApi = `https://api.github.com/users/${session.user.login}/starred`;
        followersApi = `https://api.github.com/users/${session.user.login}/followers`;
        followingApi = `https://api.github.com/users/${session.user.login}/following`;
      }

      try {
        // Fetch user profile
        const userRes = await fetch(userApi, { headers: { Authorization: `Bearer ${session.accessToken}` } });
        const userData = await userRes.json();
        setProfile(userData);

        // Fetch repositories count
        const reposRes = await fetch(reposApi, { headers: { Authorization: `Bearer ${session.accessToken}` } });
        const reposData = await reposRes.json();
        setReposCount(reposData.length);

        // Fetch starred repositories count
        const starredRes = await fetch(starredApi, { headers: { Authorization: `Bearer ${session.accessToken}` } });
        const starredData = await starredRes.json();
        setStarredCount(starredData.length);

        // Fetch followers count
        const followersRes = await fetch(followersApi, { headers: { Authorization: `Bearer ${session.accessToken}` } });
        const followersData = await followersRes.json();
        setFollowersCount(followersData.length);

        // Fetch following count (GitHub only)
        if (followingApi) {
          const followingRes = await fetch(followingApi, { headers: { Authorization: `Bearer ${session.accessToken}` } });
          const followingData = await followingRes.json();
          setFollowingCount(followingData.length);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [session]);

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen text-gray-400">Loading profile...</div>;
  }

  return (
    <div className="min-h-[92vh] bg-gray-950 flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-2xl bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 relative">
        <button
            onClick={() => router.push("/api/auth/signout")}
            className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
          >
            Logout
          </button>

        {/* Account Title */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-white">Account</h1>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={profile.avatar_url || profile.avatar_url}
            alt="User Avatar"
            className="w-20 h-20 rounded-full border-4 border-gray-700"
          />
          <div>
            <h2 className="text-2xl font-semibold text-white">{profile.name || profile.username}</h2>
            <p className="text-gray-400 text-sm">@{profile.username || profile.login}</p>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-300">
              <p>Followers: {followersCount ? followersCount : 0}</p>
              <p>Following: {followingCount !== null ? followingCount : "N/A (GitLab)"}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          {/* Repositories */}
          <div className="bg-gray-800 p-3 rounded-md mb-4">
            <p className="text-sm text-gray-400">Repositories</p>
            <p className="text-xl font-medium text-white">{reposCount}</p>
          </div>

          {/* Starred Repos */}
          <div className="bg-gray-800 p-3 rounded-md">
            <p className="text-sm text-gray-400">Starred Repos</p>
            <p className="text-xl font-medium text-white">{starredCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
