"use client";
import { useState, useEffect, useMemo, useCallback } from "react";

// ── DSA Question Bank ─────────────────────────────────────────────────────────
const DSA_QUESTIONS = {
  arrays:[
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
      title: "Maximum Subarray (Kadane's)",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/maximum-subarray/",
    },
    {
      id: "a5",
      title: "Product of Array Except Self",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/product-of-array-except-self/",
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
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    },
    {
      id: "a9",
      title: "3Sum",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/3sum/",
    },
    {
      id: "a10",
      title: "Container With Most Water",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/container-with-most-water/",
    },
    {
      id: "a11",
      title: "Trapping Rain Water",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/trapping-rain-water/",
    },
    {
      id: "a12",
      title: "Sliding Window Maximum",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/sliding-window-maximum/",
    },
    {
      id: "a13",
      title: "Longest Substring Without Repeating",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    },
    {
      id: "a14",
      title: "Minimum Window Substring",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/minimum-window-substring/",
    },
    {
      id: "a15",
      title: "Valid Anagram",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/valid-anagram/",
    },
    {
      id: "a16",
      title: "Group Anagrams",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/group-anagrams/",
    },
    {
      id: "a17",
      title: "Longest Consecutive Sequence",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/longest-consecutive-sequence/",
    },
    {
      id: "a18",
      title: "Rotate Array",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/rotate-array/",
    },
    {
      id: "a19",
      title: "Merge Intervals",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/merge-intervals/",
    },
    {
      id: "a20",
      title: "Insert Interval",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/insert-interval/",
    },
    {
      id: "a21",
      title: "Jump Game",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/jump-game/",
    },
    {
      id: "a22",
      title: "Jump Game II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/jump-game-ii/",
    },
    {
      id: "a23",
      title: "Next Permutation",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/next-permutation/",
    },
    {
      id: "a24",
      title: "Spiral Matrix",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/spiral-matrix/",
    },
    {
      id: "a25",
      title: "Set Matrix Zeroes",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/set-matrix-zeroes/",
    },
    {
      id: "a26",
      title: "Pascal's Triangle",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/pascals-triangle/",
    },
    {
      id: "a27",
      title: "Subarray Sum Equals K",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/subarray-sum-equals-k/",
    },
    {
      id: "a28",
      title: "Majority Element",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/majority-element/",
    },
    {
      id: "a29",
      title: "Count Inversions (Merge Sort)",
      difficulty: "Hard",
      leetcode:
        "https://practice.geeksforgeeks.org/problems/inversion-of-array/0",
    },
    {
      id: "a30",
      title: "4Sum",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/4sum/",
    },
  ],
  linkedlist:[
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
      title: "Linked List Cycle",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/linked-list-cycle/",
    },
    {
      id: "ll4",
      title: "Linked List Cycle II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/linked-list-cycle-ii/",
    },
    {
      id: "ll5",
      title: "Find the Duplicate Number",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/find-the-duplicate-number/",
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
    {
      id: "ll8",
      title: "Remove Nth Node From End",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    },
    {
      id: "ll9",
      title: "Reorder List",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/reorder-list/",
    },
    {
      id: "ll10",
      title: "Palindrome Linked List",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/palindrome-linked-list/",
    },
    {
      id: "ll11",
      title: "Intersection of Two Linked Lists",
      difficulty: "Easy",
      leetcode:
        "https://leetcode.com/problems/intersection-of-two-linked-lists/",
    },
    {
      id: "ll12",
      title: "Add Two Numbers",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/add-two-numbers/",
    },
    {
      id: "ll13",
      title: "Sort List (Merge Sort on LL)",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/sort-list/",
    },
    {
      id: "ll14",
      title: "Flatten a Multilevel Doubly LL",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/",
    },
    {
      id: "ll15",
      title: "Rotate List",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/rotate-list/",
    },
    {
      id: "ll16",
      title: "Copy List with Random Pointer",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/copy-list-with-random-pointer/",
    },
    {
      id: "ll17",
      title: "Swap Nodes in Pairs",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/swap-nodes-in-pairs/",
    },
    {
      id: "ll18",
      title: "Reverse Nodes in k-Group",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    },
    {
      id: "ll19",
      title: "Delete Node in a Linked List",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/delete-node-in-a-linked-list/",
    },
    {
      id: "ll20",
      title: "Middle of the Linked List",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/middle-of-the-linked-list/",
    },
  ],
  stacks:[
    {
      id: "sq1",
      title: "Valid Parentheses",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/valid-parentheses/",
    },
    {
      id: "sq2",
      title: "Min Stack",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/min-stack/",
    },
    {
      id: "sq3",
      title: "Evaluate Reverse Polish Notation",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    },
    {
      id: "sq4",
      title: "Generate Parentheses",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/generate-parentheses/",
    },
    {
      id: "sq5",
      title: "Daily Temperatures",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/daily-temperatures/",
    },
    {
      id: "sq6",
      title: "Car Fleet",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/car-fleet/",
    },
    {
      id: "sq7",
      title: "Largest Rectangle in Histogram",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    },
    {
      id: "sq8",
      title: "Next Greater Element I",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/next-greater-element-i/",
    },
    {
      id: "sq9",
      title: "Next Greater Element II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/next-greater-element-ii/",
    },
    {
      id: "sq10",
      title: "Implement Queue using Stacks",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/implement-queue-using-stacks/",
    },
    {
      id: "sq11",
      title: "Implement Stack using Queues",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/implement-stack-using-queues/",
    },
    {
      id: "sq12",
      title: "Decode String",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/decode-string/",
    },
    {
      id: "sq13",
      title: "Remove K Digits",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/remove-k-digits/",
    },
    {
      id: "sq14",
      title: "Asteroid Collision",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/asteroid-collision/",
    },
    {
      id: "sq15",
      title: "Sliding Window Maximum",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/sliding-window-maximum/",
    },
  ],
  trees:[
    {
      id: "t1",
      title: "Invert Binary Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/invert-binary-tree/",
    },
    {
      id: "t2",
      title: "Maximum Depth of Binary Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    },
    {
      id: "t3",
      title: "Diameter of Binary Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/diameter-of-binary-tree/",
    },
    {
      id: "t4",
      title: "Balanced Binary Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/balanced-binary-tree/",
    },
    {
      id: "t5",
      title: "Same Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/same-tree/",
    },
    {
      id: "t6",
      title: "Subtree of Another Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/subtree-of-another-tree/",
    },
    {
      id: "t7",
      title: "Lowest Common Ancestor of BST",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    },
    {
      id: "t8",
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    },
    {
      id: "t9",
      title: "Binary Tree Right Side View",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/binary-tree-right-side-view/",
    },
    {
      id: "t10",
      title: "Count Good Nodes in Binary Tree",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
    },
    {
      id: "t11",
      title: "Validate Binary Search Tree",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/validate-binary-search-tree/",
    },
    {
      id: "t12",
      title: "Kth Smallest Element in a BST",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    },
    {
      id: "t13",
      title: "Construct BT from Preorder & Inorder",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    },
    {
      id: "t14",
      title: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    },
    {
      id: "t15",
      title: "Serialize and Deserialize Binary Tree",
      difficulty: "Hard",
      leetcode:
        "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    },
    {
      id: "t16",
      title: "Word Search II (Trie + Tree)",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/word-search-ii/",
    },
    {
      id: "t17",
      title: "Path Sum II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/path-sum-ii/",
    },
    {
      id: "t18",
      title: "Flatten Binary Tree to Linked List",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
    },
    {
      id: "t19",
      title: "Zigzag Level Order Traversal",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
    },
    {
      id: "t20",
      title: "Morris Inorder Traversal",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    },
    {
      id: "t21",
      title: "Delete Node in a BST",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/delete-node-in-a-bst/",
    },
    {
      id: "t22",
      title: "Insert into a BST",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
    },
    {
      id: "t23",
      title: "Recover Binary Search Tree",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/recover-binary-search-tree/",
    },
    {
      id: "t24",
      title: "Vertical Order Traversal",
      difficulty: "Hard",
      leetcode:
        "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/",
    },
    {
      id: "t25",
      title: "Boundary of Binary Tree",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/boundary-of-binary-tree/",
    },
  ],
  graphs:[
    {
      id: "g1",
      title: "Number of Islands",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/number-of-islands/",
    },
    {
      id: "g2",
      title: "Clone Graph",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/clone-graph/",
    },
    {
      id: "g3",
      title: "Max Area of Island",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/max-area-of-island/",
    },
    {
      id: "g4",
      title: "Pacific Atlantic Water Flow",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    },
    {
      id: "g5",
      title: "Surrounded Regions",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/surrounded-regions/",
    },
    {
      id: "g6",
      title: "Rotting Oranges",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/rotting-oranges/",
    },
    {
      id: "g7",
      title: "Walls and Gates",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/walls-and-gates/",
    },
    {
      id: "g8",
      title: "Course Schedule (Topological Sort)",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/course-schedule/",
    },
    {
      id: "g9",
      title: "Course Schedule II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/course-schedule-ii/",
    },
    {
      id: "g10",
      title: "Redundant Connection",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/redundant-connection/",
    },
    {
      id: "g11",
      title: "Number of Connected Components",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
    },
    {
      id: "g12",
      title: "Graph Valid Tree",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/graph-valid-tree/",
    },
    {
      id: "g13",
      title: "Word Ladder",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/word-ladder/",
    },
    {
      id: "g14",
      title: "Alien Dictionary",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/alien-dictionary/",
    },
    {
      id: "g15",
      title: "Dijkstra's Shortest Path",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/network-delay-time/",
    },
    {
      id: "g16",
      title: "Cheapest Flights Within K Stops",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    },
    {
      id: "g17",
      title: "Swim in Rising Water",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/swim-in-rising-water/",
    },
    {
      id: "g18",
      title: "Bellman-Ford - Negative Cycles",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors/",
    },
    {
      id: "g19",
      title: "Minimum Spanning Tree (Kruskal)",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/min-cost-to-connect-all-points/",
    },
    {
      id: "g20",
      title: "Strongly Connected Components",
      difficulty: "Hard",
      leetcode:
        "https://practice.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1",
    },
    {
      id: "g21",
      title: "Bipartite Graph Check",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/is-graph-bipartite/",
    },
    {
      id: "g22",
      title: "Find Eventual Safe States",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/find-eventual-safe-states/",
    },
    {
      id: "g23",
      title: "As Far from Land as Possible",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/as-far-from-land-as-possible/",
    },
    {
      id: "g24",
      title: "Snakes and Ladders",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/snakes-and-ladders/",
    },
    {
      id: "g25",
      title: "Critical Connections (Bridges)",
      difficulty: "Hard",
      leetcode:
        "https://leetcode.com/problems/critical-connections-in-a-network/",
    },
  ],
  dp:[
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
      title: "Palindromic Substrings",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/palindromic-substrings/",
    },
    {
      id: "dp6",
      title: "Decode Ways",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/decode-ways/",
    },
    {
      id: "dp7",
      title: "Coin Change",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/coin-change/",
    },
    {
      id: "dp8",
      title: "Maximum Product Subarray",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/maximum-product-subarray/",
    },
    {
      id: "dp9",
      title: "Word Break",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/word-break/",
    },
    {
      id: "dp10",
      title: "Longest Increasing Subsequence",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/longest-increasing-subsequence/",
    },
    {
      id: "dp11",
      title: "Can I Win",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/can-i-win/",
    },
    {
      id: "dp12",
      title: "Unique Paths",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/unique-paths/",
    },
    {
      id: "dp13",
      title: "Jump Game",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/jump-game/",
    },
    {
      id: "dp14",
      title: "0/1 Knapsack",
      difficulty: "Medium",
      leetcode:
        "https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem/0",
    },
    {
      id: "dp15",
      title: "Partition Equal Subset Sum",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/partition-equal-subset-sum/",
    },
    {
      id: "dp16",
      title: "Target Sum",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/target-sum/",
    },
    {
      id: "dp17",
      title: "Interleaving String",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/interleaving-string/",
    },
    {
      id: "dp18",
      title: "Longest Common Subsequence",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/longest-common-subsequence/",
    },
    {
      id: "dp19",
      title: "Edit Distance",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/edit-distance/",
    },
    {
      id: "dp20",
      title: "Burst Balloons",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/burst-balloons/",
    },
    {
      id: "dp21",
      title: "Regular Expression Matching",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/regular-expression-matching/",
    },
    {
      id: "dp22",
      title: "Wildcard Matching",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/wildcard-matching/",
    },
    {
      id: "dp23",
      title: "Distinct Subsequences",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/distinct-subsequences/",
    },
    {
      id: "dp24",
      title: "Matrix Chain Multiplication",
      difficulty: "Hard",
      leetcode:
        "https://practice.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1",
    },
    {
      id: "dp25",
      title: "Maximal Rectangle",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/maximal-rectangle/",
    },
    {
      id: "dp26",
      title: "Longest String Chain",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/longest-string-chain/",
    },
    {
      id: "dp27",
      title: "Ugly Number II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/ugly-number-ii/",
    },
    {
      id: "dp28",
      title: "Minimum Path Sum",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/minimum-path-sum/",
    },
    {
      id: "dp29",
      title: "Triangle",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/triangle/",
    },
    {
      id: "dp30",
      title: "Russian Doll Envelopes",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/russian-doll-envelopes/",
    },
  ],
  recursion:[
    {
      id: "r1",
      title: "Subsets",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/subsets/",
    },
    {
      id: "r2",
      title: "Subsets II (with duplicates)",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/subsets-ii/",
    },
    {
      id: "r3",
      title: "Permutations",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/permutations/",
    },
    {
      id: "r4",
      title: "Permutations II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/permutations-ii/",
    },
    {
      id: "r5",
      title: "Combination Sum",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/combination-sum/",
    },
    {
      id: "r6",
      title: "Combination Sum II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/combination-sum-ii/",
    },
    {
      id: "r7",
      title: "N-Queens",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/n-queens/",
    },
    {
      id: "r8",
      title: "Sudoku Solver",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/sudoku-solver/",
    },
    {
      id: "r9",
      title: "Word Search",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/word-search/",
    },
    {
      id: "r10",
      title: "Letter Combinations of Phone Number",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    },
    {
      id: "r11",
      title: "Palindrome Partitioning",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/palindrome-partitioning/",
    },
    {
      id: "r12",
      title: "Restore IP Addresses",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/restore-ip-addresses/",
    },
    {
      id: "r13",
      title: "Generate Parentheses",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/generate-parentheses/",
    },
    {
      id: "r14",
      title: "Rat in a Maze",
      difficulty: "Medium",
      leetcode:
        "https://practice.geeksforgeeks.org/problems/rat-in-a-maze-problem/1",
    },
    {
      id: "r15",
      title: "M-Coloring Problem",
      difficulty: "Medium",
      leetcode:
        "https://practice.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1",
    },
    {
      id: "r16",
      title: "Power Set",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/subsets/",
    },
    {
      id: "r17",
      title: "Knight's Tour",
      difficulty: "Hard",
      leetcode: "https://practice.geeksforgeeks.org/problems/knights-tour/0",
    },
    {
      id: "r18",
      title: "Expression Add Operators",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/expression-add-operators/",
    },
    {
      id: "r19",
      title: "Beautiful Arrangement",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/beautiful-arrangement/",
    },
    {
      id: "r20",
      title: "Unique Binary Search Trees II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/unique-binary-search-trees-ii/",
    },
  ],
  sorting:[
    {
      id: "s1",
      title: "Sort Colors (Dutch Flag)",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/sort-colors/",
    },
    {
      id: "s2",
      title: "Merge Sorted Array",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/merge-sorted-array/",
    },
    {
      id: "s3",
      title: "Kth Largest Element",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    },
    {
      id: "s4",
      title: "Find K Closest Elements",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/find-k-closest-elements/",
    },
    {
      id: "s5",
      title: "Sort an Array (Quicksort / Mergesort)",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/sort-an-array/",
    },
    {
      id: "s6",
      title: "Largest Number",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/largest-number/",
    },
    {
      id: "s7",
      title: "Meeting Rooms II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/meeting-rooms-ii/",
    },
    {
      id: "s8",
      title: "Binary Search",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/binary-search/",
    },
    {
      id: "s9",
      title: "Search a 2D Matrix",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/search-a-2d-matrix/",
    },
    {
      id: "s10",
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    },
    {
      id: "s11",
      title: "First Bad Version",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/first-bad-version/",
    },
    {
      id: "s12",
      title: "Count of Smaller Numbers After Self",
      difficulty: "Hard",
      leetcode:
        "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
    },
    {
      id: "s13",
      title: "Wiggle Sort II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/wiggle-sort-ii/",
    },
    {
      id: "s14",
      title: "H-Index",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/h-index/",
    },
    {
      id: "s15",
      title: "Capacity to Ship Packages",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
    },
  ],
  greedy:[
    {
      id: "gr1",
      title: "Maximum Subarray",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/maximum-subarray/",
    },
    {
      id: "gr2",
      title: "Jump Game",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/jump-game/",
    },
    {
      id: "gr3",
      title: "Jump Game II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/jump-game-ii/",
    },
    {
      id: "gr4",
      title: "Gas Station",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/gas-station/",
    },
    {
      id: "gr5",
      title: "Hand of Straights",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/hand-of-straights/",
    },
    {
      id: "gr6",
      title: "Merge Triplets to Form Target",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/",
    },
    {
      id: "gr7",
      title: "Partition Labels",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/partition-labels/",
    },
    {
      id: "gr8",
      title: "Valid Parenthesis String",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/valid-parenthesis-string/",
    },
    {
      id: "gr9",
      title: "Task Scheduler",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/task-scheduler/",
    },
    {
      id: "gr10",
      title: "Assign Cookies",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/assign-cookies/",
    },
    {
      id: "gr11",
      title: "Non-overlapping Intervals",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/non-overlapping-intervals/",
    },
    {
      id: "gr12",
      title: "Meeting Rooms",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/meeting-rooms/",
    },
    {
      id: "gr13",
      title: "Minimum Number of Arrows",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
    },
    {
      id: "gr14",
      title: "Lemonade Change",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/lemonade-change/",
    },
    {
      id: "gr15",
      title: "Candy",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/candy/",
    },
  ],
  hashing:[
    {
      id: "h1",
      title: "Two Sum",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/two-sum/",
    },
    {
      id: "h2",
      title: "Group Anagrams",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/group-anagrams/",
    },
    {
      id: "h3",
      title: "Top K Frequent Elements",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/top-k-frequent-elements/",
    },
    {
      id: "h4",
      title: "Valid Anagram",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/valid-anagram/",
    },
    {
      id: "h5",
      title: "Longest Consecutive Sequence",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/longest-consecutive-sequence/",
    },
    {
      id: "h6",
      title: "Subarray Sum Equals K",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/subarray-sum-equals-k/",
    },
    {
      id: "h7",
      title: "4Sum II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/4sum-ii/",
    },
    {
      id: "h8",
      title: "Happy Number",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/happy-number/",
    },
    {
      id: "h9",
      title: "Isomorphic Strings",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/isomorphic-strings/",
    },
    {
      id: "h10",
      title: "Word Pattern",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/word-pattern/",
    },
    {
      id: "h11",
      title: "Find All Anagrams in a String",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
    },
    {
      id: "h12",
      title: "Brick Wall",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/brick-wall/",
    },
  ],
  heap:[
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
    {
      id: "hp8",
      title: "Merge K Sorted Lists",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/",
    },
    {
      id: "hp9",
      title: "Top K Frequent Words",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/top-k-frequent-words/",
    },
    {
      id: "hp10",
      title: "Reorganize String",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/reorganize-string/",
    },
    {
      id: "hp11",
      title: "Minimum Cost to Connect Sticks",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/minimum-cost-to-connect-sticks/",
    },
    {
      id: "hp12",
      title: "IPO (Maximize Capital)",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/ipo/",
    },
  ],
  trie:[
    {
      id: "tr1",
      title: "Implement Trie",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/implement-trie-prefix-tree/",
    },
    {
      id: "tr2",
      title: "Design Add and Search Words",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
    },
    {
      id: "tr3",
      title: "Word Search II",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/word-search-ii/",
    },
    {
      id: "tr4",
      title: "Replace Words",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/replace-words/",
    },
    {
      id: "tr5",
      title: "Maximum XOR of Two Numbers",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
    },
    {
      id: "tr6",
      title: "Count Words With a Given Prefix",
      difficulty: "Easy",
      leetcode:
        "https://leetcode.com/problems/count-words-with-a-given-prefix/",
    },
    {
      id: "tr7",
      title: "Longest Word in Dictionary",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/longest-word-in-dictionary/",
    },
    {
      id: "tr8",
      title: "Autocomplete System",
      difficulty: "Hard",
      leetcode:
        "https://leetcode.com/problems/design-search-autocomplete-system/",
    },
    {
      id: "tr9",
      title: "Concatenated Words",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/concatenated-words/",
    },
    {
      id: "tr10",
      title: "Map Sum Pairs",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/map-sum-pairs/",
    },
  ],
  bitmanip:[
    {
      id: "b1",
      title: "Single Number",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/single-number/",
    },
    {
      id: "b2",
      title: "Number of 1 Bits",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/number-of-1-bits/",
    },
    {
      id: "b3",
      title: "Counting Bits",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/counting-bits/",
    },
    {
      id: "b4",
      title: "Reverse Bits",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/reverse-bits/",
    },
    {
      id: "b5",
      title: "Missing Number",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/missing-number/",
    },
    {
      id: "b6",
      title: "Sum of Two Integers (No + operator)",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/sum-of-two-integers/",
    },
    {
      id: "b7",
      title: "Power of Two",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/power-of-two/",
    },
    {
      id: "b8",
      title: "Single Number II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/single-number-ii/",
    },
    {
      id: "b9",
      title: "Single Number III",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/single-number-iii/",
    },
    {
      id: "b10",
      title: "Bitwise AND of Numbers Range",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/bitwise-and-of-numbers-range/",
    },
  ],
  math:[
    {
      id: "m1",
      title: "Palindrome Number",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/palindrome-number/",
    },
    {
      id: "m2",
      title: "Plus One",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/plus-one/",
    },
    {
      id: "m3",
      title: "Sqrt(x) — Newton's Method",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/sqrtx/",
    },
    {
      id: "m4",
      title: "Power(x, n) — Fast Exponentiation",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/powx-n/",
    },
    {
      id: "m5",
      title: "Count Primes (Sieve)",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/count-primes/",
    },
    {
      id: "m6",
      title: "Excel Sheet Column Number",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/excel-sheet-column-number/",
    },
    {
      id: "m7",
      title: "Factorial Trailing Zeroes",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/factorial-trailing-zeroes/",
    },
    {
      id: "m8",
      title: "GCD & LCM",
      difficulty: "Easy",
      leetcode: "https://practice.geeksforgeeks.org/problems/lcm-and-gcd4516/1",
    },
    {
      id: "m9",
      title: "Multiply Strings",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/multiply-strings/",
    },
    {
      id: "m10",
      title: "Ugly Number",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/ugly-number/",
    },
  ],
};

