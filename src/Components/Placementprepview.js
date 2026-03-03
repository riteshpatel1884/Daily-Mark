"use client";
// ─────────────────────────────────────────────────────────────────────────────
// PlacementPrepView_Enhanced.jsx
// All new features: Weakness Prediction Engine, Risk Scores, Retention Decay,
// Company Risk Reordering, Opportunity Cost, Real Readiness Score,
// Placement ROI, Weekly Reality Report + AI Coach (Anthropic Streaming)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo, useEffect, useCallback, useRef } from "react";

// ── Inline Data ───────────────────────────────────────────────────────────────
const DSA_TOPICS = [
  {
    id: "arrays",
    label: "Arrays & Hashing",
    icon: "📦",
    tag: "Array",
    companyWeight: { google: 9, amazon: 8, service: 5, startup: 7 },
  },
  {
    id: "twopointers",
    label: "Two Pointers",
    icon: "👆",
    tag: "Array",
    companyWeight: { google: 8, amazon: 7, service: 4, startup: 6 },
  },
  {
    id: "slidingwindow",
    label: "Sliding Window",
    icon: "🪟",
    tag: "Array",
    companyWeight: { google: 9, amazon: 9, service: 5, startup: 7 },
  },
  {
    id: "binarysearch",
    label: "Binary Search",
    icon: "🔍",
    tag: "Search",
    companyWeight: { google: 10, amazon: 9, service: 6, startup: 8 },
  },
  {
    id: "prefixsum",
    label: "Prefix Sum",
    icon: "➕",
    tag: "Array",
    companyWeight: { google: 8, amazon: 7, service: 5, startup: 6 },
  },
  {
    id: "stack",
    label: "Stack & Queue",
    icon: "📚",
    tag: "Stack",
    companyWeight: { google: 7, amazon: 8, service: 7, startup: 6 },
  },
  {
    id: "linkedlist",
    label: "Linked List",
    icon: "🔗",
    tag: "LinkedList",
    companyWeight: { google: 8, amazon: 9, service: 8, startup: 6 },
  },
  {
    id: "trees",
    label: "Binary Trees",
    icon: "🌳",
    tag: "Tree",
    companyWeight: { google: 10, amazon: 10, service: 7, startup: 8 },
  },
  {
    id: "bst",
    label: "BST",
    icon: "🌲",
    tag: "Tree",
    companyWeight: { google: 9, amazon: 8, service: 6, startup: 7 },
  },
  {
    id: "heap",
    label: "Heap / Priority Queue",
    icon: "⛰️",
    tag: "Heap",
    companyWeight: { google: 9, amazon: 10, service: 5, startup: 7 },
  },
  {
    id: "graphs",
    label: "Graphs (BFS/DFS)",
    icon: "🕸️",
    tag: "Graph",
    companyWeight: { google: 10, amazon: 10, service: 6, startup: 8 },
  },
  {
    id: "dp",
    label: "Dynamic Programming",
    icon: "🧠",
    tag: "DP",
    companyWeight: { google: 10, amazon: 9, service: 5, startup: 7 },
  },
  {
    id: "greedy",
    label: "Greedy",
    icon: "💰",
    tag: "Greedy",
    companyWeight: { google: 8, amazon: 7, service: 5, startup: 6 },
  },
  {
    id: "backtracking",
    label: "Backtracking",
    icon: "↩️",
    tag: "Recursion",
    companyWeight: { google: 9, amazon: 8, service: 4, startup: 6 },
  },
  {
    id: "trie",
    label: "Trie",
    icon: "🌿",
    tag: "Advanced DS",
    companyWeight: { google: 8, amazon: 6, service: 3, startup: 5 },
  },
  {
    id: "intervals",
    label: "Intervals",
    icon: "📏",
    tag: "Array",
    companyWeight: { google: 7, amazon: 8, service: 5, startup: 6 },
  },
  {
    id: "math",
    label: "Math & Bit Manipulation",
    icon: "🔢",
    tag: "Math",
    companyWeight: { google: 7, amazon: 6, service: 4, startup: 5 },
  },
  {
    id: "monotonic",
    label: "Monotonic Stack",
    icon: "📊",
    tag: "Stack",
    companyWeight: { google: 7, amazon: 7, service: 4, startup: 5 },
  },
];

