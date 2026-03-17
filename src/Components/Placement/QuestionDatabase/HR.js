// hr.questions.js — HR Interview Questions Database
// Tags: category, frequency, answer

export const HR_CATEGORIES = [
  "Self & Background",
  "Motivation & Goals",
  "Behavioral (STAR)",
  "Teamwork & Conflict",
  "Leadership",
  "Work Style & Culture",
  "Situational",
  "Salary & Logistics",
];

export const HR_CATEGORY_COLORS = {
  "Self & Background": "#5b8def",
  "Motivation & Goals": "#9b72cf",
  "Behavioral (STAR)": "#d4b44a",
  "Teamwork & Conflict": "#4caf7d",
  Leadership: "#e05252",
  "Work Style & Culture": "#3bbdbd",
  Situational: "#e07832",
  "Salary & Logistics": "#888888",
};

// frequency: 1–5
export const HR_QUESTIONS = [
  // ─── SELF & BACKGROUND ───
  {
    id: "h001",
    question: "Tell me about yourself.",
    category: "Self & Background",
    frequency: 5,
    answer: `I’m a computer science student who enjoys solving problems using technology. 
During my studies I’ve focused on strengthening my programming fundamentals and building practical projects.

For example, I’ve worked on projects involving machine learning and software development where I had to work with datasets, debug issues, and improve performance. These experiences helped me understand how theoretical concepts apply in real applications.

Right now I’m looking for an opportunity where I can apply my skills in a real development environment, learn from experienced engineers, and continue improving as a developer.`,
  },

  {
    id: "h002",
    question: "Walk me through your resume.",
    category: "Self & Background",
    frequency: 5,
    answer: `I started my journey studying computer science where I built a strong foundation in programming, data structures, and core computer science concepts.

During my academic journey I became particularly interested in AI and software development, so I started working on practical projects to apply what I was learning. One of my projects involved building a machine learning model using TensorFlow where I worked on data preprocessing, training models, and improving accuracy.

Alongside projects, I’ve been improving my problem-solving skills through coding practice and learning modern development tools. Overall, my resume reflects my focus on building strong technical fundamentals and gaining hands-on experience through projects.`,
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────

export function sortHRByFrequency(questions) {
  return [...questions].sort((a, b) => b.frequency - a.frequency);
}

export function groupHRByCategory(questions) {
  return questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});
}

/**
 * Build day-wise HR prep plan.
 * Returns array of { dayNum, date, questions[] }
 */
export function buildHRDayPlan(
  daysLeft,
  questionsPerDay,
  startDate = new Date(),
) {
  const sorted = sortHRByFrequency(HR_QUESTIONS);
  const days = [];
  let qIdx = 0;

  for (let d = 0; d < daysLeft; d++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + d);

    const dayQs = [];

    for (let q = 0; q < questionsPerDay && qIdx < sorted.length; q++, qIdx++) {
      dayQs.push(sorted[qIdx]);
    }

    if (dayQs.length === 0 && sorted.length > 0) {
      qIdx = 0;
      for (
        let q = 0;
        q < questionsPerDay && qIdx < sorted.length;
        q++, qIdx++
      ) {
        dayQs.push(sorted[qIdx]);
      }
    }

    if (dayQs.length > 0) {
      days.push({
        dayNum: d + 1,
        date: date.toISOString().split("T")[0],
        questions: dayQs,
      });
    }
  }

  return days;
}