// ── Constants ─────────────────────────────────────────────────────────────────
const DSA_TOPICS =[
  { id: "arrays", label: "Arrays & Strings", total: 30 },
  { id: "linkedlist", label: "Linked Lists", total: 20 },
  { id: "stacks", label: "Stacks & Queues", total: 15 },
  { id: "trees", label: "Trees & BST", total: 25 },
  { id: "graphs", label: "Graphs", total: 25 },
  { id: "dp", label: "Dynamic Programming", total: 30 },
  { id: "recursion", label: "Recursion & Backtracking", total: 20 },
  { id: "sorting", label: "Sorting & Searching", total: 15 },
  { id: "greedy", label: "Greedy Algorithms", total: 15 },
  { id: "hashing", label: "Hashing", total: 12 },
  { id: "heap", label: "Heaps & Priority Queue", total: 12 },
  { id: "trie", label: "Trie & Advanced DS", total: 10 },
  { id: "bitmanip", label: "Bit Manipulation", total: 10 },
  { id: "math", label: "Math & Number Theory", total: 10 },
];

const CORE_SUBJECTS =[
  {
    id: "os",
    label: "Operating Systems",
    topics:[
      "Processes & Threads",
      "Memory Management",
      "Deadlocks",
      "File Systems",
      "Scheduling",
      "Synchronization",
    ],
  },
  {
    id: "dbms",
    label: "DBMS",
    topics:[
      "SQL Queries",
      "Normalization",
      "Transactions & ACID",
      "Indexing",
      "ER Diagrams",
      "NoSQL Basics",
    ],
  },
  {
    id: "cn",
    label: "Computer Networks",
    topics:[
      "OSI / TCP-IP Model",
      "TCP vs UDP",
      "HTTP / HTTPS",
      "DNS & DHCP",
      "Routing Algorithms",
      "Socket Programming",
    ],
  },
  {
    id: "oops",
    label: "OOP Concepts",
    topics:[
      "Inheritance & Polymorphism",
      "Abstraction & Encapsulation",
      "Design Patterns",
      "SOLID Principles",
      "Java / C++ specifics",
    ],
  },
  {
    id: "algo",
    label: "Algorithms",
    topics:[
      "Time & Space Complexity",
      "Divide & Conquer",
      "Graph Algorithms",
      "String Algorithms",
      "NP Completeness",
    ],
  },
];