const DSA_QUESTIONS = {
  arrays: [
    {
      id: "a1",
      title: "Two Sum",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/two-sum/",
    },
    {
      id: "a2",
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      leetcode:
        "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    },
    {
      id: "a3",
      title: "Contains Duplicate",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/contains-duplicate/",
    },
    {
      id: "a4",
      title: "Product of Array Except Self",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/product-of-array-except-self/",
    },
    {
      id: "a5",
      title: "Maximum Subarray (Kadane)",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/maximum-subarray/",
    },
    {
      id: "a6",
      title: "Maximum Product Subarray",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/maximum-product-subarray/",
    },
    {
      id: "a7",
      title: "Find Minimum in Rotated Sorted Array",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    },
    {
      id: "a8",
      title: "3Sum",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/3sum/",
    },
  ],
  twopointers: [
    {
      id: "tp1",
      title: "Valid Palindrome",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/valid-palindrome/",
    },
    {
      id: "tp2",
      title: "Two Sum II",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    },
    {
      id: "tp3",
      title: "Container With Most Water",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/container-with-most-water/",
    },
    {
      id: "tp4",
      title: "Trapping Rain Water",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/trapping-rain-water/",
    },
  ],
  slidingwindow: [
    {
      id: "sw1",
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      leetcode:
        "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    },
    {
      id: "sw2",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    },
    {
      id: "sw3",
      title: "Longest Repeating Character Replacement",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/longest-repeating-character-replacement/",
    },
    {
      id: "sw4",
      title: "Permutation in String",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/permutation-in-string/",
    },
    {
      id: "sw5",
      title: "Minimum Window Substring",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/minimum-window-substring/",
    },
    {
      id: "sw6",
      title: "Sliding Window Maximum",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/sliding-window-maximum/",
    },
  ],
  binarysearch: [
    {
      id: "bs1",
      title: "Binary Search",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/binary-search/",
    },
    {
      id: "bs2",
      title: "Search a 2D Matrix",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/search-a-2d-matrix/",
    },
    {
      id: "bs3",
      title: "Koko Eating Bananas",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/koko-eating-bananas/",
    },
    {
      id: "bs4",
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    },
    {
      id: "bs5",
      title: "Find Peak Element",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/find-peak-element/",
    },
    {
      id: "bs6",
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    },
  ],
  prefixsum: [
    {
      id: "ps1",
      title: "Range Sum Query - Immutable",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/range-sum-query-immutable/",
    },
    {
      id: "ps2",
      title: "Subarray Sum Equals K",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/subarray-sum-equals-k/",
    },
    {
      id: "ps3",
      title: "Product of Array Except Self",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/product-of-array-except-self/",
    },
    {
      id: "ps4",
      title: "Count Number of Bad Pairs",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/count-number-of-bad-pairs/",
    },
  ],
  stack: [
    {
      id: "st1",
      title: "Valid Parentheses",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/valid-parentheses/",
    },
    {
      id: "st2",
      title: "Min Stack",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/min-stack/",
    },
    {
      id: "st3",
      title: "Evaluate Reverse Polish Notation",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    },
    {
      id: "st4",
      title: "Generate Parentheses",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/generate-parentheses/",
    },
    {
      id: "st5",
      title: "Daily Temperatures",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/daily-temperatures/",
    },
    {
      id: "st6",
      title: "Car Fleet",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/car-fleet/",
    },
    {
      id: "st7",
      title: "Largest Rectangle in Histogram",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    },
  ],
  linkedlist: [
    {
      id: "ll1",
      title: "Reverse Linked List",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/reverse-linked-list/",
    },
    {
      id: "ll2",
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/merge-two-sorted-lists/",
    },
    {
      id: "ll3",
      title: "Reorder List",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/reorder-list/",
    },
    {
      id: "ll4",
      title: "Remove Nth Node From End",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    },
    {
      id: "ll5",
      title: "Linked List Cycle",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/linked-list-cycle/",
    },
    {
      id: "ll6",
      title: "LRU Cache",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/lru-cache/",
    },
    {
      id: "ll7",
      title: "Merge K Sorted Lists",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/",
    },
  ],
  trees: [
    {
      id: "tr1",
      title: "Invert Binary Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/invert-binary-tree/",
    },
    {
      id: "tr2",
      title: "Maximum Depth of Binary Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    },
    {
      id: "tr3",
      title: "Diameter of Binary Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/diameter-of-binary-tree/",
    },
    {
      id: "tr4",
      title: "Balanced Binary Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/balanced-binary-tree/",
    },
    {
      id: "tr5",
      title: "Same Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/same-tree/",
    },
    {
      id: "tr6",
      title: "Subtree of Another Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/subtree-of-another-tree/",
    },
    {
      id: "tr7",
      title: "Lowest Common Ancestor of BST",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    },
    {
      id: "tr8",
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    },
    {
      id: "tr9",
      title: "Binary Tree Right Side View",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/binary-tree-right-side-view/",
    },
    {
      id: "tr10",
      title: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    },
    {
      id: "tr11",
      title: "Serialize and Deserialize Binary Tree",
      difficulty: "Hard",
      leetcode:
        "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    },
  ],
  bst: [
    {
      id: "bst1",
      title: "Validate Binary Search Tree",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/validate-binary-search-tree/",
    },
    {
      id: "bst2",
      title: "Kth Smallest Element in BST",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    },
    {
      id: "bst3",
      title: "Construct BST from Preorder Traversal",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/",
    },
  ],
  heap: [
    {
      id: "hp1",
      title: "Kth Largest Element in a Stream",
      difficulty: "Easy",
      leetcode:
        "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
    },
    {
      id: "hp2",
      title: "Last Stone Weight",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/last-stone-weight/",
    },
    {
      id: "hp3",
      title: "K Closest Points to Origin",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/k-closest-points-to-origin/",
    },
    {
      id: "hp4",
      title: "Kth Largest Element in an Array",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    },
    {
      id: "hp5",
      title: "Task Scheduler",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/task-scheduler/",
    },
    {
      id: "hp6",
      title: "Design Twitter",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/design-twitter/",
    },
    {
      id: "hp7",
      title: "Find Median from Data Stream",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/find-median-from-data-stream/",
    },
  ],
  graphs: [
    {
      id: "gr1",
      title: "Number of Islands",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/number-of-islands/",
    },
    {
      id: "gr2",
      title: "Max Area of Island",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/max-area-of-island/",
    },
    {
      id: "gr3",
      title: "Clone Graph",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/clone-graph/",
    },
    {
      id: "gr4",
      title: "Pacific Atlantic Water Flow",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    },
    {
      id: "gr5",
      title: "Surrounded Regions",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/surrounded-regions/",
    },
    {
      id: "gr6",
      title: "Rotting Oranges",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/rotting-oranges/",
    },
    {
      id: "gr7",
      title: "Course Schedule",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/course-schedule/",
    },
    {
      id: "gr8",
      title: "Course Schedule II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/course-schedule-ii/",
    },
    {
      id: "gr9",
      title: "Redundant Connection",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/redundant-connection/",
    },
    {
      id: "gr10",
      title: "Word Ladder",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/word-ladder/",
    },
  ],
  dp: [
    {
      id: "dp1",
      title: "Climbing Stairs",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/climbing-stairs/",
    },
    {
      id: "dp2",
      title: "House Robber",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/house-robber/",
    },
    {
      id: "dp3",
      title: "House Robber II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/house-robber-ii/",
    },
    {
      id: "dp4",
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/longest-palindromic-substring/",
    },
    {
      id: "dp5",
      title: "Coin Change",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/coin-change/",
    },
    {
      id: "dp6",
      title: "Maximum Product Subarray",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/maximum-product-subarray/",
    },
    {
      id: "dp7",
      title: "Word Break",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/word-break/",
    },
    {
      id: "dp8",
      title: "Longest Increasing Subsequence",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/longest-increasing-subsequence/",
    },
    {
      id: "dp9",
      title: "Unique Paths",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/unique-paths/",
    },
    {
      id: "dp10",
      title: "Jump Game",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/jump-game/",
    },
    {
      id: "dp11",
      title: "Partition Equal Subset Sum",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/partition-equal-subset-sum/",
    },
    {
      id: "dp12",
      title: "Edit Distance",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/edit-distance/",
    },
  ],
  greedy: [
    {
      id: "gy1",
      title: "Maximum Subarray",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/maximum-subarray/",
    },
    {
      id: "gy2",
      title: "Jump Game",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/jump-game/",
    },
    {
      id: "gy3",
      title: "Jump Game II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/jump-game-ii/",
    },
    {
      id: "gy4",
      title: "Gas Station",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/gas-station/",
    },
    {
      id: "gy5",
      title: "Partition Labels",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/partition-labels/",
    },
  ],
  backtracking: [
    {
      id: "bt1",
      title: "Subsets",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/subsets/",
    },
    {
      id: "bt2",
      title: "Combination Sum",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/combination-sum/",
    },
    {
      id: "bt3",
      title: "Permutations",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/permutations/",
    },
    {
      id: "bt4",
      title: "Subsets II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/subsets-ii/",
    },
    {
      id: "bt5",
      title: "Combination Sum II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/combination-sum-ii/",
    },
    {
      id: "bt6",
      title: "Word Search",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/word-search/",
    },
    {
      id: "bt7",
      title: "Palindrome Partitioning",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/palindrome-partitioning/",
    },
    {
      id: "bt8",
      title: "N-Queens",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/n-queens/",
    },
  ],
  trie: [
    {
      id: "ti1",
      title: "Implement Trie",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/implement-trie-prefix-tree/",
    },
    {
      id: "ti2",
      title: "Design Add and Search Words Data Structure",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
    },
    {
      id: "ti3",
      title: "Word Search II",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/word-search-ii/",
    },
  ],
  intervals: [
    {
      id: "iv1",
      title: "Insert Interval",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/insert-interval/",
    },
    {
      id: "iv2",
      title: "Merge Intervals",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/merge-intervals/",
    },
    {
      id: "iv3",
      title: "Non-overlapping Intervals",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/non-overlapping-intervals/",
    },
    {
      id: "iv4",
      title: "Meeting Rooms II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/meeting-rooms-ii/",
    },
    {
      id: "iv5",
      title: "Minimum Interval to Include Each Query",
      difficulty: "Hard",
      leetcode:
        "https://leetcode.com/problems/minimum-interval-to-include-each-query/",
    },
  ],
  math: [
    {
      id: "mth1",
      title: "Happy Number",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/happy-number/",
    },
    {
      id: "mth2",
      title: "Plus One",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/plus-one/",
    },
    {
      id: "mth3",
      title: "Pow(x, n)",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/powx-n/",
    },
    {
      id: "mth4",
      title: "Multiply Strings",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/multiply-strings/",
    },
    {
      id: "mth5",
      title: "Reverse Bits",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/reverse-bits/",
    },
  ],
  monotonic: [
    {
      id: "ms1",
      title: "Daily Temperatures",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/daily-temperatures/",
    },
    {
      id: "ms2",
      title: "Online Stock Span",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/online-stock-span/",
    },
    {
      id: "ms3",
      title: "Largest Rectangle in Histogram",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    },
    {
      id: "ms4",
      title: "Next Greater Element I",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/next-greater-element-i/",
    },
  ],
};

const CORE_SUBJECTS = [
  {
    id: "os",
    label: "Operating Systems",
    topics: [
      "Processes & Threads",
      "Scheduling Algorithms",
      "Memory Management",
      "Virtual Memory",
      "Deadlocks",
      "File Systems",
      "Synchronization",
    ],
  },
  {
    id: "dbms",
    label: "DBMS",
    topics: [
      "SQL & Joins",
      "Normalization",
      "Indexing",
      "Transactions & ACID",
      "NoSQL Basics",
      "Query Optimization",
    ],
  },
  {
    id: "cn",
    label: "Computer Networks",
    topics: [
      "OSI Model",
      "TCP/IP",
      "HTTP/HTTPS",
      "DNS & DHCP",
      "Routing Algorithms",
      "Socket Programming",
    ],
  },
  {
    id: "oops",
    label: "OOP Concepts",
    topics: [
      "Inheritance & Polymorphism",
      "Encapsulation",
      "Abstraction",
      "SOLID Principles",
      "Design Patterns",
    ],
  },
  {
    id: "sys",
    label: "System Design",
    topics: [
      "Load Balancing",
      "Caching (Redis)",
      "CAP Theorem",
      "Microservices",
      "Message Queues",
    ],
  },
];

const SKILL_CATEGORIES = [
  {
    id: "lang",
    label: "Languages",
    items: ["Python", "Java", "C++", "JavaScript", "Go"],
  },
  {
    id: "backend",
    label: "Backend",
    items: ["Node.js", "Spring Boot", "Django/Flask", "REST APIs", "GraphQL"],
  },
  {
    id: "db",
    label: "Databases",
    items: ["MySQL/PostgreSQL", "MongoDB", "Redis"],
  },
  {
    id: "tools",
    label: "Tools & Cloud",
    items: ["Git", "Docker", "Kubernetes", "AWS/GCP/Azure", "Linux/Shell"],
  },
];

const SKILL_LEVELS = [
  { val: 0, label: "–", color: "var(--txt3)" },
  { val: 1, label: "Beginner", color: "#ef4444" },
  { val: 2, label: "Familiar", color: "#e8924a" },
  { val: 3, label: "Proficient", color: "#d4b44a" },
  { val: 4, label: "Advanced", color: "#4caf7d" },
];

const DIFF_CONFIG = {
  Easy: { color: "#4caf7d", bg: "rgba(76,175,125,0.1)" },
  Medium: { color: "#d4b44a", bg: "rgba(212,180,74,0.1)" },
  Hard: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

const RESUME_CHECKLIST = [
  { id: "r1", label: "One page, ATS-friendly format" },
  { id: "r2", label: "Strong summary / objective at top" },
  { id: "r3", label: "Projects with impact metrics (e.g. 40% faster)" },
  { id: "r4", label: "GitHub links for all major projects" },
  { id: "r5", label: "LeetCode / competitive profile linked" },
  { id: "r6", label: "Internship / work experience listed" },
  { id: "r7", label: "No spelling or grammar errors" },
  { id: "r8", label: "Skills section is keyword-rich (for ATS)" },
  { id: "r9", label: "Action verbs used for all bullet points" },
  { id: "r10", label: "Education, CGPA listed clearly" },
];

const APP_STATUS = [
  "Shortlisted",
  "OA Sent",
  "OA Done",
  "Interview",
  "Offer",
  "Rejected",
];
const STATUS_COLORS = {
  Shortlisted: { color: "#5b8def", bg: "rgba(91,141,239,0.08)" },
  "OA Sent": { color: "#9b72cf", bg: "rgba(155,114,207,0.08)" },
  "OA Done": { color: "#d4b44a", bg: "rgba(212,180,74,0.08)" },
  Interview: { color: "#e8924a", bg: "rgba(232,146,74,0.08)" },
  Offer: { color: "#4caf7d", bg: "rgba(76,175,125,0.08)" },
  Rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
};
const COMPANY_TIERS = [
  { id: "dream", label: "Dream", color: "#d4b44a", bg: "rgba(212,180,74,0.1)" },
  {
    id: "product",
    label: "Product",
    color: "#5b8def",
    bg: "rgba(91,141,239,0.1)",
  },
  {
    id: "mass",
    label: "Mass Recruiter",
    color: "#9b72cf",
    bg: "rgba(155,114,207,0.1)",
  },
  {
    id: "startup",
    label: "Startup",
    color: "#4caf7d",
    bg: "rgba(76,175,125,0.1)",
  },
];
const INTERVIEW_ROUNDS = [
  "Online Assessment",
  "Technical Round 1",
  "Technical Round 2",
  "System Design",
  "HR / Managerial",
];

// ── localStorage helpers ──────────────────────────────────────────────────────
function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

// ── Question helpers ──────────────────────────────────────────────────────────
function getTotalQuestions() {
  return DSA_TOPICS.reduce((s, t) => s + (DSA_QUESTIONS[t.id] || []).length, 0);
}
function getSolvedCount(questionDone) {
  return DSA_TOPICS.reduce(
    (s, t) =>
      s + (DSA_QUESTIONS[t.id] || []).filter((q) => questionDone[q.id]).length,
    0,
  );
}
function calcReadinessScore(questionDone) {
  const total = getTotalQuestions(),
    done = getSolvedCount(questionDone);
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

// ── Activity log ──────────────────────────────────────────────────────────────
function logActivity(count = 1) {
  const today = new Date().toISOString().split("T")[0];
  const log = load("pp_activity_log", {});
  log[today] = (log[today] || 0) + count;
  save("pp_activity_log", log);
}
function getMomentum() {
  const log = load("pp_activity_log", {});
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  });
  const week = days.map((d) => log[d] || 0);
  const recent3 = week.slice(0, 3).reduce((a, b) => a + b, 0);
  const prior4 = week.slice(3).reduce((a, b) => a + b, 0);
  const activeDays = week.filter((v) => v > 0).length;
  const total7 = week.reduce((a, b) => a + b, 0);
  if (total7 === 0)
    return {
      label: "No Activity",
      icon: "◦",
      color: "var(--txt3)",
      trend: 0,
      activeDays,
      total7,
    };
  if (recent3 > prior4 * 1.2)
    return {
      label: "Increasing",
      icon: "↑",
      color: "#4caf7d",
      trend: 1,
      activeDays,
      total7,
    };
  if (prior4 > recent3 * 1.2)
    return {
      label: "Dropping",
      icon: "↓",
      color: "#ef4444",
      trend: -1,
      activeDays,
      total7,
    };
  return {
    label: "Stable",
    icon: "→",
    color: "#d4b44a",
    trend: 0,
    activeDays,
    total7,
  };
}

// ── Retention Decay Engine ─────────────────────────────────────────────────────
// Based on Ebbinghaus forgetting curve: R = e^(-t/S) where S is stability
function calcRetention(daysSince, solvedCount, topicTotal) {
  if (!daysSince || daysSince === 0) return 100;
  const completionBonus = (solvedCount / topicTotal) * 1.5; // more solved = slower decay
  const stability = Math.max(1, 3 + completionBonus * 10); // stability in days
  const retention = Math.round(100 * Math.exp(-daysSince / stability));
  return Math.max(5, Math.min(100, retention));
}

function getRevisionUrgency(retention) {
  if (retention < 40)
    return { label: "URGENT", color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
  if (retention < 65)
    return { label: "SOON", color: "#e8924a", bg: "rgba(232,146,74,0.08)" };
  if (retention < 80)
    return { label: "REVIEW", color: "#d4b44a", bg: "rgba(212,180,74,0.08)" };
  return { label: "FRESH", color: "#4caf7d", bg: "rgba(76,175,125,0.08)" };
}

// ── Weakness Prediction Engine ────────────────────────────────────────────────
function getWeaknessPredictions(
  questionDone,
  topicLastSeen,
  targetCompany = "google",
) {
  const now = Date.now();
  return DSA_TOPICS.map((topic) => {
    const qs = DSA_QUESTIONS[topic.id] || [];
    const done = qs.filter((q) => questionDone[q.id]).length;
    const pct = qs.length > 0 ? done / qs.length : 1;
    const lastSeen = topicLastSeen[topic.id] || 0;
    const daysSince = lastSeen ? Math.floor((now - lastSeen) / 86400000) : 999;
    const retention = lastSeen
      ? calcRetention(daysSince, done, qs.length)
      : done > 0
        ? 60
        : 0;
    const companyWeight = topic.companyWeight?.[targetCompany] || 5;

    // Risk score: combines coverage gap, retention, and company relevance
    const coverageGap = (1 - pct) * 40;
    const retentionGap = ((100 - retention) / 100) * 30;
    const companyFactor = (companyWeight / 10) * 30;
    const riskScore = Math.round(coverageGap + retentionGap + companyFactor);

    // OA Risk prediction
    let oaRisk = "LOW";
    if (riskScore > 70 && companyWeight >= 8) oaRisk = "HIGH";
    else if (riskScore > 50 && companyWeight >= 6) oaRisk = "MEDIUM";

    return {
      ...topic,
      pct,
      done,
      total: qs.length,
      daysSince,
      retention,
      companyWeight,
      riskScore,
      oaRisk,
    };
  }).sort((a, b) => b.riskScore - a.riskScore);
}

// ── Opportunity Cost Tracker ──────────────────────────────────────────────────
function getOpportunityCost(questionDone, topicLastSeen, targetDate) {
  const now = Date.now();
  const log = load("pp_activity_log", {});
  const daysLeft = targetDate
    ? Math.max(1, Math.ceil((new Date(targetDate) - new Date()) / 86400000))
    : 90;

  // Time spent estimate per topic (based on activity log weighted by when questions were solved)
  const topicCosts = DSA_TOPICS.map((topic) => {
    const qs = DSA_QUESTIONS[topic.id] || [];
    const done = qs.filter((q) => questionDone[q.id]).length;
    const estimatedHours = done * 0.75; // avg 45min per question
    const remaining = qs.length - done;
    const hoursNeeded = remaining * 0.75;
    const lastSeen = topicLastSeen[topic.id] || 0;
    const daysSince = lastSeen ? Math.floor((now - lastSeen) / 86400000) : 999;

    return {
      ...topic,
      done,
      total: qs.length,
      remaining,
      estimatedHours,
      hoursNeeded,
      daysSince,
    };
  });

  const totalHoursSpent = topicCosts.reduce((s, t) => s + t.estimatedHours, 0);
  const topTimeSpent = topicCosts
    .sort((a, b) => b.estimatedHours - a.estimatedHours)
    .slice(0, 3);
  const untouched = topicCosts.filter((t) => t.done === 0);

  // If current pace continues, which patterns wont finish
  const totalQ = getTotalQuestions();
  const doneQ = getSolvedCount(questionDone);
  const allLoggedDays = Object.keys(log).sort();
  const daysSinceStart =
    allLoggedDays.length > 0
      ? Math.max(
          1,
          Math.floor((new Date() - new Date(allLoggedDays[0])) / 86400000) + 1,
        )
      : 1;
  const totalActivity = Object.values(log).reduce((a, b) => a + b, 0);
  const qPerDay = totalActivity / daysSinceStart;
  const projectedSolved = doneQ + qPerDay * daysLeft;
  const willMiss = totalQ - projectedSolved;

  return {
    topTimeSpent: topicCosts.slice(0, 3),
    untouched,
    totalHoursSpent,
    daysLeft,
    willMiss: Math.max(0, willMiss),
    qPerDay,
  };
}

// ── Pace Engine ───────────────────────────────────────────────────────────────
function calcPace(targetDate, questionDone) {
  if (!targetDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  const daysLeft = Math.max(1, Math.ceil((target - now) / 86400000));
  const totalQ = getTotalQuestions(),
    doneQ = getSolvedCount(questionDone);
  const remaining = totalQ - doneQ;
  const requiredPerDay = remaining / daysLeft;
  const log = load("pp_activity_log", {});
  const today = new Date().toISOString().split("T")[0];
  const allLoggedDays = Object.keys(log).sort();
  const firstDay = allLoggedDays.length > 0 ? allLoggedDays[0] : today;
  const daysSinceStart = Math.max(
    1,
    Math.floor((new Date(today) - new Date(firstDay)) / 86400000) + 1,
  );
  const totalActivity = Object.values(log).reduce((a, b) => a + b, 0);
  const actualPerDay = totalActivity / daysSinceStart;
  const projectedFinishDays =
    actualPerDay > 0 ? Math.ceil(remaining / actualPerDay) : Infinity;
  const projectedDate = new Date(now);
  projectedDate.setDate(projectedDate.getDate() + projectedFinishDays);
  const lateDays = projectedFinishDays - daysLeft;
  return {
    daysLeft,
    totalQ,
    doneQ,
    remaining,
    requiredPerDay,
    actualPerDay,
    projectedFinishDays,
    lateDays,
    projectedDate,
  };
}

// ── Weekly Reality Report ─────────────────────────────────────────────────────
function getWeeklyReport(questionDone, targetDate) {
  const log = load("pp_activity_log", {});
  const lastWeekPlan = load("pp_weekly_plan", null);
  const today = new Date();

  const thisWeekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  });
  const thisWeekSolved = thisWeekDays
    .map((d) => log[d] || 0)
    .reduce((a, b) => a + b, 0);

  const prevWeekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - 7 - i);
    return d.toISOString().split("T")[0];
  });
  const prevWeekSolved = prevWeekDays
    .map((d) => log[d] || 0)
    .reduce((a, b) => a + b, 0);

  const pace = calcPace(targetDate, questionDone);
  const weeklyTarget = pace ? Math.ceil(pace.requiredPerDay * 7) : 35;
  const gap = weeklyTarget - thisWeekSolved;
  const slipDays =
    pace && pace.actualPerDay > 0 ? Math.round(gap / pace.actualPerDay) : 0;

  // Weakest patterns this week (untouched)
  const topicLastSeen = load("pp_topic_last_seen", {});
  const now = Date.now();
  const unchanged = DSA_TOPICS.filter((t) => {
    const ls = topicLastSeen[t.id];
    return !ls || Math.floor((now - ls) / 86400000) >= 7;
  }).slice(0, 3);

  return {
    thisWeekSolved,
    prevWeekSolved,
    weeklyTarget,
    gap,
    slipDays,
    unchanged,
    pace,
  };
}

// ── Real Readiness Score ──────────────────────────────────────────────────────
function calcRealReadiness(
  questionDone,
  topicLastSeen,
  targetCompany = "google",
) {
  const predictions = getWeaknessPredictions(
    questionDone,
    topicLastSeen,
    targetCompany,
  );

  // Pattern Coverage Score (0-100)
  const totalQ = getTotalQuestions(),
    doneQ = getSolvedCount(questionDone);
  const coverageScore = Math.round((doneQ / totalQ) * 100);

  // Retention / Memory Score (0-100)
  const retentionScores = predictions.map((p) => p.retention);
  const retentionScore = Math.round(
    retentionScores.reduce((a, b) => a + b, 0) / retentionScores.length,
  );

  // Interview Stability Score = no critical gaps in high-weight topics for selected company
  const highWeightTopics = predictions.filter((p) => p.companyWeight >= 8);
  const coveredHighWeight = highWeightTopics.filter((p) => p.pct >= 0.5).length;
  const stabilityScore =
    highWeightTopics.length > 0
      ? Math.round((coveredHighWeight / highWeightTopics.length) * 100)
      : 50;

  const combined = Math.round(
    coverageScore * 0.35 + retentionScore * 0.35 + stabilityScore * 0.3,
  );

  return {
    coverageScore,
    retentionScore,
    stabilityScore,
    combined,
    targetCompany,
  };
}

// ── Shared UI primitives ──────────────────────────────────────────────────────
function Check({ size = 11 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Ring({ pct, size = 56, stroke = 5, color = "#5b8def" }) {
  const r = (size - stroke) / 2,
    c = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--bg3)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${(pct / 100) * c} ${c}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray .6s ease" }}
      />
    </svg>
  );
}

function ProgressRing({ pct, size, color, label }) {
  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <Ring pct={pct} size={size} stroke={6} color={color} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: size * 0.22,
            fontWeight: 800,
            color: "var(--txt)",
            fontFamily: "var(--mono)",
            lineHeight: 1,
          }}
        >
          {pct}%
        </div>
        {label && (
          <div
            style={{
              fontSize: size * 0.13,
              color: "var(--txt3)",
              marginTop: 2,
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Question Modal ─────────────────────────────────────────────────────────────
function QuestionModal({ topic, doneMap, onToggle, onClose }) {
  const questions = DSA_QUESTIONS[topic.id] || [];
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const doneCount = questions.filter((q) => doneMap[q.id]).length;
  const pct = Math.round((doneCount / questions.length) * 100);
  const topicColor =
    pct === 100
      ? "#4caf7d"
      : pct >= 60
        ? "#5b8def"
        : pct >= 30
          ? "#e8924a"
          : "#ef4444";
  const filtered = questions.filter(
    (q) =>
      (filter === "All" || q.difficulty === filter) &&
      (!search || q.title.toLowerCase().includes(search.toLowerCase())),
  );

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "0 0 20px 20px",
          width: "100%",
          maxWidth: 600,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
        }}
      >
        <div
          style={{
            padding: "18px 20px 14px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 20 }}>{topic.icon}</span>
                <div
                  style={{ fontSize: 16, fontWeight: 800, color: "var(--txt)" }}
                >
                  {topic.label}
                </div>
                {topic.tag && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: 5,
                      background: "rgba(91,141,239,0.12)",
                      color: "#5b8def",
                      letterSpacing: ".06em",
                    }}
                  >
                    {topic.tag}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: "var(--txt3)" }}>
                {doneCount}/{questions.length} solved
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--bg2)",
                color: "var(--txt3)",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 6,
                background: "var(--bg3)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: topicColor,
                  borderRadius: 99,
                  transition: "width .4s",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: topicColor,
                fontFamily: "var(--mono)",
              }}
            >
              {pct}%
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                flex: "1 1 120px",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                padding: "7px 12px",
                fontSize: 12,
                color: "var(--txt)",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {["All", "Easy", "Medium", "Hard"].map((f) => {
                const dc = f === "All" ? null : DIFF_CONFIG[f];
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: filter === f ? 700 : 400,
                      cursor: "pointer",
                      border: `1px solid ${filter === f ? dc?.color || "var(--txt)" : "var(--border)"}`,
                      background:
                        filter === f ? dc?.bg || "var(--txt)" : "transparent",
                      color:
                        filter === f ? dc?.color || "var(--bg)" : "var(--txt3)",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {filtered.map((q, i) => {
              const done = !!doneMap[q.id],
                dc = DIFF_CONFIG[q.difficulty];
              return (
                <div
                  key={q.id}
                  onClick={() => onToggle(q.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    borderRadius: 10,
                    background: done ? "#4caf7d0a" : "var(--bg2)",
                    border: `1px solid ${done ? "#4caf7d25" : "var(--border)"}`,
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      border: `1.5px solid ${done ? "#4caf7d" : "var(--border2)"}`,
                      background: done ? "#4caf7d" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {done && <Check />}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--txt3)",
                      fontFamily: "var(--mono)",
                      width: 20,
                      flexShrink: 0,
                      textAlign: "right",
                    }}
                  >
                    {i + 1}.
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: done ? 600 : 400,
                      color: done ? "#4caf7d" : "var(--txt2)",
                      wordBreak: "break-word",
                    }}
                  >
                    {q.title}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "2px 7px",
                      borderRadius: 5,
                      background: dc.bg,
                      color: dc.color,
                      flexShrink: 0,
                    }}
                  >
                    {q.difficulty[0]}
                  </span>
                  <a
                    href={q.leetcode}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: 11,
                      color: "var(--txt3)",
                      textDecoration: "none",
                      flexShrink: 0,
                      padding: "3px 7px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                    }}
                  >
                    ↗
                  </a>
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => questions.forEach((q) => onToggle(q.id, true))}
              style={{
                fontSize: 12,
                padding: "7px 14px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--bg2)",
                color: "var(--txt3)",
                cursor: "pointer",
              }}
            >
              Mark All
            </button>
            <button
              onClick={() => questions.forEach((q) => onToggle(q.id, false))}
              style={{
                fontSize: 12,
                padding: "7px 14px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--bg2)",
                color: "var(--txt3)",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
          <button
            onClick={onClose}
            style={{
              fontSize: 13,
              padding: "8px 20px",
              borderRadius: 9,
              border: "none",
              background: "var(--txt)",
              color: "var(--bg)",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── AI Coach Tab (Anthropic Streaming) ───────────────────────────────────────
function AICoachTab({ contextData }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Your real-time prep data is loaded. I have your DSA coverage, retention decay scores, weakness predictions, and opportunity cost analysis. Ask me anything — or pick a suggestion below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

 async function sendMessage(text) {
   if (!text.trim() || loading) return;
   setMessages((prev) => [...prev, { role: "user", content: text }]);
   setInput("");
   setLoading(true);
   setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

   try {
     const res = await fetch("/api/analyze", {
       // ← your existing backend route
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         message: text,
         context: contextData,
         history: messages.map((m) => ({ role: m.role, content: m.content })),
       }),
     });

     if (!res.ok) throw new Error("Bad response");

     const reader = res.body.getReader();
     const decoder = new TextDecoder();
     let buffer = "";

     setLoading(false); // hide dots, streaming begins

     while (true) {
       const { done, value } = await reader.read();
       if (done) break;

       buffer += decoder.decode(value, { stream: true });
       const lines = buffer.split("\n");
       buffer = lines.pop();

       for (const line of lines) {
         if (!line.startsWith("data: ")) continue;
         const data = line.slice(6).trim();
         if (data === "[DONE]") break;
         try {
           const { token } = JSON.parse(data);
           if (token) {
             setMessages((prev) => {
               const updated = [...prev];
               const last = updated[updated.length - 1];
               updated[updated.length - 1] = {
                 ...last,
                 content: last.content + token,
               };
               return updated;
             });
           }
         } catch {
           /* skip malformed chunk */
         }
       }
     }
   } catch {
     setLoading(false);
     setMessages((prev) => {
       const updated = [...prev];
       updated[updated.length - 1] = {
         role: "assistant",
         content: "Connection error. Check your network or API key.",
       };
       return updated;
     });
   }
 }

  const SUGGESTIONS = [
    {
      label: "Today's Plan",
      prompt:
        "Give me a focused 3-task plan for today based on my retention decay and weak spots.",
    },
    {
      label: "OA Risk",
      prompt:
        "Which patterns are most likely to cost me an OA rejection? Give me specific risk scores.",
    },
    {
      label: "Brutal Pace Check",
      prompt:
        "Am I going to make my deadline? Be completely honest with numbers.",
    },
    {
      label: "Opportunity Cost",
      prompt:
        "Where am I wasting prep time vs where I should focus based on company weight?",
    },
    {
      label: "Retention Gaps",
      prompt:
        "Which patterns have dangerous retention decay right now and why?",
    },
    {
      label: "Weekly Reality",
      prompt:
        "Give me a brutal honest assessment of this week's performance vs what was needed.",
    },
    {
      label: "Interview Readiness",
      prompt:
        "What is my real interview readiness score breakdown and what's dragging it down?",
    },
  ];

  const renderText = (text) => {
    const lines = text
      .replace(/^#{1,3}\s+/gm, "")
      .replace(/^---+$/gm, "")
      .replace(/^\s*[-–—]\s+/gm, "· ")
      .split("\n");
    return lines.map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: 10 }} />;
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={i} style={{ marginBottom: 3, lineHeight: 1.55 }}>
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} style={{ color: "inherit", fontWeight: 700 }}>
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            ),
          )}
        </div>
      );
    });
  };

  const dsaScore = contextData?.dsa?.score ?? 0;
  const paceLateDays = contextData?.pace?.lateDays ?? 0;
  const readiness = contextData?.readiness?.combined ?? 0;

  return (
    <div
      style={{
        height: "calc(100vh - 200px)",
        minHeight: 500,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px 12px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg2)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                flexShrink: 0,
              }}
            >
              🧠
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "var(--txt)",
                  lineHeight: 1.2,
                }}
              >
                Placement Intelligence
              </div>
              <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 1 }}>
                Live data · decay model · risk scores active
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {[
              {
                label: `DSA ${dsaScore}%`,
                color:
                  dsaScore >= 70
                    ? "#4caf7d"
                    : dsaScore >= 40
                      ? "#d4b44a"
                      : "#ef4444",
              },
              {
                label:
                  paceLateDays > 5
                    ? `${Math.round(paceLateDays)}d late`
                    : paceLateDays < -3
                      ? `${Math.abs(Math.round(paceLateDays))}d early`
                      : "On Pace",
                color:
                  paceLateDays > 5
                    ? "#ef4444"
                    : paceLateDays < -3
                      ? "#4caf7d"
                      : "#d4b44a",
              },
              {
                label: `Ready ${readiness}%`,
                color:
                  readiness >= 65
                    ? "#4caf7d"
                    : readiness >= 40
                      ? "#d4b44a"
                      : "#ef4444",
              },
            ].map((b) => (
              <div
                key={b.label}
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  padding: "3px 7px",
                  borderRadius: 6,
                  background: b.color + "18",
                  color: b.color,
                  border: `1px solid ${b.color}30`,
                  letterSpacing: ".04em",
                }}
              >
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            {m.role !== "user" && (
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                🧠
              </div>
            )}
            <div
              style={{
                maxWidth: "82%",
                padding: "11px 15px",
                borderRadius:
                  m.role === "user"
                    ? "16px 16px 4px 16px"
                    : "4px 16px 16px 16px",
                background:
                  m.role === "user"
                    ? "linear-gradient(135deg, #5b8def, #6366f1)"
                    : "var(--bg2)",
                color: m.role === "user" ? "#fff" : "var(--txt)",
                border: m.role === "user" ? "none" : "1px solid var(--border)",
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              {renderText(m.content)}
              {m.role === "assistant" &&
                i === messages.length - 1 &&
                !loading &&
                m.content && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 13,
                      background: "var(--txt3)",
                      marginLeft: 2,
                      verticalAlign: "middle",
                      animation: "blink 1s step-end infinite",
                    }}
                  />
                )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
              }}
            >
              🧠
            </div>
            <div
              style={{
                padding: "11px 16px",
                borderRadius: "4px 16px 16px 16px",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              {[0, 0.18, 0.36].map((delay, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#6366f1",
                    animation: `pulse 1.1s ${delay}s ease-in-out infinite`,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <style>{`
          @keyframes pulse { 0%, 100% { transform: scale(0.8); opacity: 0.4; } 50% { transform: scale(1.2); opacity: 1; } }
          @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        `}</style>
      </div>

      {/* Suggestions */}
      <div
        style={{
          padding: "10px 14px 0",
          background: "var(--bg2)",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 10,
            scrollbarWidth: "none",
          }}
        >
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s.prompt)}
              disabled={loading}
              style={{
                flexShrink: 0,
                padding: "6px 13px",
                borderRadius: 20,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--txt3)",
                fontSize: 11,
                fontWeight: 600,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.5 : 1,
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.color = "#6366f1";
                  e.currentTarget.style.background = "rgba(99,102,241,0.06)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--txt3)";
                e.currentTarget.style.background = "var(--bg)";
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div
        style={{
          padding: "10px 14px 14px",
          background: "var(--bg2)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "4px 4px 4px 14px",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage(input)
            }
            placeholder="Ask about pace, OA risk, retention, opportunity cost…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              fontSize: 13,
              color: "var(--txt)",
              outline: "none",
              padding: "7px 0",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              padding: "8px 16px",
              borderRadius: 11,
              border: "none",
              background:
                input.trim() && !loading
                  ? "linear-gradient(135deg, #5b8def, #6366f1)"
                  : "var(--bg3)",
              color: input.trim() && !loading ? "white" : "var(--txt3)",
              cursor: input.trim() && !loading ? "pointer" : "default",
              fontWeight: 700,
              fontSize: 15,
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Weakness Prediction Panel ─────────────────────────────────────────────────
function WeaknessPredictionPanel({
  questionDone,
  topicLastSeen,
  targetCompany,
  onOpenTopic,
}) {
  const predictions = getWeaknessPredictions(
    questionDone,
    topicLastSeen,
    targetCompany,
  );
  const top5 = predictions.slice(0, 5);

  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "#ef4444",
          marginBottom: 12,
        }}
      >
        ⚡ Weakness Prediction Engine
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {top5.map((topic) => {
          const urgency = getRevisionUrgency(topic.retention);
          const oaColor =
            topic.oaRisk === "HIGH"
              ? "#ef4444"
              : topic.oaRisk === "MEDIUM"
                ? "#e8924a"
                : "#4caf7d";
          return (
            <div
              key={topic.id}
              onClick={() => onOpenTopic(topic)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                background: "var(--bg)",
                border: `1px solid ${topic.oaRisk === "HIGH" ? "#ef444422" : "var(--border)"}`,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{topic.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--txt2)",
                    marginBottom: 3,
                  }}
                >
                  {topic.label}
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 4,
                      background: urgency.bg,
                      color: urgency.color,
                    }}
                  >
                    {topic.retention}% retained
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 4,
                      background: "rgba(91,141,239,0.1)",
                      color: "#5b8def",
                    }}
                  >
                    {Math.round(topic.pct * 100)}% done
                  </span>
                  {topic.oaRisk !== "LOW" && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "1px 6px",
                        borderRadius: 4,
                        background: oaColor + "18",
                        color: oaColor,
                      }}
                    >
                      OA Risk: {topic.oaRisk}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color:
                      topic.riskScore > 70
                        ? "#ef4444"
                        : topic.riskScore > 50
                          ? "#e8924a"
                          : "#d4b44a",
                    fontFamily: "var(--mono)",
                  }}
                >
                  {topic.riskScore}
                </div>
                <div
                  style={{
                    fontSize: 8,
                    color: "var(--txt3)",
                    fontWeight: 600,
                    letterSpacing: ".04em",
                  }}
                >
                  RISK
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Retention Decay Panel ─────────────────────────────────────────────────────
function RetentionDecayPanel({ questionDone, topicLastSeen, onOpenTopic }) {
  const now = Date.now();
  const decayData = DSA_TOPICS.map((topic) => {
    const qs = DSA_QUESTIONS[topic.id] || [];
    const done = qs.filter((q) => questionDone[q.id]).length;
    if (done === 0) return null;
    const lastSeen = topicLastSeen[topic.id];
    const daysSince = lastSeen ? Math.floor((now - lastSeen) / 86400000) : 999;
    const retention = calcRetention(daysSince, done, qs.length);
    const urgency = getRevisionUrgency(retention);
    return { ...topic, done, total: qs.length, daysSince, retention, urgency };
  })
    .filter(Boolean)
    .sort((a, b) => a.retention - b.retention);

  if (!decayData.length)
    return (
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "14px 16px",
          marginBottom: 14,
          textAlign: "center",
          color: "var(--txt3)",
          fontSize: 13,
        }}
      >
        No solved topics to track retention yet.
      </div>
    );

  const urgent = decayData.filter((t) => t.retention < 40);

  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--txt3)",
          }}
        >
          🧬 Memory Decay Model
        </div>
        {urgent.length > 0 && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#ef4444",
              background: "rgba(239,68,68,0.1)",
              padding: "3px 8px",
              borderRadius: 6,
            }}
          >
            {urgent.length} critical
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {decayData.slice(0, 6).map((t) => (
          <div
            key={t.id}
            onClick={() => onOpenTopic(t)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 10,
              background: "var(--bg)",
              border: `1px solid ${t.urgency.bg === "rgba(239,68,68,0.1)" ? "#ef444420" : "var(--border)"}`,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 14, flexShrink: 0 }}>{t.icon}</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--txt2)",
                    fontWeight: 600,
                  }}
                >
                  {t.label}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: t.urgency.color,
                    fontWeight: 700,
                  }}
                >
                  {t.urgency.label}
                </span>
              </div>
              {/* Retention bar */}
              <div
                style={{
                  height: 4,
                  background: "var(--bg3)",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${t.retention}%`,
                    background: t.urgency.color,
                    borderRadius: 99,
                    transition: "width .4s",
                  }}
                />
              </div>
            </div>
            <div style={{ flexShrink: 0, textAlign: "right" }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: t.urgency.color,
                  fontFamily: "var(--mono)",
                }}
              >
                {t.retention}%
              </div>
              <div style={{ fontSize: 9, color: "var(--txt3)" }}>
                {t.daysSince < 999 ? `${t.daysSince}d ago` : "long ago"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Real Readiness Score Panel ────────────────────────────────────────────────
function RealReadinessPanel({ questionDone, topicLastSeen, targetCompany }) {
  const readiness = calcRealReadiness(
    questionDone,
    topicLastSeen,
    targetCompany,
  );
  const { coverageScore, retentionScore, stabilityScore, combined } = readiness;

  const companyLabel =
    {
      google: "Google / FAANG OA",
      amazon: "Amazon / MNC",
      service: "Service-based (TCS/Infosys)",
      startup: "Startup",
    }[targetCompany] || "Product-based";

  const readinessLabel =
    combined >= 75
      ? "Interview Ready 🚀"
      : combined >= 55
        ? "Almost Ready 💪"
        : combined >= 35
          ? "Needs Work 🔥"
          : "Just Starting ⚡";
  const readinessColor =
    combined >= 75
      ? "#4caf7d"
      : combined >= 55
        ? "#5b8def"
        : combined >= 35
          ? "#e8924a"
          : "#ef4444";

  const metrics = [
    {
      label: "Pattern Coverage",
      val: coverageScore,
      desc: "% of questions solved",
      color:
        coverageScore >= 70
          ? "#4caf7d"
          : coverageScore >= 40
            ? "#d4b44a"
            : "#ef4444",
    },
    {
      label: "Memory Retention",
      val: retentionScore,
      desc: "avg decay across topics",
      color:
        retentionScore >= 70
          ? "#4caf7d"
          : retentionScore >= 40
            ? "#d4b44a"
            : "#ef4444",
    },
    {
      label: "Interview Stability",
      val: stabilityScore,
      desc: `high-priority for ${companyLabel}`,
      color:
        stabilityScore >= 70
          ? "#4caf7d"
          : stabilityScore >= 40
            ? "#d4b44a"
            : "#ef4444",
    },
  ];

  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "16px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 14,
        }}
      >
        <ProgressRing pct={combined} size={72} color={readinessColor} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: readinessColor,
              marginBottom: 3,
            }}
          >
            {readinessLabel}
          </div>
          <div style={{ fontSize: 11, color: "var(--txt3)" }}>
            for {companyLabel}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {metrics.map((m) => (
          <div key={m.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span
                style={{ fontSize: 11, color: "var(--txt2)", fontWeight: 600 }}
              >
                {m.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: m.color,
                  fontFamily: "var(--mono)",
                }}
              >
                {m.val}%
              </span>
            </div>
            <div
              style={{
                height: 5,
                background: "var(--bg3)",
                borderRadius: 99,
                overflow: "hidden",
                marginBottom: 2,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${m.val}%`,
                  background: m.color,
                  borderRadius: 99,
                  transition: "width .5s",
                }}
              />
            </div>
            <div style={{ fontSize: 9, color: "var(--txt3)" }}>{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Opportunity Cost Tracker Panel ────────────────────────────────────────────
function OpportunityCostPanel({ questionDone, topicLastSeen, targetDate }) {
  const cost = getOpportunityCost(questionDone, topicLastSeen, targetDate);
  return (
    <div
      style={{
        background: "rgba(212,180,74,0.05)",
        border: "1px solid rgba(212,180,74,0.2)",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "#d4b44a",
          marginBottom: 12,
        }}
      >
        ⏱ Opportunity Cost Tracker
      </div>
      {cost.qPerDay > 0 ? (
        <>
          {cost.willMiss > 0 && (
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#ef4444",
                marginBottom: 10,
                lineHeight: 1.5,
              }}
            >
              At {cost.qPerDay.toFixed(1)} q/day, you'll miss ~
              {Math.round(cost.willMiss)} questions by your deadline. That's
              patterns left uncovered.
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {cost.topTimeSpent.slice(0, 3).map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: 14 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--txt2)",
                      fontWeight: 600,
                    }}
                  >
                    {t.label}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--txt3)" }}>
                    ~{t.estimatedHours.toFixed(1)}h invested · {t.remaining}{" "}
                    remaining
                  </div>
                </div>
              </div>
            ))}
          </div>
          {cost.untouched.length > 0 && (
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "#e8924a",
                fontWeight: 600,
              }}
            >
              ⚠ {cost.untouched.length} patterns completely untouched:{" "}
              {cost.untouched
                .slice(0, 3)
                .map((t) => t.label)
                .join(", ")}
              {cost.untouched.length > 3
                ? ` +${cost.untouched.length - 3} more`
                : ""}
            </div>
          )}
        </>
      ) : (
        <div style={{ fontSize: 12, color: "var(--txt3)" }}>
          Start solving questions to see your opportunity cost analysis.
        </div>
      )}
    </div>
  );
}

