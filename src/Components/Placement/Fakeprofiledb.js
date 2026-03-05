// fakeProfileDB.js
// ─────────────────────────────────────────────────────────────────────────────
// FAKE DATABASE — replace `getUserByUsername()` with a real DB/API call later.
// All profile data lives here. The shape matches what the real DB should return.
// ─────────────────────────────────────────────────────────────────────────────

export const FAKE_USERS = {
  riteshpatel1884: {
    // ── Identity ──────────────────────────────────────────────────────────────
    username: "riteshpatel1884",
    name: "Ritesh Patel",
    college: "Your College",
    branch: "CSE",
    year: "3rd Year",
    bio: "Aspiring SDE · Grinding LeetCode · Open to opportunities 🚀",
    avatarColor: "#5b8def",

    // ── Links ─────────────────────────────────────────────────────────────────
    links: {
      github: "github.com/riteshpatel1884",
      linkedin: "linkedin.com/in/riteshpatel1884",
      leetcode: "leetcode.com/riteshpatel1884",
    },

    // ── Placement Prep ────────────────────────────────────────────────────────
    targetCompany: "Google",
    readiness: 24, // %
    solved: 7, // total DSA questions solved
    leaderboardRank: 10,

    // Solved breakdown per topic (shown as topic progress bars)
    topicProgress: [
      { topic: "Arrays", solved: 3, total: 10, color: "#5b8def" },
      { topic: "Trees", solved: 2, total: 8, color: "#9b72cf" },
      { topic: "Dynamic Prog.", solved: 1, total: 12, color: "#4caf7d" },
      { topic: "Graphs", solved: 1, total: 10, color: "#e8924a" },
      { topic: "Strings", solved: 0, total: 6, color: "#d46fa0" },
      { topic: "Greedy", solved: 0, total: 5, color: "#d4b44a" },
    ],

    // ── Recent Activity ───────────────────────────────────────────────────────
    recentActivity: [
      {
        date: "2026-03-05",
        action: "Solved",
        detail: "Two Sum (Easy)",
        company: "Google",
      },
      {
        date: "2026-03-04",
        action: "Solved",
        detail: "Binary Tree Inorder (Easy)",
        company: "Google",
      },
      {
        date: "2026-03-03",
        action: "Solved",
        detail: "Valid Parentheses (Easy)",
        company: "Google",
      },
      {
        date: "2026-03-02",
        action: "Studied",
        detail: "Arrays topic review",
        company: null,
      },
      {
        date: "2026-03-01",
        action: "Solved",
        detail: "Merge Intervals (Medium)",
        company: "Google",
      },
    ],

    // ── Badges ────────────────────────────────────────────────────────────────
    badges: [
      { icon: "🔥", label: "3-Day Streak" },
      { icon: "⚡", label: "First Solve" },
      { icon: "🎯", label: "Goal Setter" },
    ],

    // ── Academic ──────────────────────────────────────────────────────────────
    cgpaGoal: 8.5,
    currentCGPA: 7.8,
    semester: "Semester 5",
    attendance: 82, // %
  },

  // ── Add more seed users here ───────────────────────────────────────────────
  aditya_k: {
    username: "aditya_k",
    name: "Aditya Kumar",
    college: "IIT Bombay",
    branch: "CSE",
    year: "4th Year",
    bio: "SDE Intern @ Google · CP Enthusiast · CF Expert",
    avatarColor: "#4caf7d",
    links: {
      github: "github.com/adityakumar",
      linkedin: "linkedin.com/in/adityakumar",
      leetcode: "leetcode.com/adityakumar",
    },
    targetCompany: "Google",
    readiness: 91,
    solved: 134,
    leaderboardRank: 1,
    topicProgress: [
      { topic: "Arrays", solved: 18, total: 20, color: "#5b8def" },
      { topic: "Trees", solved: 15, total: 16, color: "#9b72cf" },
      { topic: "Dynamic Prog.", solved: 14, total: 18, color: "#4caf7d" },
      { topic: "Graphs", solved: 12, total: 14, color: "#e8924a" },
      { topic: "Strings", solved: 10, total: 12, color: "#d46fa0" },
      { topic: "Greedy", solved: 8, total: 10, color: "#d4b44a" },
    ],
    recentActivity: [
      {
        date: "2026-03-05",
        action: "Solved",
        detail: "Hard DP Problem (Hard)",
        company: "Google",
      },
      {
        date: "2026-03-04",
        action: "Solved",
        detail: "Graph BFS/DFS (Medium)",
        company: "Google",
      },
    ],
    badges: [
      { icon: "🥇", label: "Rank #1" },
      { icon: "🔥", label: "30-Day Streak" },
      { icon: "💎", label: "130+ Solved" },
      { icon: "⚡", label: "Speed Solver" },
    ],
    cgpaGoal: 9.5,
    currentCGPA: 9.2,
    semester: "Semester 8",
    attendance: 95,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TODO: Replace this function body with a real DB/API call.
//
// Example (Prisma):
//   export async function getUserByUsername(username) {
//     return await prisma.user.findUnique({ where: { username } });
//   }
//
// Example (REST API):
//   export async function getUserByUsername(username) {
//     const res = await fetch(`/api/users/${username}`);
//     if (!res.ok) return null;
//     return res.json();
//   }
// ─────────────────────────────────────────────────────────────────────────────
export function getUserByUsername(username) {
  return FAKE_USERS[username] ?? null;
}