const SKILL_CATEGORIES = [
  {
    id: "lang",
    label: "Languages",
    items:["C++", "Java", "Python", "JavaScript", "Go", "Rust"],
  },
  {
    id: "web",
    label: "Web / Backend",
    items:[
      "React",
      "Node.js",
      "Express",
      "Django",
      "Spring Boot",
      "FastAPI",
      "REST APIs",
      "GraphQL",
    ],
  },
  {
    id: "devops",
    label: "DevOps & Cloud",
    items:[
      "Git & GitHub",
      "Docker",
      "Kubernetes",
      "AWS",
      "GCP",
      "CI/CD",
      "Linux",
    ],
  },
  {
    id: "ml",
    label: "ML / Data",
    items:[
      "NumPy / Pandas",
      "Scikit-learn",
      "TensorFlow / PyTorch",
      "SQL",
      "Data Visualization",
      "Statistics",
    ],
  },
];

const COMPANY_TIERS =[
  {
    id: "dream",
    label: "Dream",
    color: "#d4b44a",
    bg: "var(--yellow)15",
    border: "var(--yellow)44",
  },
  {
    id: "super",
    label: "Super Dream",
    color: "#9b72cf",
    bg: "var(--purple)15",
    border: "var(--purple)44",
  },
  {
    id: "product",
    label: "Product",
    color: "#5b8def",
    bg: "var(--blue)15",
    border: "var(--blue)44",
  },
  {
    id: "service",
    label: "Service",
    color: "#4caf7d",
    bg: "#4caf7d15",
    border: "#4caf7d44",
  },
  {
    id: "startup",
    label: "Startup",
    color: "#e8924a",
    bg: "var(--orange)15",
    border: "var(--orange)44",
  },
];