// ── Weekly Reality Report Panel ────────────────────────────────────────────────
function WeeklyRealityPanel({ questionDone, targetDate }) {
  const report = getWeeklyReport(questionDone, targetDate);
  const hit = report.thisWeekSolved >= report.weeklyTarget;
  const delta = report.thisWeekSolved - report.prevWeekSolved;

  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--txt3)",
          marginBottom: 12,
        }}
      >
        📊 Weekly Reality Report
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {[
          {
            label: "This Week",
            val: report.thisWeekSolved,
            target: report.weeklyTarget,
            color: hit ? "#4caf7d" : "#ef4444",
          },
          {
            label: "Target",
            val: report.weeklyTarget,
            color: "#5b8def",
            sub: "q needed",
          },
          {
            label: "vs Last Week",
            val: delta >= 0 ? `+${delta}` : delta,
            color: delta >= 0 ? "#4caf7d" : "#ef4444",
            sub: "change",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "10px 8px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "var(--txt3)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                marginBottom: 4,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: s.color,
                fontFamily: "var(--mono)",
                lineHeight: 1,
              }}
            >
              {s.val}
            </div>
            {s.target && (
              <div style={{ fontSize: 9, color: "var(--txt3)", marginTop: 2 }}>
                of {s.target} target
              </div>
            )}
            {s.sub && (
              <div style={{ fontSize: 9, color: "var(--txt3)", marginTop: 2 }}>
                {s.sub}
              </div>
            )}
          </div>
        ))}
      </div>
      {!hit && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#ef4444",
            marginBottom: 8,
            lineHeight: 1.5,
          }}
        >
          You missed your weekly target by{" "}
          {report.weeklyTarget - report.thisWeekSolved} questions.
          {report.slipDays > 0
            ? ` At this pace, target date slips by ~${report.slipDays} days.`
            : ""}
        </div>
      )}
      {hit && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#4caf7d",
            marginBottom: 8,
            lineHeight: 1.5,
          }}
        >
          You hit your weekly target. Keep it up.
        </div>
      )}
      {report.unchanged.length > 0 && (
        <div style={{ fontSize: 11, color: "var(--txt3)" }}>
          Unchanged all week: {report.unchanged.map((t) => t.label).join(", ")}
        </div>
      )}
    </div>
  );
}

