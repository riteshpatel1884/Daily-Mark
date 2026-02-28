// ─────────────────────────────────────────────────────────────────────────────
// placementData.js
// All static data: DSA question bank, topic/subject/skill/company constants.
// Import from PlacementPrepView.jsx — NO logic or UI here.
// ─────────────────────────────────────────────────────────────────────────────

// ── DSA Question Bank ─────────────────────────────────────────────────────────
export const DSA_QUESTIONS = {
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

  stacks: [
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

  trees: [
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

  graphs: [
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

  recursion: [
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

  sorting: [
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

  greedy: [
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

  hashing: [
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

  trie: [
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

  bitmanip: [
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

  math: [
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

// ── DSA Topics (sidebar list + totals) ───────────────────────────────────────
export const DSA_TOPICS = [
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

// ── Core CS Subjects ──────────────────────────────────────────────────────────
export const CORE_SUBJECTS = [
  {
    id: "os",
    label: "Operating Systems",
    topics: [
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
    topics: [
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
    topics: [
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
    topics: [
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
    topics: [
      "Time & Space Complexity",
      "Divide & Conquer",
      "Graph Algorithms",
      "String Algorithms",
      "NP Completeness",
    ],
  },
];

// ── Skill Categories ──────────────────────────────────────────────────────────
export const SKILL_CATEGORIES = [
  {
    id: "lang",
    label: "Languages",
    items: ["C++", "Java", "Python", "JavaScript", "Go", "Rust"],
  },
  {
    id: "web",
    label: "Web / Backend",
    items: [
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
    items: [
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
    items: [
      "NumPy / Pandas",
      "Scikit-learn",
      "TensorFlow / PyTorch",
      "SQL",
      "Data Visualization",
      "Statistics",
    ],
  },
];

// ── Company Tiers ─────────────────────────────────────────────────────────────
export const COMPANY_TIERS = [
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

// ── Application Status ────────────────────────────────────────────────────────
export const APP_STATUS = [
  "Shortlisted",
  "OA Sent",
  "OA Done",
  "Interview",
  "Offer",
  "Rejected",
];

export const STATUS_COLORS = {
  Shortlisted: { color: "var(--blue)", bg: "var(--blue)18" },
  "OA Sent": { color: "var(--yellow)", bg: "var(--yellow)18" },
  "OA Done": { color: "var(--orange)", bg: "var(--orange)18" },
  Interview: { color: "var(--purple)", bg: "var(--purple)18" },
  Offer: { color: "#4caf7d", bg: "#4caf7d18" },
  Rejected: { color: "var(--red)", bg: "var(--red)18" },
};

// ── Interview Rounds ──────────────────────────────────────────────────────────
export const INTERVIEW_ROUNDS = [
  "Coding Round",
  "Technical Round 1",
  "Technical Round 2",
  "System Design",
  "HR Round",
  "Manager Round",
];

// ── Difficulty Config ─────────────────────────────────────────────────────────
export const DIFF_CONFIG = {
  Easy: { color: "#4caf7d", bg: "#4caf7d18" },
  Medium: { color: "#ffa116", bg: "#ffa11618" },
  Hard: { color: "#ef4444", bg: "#ef444418" },
};

// ── Resume Tips ───────────────────────────────────────────────────────────────
export const RESUME_TIPS = [
  "Keep resume to 1 page for < 3 years experience",
  "Quantify every achievement (e.g. 'improved speed by 40%')",
  "Use action verbs: Built, Designed, Optimized, Led",
  "Add GitHub, LinkedIn, LeetCode profile links",
  "List tech stack used in each project",
  "No photo, no DOB, no address needed",
  "ATS-friendly: avoid tables/columns/graphics",
  "Tailor keywords to each job description",
];

// ── Resume Checklist Items ────────────────────────────────────────────────────
export const RESUME_CHECKLIST = [
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

// ── Skill Levels ──────────────────────────────────────────────────────────────
export const SKILL_LEVELS = [
  { val: 0, label: "–", color: "var(--txt3)" },
  { val: 1, label: "Beginner", color: "var(--red)" },
  { val: 2, label: "Intermediate", color: "var(--orange)" },
  { val: 3, label: "Proficient", color: "var(--yellow)" },
  { val: 4, label: "Advanced", color: "#4caf7d" },
];