const APP_STATUS =[
  "Shortlisted",
  "OA Sent",
  "OA Done",
  "Interview",
  "Offer",
  "Rejected",
];
const STATUS_COLORS = {
  Shortlisted: { color: "var(--blue)", bg: "var(--blue)18" },
  "OA Sent": { color: "var(--yellow)", bg: "var(--yellow)18" },
  "OA Done": { color: "var(--orange)", bg: "var(--orange)18" },
  Interview: { color: "var(--purple)", bg: "var(--purple)18" },
  Offer: { color: "#4caf7d", bg: "#4caf7d18" },
  Rejected: { color: "var(--red)", bg: "var(--red)18" },
};

const RESUME_TIPS =[
  "Keep resume to 1 page for < 3 years experience",
  "Quantify every achievement (e.g. 'improved speed by 40%')",
  "Use action verbs: Built, Designed, Optimized, Led",
  "Add GitHub, LinkedIn, LeetCode profile links",
  "List tech stack used in each project",
  "No photo, no DOB, no address needed",
  "ATS-friendly: avoid tables/columns/graphics",
  "Tailor keywords to each job description",
];

const INTERVIEW_ROUNDS =[
  "Coding Round",
  "Technical Round 1",
  "Technical Round 2",
  "System Design",
  "HR Round",
  "Manager Round",
];