// ── Company Selector & Risk Reorder ───────────────────────────────────────────
const COMPANY_TYPES = [
  { id: "google", label: "Google / FAANG", icon: "🔵" },
  { id: "amazon", label: "Amazon / MNC", icon: "🟠" },
  { id: "service", label: "Service-based", icon: "🟢" },
  { id: "startup", label: "Startup", icon: "🟣" },
];

// ── DSA Tab ───────────────────────────────────────────────────────────────────
function DSATab({ onSolve }) {
  const [questionDone, setQuestionDone] = useState(() =>
    load("pp_dsa_qdone", {}),
  );
  const [topicLastSeen, setTopicLastSeen] = useState(() =>
    load("pp_topic_last_seen", {}),
  );
  const [openTopic, setOpenTopic] = useState(null);
  const [targetDate, setTargetDate] = useState(() =>
    load("pp_target_date", ""),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState(targetDate);
  const [targetCompany, setTargetCompany] = useState(() =>
    load("pp_target_company", "google"),
  );
  const [activeView, setActiveView] = useState("overview"); // "overview" | "patterns" | "retention" | "cost" | "reality"

  const dsaScore = useMemo(
    () => calcReadinessScore(questionDone),
    [questionDone],
  );
  const pace = useMemo(
    () => calcPace(targetDate, questionDone),
    [targetDate, questionDone],
  );
  const momentum = useMemo(() => getMomentum(), []);
  const totalSolved = getSolvedCount(questionDone);
  const totalProblems = getTotalQuestions();
  const predictions = useMemo(
    () => getWeaknessPredictions(questionDone, topicLastSeen, targetCompany),
    [questionDone, topicLastSeen, targetCompany],
  );
  const readiness = useMemo(
    () => calcRealReadiness(questionDone, topicLastSeen, targetCompany),
    [questionDone, topicLastSeen, targetCompany],
  );

  // Sort topics by risk when a company is selected
  const sortedTopics = useMemo(() => {
    return [...predictions];
  }, [predictions]);

  function applyDate() {
    setTargetDate(dateInput);
    save("pp_target_date", dateInput);
    setShowDatePicker(false);
  }
  function setCompany(id) {
    setTargetCompany(id);
    save("pp_target_company", id);
  }
  function toggleQuestion(qid, forceValue) {
    setQuestionDone((prev) => {
      const next = { ...prev };
      let solved = false;
      if (forceValue === true) {
        next[qid] = true;
      } else if (forceValue === false) {
        delete next[qid];
      } else if (next[qid]) {
        delete next[qid];
      } else {
        next[qid] = true;
        solved = true;
      }
      save("pp_dsa_qdone", next);
      if (solved)
        setTimeout(() => {
          logActivity(1);
          onSolve?.();
        }, 0);
      return next;
    });
  }
  function openTopicModal(topic) {
    setTopicLastSeen((prev) => {
      const next = { ...prev, [topic.id]: Date.now() };
      save("pp_topic_last_seen", next);
      return next;
    });
    setOpenTopic(topic);
  }

  const readinessColor =
    readiness.combined >= 75
      ? "#4caf7d"
      : readiness.combined >= 55
        ? "#5b8def"
        : readiness.combined >= 35
          ? "#e8924a"
          : "#ef4444";

  const subTabs = [
    { id: "overview", label: "Overview" },
    { id: "patterns", label: "Patterns" },
    { id: "retention", label: "Memory" },
    { id: "cost", label: "Opportunity" },
    { id: "reality", label: "Weekly" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Hero Card */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 14,
          }}
        >
          <ProgressRing
            pct={readiness.combined}
            size={82}
            color={readinessColor}
            label="Ready"
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: readinessColor,
                marginBottom: 4,
              }}
            >
              {readiness.combined >= 75
                ? "Interview Ready 🚀"
                : readiness.combined >= 55
                  ? "Almost Ready 💪"
                  : readiness.combined >= 35
                    ? "Needs Work 🔥"
                    : "Just Starting ⚡"}
            </div>
            <div
              style={{ fontSize: 11, color: "var(--txt3)", marginBottom: 6 }}
            >
              {totalSolved}/{totalProblems} solved · DSA raw: {dsaScore}%
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "Coverage", val: readiness.coverageScore },
                { label: "Retention", val: readiness.retentionScore },
                { label: "Stability", val: readiness.stabilityScore },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    flex: 1,
                    background: "var(--bg3)",
                    borderRadius: 8,
                    padding: "5px 8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color:
                        m.val >= 65
                          ? "#4caf7d"
                          : m.val >= 40
                            ? "#d4b44a"
                            : "#ef4444",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {m.val}%
                  </div>
                  <div
                    style={{
                      fontSize: 8,
                      color: "var(--txt3)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: ".04em",
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
            {targetDate && !showDatePicker && (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 11, color: "var(--txt3)" }}>
                  📅{" "}
                  <strong style={{ color: "var(--txt2)" }}>
                    {new Date(targetDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </strong>
                </span>
                <button
                  onClick={() => {
                    setDateInput(targetDate);
                    setShowDatePicker(true);
                  }}
                  style={{
                    fontSize: 10,
                    color: "var(--txt3)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✎ change
                </button>
              </div>
            )}
            {!showDatePicker && !targetDate && (
              <button
                onClick={() => setShowDatePicker(true)}
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  color: "#5b8def",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  padding: 0,
                }}
              >
                + Set your placement deadline
              </button>
            )}
          </div>
        </div>

        {/* Company selector */}
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              color: "var(--txt3)",
              marginBottom: 6,
            }}
          >
            Target Company Type
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {COMPANY_TYPES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCompany(c.id)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: targetCompany === c.id ? 700 : 500,
                  cursor: "pointer",
                  flexShrink: 0,
                  border: `1px solid ${targetCompany === c.id ? "#5b8def60" : "var(--border)"}`,
                  background:
                    targetCompany === c.id ? "#5b8def18" : "var(--bg)",
                  color: targetCompany === c.id ? "#5b8def" : "var(--txt3)",
                }}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        {showDatePicker && (
          <div
            style={{
              padding: "12px 14px",
              background: "var(--bg3)",
              borderRadius: 12,
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--txt3)",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              I want to finish all patterns by:
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                style={{
                  flex: 1,
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "8px 10px",
                  fontSize: 13,
                  color: "var(--txt)",
                  outline: "none",
                }}
              />
              <button
                onClick={applyDate}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#5b8def",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Set
              </button>
              <button
                onClick={() => setShowDatePicker(false)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--txt3)",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sub-tab navigation */}
      <div
        style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 4 }}
      >
        {subTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveView(t.id)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: activeView === t.id ? 700 : 500,
              cursor: "pointer",
              flexShrink: 0,
              border: "none",
              background: activeView === t.id ? "var(--txt)" : "var(--bg2)",
              color: activeView === t.id ? "var(--bg)" : "var(--txt3)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeView === "overview" && (
        <>
          {/* Pace Banner */}
          {pace &&
            (() => {
              const {
                daysLeft,
                remaining,
                requiredPerDay,
                actualPerDay,
                lateDays,
                projectedDate,
              } = pace;
              const isLate = lateDays > 3,
                isAhead = lateDays < -3;
              const accent = isLate
                ? "#ef4444"
                : isAhead
                  ? "#4caf7d"
                  : "#d4b44a";
              return (
                <div
                  style={{
                    background: isLate
                      ? "rgba(239,68,68,0.06)"
                      : isAhead
                        ? "rgba(76,175,125,0.06)"
                        : "rgba(212,180,74,0.06)",
                    border: `1px solid ${accent}30`,
                    borderRadius: 14,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        color: accent,
                      }}
                    >
                      ⚡ Pace
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--txt3)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {daysLeft}d left · {remaining} to go
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: accent,
                      marginBottom: 10,
                      lineHeight: 1.4,
                    }}
                  >
                    {isLate
                      ? `At current pace you'll finish ${Math.abs(Math.round(lateDays))} days late`
                      : isAhead
                        ? `On track — ${Math.abs(Math.round(lateDays))} days early`
                        : "Barely on pace — one bad week slips you behind."}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      {
                        label: "Need/day",
                        value: `${requiredPerDay.toFixed(1)} q`,
                        color: accent,
                      },
                      {
                        label: "Your avg",
                        value:
                          actualPerDay > 0
                            ? `${actualPerDay.toFixed(1)} q`
                            : "—",
                        color:
                          actualPerDay >= requiredPerDay
                            ? "#4caf7d"
                            : "#ef4444",
                      },
                      {
                        label: "Finish",
                        value:
                          lateDays === Infinity
                            ? "Unknown"
                            : projectedDate.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              }),
                        color: "var(--txt2)",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          flex: 1,
                          background: "var(--bg3)",
                          borderRadius: 10,
                          padding: "8px 10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 9,
                            color: "var(--txt3)",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            marginBottom: 3,
                          }}
                        >
                          {s.label}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: s.color,
                            fontFamily: "var(--mono)",
                          }}
                        >
                          {s.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          {/* Momentum */}
          {(() => {
            const log = load("pp_activity_log", {});
            const bars = Array.from({ length: 7 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const key = d.toISOString().split("T")[0];
              return {
                val: log[key] || 0,
                day: d.toLocaleDateString("en", { weekday: "short" }),
              };
            });
            const max = Math.max(...bars.map((b) => b.val), 1);
            return (
              <div
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        color: "var(--txt3)",
                        marginBottom: 2,
                      }}
                    >
                      Momentum
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: momentum.color,
                      }}
                    >
                      {momentum.icon} {momentum.label}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "var(--txt3)" }}>
                      Last 7 days
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "var(--txt)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {momentum.total7} q
                    </div>
                    <div style={{ fontSize: 10, color: "var(--txt3)" }}>
                      {momentum.activeDays}/7 active
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 4,
                    height: 36,
                  }}
                >
                  {bars.map((b, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          borderRadius: 3,
                          height:
                            b.val > 0
                              ? `${Math.max(6, (b.val / max) * 32)}px`
                              : "3px",
                          background:
                            b.val > 0 ? momentum.color : "var(--border)",
                          transition: "height .4s ease",
                        }}
                      />
                      <div style={{ fontSize: 8, color: "var(--txt3)" }}>
                        {b.day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <WeaknessPredictionPanel
            questionDone={questionDone}
            topicLastSeen={topicLastSeen}
            targetCompany={targetCompany}
            onOpenTopic={openTopicModal}
          />
        </>
      )}

      {/* Patterns (risk-sorted) */}
      {activeView === "patterns" && (
        <>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "var(--txt3)",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Sorted by Risk for{" "}
            {COMPANY_TYPES.find((c) => c.id === targetCompany)?.label}
          </div>
          <RealReadinessPanel
            questionDone={questionDone}
            topicLastSeen={topicLastSeen}
            targetCompany={targetCompany}
          />
          {sortedTopics.map((topic) => {
            const qs = DSA_QUESTIONS[topic.id] || [];
            const qDone = qs.filter((q) => questionDone[q.id]).length;
            const pct =
              qs.length > 0 ? Math.round((qDone / qs.length) * 100) : 0;
            const color =
              pct === 100
                ? "#4caf7d"
                : pct >= 60
                  ? "#5b8def"
                  : pct >= 30
                    ? "#e8924a"
                    : "#ef4444";
            const urgency = getRevisionUrgency(topic.retention);
            const oaColor =
              topic.oaRisk === "HIGH"
                ? "#ef4444"
                : topic.oaRisk === "MEDIUM"
                  ? "#e8924a"
                  : "#4caf7d";

            return (
              <div
                key={topic.id}
                onClick={() => openTopicModal(topic)}
                style={{
                  background: "var(--bg2)",
                  border: `1px solid ${topic.oaRisk === "HIGH" ? "#ef444422" : "var(--border)"}`,
                  borderRadius: 13,
                  padding: "12px 14px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#5b8def33")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor =
                    topic.oaRisk === "HIGH" ? "#ef444422" : "var(--border)")
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: "rgba(91,141,239,0.1)",
                      border: "1px solid rgba(91,141,239,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 14,
                    }}
                  >
                    {topic.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--txt2)",
                          }}
                        >
                          {topic.label}
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: 4,
                            background: urgency.bg,
                            color: urgency.color,
                          }}
                        >
                          {topic.retention}%
                        </span>
                        {topic.oaRisk !== "LOW" && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 800,
                              padding: "1px 6px",
                              borderRadius: 4,
                              background: oaColor + "18",
                              color: oaColor,
                            }}
                          >
                            {topic.oaRisk} RISK
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: 4,
                            background: "rgba(91,141,239,0.1)",
                            color: "#5b8def",
                          }}
                        >
                          {qDone}/{qs.length}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--txt3)",
                          fontFamily: "var(--mono)",
                        }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: "var(--bg3)",
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: color,
                          borderRadius: 99,
                          transition: "width .4s ease",
                        }}
                      />
                    </div>
                    <div style={{ marginTop: 4, display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 9, color: "var(--txt3)" }}>
                        Wt: {topic.companyWeight}/10
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          color:
                            topic.riskScore > 70 ? "#ef4444" : "var(--txt3)",
                          fontWeight: topic.riskScore > 70 ? 700 : 400,
                        }}
                      >
                        Risk: {topic.riskScore}
                      </span>
                      {topic.daysSince < 999 && topic.daysSince > 0 && (
                        <span style={{ fontSize: 9, color: "var(--txt3)" }}>
                          {topic.daysSince}d ago
                        </span>
                      )}
                    </div>
                  </div>
                  {pct === 100 ? (
                    <span style={{ fontSize: 14 }}>✅</span>
                  ) : (
                    <span style={{ fontSize: 12, color: "var(--txt3)" }}>
                      ›
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Memory / Retention */}
      {activeView === "retention" && (
        <RetentionDecayPanel
          questionDone={questionDone}
          topicLastSeen={topicLastSeen}
          onOpenTopic={openTopicModal}
        />
      )}

      {/* Opportunity Cost */}
      {activeView === "cost" && (
        <OpportunityCostPanel
          questionDone={questionDone}
          topicLastSeen={topicLastSeen}
          targetDate={targetDate}
        />
      )}

      {/* Weekly Reality */}
      {activeView === "reality" && (
        <WeeklyRealityPanel
          questionDone={questionDone}
          targetDate={targetDate}
        />
      )}

      {openTopic && (
        <QuestionModal
          topic={openTopic}
          doneMap={questionDone}
          onToggle={toggleQuestion}
          onClose={() => setOpenTopic(null)}
        />
      )}
    </div>
  );
}

