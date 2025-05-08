# 🔄 GitSync — Unified GitHub/GitLab Repo Manager with Code Analytics

**GitSync** is a powerful and intuitive platform designed for developers who want better control, visibility, and organization of their repositories. By connecting your **GitHub** or **GitLab** account, GitSync provides a clean, unified dashboard to view and manage all your projects — complete with useful statistics like total lines of code per repository.

---

![GitSync Screenshot](https://yourdomain.com/gitsync-banner.png) <!-- Optional visual -->

## 🚀 Key Features

- 🔐 **OAuth Login with GitHub & GitLab**  
  Log in securely using your GitHub or GitLab account to access your repositories.

- 📁 **Unified Repository Dashboard**  
  See all your public and private repositories in one place, regardless of the platform.

- 📊 **Codebase Metrics per Repo**  
  Get a quick summary of **total lines of code** per repository for easy insight into project scale.

- 👤 **Developer Profile Panel**  
  View essential user details such as name, username, bio, and connected accounts.

- 📂 **Organized Repository List**
  Repos are displayed with language tags, visibility status, last updated time, and line count.

- 🧩 **Cross-Platform Sync**
  GitSync supports syncing both GitHub and GitLab simultaneously.

---

## 🧱 Tech Stack

| Layer       | Technologies Used                   |
|-------------|--------------------------------------|
| **Frontend** | Next.js, TailwindCSS, TypeScript     |
| **Backend**  | Node.js, Express.js                 |
| **Auth**     | OAuth 2.0 (GitHub, GitLab)           |
| **Database** | MongoDB (user data, token storage)   |
| **API Usage**| GitHub REST API, GitLab API          |
| **Analytics**| Line count via file-tree traversal / Git blob scan |

---

## ⚙️ Setup & Installation

### 🛠 Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- GitHub/GitLab OAuth App credentials

### 🔧 Steps

```bash
# Clone the repo
git clone https://github.com/HYDRO2070/GitSync.git
cd GitSync

# Install dependencies
npm install

# Create environment config
cp .env.example .env

# Run development server
npm run dev
````

Ensure the following are set in your `.env`:

```
GITHUB_CLIENT_ID=your_github_app_id
GITHUB_CLIENT_SECRET=your_github_app_secret
GITLAB_CLIENT_ID=your_gitlab_app_id
GITLAB_CLIENT_SECRET=your_gitlab_app_secret
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

---

## 🧪 How It Works

1. User signs in with **GitHub** or **GitLab** OAuth.
2. GitSync fetches repository metadata and file trees using the platform APIs.
3. For each repository, GitSync scans the structure and **counts the lines of code**.
4. The platform displays a full profile dashboard with user details and repository metrics.

---

## 📈 Roadmap

* [x] OAuth integration with GitHub & GitLab
* [x] Repo list and sorting
* [x] Line-of-code analytics
* [ ] Contribution history per repo
* [ ] Language breakdown (e.g., JavaScript 60%, CSS 10%)
* [ ] Download/export repository metadata
* [ ] Collaborator display for team projects
* [ ] Dark/light mode support

---

## 🤝 Contributing

We welcome contributors! Here’s how to start:

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/YourFeature

# Commit your changes
git commit -m "Add YourFeature"

# Push to GitHub
git push origin feature/YourFeature
```

Open a pull request, and let’s build GitSync together!

---