const DIFF_CONFIG = {
  Easy: { color: "#4caf7d", bg: "#4caf7d18" },
  Medium: { color: "#ffa116", bg: "#ffa11618" },
  Hard: { color: "#ef4444", bg: "#ef444418" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── API Fetchers ──────────────────────────────────────────────────────────────
async function fetchLeetCodeStats(username) {
  const urls =[
    `https://leetcode-stats-api.herokuapp.com/${username}`,
    `https://alfa-leetcode-api.0x10.workers.dev/userProfile/${username}`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const data = await res.json();
      if (data.status === "success" && data.totalSolved !== undefined) {
        return {
          totalSolved: data.totalSolved,
          easySolved: data.easySolved,
          mediumSolved: data.mediumSolved,
          hardSolved: data.hardSolved,
          ranking: data.ranking,
          acceptanceRate: data.acceptanceRate,
          totalQuestions: data.totalQuestions,
        };
      }
      if (data.totalSolved !== undefined) {
        return {
          totalSolved: data.totalSolved,
          easySolved: data.easySolved,
          mediumSolved: data.mediumSolved,
          hardSolved: data.hardSolved,
          ranking: data.ranking,
          acceptanceRate: null,
          totalQuestions: data.totalQuestions,
        };
      }
    } catch {
      continue;
    }
  }
  throw new Error("Could not fetch LeetCode stats. Check your username.");
}

async function fetchCodeforcesStats(username) {
  const [infoRes, ratingRes] = await Promise.all([
    fetch(`https://codeforces.com/api/user.info?handles=${username}`, {
      signal: AbortSignal.timeout(8000),
    }),
    fetch(`https://codeforces.com/api/user.rating?handle=${username}`, {
      signal: AbortSignal.timeout(8000),
    }),
  ]);
  if (!infoRes.ok) throw new Error("User not found on Codeforces");
  const infoData = await infoRes.json();
  if (infoData.status !== "OK")
    throw new Error(infoData.comment || "CF API error");
  const user = infoData.result[0];
  let contestCount = 0;
  if (ratingRes.ok) {
    const ratingData = await ratingRes.json();
    if (ratingData.status === "OK") contestCount = ratingData.result.length;
  }
  return {
    handle: user.handle,
    rating: user.rating || 0,
    maxRating: user.maxRating || 0,
    rank: user.rank || "unrated",
    maxRank: user.maxRank || "unrated",
    contestCount,
    contribution: user.contribution || 0,
    avatar: user.avatar,
  };
}

function cfRankColor(rank = "") {
  const r = rank.toLowerCase();
  if (r.includes("legendary")) return "#ff0000";
  if (r.includes("international") && r.includes("grandmaster"))
    return "#ff3333";
  if (r.includes("grandmaster")) return "#ff3333";
  if (r.includes("international") && r.includes("master")) return "#ff7777";
  if (r.includes("master")) return "#ffbb55";
  if (r.includes("candidate")) return "#ff8c00";
  if (r.includes("expert")) return "#a0a0ff";
  if (r.includes("specialist")) return "#77ddbb";
  if (r.includes("pupil")) return "#77ff77";
  return "#808080";
}

// ── Sub-components ────────────────────────────────────────────────────────────
function RadialProgress({ pct, size = 56, stroke = 5, color = "var(--blue)" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
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
        stroke="var(--border)"
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
      <RadialProgress pct={pct} size={size} stroke={6} color={color} />
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

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: 9,
        border: "none",
        flexShrink: 0,
        background: active ? "var(--txt)" : "var(--bg3)",
        color: active ? "var(--bg)" : "var(--txt2)",
        fontFamily: "var(--font)",
        fontSize: 12,
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "var(--txt)",
          letterSpacing: "-.02em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 12, color: "var(--txt3)", marginTop: 3 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Question Popup Modal ──────────────────────────────────────────────────────
function QuestionModal({ topic, doneMap, onToggle, onClose }) {
  const questions = DSA_QUESTIONS[topic.id] || [];
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const doneCount = questions.filter((q) => doneMap[q.id]).length;
  const pct = Math.round((doneCount / questions.length) * 100);

  const filtered = questions.filter((q) => {
    const matchDiff = filter === "All" || q.difficulty === filter;
    const matchSearch =
      !search || q.title.toLowerCase().includes(search.toLowerCase());
    return matchDiff && matchSearch;
  });

  const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
  questions.forEach((q) => diffCounts[q.difficulty]++);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const topicColor =
    pct === 100
      ? "#4caf7d"
      : pct >= 60
        ? "var(--blue)"
        : pct >= 30
          ? "var(--orange)"
          : "var(--red)";

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(5px)",
        zIndex: 99999, // Guaranteed to be on top
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0",
        animation: "fadeIn .15s ease",
        boxSizing: "border-box", // Ensure it contains width bounds securely
      }}
    >
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "0 0 20px 20px",
          width: "100%",
          maxWidth: "600px", // Safely constrains it on desktop, scales normally on mobile
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          animation: "slideDown .22s cubic-bezier(.16,1,.3,1)",
          boxSizing: "border-box",
          overflow: "hidden", // Prevents inner items forcing lateral overflow
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px 14px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
            boxSizing: "border-box",
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
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "var(--txt)",
                  letterSpacing: "-.02em",
                  wordBreak: "break-word",
                }}
              >
                {topic.label}
              </div>
              <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>
                {doneCount} / {questions.length} solved · Click to mark done
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--bg3)",
                color: "var(--txt2)",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Progress bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 7,
                background: "var(--bg4)",
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
                flexShrink: 0,
              }}
            >
              {pct}%
            </span>
          </div>

          {/* Diff summary chips */}
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            {Object.entries(diffCounts).map(([d, cnt]) => {
              const dc = DIFF_CONFIG[d];
              const doneCnt = questions.filter(
                (q) => q.difficulty === d && doneMap[q.id],
              ).length;
              return (
                <div
                  key={d}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 6,
                    background: dc.bg,
                    color: dc.color,
                    border: `1px solid ${dc.color}33`,
                  }}
                >
                  {d}: {doneCnt}/{cnt}
                </div>
              );
            })}
          </div>

          {/* Search + filter */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions…"
              style={{
                flex: "1 1 120px",
                minWidth: 0, // Critical for preventing flex blowout
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                padding: "7px 12px",
                fontSize: 12,
                color: "var(--txt)",
                outline: "none",
                fontFamily: "var(--font)",
                boxSizing: "border-box",
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
                      border: `1px solid ${filter === f ? dc?.color || "var(--txt)" : "var(--border)"}`,
                      background:
                        filter === f ? dc?.bg || "var(--txt)" : "transparent",
                      color:
                        filter === f ? dc?.color || "var(--bg)" : "var(--txt3)",
                      fontSize: 11,
                      fontWeight: filter === f ? 700 : 400,
                      cursor: "pointer",
                      fontFamily: "var(--font)",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 20px 24px",
            boxSizing: "border-box",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "var(--txt3)",
                fontSize: 13,
              }}
            >
              No questions match your filter
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filtered.map((q, i) => {
                const done = !!doneMap[q.id];
                const dc = DIFF_CONFIG[q.difficulty];
                return (
                  <div
                    key={q.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      borderRadius: 12,
                      background: done ? "#4caf7d0c" : "var(--bg2)",
                      border: `1px solid ${done ? "#4caf7d30" : "var(--border)"}`,
                      cursor: "pointer",
                      transition: "all .15s",
                      userSelect: "none",
                      boxSizing: "border-box",
                    }}
                    onClick={() => onToggle(q.id)}
                  >
                    {/* Checkbox */}
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
                        transition: "all .15s",
                      }}
                    >
                      {done && (
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>

                    {/* Index */}
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

                    {/* Title */}
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontWeight: done ? 600 : 400,
                        color: done ? "#4caf7d" : "var(--txt)",
                        lineHeight: 1.3,
                        textDecoration: done ? "none" : "none",
                        minWidth: 0, // Critical for preventing horizontal blowout
                        wordBreak: "break-word",
                      }}
                    >
                      {q.title}
                    </span>

                    {/* Difficulty badge */}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 5,
                        background: dc.bg,
                        color: dc.color,
                        flexShrink: 0,
                      }}
                    >
                      {q.difficulty}
                    </span>

                    {/* LC link */}
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
                        background: "var(--bg3)",
                        transition: "all .12s",
                      }}
                      title="Open on LeetCode/GFG"
                    >
                      ↗
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer action */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button
              onClick={() => {
                questions.forEach((q) => onToggle(q.id, true));
              }}
              style={{
                fontSize: 12,
                padding: "7px 14px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--bg3)",
                color: "var(--txt2)",
                cursor: "pointer",
              }}
            >
              Mark All
            </button>
            <button
              onClick={() => {
                questions.forEach((q) => onToggle(q.id, false));
              }}
              style={{
                fontSize: 12,
                padding: "7px 14px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--bg3)",
                color: "var(--txt2)",
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
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Platform Cards ────────────────────────────────────────────────────────────
function LeetCodeCard({ username, data, loading, error, onRefresh }) {
  if (loading)
    return (
      <div
        style={{
          padding: "14px 16px",
          background: "var(--bg3)",
          borderRadius: 12,
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "2px solid #ffa116",
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
          }}
        />
        <span style={{ fontSize: 12, color: "var(--txt3)" }}>
          Fetching LeetCode stats for <b>{username}</b>…
        </span>
      </div>
    );
  if (error)
    return (
      <div
        style={{
          padding: "12px 14px",
          background: "#ff444415",
          borderRadius: 12,
          border: "1px solid #ff444433",
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--red)" }}>⚠ {error}</span>
        <button
          onClick={onRefresh}
          style={{
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 7,
            border: "1px solid var(--border)",
            background: "var(--bg3)",
            color: "var(--txt2)",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  if (!data) return null;
  const diffBars =[
    { label: "Easy", val: data.easySolved, color: "#4caf7d" },
    { label: "Medium", val: data.mediumSolved, color: "#ffa116" },
    { label: "Hard", val: data.hardSolved, color: "#ef4444" },
  ];
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "linear-gradient(135deg, #ffa11608 0%, #ffa11602 100%)",
        borderRadius: 14,
        border: "1px solid #ffa11633",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#ffa116" }}>
          LeetCode
        </span>

        <button
          onClick={onRefresh}
          style={{
            background: "none",
            border: "none",
            color: "var(--txt3)",
            cursor: "pointer",
            fontSize: 14,
            padding: "0 2px",
          }}
        >
          ↺
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "var(--txt)",
              fontFamily: "var(--mono)",
              lineHeight: 1,
            }}
          >
            {data.totalSolved}
          </div>
          <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 2 }}>
            Solved
          </div>
          {data.totalQuestions && (
            <div style={{ fontSize: 10, color: "var(--txt3)" }}>
              / {data.totalQuestions}
            </div>
          )}
        </div>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}
        >
          {diffBars.map((d) => (
            <div
              key={d.label}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: d.color,
                  fontWeight: 700,
                  width: 42,
                  flexShrink: 0,
                }}
              >
                {d.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 5,
                  background: "var(--bg4)",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, (d.val / (data.totalSolved || 1)) * 100)}%`,
                    background: d.color,
                    borderRadius: 99,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--txt2)",
                  fontFamily: "var(--mono)",
                  width: 24,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {d.val}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop: "1px solid var(--border)",
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {data.ranking && (
          <div>
            <div style={{ fontSize: 10, color: "var(--txt3)" }}>
              Global Rank
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--txt)",
                fontFamily: "var(--mono)",
              }}
            >
              #{data.ranking.toLocaleString()}
            </div>
          </div>
        )}
        {data.acceptanceRate != null && (
          <div>
            <div style={{ fontSize: 10, color: "var(--txt3)" }}>Acceptance</div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--txt)",
                fontFamily: "var(--mono)",
              }}
            >
              {typeof data.acceptanceRate === "number"
                ? data.acceptanceRate.toFixed(1)
                : data.acceptanceRate}
              %
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CodeforcesCard({ username, data, loading, error, onRefresh }) {
  if (loading)
    return (
      <div
        style={{
          padding: "14px 16px",
          background: "var(--bg3)",
          borderRadius: 12,
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "2px solid #5b8def",
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
          }}
        />
        <span style={{ fontSize: 12, color: "var(--txt3)" }}>
          Fetching Codeforces stats for <b>{username}</b>…
        </span>
      </div>
    );
  if (error)
    return (
      <div
        style={{
          padding: "12px 14px",
          background: "#ff444415",
          borderRadius: 12,
          border: "1px solid #ff444433",
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--red)" }}>⚠ {error}</span>
        <button
          onClick={onRefresh}
          style={{
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 7,
            border: "1px solid var(--border)",
            background: "var(--bg3)",
            color: "var(--txt2)",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  if (!data) return null;
  const rankColor = cfRankColor(data.rank);
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "linear-gradient(135deg, #5b8def08 0%, #5b8def02 100%)",
        borderRadius: 14,
        border: "1px solid #5b8def33",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#5b8def" }}>
          Codeforces
        </span>

        <button
          onClick={onRefresh}
          style={{
            background: "none",
            border: "none",
            color: "var(--txt3)",
            cursor: "pointer",
            fontSize: 14,
            padding: "0 2px",
          }}
        >
          ↺
        </button>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: rankColor,
              fontFamily: "var(--mono)",
              lineHeight: 1,
            }}
          >
            {data.rating || "—"}
          </div>
          <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 2 }}>
            Rating
          </div>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}
        >
          {[["Rank", data.rank, rankColor, true],["Max Rating", data.maxRating || "—", "var(--txt)", false],
            ["Contests", data.contestCount, "var(--txt)", false],[
              "Contribution",
              (data.contribution >= 0 ? "+" : "") + data.contribution,
              data.contribution >= 0 ? "#4caf7d" : "var(--red)",
              false,
            ],
          ].map(([label, val, color, cap]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <span style={{ color: "var(--txt3)" }}>{label}</span>
              <span
                style={{
                  fontWeight: 700,
                  color,
                  fontFamily: "var(--mono)",
                  textTransform: cap ? "capitalize" : "none",
                }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodeChefCard({ username }) {
  if (!username) return null;
  return (
    <div
      style={{
        padding: "12px 14px",
        background: "#e8924a08",
        borderRadius: 12,
        border: "1px solid #e8924a33",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#e8924a" }}>
          CodeChef
        </span>
      </div>
      <div style={{ fontSize: 11, color: "var(--txt3)", lineHeight: 1.5 }}>
        No public API available for CodeChef. Stats must be checked manually.
      </div>
    </div>
  );
}

// ── DSA Tracker Tab ───────────────────────────────────────────────────────────
function DSATab() {
  const [solved, setSolved] = useState(() => load("pp_dsa_solved", {}));
  const [questionDone, setQuestionDone] = useState(() =>
    load("pp_dsa_qdone", {}),
  );
  const [openTopic, setOpenTopic] = useState(null);

  function toggleQuestion(qid, forceValue) {
    setQuestionDone((prev) => {
      const next = { ...prev };
      if (forceValue === true) next[qid] = true;
      else if (forceValue === false) delete next[qid];
      else if (next[qid]) delete next[qid];
      else next[qid] = true;
      save("pp_dsa_qdone", next);
      if (openTopic) {
        const questions = DSA_QUESTIONS[openTopic.id] || [];
        const doneCount = questions.filter((q) => next[q.id]).length;
        setSolved((sp) => {
          const ns = { ...sp, [openTopic.id]: doneCount };
          save("pp_dsa_solved", ns);
          return ns;
        });
      }
      return next;
    });
  }

  // Manual +/- still works but syncs from question bank if available
  function toggle(topicId, delta) {
    setSolved((prev) => {
      const cur = prev[topicId] || 0;
      const topic = DSA_TOPICS.find((t) => t.id === topicId);
      const next = {
        ...prev,
        [topicId]: Math.max(0, Math.min(topic.total, cur + delta)),
      };
      save("pp_dsa_solved", next);
      return next;
    });
  }

  function setCount(topicId, val) {
    const topic = DSA_TOPICS.find((t) => t.id === topicId);
    const n = Math.max(0, Math.min(topic.total, parseInt(val) || 0));
    setSolved((prev) => {
      const next = { ...prev, [topicId]: n };
      save("pp_dsa_solved", next);
      return next;
    });
  }

  const totalSolved = DSA_TOPICS.reduce((s, t) => s + (solved[t.id] || 0), 0);
  const totalProblems = DSA_TOPICS.reduce((s, t) => s + t.total, 0);
  const overallPct = Math.round((totalSolved / totalProblems) * 100);
  const readiness =
    overallPct >= 80
      ? { label: "Interview Ready", color: "#4caf7d" }
      : overallPct >= 50
        ? { label: "Getting There", color: "var(--yellow)" }
        : overallPct >= 25
          ? { label: "Needs Work", color: "var(--orange)" }
          : { label: "Just Starting", color: "var(--red)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Overview */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <ProgressRing pct={overallPct} size={80} color="var(--blue)" />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "var(--txt)",
                  fontFamily: "var(--mono)",
                }}
              >
                {totalSolved}
              </span>
              <span style={{ fontSize: 14, color: "var(--txt3)" }}>
                / {totalProblems} problems
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: 5,
                  background: readiness.color + "20",
                  color: readiness.color,
                  letterSpacing: ".06em",
                }}
              >
                {readiness.label}
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: "var(--bg4)",
                borderRadius: 99,
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${overallPct}%`,
                  background: "var(--blue)",
                  borderRadius: 99,
                  transition: "width .5s ease",
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "var(--txt3)" }}>
              {totalProblems - totalSolved} problems remaining across{" "}
              {DSA_TOPICS.length} topics
            </div>
          </div>
        </div>
      </div>

      {/* Topic Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--txt3)",
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            Topic Progress
          </div>
          <div style={{ fontSize: 11, color: "var(--txt3)" }}>
            Click any topic to see questions →
          </div>
        </div>
        {DSA_TOPICS.map((topic) => {
          const s = solved[topic.id] || 0;
          const pct = Math.round((s / topic.total) * 100);
          const color =
            pct === 100
              ? "#4caf7d"
              : pct >= 60
                ? "var(--blue)"
                : pct >= 30
                  ? "var(--orange)"
                  : "var(--red)";
          const questions = DSA_QUESTIONS[topic.id] || [];
          const qDone = questions.filter((q) => questionDone[q.id]).length;
          const hasBank = questions.length > 0;

          return (
            <div
              key={topic.id}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 13,
                padding: "12px 14px",
                cursor: hasBank ? "pointer" : "default",
                transition: "border-color .15s",
              }}
              onClick={hasBank ? () => setOpenTopic(topic) : undefined}
              onMouseEnter={(e) => {
                if (hasBank)
                  e.currentTarget.style.borderColor = "var(--blue)44";
              }}
              onMouseLeave={(e) => {
                if (hasBank)
                  e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--txt)",
                        }}
                      >
                        {topic.label}
                      </span>
                      {hasBank && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: 4,
                            background: "var(--blue)15",
                            color: "var(--blue)",
                            letterSpacing: ".05em",
                          }}
                        >
                          {qDone}/{questions.length} done
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--txt3)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {s}/{topic.total}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: "var(--bg4)",
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
                </div>

                {/* +/- controls — stop propagation so clicks don't open modal */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => toggle(topic.id, -1)}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      border: "1px solid var(--border)",
                      background: "var(--bg3)",
                      color: "var(--txt2)",
                      cursor: "pointer",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={topic.total}
                    value={s}
                    onChange={(e) => setCount(topic.id, e.target.value)}
                    style={{
                      width: 40,
                      textAlign: "center",
                      background: "var(--bg3)",
                      border: "1px solid var(--border)",
                      borderRadius: 7,
                      padding: "4px",
                      fontSize: 12,
                      color: "var(--txt)",
                      fontFamily: "var(--mono)",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={() => toggle(topic.id, 1)}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      border: "1px solid var(--border)",
                      background: "var(--bg3)",
                      color: "var(--txt2)",
                      cursor: "pointer",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    +
                  </button>
                </div>
                {pct === 100 ? (
                  <span style={{ fontSize: 14 }}>✅</span>
                ) : (
                  hasBank && (
                    <span style={{ fontSize: 12, color: "var(--txt3)" }}>
                      ›
                    </span>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Question Modal */}
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <SectionHeader
        title="Core CS Subjects"
        subtitle="Mark topics as revised — essential for tech interviews"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
          gap: 8,
          marginBottom: 8,
        }}
      >
        {CORE_SUBJECTS.map((subj) => {
          const done = subj.topics.filter(
            (t) => progress[`${subj.id}_${t}`],
          ).length;
          const pct = Math.round((done / subj.topics.length) * 100);
          const color =
            pct === 100
              ? "#4caf7d"
              : pct >= 50
                ? "var(--blue)"
                : "var(--orange)";
          return (
            <div
              key={subj.id}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "12px 10px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => setExpanded(expanded === subj.id ? null : subj.id)}
            >
              <ProgressRing pct={pct} size={44} color={color} />
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--txt)",
                  marginTop: 6,
                  lineHeight: 1.3,
                }}
              >
                {subj.label}
              </div>
            </div>
          );
        })}
      </div>
      {CORE_SUBJECTS.map((subj) => {
        const done = subj.topics.filter(
          (t) => progress[`${subj.id}_${t}`],
        ).length;
        const pct = Math.round((done / subj.topics.length) * 100);
        const isOpen = expanded === subj.id;
        const color =
          pct === 100 ? "#4caf7d" : pct >= 50 ? "var(--blue)" : "var(--orange)";
        return (
          <div
            key={subj.id}
            style={{
              background: "var(--bg2)",
              border: `1px solid ${isOpen ? "var(--blue)44" : "var(--border)"}`,
              borderRadius: 14,
              overflow: "hidden",
              transition: "border-color .2s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                cursor: "pointer",
              }}
              onClick={() => setExpanded(isOpen ? null : subj.id)}
            >
              <RadialProgress pct={pct} size={36} stroke={4} color={color} />
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: "var(--txt)" }}
                >
                  {subj.label}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--txt3)", marginTop: 1 }}
                >
                  {done}/{subj.topics.length} topics revised
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
                  gap: 7,
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
                        background: isDone ? "#4caf7d12" : "var(--bg3)",
                        border: `1px solid ${isDone ? "#4caf7d33" : "var(--border)"}`,
                        cursor: "pointer",
                        transition: "all .15s",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          border: `1.5px solid ${isDone ? "#4caf7d" : "var(--border2)"}`,
                          background: isDone ? "#4caf7d" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all .15s",
                        }}
                      >
                        {isDone && (
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: isDone ? "#4caf7d" : "var(--txt2)",
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

  const LEVELS =[
    { val: 0, label: "–", color: "var(--txt3)" },
    { val: 1, label: "Beginner", color: "var(--red)" },
    { val: 2, label: "Intermediate", color: "var(--orange)" },
    { val: 3, label: "Proficient", color: "var(--yellow)" },
    { val: 4, label: "Advanced", color: "#4caf7d" },
  ];

  const proficientCount = Object.values(skills).filter((v) => v >= 3).length;
  const totalTracked = Object.keys(skills).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader
        title="Tech Skills"
        subtitle="Rate your proficiency — helps identify gaps before applying"
      />
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
      >
        {[
          { val: totalTracked, label: "Tracked" },
          { val: proficientCount, label: "Proficient+" },
          {
            val: Object.values(skills).filter((v) => v === 4).length,
            label: "Advanced",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "12px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--txt)",
                fontFamily: "var(--mono)",
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontSize: 10,
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
          <div className="slabel" style={{ marginBottom: 12 }}>
            {cat.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cat.items.map((skill) => {
              const level = skills[skill] || 0;
              return (
                <div
                  key={skill}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--txt)",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {skill}
                  </span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {LEVELS.slice(1).map((l) => (
                      <button
                        key={l.val}
                        onClick={() =>
                          setLevel(skill, level === l.val ? 0 : l.val)
                        }
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          border: `1.5px solid ${level >= l.val ? l.color : "var(--border)"}`,
                          background:
                            level >= l.val ? l.color + "22" : "var(--bg3)",
                          cursor: "pointer",
                          transition: "all .15s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background:
                              level >= l.val ? l.color : "var(--border)",
                            transition: "background .15s",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: LEVELS[level]?.color || "var(--txt3)",
                      fontWeight: 600,
                      width: 76,
                      textAlign: "right",
                    }}
                  >
                    {LEVELS[level]?.label || "–"}
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
        <div className="slabel" style={{ marginBottom: 10 }}>
          Add Custom Skill
        </div>
        <form onSubmit={addCustom} style={{ display: "flex", gap: 8 }}>
          <input
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="e.g. Redis, Kafka, OpenCV..."
            style={{
              flex: 1,
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 9,
              padding: "9px 12px",
              fontSize: 13,
              color: "var(--txt)",
              outline: "none",
              fontFamily: "var(--font)",
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
              fontFamily: "var(--font)",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </form>
        {Object.keys(skills).filter(
          (s) => !SKILL_CATEGORIES.flatMap((c) => c.items).includes(s),
        ).length > 0 && (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {Object.entries(skills)
              .filter(
                ([s]) => !SKILL_CATEGORIES.flatMap((c) => c.items).includes(s),
              )
              .map(([skill, level]) => (
                <div
                  key={skill}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 13, color: "var(--txt)", flex: 1 }}>
                    {skill}
                  </span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLevel(skill, level === l ? 0 : l)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          border: `1.5px solid ${level >= l ? "#5b8def" : "var(--border)"}`,
                          background: level >= l ? "#5b8def22" : "var(--bg3)",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
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
                      fontSize: 14,
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
  const [newCo, setNewCo] = useState({
    name: "",
    tier: "dream",
    role: "",
    ctc: "",
    status: "Shortlisted",
    notes: "",
    rounds:[],
    applyDate: "",
  });

  function addCompany(e) {
    e.preventDefault();
    if (!newCo.name.trim()) return;
    const updated =[
      { ...newCo, id: Date.now(), name: newCo.name.trim() },
      ...companies,
    ];
    setCompanies(updated);
    save("pp_companies", updated);
    setNewCo({
      name: "",
      tier: "dream",
      role: "",
      ctc: "",
      status: "Shortlisted",
      notes: "",
      rounds:[],
      applyDate: "",
    });
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
              :[...(c.rounds || []), round],
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
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <SectionHeader
          title="Company Tracker"
          subtitle="Track applications, rounds, and offers"
        />
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
            color: "var(--txt2)",
            fontFamily: "var(--font)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 8,
        }}
      >
        {[
          { val: companies.length, label: "Applied", color: "var(--blue)" },
          {
            val: companies.filter((c) => c.status === "Interview").length,
            label: "Interviews",
            color: "var(--purple)",
          },
          {
            val: companies.filter((c) => c.status === "Offer").length,
            label: "Offers 🎉",
            color: "#4caf7d",
          },
          {
            val: companies.filter((c) => c.status === "Rejected").length,
            label: "Rejected",
            color: "var(--red)",
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
                fontSize: 10,
                color: "var(--txt3)",
                fontWeight: 600,
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
            border: "1px solid var(--blue)44",
            borderRadius: 14,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--txt)" }}>
            Add Company
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div style={{ gridColumn: "1/-1" }}>
              <div className="slabel">Company Name *</div>
              <input
                value={newCo.name}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Google, Flipkart..."
                className="inp"
                autoFocus
                required
              />
            </div>
            <div>
              <div className="slabel">Tier</div>
              <select
                value={newCo.tier}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, tier: e.target.value }))
                }
                className="inp"
              >
                {COMPANY_TIERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="slabel">Status</div>
              <select
                value={newCo.status}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, status: e.target.value }))
                }
                className="inp"
              >
                {APP_STATUS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="slabel">Role</div>
              <input
                value={newCo.role}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, role: e.target.value }))
                }
                placeholder="SDE, Data Analyst..."
                className="inp"
              />
            </div>
            <div>
              <div className="slabel">CTC (LPA)</div>
              <input
                value={newCo.ctc}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, ctc: e.target.value }))
                }
                placeholder="e.g. 12-18 LPA"
                className="inp"
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <div className="slabel">Notes</div>
              <input
                value={newCo.notes}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Referral contact, job link, etc."
                className="inp"
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 9,
                border: "none",
                background: "var(--txt)",
                color: "var(--bg)",
                fontFamily: "var(--font)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add Company
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              style={{
                padding: "10px 16px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--txt2)",
                fontFamily: "var(--font)",
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
        <TabBtn
          active={filterTier === "all"}
          onClick={() => setFilterTier("all")}
        >
          All ({companies.length})
        </TabBtn>
        {COMPANY_TIERS.map((t) => {
          const cnt = companies.filter((c) => c.tier === t.id).length;
          return cnt > 0 ? (
            <TabBtn
              key={t.id}
              active={filterTier === t.id}
              onClick={() => setFilterTier(t.id)}
            >
              {t.label} ({cnt})
            </TabBtn>
          ) : null;
        })}
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
          <div style={{ fontSize: 12, marginTop: 4 }}>
            Add your target companies above
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
                          color: "var(--txt2)",
                          marginBottom: 2,
                        }}
                      >
                        {co.role}
                        {co.ctc && ` · ${co.ctc} LPA`}
                      </div>
                    )}
                    {co.notes && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--txt3)",
                          lineHeight: 1.4,
                        }}
                      >
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
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 5,
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
                          border: `1px solid ${isActive ? sc.color + "66" : "var(--border)"}`,
                          background: isActive ? sc.bg : "transparent",
                          color: isActive ? sc.color : "var(--txt3)",
                          fontSize: 11,
                          fontWeight: isActive ? 700 : 400,
                          cursor: "pointer",
                          fontFamily: "var(--font)",
                          transition: "all .15s",
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
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--txt3)",
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      Rounds Cleared
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {INTERVIEW_ROUNDS.map((r) => {
                        const done = co.rounds?.includes(r);
                        return (
                          <button
                            key={r}
                            onClick={() => toggleRound(co.id, r)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 7,
                              border: `1px solid ${done ? "#4caf7d55" : "var(--border)"}`,
                              background: done ? "#4caf7d18" : "var(--bg3)",
                              color: done ? "#4caf7d" : "var(--txt3)",
                              fontSize: 11,
                              fontWeight: done ? 600 : 400,
                              cursor: "pointer",
                              fontFamily: "var(--font)",
                              transition: "all .15s",
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
  const [versions, setVersions] = useState(() =>
    load("pp_resume_versions", []),
  );
  const [showAdd, setShowAdd] = useState(false);
  const [newV, setNewV] = useState({ label: "", link: "", notes: "" });

  const RESUME_CHECKLIST =[
    {
      id: "contact",
      label: "Contact info complete (email, phone, LinkedIn, GitHub)",
    },
    { id: "objective", label: "Summary/objective tailored to target role" },
    { id: "education", label: "Education section with CGPA (if ≥ 7.5)" },
    {
      id: "projects",
      label: "3-4 strong projects with tech stack & impact metrics",
    },
    { id: "internship", label: "Internship / work experience listed" },
    { id: "skills", label: "Skills section with relevant tech stack" },
    {
      id: "achievements",
      label: "Achievements: coding contests, hackathons, certifications",
    },
    {
      id: "quantify",
      label: "Every bullet point quantified with numbers/impact",
    },
    { id: "ats", label: "ATS-friendly format (no tables, no graphics)" },
    { id: "onepage", label: "Fits in 1 page (for < 3 yrs experience)" },
    { id: "proofread", label: "Proofread — no spelling/grammar errors" },
    {
      id: "pdf",
      label: "Exported as PDF, file named properly (FirstName_Resume.pdf)",
    },
  ];

  function toggleCheck(id) {
    setChecklist((p) => {
      const n = { ...p, [id]: !p[id] };
      save("pp_resume_check", n);
      return n;
    });
  }
  function addVersion(e) {
    e.preventDefault();
    if (!newV.label.trim()) return;
    const u =[
      {
        ...newV,
        id: Date.now(),
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
      },
      ...versions,
    ];
    setVersions(u);
    save("pp_resume_versions", u);
    setNewV({ label: "", link: "", notes: "" });
    setShowAdd(false);
  }

  const doneCount = RESUME_CHECKLIST.filter((i) => checklist[i.id]).length;
  const pct = Math.round((doneCount / RESUME_CHECKLIST.length) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader
        title="Resume Builder"
        subtitle="Checklist + version tracker for your resume"
      />
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
        <ProgressRing
          pct={pct}
          size={72}
          color={
            pct === 100
              ? "#4caf7d"
              : pct >= 70
                ? "var(--blue)"
                : "var(--orange)"
          }
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--txt)",
              marginBottom: 4,
            }}
          >
            Resume Score:{" "}
            <span
              style={{
                color:
                  pct === 100
                    ? "#4caf7d"
                    : pct >= 70
                      ? "var(--blue)"
                      : "var(--orange)",
              }}
            >
              {pct === 100
                ? "Perfect! 🎉"
                : pct >= 70
                  ? "Good"
                  : pct >= 40
                    ? "Needs Work"
                    : "Incomplete"}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--txt3)" }}>
            {doneCount}/{RESUME_CHECKLIST.length} items checked
          </div>
          <div
            style={{
              height: 5,
              background: "var(--bg4)",
              borderRadius: 99,
              overflow: "hidden",
              marginTop: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: pct === 100 ? "#4caf7d" : "var(--blue)",
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
        <div className="slabel" style={{ marginBottom: 12 }}>
          Resume Checklist
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
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
                  background: done ? "#4caf7d10" : "var(--bg3)",
                  border: `1px solid ${done ? "#4caf7d33" : "var(--border)"}`,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: `1.5px solid ${done ? "#4caf7d" : "var(--border2)"}`,
                    background: done ? "#4caf7d" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                    transition: "all .15s",
                  }}
                >
                  {done && (
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: done ? "#4caf7d" : "var(--txt2)",
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
      <div
        style={{
          background: "var(--blue)10",
          border: "1px solid var(--blue)25",
          borderRadius: 14,
          padding: 16,
        }}
      >
        <div
          className="slabel"
          style={{ marginBottom: 10, color: "var(--blue)" }}
        >
          💡 Pro Tips
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {RESUME_TIPS.map((tip, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                fontSize: 12,
                color: "var(--txt2)",
                lineHeight: 1.5,
              }}
            >
              <span
                style={{ color: "var(--blue)", flexShrink: 0, fontWeight: 700 }}
              >
                →
              </span>
              <span>{tip}</span>
            </div>
          ))}
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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div className="slabel" style={{ margin: 0 }}>
            Resume Versions
          </div>
          <button
            onClick={() => setShowAdd((s) => !s)}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "5px 11px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg3)",
              color: "var(--txt2)",
              cursor: "pointer",
            }}
          >
            + Add Version
          </button>
        </div>
        {showAdd && (
          <form
            onSubmit={addVersion}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 12,
              padding: 12,
              background: "var(--bg3)",
              borderRadius: 10,
            }}
          >
            {[
              {
                val: newV.label,
                key: "label",
                ph: "Version label (e.g. SDE Intern v2)",
                req: true,
              },
              {
                val: newV.link,
                key: "link",
                ph: "Google Drive / link (optional)",
              },
              { val: newV.notes, key: "notes", ph: "What changed? (optional)" },
            ].map((f) => (
              <input
                key={f.key}
                value={f.val}
                onChange={(e) =>
                  setNewV((p) => ({ ...p, [f.key]: e.target.value }))
                }
                placeholder={f.ph}
                required={f.req}
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "8px 11px",
                  fontSize: 13,
                  color: "var(--txt)",
                  outline: "none",
                  fontFamily: "var(--font)",
                }}
              />
            ))}
            <div style={{ display: "flex", gap: 7 }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: 8,
                  border: "none",
                  background: "var(--txt)",
                  color: "var(--bg)",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--font)",
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--txt2)",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "var(--font)",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {versions.length === 0 ? (
          <div
            style={{
              fontSize: 12,
              color: "var(--txt3)",
              textAlign: "center",
              padding: "16px 0",
            }}
          >
            No versions saved yet — add your first one!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {versions.map((v, i) => (
              <div
                key={v.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  background: "var(--bg3)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: i === 0 ? "var(--blue)" : "var(--bg4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 800,
                    color: i === 0 ? "#fff" : "var(--txt3)",
                    flexShrink: 0,
                  }}
                >
                  v{versions.length - i}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--txt)",
                    }}
                  >
                    {v.label}
                  </div>
                  {v.notes && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--txt3)",
                        marginTop: 1,
                      }}
                    >
                      {v.notes}
                    </div>
                  )}
                </div>
                <span
                  style={{ fontSize: 10, color: "var(--txt3)", flexShrink: 0 }}
                >
                  {v.date}
                </span>
                {v.link && (
                  <a
                    href={
                      v.link.startsWith("http") ? v.link : "https://" + v.link
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 11,
                      color: "var(--blue)",
                      textDecoration: "none",
                      flexShrink: 0,
                    }}
                  >
                    ↗
                  </a>
                )}
                <button
                  onClick={() => {
                    const u = versions.filter((x) => x.id !== v.id);
                    setVersions(u);
                    save("pp_resume_versions", u);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--txt3)",
                    cursor: "pointer",
                    fontSize: 14,
                    flexShrink: 0,
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

// ── Main View ─────────────────────────────────────────────────────────────────
export default function PlacementPrepView() {
  const[activeTab, setActiveTab] = useState("dsa");

  const dsaSolved = useMemo(() => load("pp_dsa_solved", {}),[]);
  const dsaTotal = DSA_TOPICS.reduce((s, t) => s + t.total, 0);
  const dsaDone = DSA_TOPICS.reduce((s, t) => s + (dsaSolved[t.id] || 0), 0);
  const dsaPct = Math.round((dsaDone / dsaTotal) * 100);

  const coreProgress = useMemo(() => load("pp_core_progress", {}),[]);
  const coreTotal = CORE_SUBJECTS.flatMap((s) => s.topics).length;
  const coreDone = Object.values(coreProgress).filter(Boolean).length;
  const corePct = Math.round((coreDone / coreTotal) * 100);

  const skills = useMemo(() => load("pp_skills", {}),[]);
  const skillPct = Math.min(
    100,
    Math.round((Object.values(skills).filter((v) => v >= 3).length / 8) * 100),
  );

  const resumeCheck = useMemo(() => load("pp_resume_check", {}),[]);
  const resumePct = Math.round(
    (Object.values(resumeCheck).filter(Boolean).length / 12) * 100,
  );

  const companies = useMemo(() => load("pp_companies", []),[]);
  const overallPct = Math.round(
    dsaPct * 0.35 + corePct * 0.25 + skillPct * 0.2 + resumePct * 0.2,
  );

  const readiness =
    overallPct >= 80
      ? { label: "Interview Ready 🚀", color: "#4caf7d" }
      : overallPct >= 60
        ? { label: "Almost There 💪", color: "var(--blue)" }
        : overallPct >= 35
          ? { label: "Getting Warmed Up 🔥", color: "var(--yellow)" }
          : { label: "Just Getting Started ⚡", color: "var(--orange)" };

  const TABS =[
    { id: "dsa", label: "DSA", emoji: "💻" },
    { id: "core", label: "Core CS", emoji: "📚" },
    { id: "skills", label: "Skills", emoji: "⚙️" },
    { id: "companies", label: "Companies", emoji: "🏢" },
    { id: "resume", label: "Resume", emoji: "📄" },
  ];

  return (
    <div
      className="page"
      style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
    >
      <style>{`
        /* REMOVED 'transform' FROM THE 100% STATE SO FIXED OVERLAYS WORK PROPERLY */
        @keyframes fadeUp { 
          0% { opacity: 0; transform: translateY(12px); } 
          100% { opacity: 1; transform: none; } 
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { 
          0% { opacity: 0; transform: translateY(-16px); } 
          100% { opacity: 1; transform: none; } 
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pp-fadein { animation: fadeUp .3s ease forwards; }
      `}</style>

      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-.03em",
                color: "var(--txt)",
                marginBottom: 2,
              }}
            >
              Placement Prep
            </h1>
            <p style={{ fontSize: 13, color: "var(--txt3)" }}>
              Track DSA, core CS, skills, companies & resume
            </p>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <ProgressRing pct={overallPct} size={64} color={readiness.color} />
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "var(--txt3)",
                marginTop: 4,
                letterSpacing: ".05em",
                textTransform: "uppercase",
              }}
            >
              Readiness
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "13px 16px",
            marginBottom: 14,
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
            <span
              style={{ fontSize: 13, fontWeight: 700, color: readiness.color }}
            >
              {readiness.label}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "var(--txt3)",
                fontFamily: "var(--mono)",
              }}
            >
              {overallPct}% overall
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 8,
            }}
          >
            {[
              { label: "DSA", pct: dsaPct, color: "var(--blue)" },
              { label: "Core CS", pct: corePct, color: "var(--purple)" },
              { label: "Skills", pct: skillPct, color: "var(--orange)" },
              { label: "Resume", pct: resumePct, color: "#4caf7d" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--txt3)",
                    marginBottom: 5,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    height: 4,
                    background: "var(--bg4)",
                    borderRadius: 99,
                    overflow: "hidden",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${s.pct}%`,
                      background: s.color,
                      borderRadius: 99,
                      transition: "width .5s",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: s.color,
                    fontFamily: "var(--mono)",
                  }}
                >
                  {s.pct}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {companies.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "10px 14px",
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 12, color: "var(--txt3)" }}>
              📊 Tracking
            </span>
            <span
              style={{ fontSize: 12, fontWeight: 600, color: "var(--txt)" }}
            >
              {companies.length} companies
            </span>
            {companies.filter((c) => c.status === "Offer").length > 0 && (
              <>
                <span style={{ color: "var(--border)" }}>·</span>
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: "#4caf7d" }}
                >
                  🎉 {companies.filter((c) => c.status === "Offer").length}{" "}
                  offer
                  {companies.filter((c) => c.status === "Offer").length > 1
                    ? "s"
                    : ""}
                  !
                </span>
              </>
            )}
            {companies.filter((c) => c.status === "Interview").length > 0 && (
              <>
                <span style={{ color: "var(--border)" }}>·</span>
                <span style={{ fontSize: 12, color: "var(--purple)" }}>
                  {companies.filter((c) => c.status === "Interview").length} in
                  interview
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 18,
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
              background: activeTab === t.id ? "var(--txt)" : "var(--bg3)",
              color: activeTab === t.id ? "var(--bg)" : "var(--txt2)",
              fontFamily: "var(--font)",
              fontSize: 12,
              fontWeight: activeTab === t.id ? 700 : 500,
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            <span>{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="pp-fadein" key={activeTab}>
        {activeTab === "dsa" && <DSATab />}
        {activeTab === "core" && <CoreCSTab />}
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "companies" && <CompaniesTab />}
        {activeTab === "resume" && <ResumeTab />}
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
}