// ── Core CS Tab ───────────────────────────────────────────────────────────────
function CoreCSTab() {
  const [progress, setProgress] = useState(() => load("pp_core_progress", {}));
  const [expanded, setExpanded] = useState(null);

  function toggleTopic(subjId, topic) {
    setProgress((prev) => {
      const key = `${subjId}_${topic}`;
      const next = { ...prev, [key]: !prev[key] };
      save("pp_core_progress", next);
      return next;
    });
  }

  const totalTopics = CORE_SUBJECTS.flatMap((s) => s.topics).length;
  const totalDone = CORE_SUBJECTS.reduce(
    (acc, s) => acc + s.topics.filter((t) => progress[`${s.id}_${t}`]).length,
    0,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 16,
          marginBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ProgressRing
            pct={Math.round((totalDone / totalTopics) * 100)}
            size={64}
            color="#9b72cf"
          />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--txt)" }}>
              Core CS Subjects
            </div>
            <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 3 }}>
              {totalDone}/{totalTopics} topics revised
            </div>
          </div>
        </div>
      </div>
      {CORE_SUBJECTS.map((subj) => {
        const done = subj.topics.filter(
          (t) => progress[`${subj.id}_${t}`],
        ).length;
        const pct = Math.round((done / subj.topics.length) * 100);
        const isOpen = expanded === subj.id;
        const color =
          pct === 100 ? "#4caf7d" : pct >= 50 ? "#9b72cf" : "#e8924a";
        return (
          <div
            key={subj.id}
            style={{
              background: "var(--bg2)",
              border: `1px solid ${isOpen ? "#9b72cf33" : "var(--border)"}`,
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => setExpanded(isOpen ? null : subj.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                cursor: "pointer",
              }}
            >
              <Ring pct={pct} size={36} stroke={4} color={color} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--txt2)",
                  }}
                >
                  {subj.label}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--txt3)", marginTop: 1 }}
                >
                  {done}/{subj.topics.length} revised
                </div>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--txt3)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "none",
                  transition: "transform .2s",
                  flexShrink: 0,
                }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            {isOpen && (
              <div
                style={{
                  padding: "0 16px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {subj.topics.map((topic) => {
                  const isDone = !!progress[`${subj.id}_${topic}`];
                  return (
                    <div
                      key={topic}
                      onClick={() => toggleTopic(subj.id, topic)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: isDone ? "#4caf7d0a" : "var(--bg)",
                        border: `1px solid ${isDone ? "#4caf7d22" : "var(--border)"}`,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          border: `1.5px solid ${isDone ? "#4caf7d" : "var(--border)"}`,
                          background: isDone ? "#4caf7d" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {isDone && <Check />}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: isDone ? "#4caf7d" : "var(--txt3)",
                          fontWeight: isDone ? 600 : 400,
                        }}
                      >
                        {topic}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Skills Tab ────────────────────────────────────────────────────────────────
function SkillsTab() {
  const [skills, setSkills] = useState(() => load("pp_skills", {}));
  const [customSkill, setCustomSkill] = useState("");
  const allBuiltin = SKILL_CATEGORIES.flatMap((c) => c.items);

  function setLevel(skill, level) {
    setSkills((prev) => {
      const next = { ...prev, [skill]: level };
      save("pp_skills", next);
      return next;
    });
  }
  function addCustom(e) {
    e.preventDefault();
    if (!customSkill.trim()) return;
    setLevel(customSkill.trim(), 1);
    setCustomSkill("");
  }

  const proficient = Object.values(skills).filter((v) => v >= 3).length;
  const advanced = Object.values(skills).filter((v) => v === 4).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
          marginBottom: 4,
        }}
      >
        {[
          {
            val: Object.keys(skills).length,
            label: "Tracked",
            color: "#5b8def",
          },
          { val: proficient, label: "Proficient+", color: "#d4b44a" },
          { val: advanced, label: "Advanced", color: "#4caf7d" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: s.color,
                fontFamily: "var(--mono)",
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "var(--txt3)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                marginTop: 2,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      {SKILL_CATEGORIES.map((cat) => (
        <div
          key={cat.id}
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--txt3)",
              marginBottom: 12,
            }}
          >
            {cat.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cat.items.map((skill) => {
              const level = skills[skill] || 0;
              const lvl = SKILL_LEVELS[level];
              return (
                <div
                  key={skill}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 13, color: "var(--txt2)", flex: 1 }}>
                    {skill}
                  </span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {SKILL_LEVELS.slice(1).map((l) => (
                      <button
                        key={l.val}
                        onClick={() =>
                          setLevel(skill, level === l.val ? 0 : l.val)
                        }
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          border: `1.5px solid ${level >= l.val ? l.color : "var(--border)"}`,
                          background:
                            level >= l.val ? l.color + "22" : "var(--bg)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background:
                              level >= l.val ? l.color : "var(--border)",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: lvl?.color || "var(--txt3)",
                      fontWeight: 600,
                      width: 72,
                      textAlign: "right",
                    }}
                  >
                    {lvl?.label || "–"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--txt3)",
            marginBottom: 10,
          }}
        >
          Add Custom Skill
        </div>
        <form onSubmit={addCustom} style={{ display: "flex", gap: 8 }}>
          <input
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="Redis, Kafka, OpenCV…"
            style={{
              flex: 1,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 9,
              padding: "9px 12px",
              fontSize: 13,
              color: "var(--txt)",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "9px 16px",
              borderRadius: 9,
              border: "none",
              background: "var(--txt)",
              color: "var(--bg)",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </form>
        {Object.entries(skills).filter(([s]) => !allBuiltin.includes(s))
          .length > 0 && (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {Object.entries(skills)
              .filter(([s]) => !allBuiltin.includes(s))
              .map(([skill, level]) => (
                <div
                  key={skill}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 13, color: "var(--txt2)", flex: 1 }}>
                    {skill}
                  </span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1, 2, 3, 4].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLevel(skill, level === l ? 0 : l)}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          border: `1.5px solid ${level >= l ? "#5b8def" : "var(--border)"}`,
                          background: level >= l ? "#5b8def22" : "var(--bg)",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background:
                              level >= l ? "#5b8def" : "var(--border)",
                            margin: "auto",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const n = { ...skills };
                      delete n[skill];
                      setSkills(n);
                      save("pp_skills", n);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--txt3)",
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Companies Tab ─────────────────────────────────────────────────────────────
function CompaniesTab() {
  const [companies, setCompanies] = useState(() => load("pp_companies", []));
  const [showAdd, setShowAdd] = useState(false);
  const [filterTier, setFilterTier] = useState("all");
  const emptyForm = {
    name: "",
    tier: "dream",
    role: "",
    ctc: "",
    status: "Shortlisted",
    notes: "",
    rounds: [],
  };
  const [newCo, setNewCo] = useState(emptyForm);

  function addCompany(e) {
    e.preventDefault();
    if (!newCo.name.trim()) return;
    const updated = [
      { ...newCo, id: Date.now(), name: newCo.name.trim() },
      ...companies,
    ];
    setCompanies(updated);
    save("pp_companies", updated);
    setNewCo(emptyForm);
    setShowAdd(false);
  }
  function updateStatus(id, status) {
    const u = companies.map((c) => (c.id === id ? { ...c, status } : c));
    setCompanies(u);
    save("pp_companies", u);
  }
  function toggleRound(id, round) {
    const u = companies.map((c) =>
      c.id === id
        ? {
            ...c,
            rounds: c.rounds?.includes(round)
              ? c.rounds.filter((r) => r !== round)
              : [...(c.rounds || []), round],
          }
        : c,
    );
    setCompanies(u);
    save("pp_companies", u);
  }
  function deleteCompany(id) {
    const u = companies.filter((c) => c.id !== id);
    setCompanies(u);
    save("pp_companies", u);
  }

  const filtered =
    filterTier === "all"
      ? companies
      : companies.filter((c) => c.tier === filterTier);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--txt)",
              letterSpacing: "-.02em",
            }}
          >
            Company Tracker
          </div>
          <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>
            Applications, rounds, offers
          </div>
        </div>
        <button
          onClick={() => setShowAdd((s) => !s)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg2)",
            color: "var(--txt3)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 8,
        }}
      >
        {[
          { val: companies.length, label: "Applied", color: "#5b8def" },
          {
            val: companies.filter((c) => c.status === "Interview").length,
            label: "Interviews",
            color: "#9b72cf",
          },
          {
            val: companies.filter((c) => c.status === "Offer").length,
            label: "Offers 🎉",
            color: "#4caf7d",
          },
          {
            val: companies.filter((c) => c.status === "Rejected").length,
            label: "Rejected",
            color: "#ef4444",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "11px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: s.color,
                fontFamily: "var(--mono)",
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "var(--txt3)",
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      {showAdd && (
        <form
          onSubmit={addCompany}
          style={{
            background: "var(--bg2)",
            border: "1px solid #5b8def33",
            borderRadius: 14,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--txt)" }}>
            Add Company
          </div>
          <input
            value={newCo.name}
            onChange={(e) => setNewCo((p) => ({ ...p, name: e.target.value }))}
            placeholder="Google, Flipkart…"
            required
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "9px 12px",
              fontSize: 13,
              color: "var(--txt)",
              outline: "none",
            }}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {[
              {
                key: "tier",
                label: "Tier",
                type: "select",
                opts: COMPANY_TIERS.map((t) => ({ v: t.id, l: t.label })),
              },
              {
                key: "status",
                label: "Status",
                type: "select",
                opts: APP_STATUS.map((s) => ({ v: s, l: s })),
              },
              {
                key: "role",
                label: "Role",
                type: "text",
                ph: "SDE, Data Analyst…",
              },
              { key: "ctc", label: "CTC (LPA)", type: "text", ph: "12-18 LPA" },
            ].map((f) => (
              <div key={f.key}>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--txt3)",
                    marginBottom: 4,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                  }}
                >
                  {f.label}
                </div>
                {f.type === "select" ? (
                  <select
                    value={newCo[f.key]}
                    onChange={(e) =>
                      setNewCo((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "9px 12px",
                      fontSize: 13,
                      color: "var(--txt)",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    {f.opts.map((o) => (
                      <option key={o.v} value={o.v}>
                        {o.l}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={newCo[f.key]}
                    onChange={(e) =>
                      setNewCo((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    placeholder={f.ph}
                    style={{
                      width: "100%",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "9px 12px",
                      fontSize: 13,
                      color: "var(--txt)",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 9,
                border: "none",
                background: "var(--txt)",
                color: "var(--bg)",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              style={{
                padding: "10px 16px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--txt3)",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div
        style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }}
      >
        {[
          { id: "all", label: `All (${companies.length})` },
          ...COMPANY_TIERS.filter((t) =>
            companies.some((c) => c.tier === t.id),
          ).map((t) => ({
            ...t,
            label: `${t.label} (${companies.filter((c) => c.tier === t.id).length})`,
          })),
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterTier(t.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 9,
              border: "none",
              flexShrink: 0,
              background: filterTier === t.id ? "var(--txt)" : "var(--bg2)",
              color: filterTier === t.id ? "var(--bg)" : "var(--txt3)",
              fontSize: 11,
              fontWeight: filterTier === t.id ? 800 : 500,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "36px 0",
            color: "var(--txt3)",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏢</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            No companies tracked yet
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((co) => {
            const tier =
              COMPANY_TIERS.find((t) => t.id === co.tier) || COMPANY_TIERS[0];
            return (
              <div
                key={co.id}
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "var(--txt)",
                        }}
                      >
                        {co.name}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: 5,
                          background: tier.bg,
                          color: tier.color,
                          letterSpacing: ".06em",
                        }}
                      >
                        {tier.label.toUpperCase()}
                      </span>
                    </div>
                    {co.role && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--txt3)",
                          marginBottom: 2,
                        }}
                      >
                        {co.role}
                        {co.ctc && ` · ${co.ctc} LPA`}
                      </div>
                    )}
                    {co.notes && (
                      <div style={{ fontSize: 11, color: "var(--txt3)" }}>
                        {co.notes}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteCompany(co.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--txt3)",
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                  >
                    ×
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap",
                    marginBottom: 10,
                  }}
                >
                  {APP_STATUS.map((s) => {
                    const sc = STATUS_COLORS[s];
                    const isActive = co.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatus(co.id, s)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 7,
                          border: `1px solid ${isActive ? sc.color + "55" : "var(--border)"}`,
                          background: isActive ? sc.bg : "transparent",
                          color: isActive ? sc.color : "var(--txt3)",
                          fontSize: 11,
                          fontWeight: isActive ? 700 : 400,
                          cursor: "pointer",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                {(co.status === "Interview" ||
                  (co.rounds && co.rounds.length > 0)) && (
                  <div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "var(--txt3)",
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      Rounds Cleared
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {INTERVIEW_ROUNDS.map((r) => {
                        const done = co.rounds?.includes(r);
                        return (
                          <button
                            key={r}
                            onClick={() => toggleRound(co.id, r)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 7,
                              border: `1px solid ${done ? "#4caf7d44" : "var(--border)"}`,
                              background: done ? "#4caf7d15" : "var(--bg)",
                              color: done ? "#4caf7d" : "var(--txt3)",
                              fontSize: 11,
                              fontWeight: done ? 600 : 400,
                              cursor: "pointer",
                            }}
                          >
                            {done ? "✓ " : ""}
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Resume Tab ────────────────────────────────────────────────────────────────
function ResumeTab() {
  const [checklist, setChecklist] = useState(() => load("pp_resume_check", {}));
  function toggleCheck(id) {
    setChecklist((p) => {
      const n = { ...p, [id]: !p[id] };
      save("pp_resume_check", n);
      return n;
    });
  }
  const doneCount = RESUME_CHECKLIST.filter((i) => checklist[i.id]).length;
  const pct = Math.round((doneCount / RESUME_CHECKLIST.length) * 100);
  const scoreColor =
    pct === 100 ? "#4caf7d" : pct >= 70 ? "#5b8def" : "#e8924a";
  const scoreLabel =
    pct === 100
      ? "Perfect! 🎉"
      : pct >= 70
        ? "Good"
        : pct >= 40
          ? "Needs Work"
          : "Incomplete";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 18,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <ProgressRing pct={pct} size={72} color={scoreColor} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--txt)",
              marginBottom: 3,
            }}
          >
            Resume: <span style={{ color: scoreColor }}>{scoreLabel}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--txt3)" }}>
            {doneCount}/{RESUME_CHECKLIST.length} items checked
          </div>
          <div
            style={{
              height: 5,
              background: "var(--bg3)",
              borderRadius: 99,
              overflow: "hidden",
              marginTop: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: scoreColor,
                borderRadius: 99,
                transition: "width .5s",
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--txt3)",
            marginBottom: 12,
          }}
        >
          Resume Checklist
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {RESUME_CHECKLIST.map((item) => {
            const done = !!checklist[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: done ? "#4caf7d0a" : "var(--bg)",
                  border: `1px solid ${done ? "#4caf7d22" : "var(--border)"}`,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: `1.5px solid ${done ? "#4caf7d" : "var(--border)"}`,
                    background: done ? "#4caf7d" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {done && <Check />}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: done ? "#4caf7d" : "var(--txt3)",
                    lineHeight: 1.4,
                    textDecoration: done ? "line-through" : "none",
                    opacity: done ? 0.7 : 1,
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Root View ─────────────────────────────────────────────────────────────────
export default function PlacementPrepView() {
  const [activeTab, setActiveTab] = useState("dsa");
  const [questionDone] = useState(() => load("pp_dsa_qdone", {}));
  const [topicLastSeen] = useState(() => load("pp_topic_last_seen", {}));
  const [targetDate] = useState(() => load("pp_target_date", ""));
  const targetCompany = load("pp_target_company", "google");
  const coreProgress = useMemo(() => load("pp_core_progress", {}), []);
  const skills = useMemo(() => load("pp_skills", {}), []);
  const resumeCheck = useMemo(() => load("pp_resume_check", {}), []);

  const dsaScore = useMemo(
    () => calcReadinessScore(questionDone),
    [questionDone],
  );
  const totalSolved = getSolvedCount(questionDone);
  const totalProblems = getTotalQuestions();
  const pace = useMemo(
    () => calcPace(targetDate, questionDone),
    [targetDate, questionDone],
  );
  const weakTopics = useMemo(
    () =>
      getWeaknessPredictions(questionDone, topicLastSeen, targetCompany).slice(
        0,
        5,
      ),
    [questionDone, topicLastSeen, targetCompany],
  );
  const momentum = useMemo(() => getMomentum(), []);
  const readiness = useMemo(
    () => calcRealReadiness(questionDone, topicLastSeen, targetCompany),
    [questionDone, topicLastSeen, targetCompany],
  );
  const oppCost = useMemo(
    () => getOpportunityCost(questionDone, topicLastSeen, targetDate),
    [questionDone, topicLastSeen, targetDate],
  );

  const corePct = Math.round(
    (Object.values(coreProgress).filter(Boolean).length / 29) * 100,
  );
  const skillPct = Math.min(
    100,
    Math.round((Object.values(skills).filter((v) => v >= 3).length / 8) * 100),
  );
  const resumePct = Math.round(
    (Object.values(resumeCheck).filter(Boolean).length /
      RESUME_CHECKLIST.length) *
      100,
  );
  const overallPct = Math.round(
    readiness.combined * 0.4 +
      corePct * 0.25 +
      skillPct * 0.15 +
      resumePct * 0.2,
  );

  const overallColor =
    overallPct >= 75
      ? "#4caf7d"
      : overallPct >= 55
        ? "#5b8def"
        : overallPct >= 35
          ? "#e8924a"
          : "#ef4444";

  const aiContext = {
    dsa: {
      score: dsaScore,
      solved: totalSolved,
      total: totalProblems,
      weakTopics,
    },
    pace,
    core: { pct: corePct },
    resume: { pct: resumePct },
    skills: { pct: skillPct },
    readiness,
    oppCost,
    targetCompany,
  };

  const TABS = [
    { id: "dsa", label: "DSA", emoji: "💻" },
    { id: "core", label: "Core CS", emoji: "📚" },
    { id: "skills", label: "Skills", emoji: "⚙️" },
    { id: "companies", label: "Companies", emoji: "🏢" },
    { id: "resume", label: "Resume", emoji: "📄" },
    { id: "ai_coach", label: "AI Coach", emoji: "🧠" },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "var(--bg)",
        minHeight: "100vh",
        fontFamily: "-apple-system, sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeUp { 0% { opacity:0; transform:translateY(10px); } 100% { opacity:1; transform:none; } }
        .pp-tab { animation: fadeUp .25s ease forwards; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ padding: "20px 16px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: "-.04em",
                color: "var(--txt)",
                marginBottom: 2,
                lineHeight: 1,
              }}
            >
              Placement Prep
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 6,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: momentum.color,
                  letterSpacing: ".05em",
                }}
              >
                {momentum.icon} {momentum.label}
              </span>
              <span style={{ fontSize: 11, color: "var(--txt3)" }}>·</span>
              <span
                style={{
                  fontSize: 11,
                  color: readiness.combined >= 65 ? "#4caf7d" : "#ef4444",
                  fontWeight: 700,
                }}
              >
                {readiness.combined}% ready
              </span>
            </div>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <ProgressRing pct={overallPct} size={64} color={overallColor} />
            <div
              style={{
                fontSize: 8,
                fontWeight: 800,
                color: "var(--txt3)",
                marginTop: 4,
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              Overall
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 16,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "8px 14px",
                borderRadius: 10,
                border: "none",
                flexShrink: 0,
                background: activeTab === t.id ? "var(--txt)" : "var(--bg2)",
                color: activeTab === t.id ? "var(--bg)" : "var(--txt3)",
                fontSize: 12,
                fontWeight: activeTab === t.id ? 800 : 500,
                cursor: "pointer",
                transition: "all .15s",
                boxShadow:
                  activeTab === t.id && t.id === "ai_coach"
                    ? "0 4px 12px rgba(99,102,241,0.2)"
                    : "none",
              }}
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="pp-tab"
        key={activeTab}
        style={{ padding: "0 16px 40px" }}
      >
        {activeTab === "dsa" && <DSATab />}
        {activeTab === "core" && <CoreCSTab />}
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "companies" && <CompaniesTab />}
        {activeTab === "resume" && <ResumeTab />}
        {activeTab === "ai_coach" && <AICoachTab contextData={aiContext} />}
      </div>
    </div>
  );
}
