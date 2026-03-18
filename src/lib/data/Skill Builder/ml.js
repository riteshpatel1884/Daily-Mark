// ml.topics.js — Skill Builder: ML Topics + Curated Resources
// Each topic has: id, title, category, level, estimatedDays, description, resources[]
// Resource types: "video" | "playlist" | "article" | "course" | "book" | "practice" | "docs"

export const ML_CATEGORY_COLORS = {
  Mathematics: "#e05252",
  Programming: "#e07832",
  "Data Fundamentals": "#d4b44a",
  "Core ML": "#4caf7d",
  "Deep Learning": "#3bbdbd",
  NLP: "#5b8def",
  "Computer Vision": "#9b72cf",
  "Reinforcement Learning": "#d4538a",
  "MLOps & Deployment": "#6b8f5e",
  "Advanced Topics": "#c05c3a",
};

// level: "beginner" | "intermediate" | "advanced"
// estimatedDays: rough days to cover the topic at ~2 hrs/day
export const ML_TOPICS = [
  // ═══════════════════════════════════════════════════
  // MATHEMATICS
  // ═══════════════════════════════════════════════════
  {
    id: "m001",
    title: "Linear Algebra Fundamentals",
    category: "Mathematics",
    level: "beginner",
    estimatedDays: 7,
    description:
      "Vectors, matrices, matrix operations, eigenvalues, eigenvectors, SVD. The backbone of every ML algorithm.",
    resources: [
      {
        type: "playlist",
        label: "Essence of Linear Algebra — 3Blue1Brown",
        url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
        note: "Best visual intuition series ever made. Watch first.",
      },
      {
        type: "course",
        label: "MIT 18.06 Linear Algebra — Gilbert Strang",
        url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
        note: "Full MIT course, free. Gold standard for depth.",
      },
      {
        type: "video",
        label: "Linear Algebra for ML — StatQuest",
        url: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
        note: "Gentle intro focused on ML relevance.",
      },
      {
        type: "article",
        label: "Linear Algebra Cheatsheet — ML Glossary",
        url: "https://ml-cheatsheet.readthedocs.io/en/latest/linear_algebra.html",
        note: "Quick reference while coding.",
      },
      {
        type: "practice",
        label: "NumPy Linear Algebra exercises — w3resource",
        url: "https://www.w3resource.com/python-exercises/numpy/linear-algebra/index.php",
        note: "Practice with code, not just theory.",
      },
    ],
  },
  {
    id: "m002",
    title: "Calculus & Differentiation",
    category: "Mathematics",
    level: "beginner",
    estimatedDays: 6,
    description:
      "Derivatives, partial derivatives, chain rule, gradients, Jacobians, Hessians. Essential for understanding backpropagation and optimization.",
    resources: [
      {
        type: "playlist",
        label: "Essence of Calculus — 3Blue1Brown",
        url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr",
        note: "Visual first, formulas second. Start here.",
      },
      {
        type: "video",
        label: "Calculus for ML — Andrej Karpathy (micrograd)",
        url: "https://www.youtube.com/watch?v=VMj-3S1tku0",
        note: "Builds a neural net from scratch showing every derivative.",
      },
      {
        type: "course",
        label: "Mathematics for ML Specialization — Coursera",
        url: "https://www.coursera.org/specializations/mathematics-machine-learning",
        note: "Paid but covers calculus + LA + PCA end-to-end.",
      },
      {
        type: "article",
        label: "The Matrix Calculus You Need For Deep Learning",
        url: "https://explained.ai/matrix-calculus/",
        note: "Free PDF/article. Extremely practical.",
      },
    ],
  },
  {
    id: "m003",
    title: "Probability & Statistics",
    category: "Mathematics",
    level: "beginner",
    estimatedDays: 8,
    description:
      "Probability distributions, Bayes theorem, expectation, variance, MLE, MAP, hypothesis testing, confidence intervals.",
    resources: [
      {
        type: "playlist",
        label: "Statistics Fundamentals — StatQuest with Josh Starmer",
        url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9",
        note: "The single best stats channel on YouTube. Every video is gold.",
      },
      {
        type: "playlist",
        label: "Probability for ML — Brandon Foltz",
        url: "https://www.youtube.com/c/BrandonFoltz/playlists",
        note: "Slow and clear, great for building real intuition.",
      },
      {
        type: "course",
        label: "Intro to Statistics — Khan Academy",
        url: "https://www.khanacademy.org/math/statistics-probability",
        note: "Free, well-structured, covers all basics.",
      },
      {
        type: "article",
        label: "Probability Theory for ML — Seeing Theory",
        url: "https://seeing-theory.brown.edu/",
        note: "Stunning visual, interactive probability theory site.",
      },
      {
        type: "book",
        label: "Think Stats — Allen Downey (free)",
        url: "https://greenteapress.com/wp/think-stats-2e/",
        note: "Statistics using Python. Free PDF.",
      },
    ],
  },
  {
    id: "m004",
    title: "Optimization Theory",
    category: "Mathematics",
    level: "intermediate",
    estimatedDays: 5,
    description:
      "Gradient descent, stochastic gradient descent, convexity, Lagrange multipliers, constrained optimization, Adam & variants.",
    resources: [
      {
        type: "video",
        label: "Gradient Descent — 3Blue1Brown (DL series)",
        url: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
        note: "Perfect visual explanation of gradient descent.",
      },
      {
        type: "article",
        label: "An Overview of Gradient Descent Algorithms — Ruder",
        url: "https://www.ruder.io/optimizing-gradient-descent/",
        note: "Best single article on all GD variants. Bookmark this.",
      },
      {
        type: "video",
        label: "Why Momentum Really Works — distill.pub",
        url: "https://distill.pub/2017/momentum/",
        note: "Interactive deep-dive into momentum optimizers.",
      },
      {
        type: "course",
        label: "Convex Optimization — Stanford CVX101",
        url: "https://web.stanford.edu/class/ee364a/",
        note: "Free Stanford course for deeper theory.",
      },
    ],
  },
  {
    id: "m005",
    title: "Information Theory",
    category: "Mathematics",
    level: "intermediate",
    estimatedDays: 3,
    description:
      "Entropy, cross-entropy, KL divergence, mutual information. Directly used in loss functions and probabilistic models.",
    resources: [
      {
        type: "video",
        label: "Entropy and Information Theory — StatQuest",
        url: "https://www.youtube.com/watch?v=YtebGVx-Fxw",
        note: "Best simple intro to entropy for ML.",
      },
      {
        type: "article",
        label: "Visual Information Theory — colah's blog",
        url: "https://colah.github.io/posts/2015-09-Visual-Information/",
        note: "Chris Olah's legendary blog. Bookmark the entire site.",
      },
      {
        type: "article",
        label: "KL Divergence Explained — Count Bayesie",
        url: "https://www.countbayesie.com/blog/2017/5/9/kullback-leibler-divergence-explained",
        note: "Clear, practical, math included.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // PROGRAMMING
  // ═══════════════════════════════════════════════════
  {
    id: "p001",
    title: "Python for ML",
    category: "Programming",
    level: "beginner",
    estimatedDays: 5,
    description:
      "Python syntax, list comprehensions, functions, OOP basics, file I/O. The language of ML — you need to be fluent.",
    resources: [
      {
        type: "course",
        label: "Python for Everybody — Dr. Chuck (freeCodeCamp)",
        url: "https://www.youtube.com/watch?v=8DvywoWv6fI",
        note: "14-hour full course, completely free, beginner-perfect.",
      },
      {
        type: "course",
        label: "Python Tutorial — CS Dojo",
        url: "https://www.youtube.com/watch?v=Z1Yd7upQsXY",
        note: "Fast, practical Python for people who want to get to ML quick.",
      },
      {
        type: "practice",
        label: "Python Practice — HackerRank Python Track",
        url: "https://www.hackerrank.com/domains/python",
        note: "Structured exercises from easy to hard.",
      },
    ],
  },
  {
    id: "p002",
    title: "NumPy & Pandas",
    category: "Programming",
    level: "beginner",
    estimatedDays: 4,
    description:
      "Array operations with NumPy, data manipulation with Pandas. You'll use these every single day in ML.",
    resources: [
      {
        type: "video",
        label: "NumPy Full Course — freeCodeCamp",
        url: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
        note: "1-hour complete NumPy walkthrough.",
      },
      {
        type: "video",
        label: "Pandas Full Course — Corey Schafer",
        url: "https://www.youtube.com/watch?v=ZyhVh-qRZPA&list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS",
        note: "Best Pandas tutorial series on YouTube.",
      },
      {
        type: "docs",
        label: "NumPy Official Docs — numpy.org",
        url: "https://numpy.org/doc/stable/user/quickstart.html",
        note: "Read the quickstart, then use as reference.",
      },
      {
        type: "practice",
        label: "100 NumPy Exercises — GitHub",
        url: "https://github.com/rougier/numpy-100",
        note: "Classic exercise set from 0 to advanced.",
      },
    ],
  },
  {
    id: "p003",
    title: "Matplotlib & Seaborn",
    category: "Programming",
    level: "beginner",
    estimatedDays: 3,
    description:
      "Data visualization — plotting distributions, correlations, model outputs, training curves. Essential for EDA and debugging models.",
    resources: [
      {
        type: "video",
        label: "Matplotlib Tutorial — Corey Schafer",
        url: "https://www.youtube.com/watch?v=UO98lJQ3QGI&list=PL-osiE80TeTvipOqomVEeqnq2DRZYL23J",
        note: "Comprehensive, practical, great pacing.",
      },
      {
        type: "video",
        label: "Seaborn Tutorial — Kimberly Fessel",
        url: "https://www.youtube.com/watch?v=6GUZXDef2U0",
        note: "Statistical plots made easy.",
      },
      {
        type: "article",
        label: "Python Graph Gallery",
        url: "https://python-graph-gallery.com/",
        note: "Browse by chart type and copy the code. Very practical.",
      },
    ],
  },
  {
    id: "p004",
    title: "Scikit-learn",
    category: "Programming",
    level: "beginner",
    estimatedDays: 5,
    description:
      "The go-to ML library for classical algorithms. Pipelines, preprocessing, model selection, evaluation — all in one place.",
    resources: [
      {
        type: "video",
        label: "Scikit-learn Crash Course — freeCodeCamp",
        url: "https://www.youtube.com/watch?v=0B5eIE_1vpU",
        note: "3-hour complete crash course.",
      },
      {
        type: "docs",
        label: "Scikit-learn Official User Guide",
        url: "https://scikit-learn.org/stable/user_guide.html",
        note: "One of the best-written docs in open source.",
      },
      {
        type: "practice",
        label: "Kaggle Learn — Intro to ML",
        url: "https://www.kaggle.com/learn/intro-to-machine-learning",
        note: "Free, hands-on, uses real datasets.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // DATA FUNDAMENTALS
  // ═══════════════════════════════════════════════════
  {
    id: "d001",
    title: "Exploratory Data Analysis (EDA)",
    category: "Data Fundamentals",
    level: "beginner",
    estimatedDays: 4,
    description:
      "Understanding data distributions, finding patterns, detecting outliers, correlation analysis. Always the first step before any model.",
    resources: [
      {
        type: "video",
        label: "EDA with Python — Rob Mulla",
        url: "https://www.youtube.com/watch?v=xi0vhXFPegw",
        note: "Real-world EDA walkthrough, very practical.",
      },
      {
        type: "article",
        label: "Comprehensive EDA in Python — Towards Data Science",
        url: "https://towardsdatascience.com/exploratory-data-analysis-8fc1cb20fd15",
        note: "Step-by-step guide with code.",
      },
      {
        type: "practice",
        label: "Titanic EDA — Kaggle Notebook",
        url: "https://www.kaggle.com/code/startupsci/titanic-data-science-solutions",
        note: "Classic dataset, see how pros do full EDA.",
      },
    ],
  },
  {
    id: "d002",
    title: "Data Preprocessing & Cleaning",
    category: "Data Fundamentals",
    level: "beginner",
    estimatedDays: 4,
    description:
      "Handling missing values, encoding categorical features, scaling, normalization, dealing with imbalanced datasets.",
    resources: [
      {
        type: "video",
        label: "Data Preprocessing — Krish Naik",
        url: "https://www.youtube.com/watch?v=barxuvTHBYo",
        note: "Complete practical guide with sklearn.",
      },
      {
        type: "article",
        label: "Feature Engineering for ML — Alice Zheng (free excerpts)",
        url: "https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/",
        note: "Best book on the topic.",
      },
      {
        type: "practice",
        label: "Data Cleaning — Kaggle Learn",
        url: "https://www.kaggle.com/learn/data-cleaning",
        note: "Short, hands-on, free.",
      },
    ],
  },
  {
    id: "d003",
    title: "Feature Engineering",
    category: "Data Fundamentals",
    level: "intermediate",
    estimatedDays: 5,
    description:
      "Creating new features, polynomial features, interaction terms, target encoding, dimensionality reduction via PCA.",
    resources: [
      {
        type: "video",
        label: "Feature Engineering Full Guide — Abhishek Thakur",
        url: "https://www.youtube.com/watch?v=BuV57PpZBWo",
        note: "Kaggle Grandmaster explains his feature engineering process.",
      },
      {
        type: "article",
        label: "Feature Engineering Techniques — ML Mastery",
        url: "https://machinelearningmastery.com/discover-feature-engineering-how-to-engineer-features-and-how-to-get-good-at-it/",
        note: "Practical tips you can apply immediately.",
      },
      {
        type: "video",
        label: "PCA Explained — StatQuest",
        url: "https://www.youtube.com/watch?v=FgakZw6K1QQ",
        note: "Best PCA explanation anywhere.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // CORE ML
  // ═══════════════════════════════════════════════════
  {
    id: "c001",
    title: "Linear & Logistic Regression",
    category: "Core ML",
    level: "beginner",
    estimatedDays: 4,
    description:
      "The foundation algorithms. Linear regression for continuous output, logistic regression for binary classification. Understand these deeply before moving on.",
    resources: [
      {
        type: "playlist",
        label: "Regression — StatQuest full playlist",
        url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUIzaEkCLIUxQFjPIlapw8nU",
        note: "Josh Starmer makes regression crystal clear.",
      },
      {
        type: "video",
        label: "Logistic Regression from Scratch — Sentdex",
        url: "https://www.youtube.com/watch?v=XnknSUs9mCU",
        note: "Code it yourself to truly understand it.",
      },
      {
        type: "article",
        label: "Logistic Regression — Towards Data Science",
        url: "https://towardsdatascience.com/logistic-regression-detailed-overview-46c4da4303bc",
        note: "Deep mathematical breakdown.",
      },
    ],
  },
  {
    id: "c002",
    title: "Decision Trees & Ensembles",
    category: "Core ML",
    level: "beginner",
    estimatedDays: 5,
    description:
      "Decision trees, Random Forests, Gradient Boosting, XGBoost, LightGBM. These win most structured-data competitions.",
    resources: [
      {
        type: "playlist",
        label: "Decision Trees — StatQuest",
        url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUKAtDViTvRGFpphEc24M-QH",
        note: "Every aspect of trees explained visually.",
      },
      {
        type: "video",
        label: "XGBoost — StatQuest full series",
        url: "https://www.youtube.com/watch?v=OtD8wVaFm6E",
        note: "20-minute masterclass on the algorithm behind most Kaggle winners.",
      },
      {
        type: "article",
        label: "Complete Guide to Gradient Boosting — ML Mastery",
        url: "https://machinelearningmastery.com/gentle-introduction-gradient-boosting-algorithm-machine-learning/",
        note: "From theory to code.",
      },
      {
        type: "practice",
        label: "House Prices — Kaggle Competition",
        url: "https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques",
        note: "Classic beginner dataset to practice trees.",
      },
    ],
  },
  {
    id: "c003",
    title: "Support Vector Machines",
    category: "Core ML",
    level: "intermediate",
    estimatedDays: 4,
    description:
      "SVM, kernel trick, margin maximization, soft margin classification. Important for small-data high-dimensional problems.",
    resources: [
      {
        type: "playlist",
        label: "SVM — StatQuest",
        url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUL3IJ4-yor0HzkqDQ3JmJkc",
        note: "StatQuest SVM series. Three videos, covers everything.",
      },
      {
        type: "video",
        label: "SVM with Python — Sentdex",
        url: "https://www.youtube.com/watch?v=Z9a_Bjo2-zQ",
        note: "Implementation walkthrough from scratch.",
      },
      {
        type: "article",
        label: "Understanding SVM — Towards Data Science",
        url: "https://towardsdatascience.com/support-vector-machine-introduction-to-machine-learning-algorithms-934a444fca47",
        note: "Math + intuition + code.",
      },
    ],
  },
  {
    id: "c004",
    title: "Clustering Algorithms",
    category: "Core ML",
    level: "beginner",
    estimatedDays: 3,
    description:
      "K-Means, DBSCAN, hierarchical clustering. Unsupervised learning — find structure when you have no labels.",
    resources: [
      {
        type: "playlist",
        label: "Clustering — StatQuest playlist",
        url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUJo2Q6xK4tZElbIvAACEykp",
        note: "K-Means, hierarchical, all explained clearly.",
      },
      {
        type: "video",
        label: "DBSCAN Clustering — Normalized Nerd",
        url: "https://www.youtube.com/watch?v=C3r7tGRe2eI",
        note: "Best visual explanation of DBSCAN.",
      },
      {
        type: "article",
        label: "Clustering with Scikit-learn — Official Docs",
        url: "https://scikit-learn.org/stable/modules/clustering.html",
        note: "Covers every algorithm with visual examples.",
      },
    ],
  },
  {
    id: "c005",
    title: "Model Evaluation & Metrics",
    category: "Core ML",
    level: "beginner",
    estimatedDays: 4,
    description:
      "Accuracy, precision, recall, F1, ROC-AUC, confusion matrix, cross-validation, bias-variance tradeoff.",
    resources: [
      {
        type: "playlist",
        label: "Model Evaluation — StatQuest",
        url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF",
        note: "ROC, AUC, confusion matrix all covered.",
      },
      {
        type: "video",
        label: "Bias Variance Tradeoff — StatQuest",
        url: "https://www.youtube.com/watch?v=EuBBz3bI-aA",
        note: "The most important concept in ML, explained simply.",
      },
      {
        type: "article",
        label: "Complete Guide to Model Evaluation — Neptune.ai",
        url: "https://neptune.ai/blog/ml-model-evaluation-and-validation",
        note: "Comprehensive, covers classification + regression.",
      },
    ],
  },
  {
    id: "c006",
    title: "Regularization Techniques",
    category: "Core ML",
    level: "intermediate",
    estimatedDays: 3,
    description:
      "L1 (Lasso), L2 (Ridge), Elastic Net, Dropout. Prevent overfitting — the most common ML problem.",
    resources: [
      {
        type: "video",
        label: "Regularization — StatQuest",
        url: "https://www.youtube.com/watch?v=Q81RR3yKn30",
        note: "Ridge & Lasso explained in 20 minutes.",
      },
      {
        type: "article",
        label: "Regularization in ML — Towards Data Science",
        url: "https://towardsdatascience.com/regularization-in-machine-learning-76441ddcf99a",
        note: "L1 vs L2 with intuition and code.",
      },
    ],
  },
  {
    id: "c007",
    title: "Hyperparameter Tuning",
    category: "Core ML",
    level: "intermediate",
    estimatedDays: 3,
    description:
      "Grid search, random search, Bayesian optimization, Optuna, cross-validation strategies.",
    resources: [
      {
        type: "video",
        label: "Hyperparameter Tuning with Optuna — Abhishek Thakur",
        url: "https://www.youtube.com/watch?v=5nYqK-HaoKY",
        note: "Modern tuning with Optuna from a Kaggle Grandmaster.",
      },
      {
        type: "article",
        label: "Hyperparameter Tuning — ML Mastery",
        url: "https://machinelearningmastery.com/hyperparameter-optimization-with-random-search-and-grid-search/",
        note: "Grid vs random search with sklearn.",
      },
      {
        type: "docs",
        label: "Optuna Official Docs",
        url: "https://optuna.readthedocs.io/en/stable/",
        note: "Best modern HPO library.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // DEEP LEARNING
  // ═══════════════════════════════════════════════════
  {
    id: "dl001",
    title: "Neural Networks Basics",
    category: "Deep Learning",
    level: "intermediate",
    estimatedDays: 6,
    description:
      "Perceptron, activation functions, forward pass, loss functions, backpropagation. Build your first neural network from scratch.",
    resources: [
      {
        type: "playlist",
        label: "Neural Networks — 3Blue1Brown",
        url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
        note: "4 videos. The best possible starting point for neural nets.",
      },
      {
        type: "video",
        label: "Build Neural Net from Scratch — Andrej Karpathy (micrograd)",
        url: "https://www.youtube.com/watch?v=VMj-3S1tku0",
        note: "2.5-hour masterclass. Builds backprop from zero.",
      },
      {
        type: "playlist",
        label: "Deep Learning — MIT 6.S191",
        url: "https://www.youtube.com/playlist?list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI",
        note: "MIT's official intro to deep learning. Free on YouTube.",
      },
      {
        type: "book",
        label: "Neural Networks and Deep Learning — Michael Nielsen (free)",
        url: "http://neuralnetworksanddeeplearning.com/",
        note: "The best free online book for understanding NNs deeply.",
      },
    ],
  },
  {
    id: "dl002",
    title: "PyTorch",
    category: "Deep Learning",
    level: "intermediate",
    estimatedDays: 7,
    description:
      "Tensors, autograd, building models with nn.Module, training loops, GPU usage. The dominant research framework.",
    resources: [
      {
        type: "playlist",
        label: "PyTorch for Deep Learning — freeCodeCamp",
        url: "https://www.youtube.com/watch?v=V_xro1bcAuA",
        note: "26-hour full course. Comprehensive from zero.",
      },
      {
        type: "playlist",
        label: "PyTorch Tutorial — Patrick Loeber",
        url: "https://www.youtube.com/playlist?list=PLqnslRFeH2UrcDBWF5mfPGpqQDSta6VK4",
        note: "Fast, practical, code-focused.",
      },
      {
        type: "docs",
        label: "PyTorch Official Tutorials",
        url: "https://pytorch.org/tutorials/",
        note: "Official tutorials are excellent quality.",
      },
      {
        type: "practice",
        label: "Zero to Mastery PyTorch — Daniel Bourke (free)",
        url: "https://www.learnpytorch.io/",
        note: "Opinionated, practical, free website.",
      },
    ],
  },
  {
    id: "dl003",
    title: "Convolutional Neural Networks (CNNs)",
    category: "Deep Learning",
    level: "intermediate",
    estimatedDays: 6,
    description:
      "Convolutions, pooling, architectures (AlexNet, VGG, ResNet, EfficientNet), transfer learning.",
    resources: [
      {
        type: "video",
        label: "CNN Explained — 3Blue1Brown",
        url: "https://www.youtube.com/watch?v=KuXjwB4LzSA",
        note: "Visual intuition for convolutions.",
      },
      {
        type: "video",
        label: "CNN Architecture Overview — Andrej Karpathy (CS231n)",
        url: "https://www.youtube.com/watch?v=NfnWJUyUJYU",
        note: "Lecture from Stanford's legendary CS231n.",
      },
      {
        type: "course",
        label: "CS231n: CNN for Visual Recognition — Stanford (free)",
        url: "https://cs231n.github.io/",
        note: "Full Stanford course, notes + lectures free online.",
      },
      {
        type: "video",
        label: "Transfer Learning with PyTorch — Aladdin Persson",
        url: "https://www.youtube.com/watch?v=qaDe0qQZ5AQ",
        note: "Practical guide to using pretrained models.",
      },
    ],
  },
  {
    id: "dl004",
    title: "Recurrent Neural Networks & LSTMs",
    category: "Deep Learning",
    level: "intermediate",
    estimatedDays: 5,
    description:
      "RNN, LSTM, GRU, sequence modelling, time-series with deep learning. Predecessor to transformers.",
    resources: [
      {
        type: "video",
        label: "RNN & LSTM — StatQuest",
        url: "https://www.youtube.com/watch?v=AsNTP8Kwu80",
        note: "Intuitive visual explanation of LSTMs.",
      },
      {
        type: "article",
        label: "Understanding LSTM — colah's blog",
        url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
        note: "The definitive LSTM explanation. A classic read.",
      },
      {
        type: "video",
        label: "Sequence Models — deeplearning.ai Coursera",
        url: "https://www.youtube.com/playlist?list=PLkDaE6sCZn6F6wUI9tvS_Gw1vaFAx6rd6",
        note: "Andrew Ng's lectures on sequence models.",
      },
    ],
  },
  {
    id: "dl005",
    title: "Training Deep Networks",
    category: "Deep Learning",
    level: "intermediate",
    estimatedDays: 4,
    description:
      "Batch normalisation, weight initialisation, learning rate schedules, gradient clipping, mixed precision training.",
    resources: [
      {
        type: "video",
        label: "Batch Normalisation — DeepLearning.AI",
        url: "https://www.youtube.com/watch?v=nUUqwaxLnWs",
        note: "Andrew Ng explains batch norm clearly.",
      },
      {
        type: "article",
        label: "Practical Deep Learning Tips — Fast.ai",
        url: "https://www.fast.ai/posts/2018-07-02-adam-weight-decay.html",
        note: "Jeremy Howard's practical training tips.",
      },
      {
        type: "article",
        label: "A Recipe for Training NNs — Andrej Karpathy",
        url: "https://karpathy.github.io/2019/04/25/recipe/",
        note: "Essential read. Save this for whenever your model doesn't train.",
      },
    ],
  },
  {
    id: "dl006",
    title: "Generative Models (GANs & VAEs)",
    category: "Deep Learning",
    level: "advanced",
    estimatedDays: 5,
    description:
      "Generative Adversarial Networks, Variational Autoencoders, diffusion models. Generate images, audio, and more.",
    resources: [
      {
        type: "video",
        label: "GANs — Computerphile",
        url: "https://www.youtube.com/watch?v=Sw9r8CL98N0",
        note: "Gentle intro to GANs for beginners.",
      },
      {
        type: "video",
        label: "VAE Explained — Arxiv Insights",
        url: "https://www.youtube.com/watch?v=fcvYpzHmhvA",
        note: "Best explanation of variational autoencoders.",
      },
      {
        type: "article",
        label: "The Illustrated DDPM — Hugging Face Blog",
        url: "https://huggingface.co/blog/annotated-diffusion",
        note: "Annotated diffusion model from scratch.",
      },
      {
        type: "course",
        label: "GAN Specialization — Coursera deeplearning.ai",
        url: "https://www.coursera.org/specializations/generative-adversarial-networks-gans",
        note: "3-course specialization on GANs.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // NLP
  // ═══════════════════════════════════════════════════
  {
    id: "n001",
    title: "NLP Fundamentals",
    category: "NLP",
    level: "beginner",
    estimatedDays: 4,
    description:
      "Tokenisation, stemming, lemmatisation, bag-of-words, TF-IDF, word embeddings (Word2Vec, GloVe).",
    resources: [
      {
        type: "course",
        label: "NLP with Python — NLTK Book (free)",
        url: "https://www.nltk.org/book/",
        note: "Classic free book, Python + NLTK.",
      },
      {
        type: "video",
        label: "NLP Zero to Hero — TensorFlow YouTube",
        url: "https://www.youtube.com/playlist?list=PLQY2H8rRoyvzDbLUZkbudP-MFQZwNmU4S",
        note: "Practical NLP series from TF team.",
      },
      {
        type: "video",
        label: "Word2Vec — StatQuest",
        url: "https://www.youtube.com/watch?v=viZrOnJclY0",
        note: "Word embeddings explained from scratch.",
      },
    ],
  },
  {
    id: "n002",
    title: "Transformer Architecture",
    category: "NLP",
    level: "intermediate",
    estimatedDays: 6,
    description:
      "Attention mechanism, multi-head attention, positional encoding, encoder-decoder architecture, BERT, GPT.",
    resources: [
      {
        type: "article",
        label: "The Illustrated Transformer — Jay Alammar",
        url: "https://jalammar.github.io/illustrated-transformer/",
        note: "THE definitive visual guide to transformers. Read this first.",
      },
      {
        type: "video",
        label: "Attention is All You Need — Yannic Kilcher",
        url: "https://www.youtube.com/watch?v=iDulhoQ2pro",
        note: "Paper walkthrough of the original transformer paper.",
      },
      {
        type: "video",
        label: "Let's Build GPT — Andrej Karpathy",
        url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
        note: "2-hour masterclass building a GPT from scratch. A must-watch.",
      },
      {
        type: "article",
        label: "The Illustrated BERT — Jay Alammar",
        url: "https://jalammar.github.io/illustrated-bert/",
        note: "BERT explained with the same visual style.",
      },
    ],
  },
  {
    id: "n003",
    title: "Hugging Face & Modern NLP",
    category: "NLP",
    level: "intermediate",
    estimatedDays: 5,
    description:
      "Using pretrained models, fine-tuning BERT/GPT, Hugging Face Transformers library, datasets library, tokenizers.",
    resources: [
      {
        type: "course",
        label: "Hugging Face NLP Course (free)",
        url: "https://huggingface.co/learn/nlp-course/chapter1/1",
        note: "Official HF course. The best starting point for modern NLP.",
      },
      {
        type: "video",
        label: "Fine-tuning BERT — Abhishek Thakur",
        url: "https://www.youtube.com/watch?v=hinZO--TEk4",
        note: "Practical fine-tuning from a Kaggle Grandmaster.",
      },
      {
        type: "docs",
        label: "Transformers Library Docs — HuggingFace",
        url: "https://huggingface.co/docs/transformers/index",
        note: "Excellent documentation with examples.",
      },
    ],
  },
  {
    id: "n004",
    title: "Large Language Models (LLMs)",
    category: "NLP",
    level: "advanced",
    estimatedDays: 7,
    description:
      "GPT architecture, pretraining, RLHF, prompt engineering, RAG, fine-tuning LLMs, LangChain.",
    resources: [
      {
        type: "video",
        label: "Intro to LLMs — Andrej Karpathy",
        url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
        note: "1-hour talk from the best teacher in the field.",
      },
      {
        type: "course",
        label: "LangChain for LLM Apps — DeepLearning.AI (free)",
        url: "https://learn.deeplearning.ai/langchain",
        note: "Short, free, practical LangChain course.",
      },
      {
        type: "article",
        label: "Prompt Engineering Guide — promptingguide.ai",
        url: "https://www.promptingguide.ai/",
        note: "Comprehensive prompt engineering resource.",
      },
      {
        type: "video",
        label: "RAG Explained — IBM Technology",
        url: "https://www.youtube.com/watch?v=T-D1OfcDW1M",
        note: "Clear explanation of Retrieval Augmented Generation.",
      },
      {
        type: "course",
        label: "Fine-tuning LLMs — DeepLearning.AI",
        url: "https://learn.deeplearning.ai/finetuning-large-language-models",
        note: "Free short course on LLM fine-tuning.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // COMPUTER VISION
  // ═══════════════════════════════════════════════════
  {
    id: "cv001",
    title: "Computer Vision Basics",
    category: "Computer Vision",
    level: "beginner",
    estimatedDays: 4,
    description:
      "Image representation, colour spaces, basic transformations with OpenCV, image augmentation.",
    resources: [
      {
        type: "course",
        label: "OpenCV Python Course — freeCodeCamp",
        url: "https://www.youtube.com/watch?v=oXlwWbU8l2o",
        note: "3-hour complete OpenCV course.",
      },
      {
        type: "course",
        label: "CS231n Notes — Stanford",
        url: "https://cs231n.github.io/",
        note: "Best computer vision course ever made. Free notes.",
      },
      {
        type: "video",
        label: "Image Augmentation — Albumentations Tutorial",
        url: "https://www.youtube.com/watch?v=rAdLwKJBvPM",
        note: "The best augmentation library for CV.",
      },
    ],
  },
  {
    id: "cv002",
    title: "Object Detection & Segmentation",
    category: "Computer Vision",
    level: "advanced",
    estimatedDays: 6,
    description:
      "YOLO, Faster R-CNN, Mask R-CNN, semantic vs instance segmentation, anchor boxes.",
    resources: [
      {
        type: "video",
        label: "YOLO Explained — Aladdin Persson",
        url: "https://www.youtube.com/watch?v=n9_XyCGr-MI",
        note: "Clear YOLO architecture walkthrough.",
      },
      {
        type: "video",
        label: "Object Detection Overview — Yannic Kilcher",
        url: "https://www.youtube.com/watch?v=5e5pjeojznk",
        note: "History and intuition of detection models.",
      },
      {
        type: "practice",
        label: "Roboflow — Object Detection Projects",
        url: "https://roboflow.com/",
        note: "Dataset tools + tutorials for detection tasks.",
      },
    ],
  },
  {
    id: "cv003",
    title: "Vision Transformers (ViT)",
    category: "Computer Vision",
    level: "advanced",
    estimatedDays: 4,
    description:
      "ViT, CLIP, DINO — applying transformer architecture to image tasks.",
    resources: [
      {
        type: "video",
        label: "Vision Transformer (ViT) Paper Explained — Yannic Kilcher",
        url: "https://www.youtube.com/watch?v=TrdevFK_am4",
        note: "Paper walkthrough of the original ViT paper.",
      },
      {
        type: "article",
        label: "CLIP Explained — ML Explained",
        url: "https://mlexplained.ai/clip",
        note: "CLIP multimodal model explained clearly.",
      },
      {
        type: "video",
        label: "ViT with PyTorch — Aladdin Persson",
        url: "https://www.youtube.com/watch?v=ovB0ddFtzzA",
        note: "Implementation from scratch.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // REINFORCEMENT LEARNING
  // ═══════════════════════════════════════════════════
  {
    id: "r001",
    title: "RL Fundamentals",
    category: "Reinforcement Learning",
    level: "intermediate",
    estimatedDays: 6,
    description:
      "Markov Decision Processes, reward, policy, value functions, Q-learning, exploration vs exploitation.",
    resources: [
      {
        type: "course",
        label: "Intro to RL — David Silver (DeepMind) lectures",
        url: "https://www.youtube.com/playlist?list=PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ",
        note: "The best RL lecture series ever. 10 videos, deeply rigorous.",
      },
      {
        type: "course",
        label: "Spinning Up in Deep RL — OpenAI",
        url: "https://spinningup.openai.com/en/latest/",
        note: "Free resource from OpenAI. Theory + code.",
      },
      {
        type: "video",
        label: "Q-Learning — StatQuest",
        url: "https://www.youtube.com/watch?v=0iqz4tcKN58",
        note: "Gentle introduction to Q-learning.",
      },
    ],
  },
  {
    id: "r002",
    title: "Deep Reinforcement Learning",
    category: "Reinforcement Learning",
    level: "advanced",
    estimatedDays: 7,
    description:
      "DQN, Policy Gradient, PPO, Actor-Critic methods. Training agents to play games and control robots.",
    resources: [
      {
        type: "video",
        label: "Deep RL Bootcamp — Berkeley (2017)",
        url: "https://www.youtube.com/playlist?list=PLAdk-EyP1ND8MqJEJnSvaoUShrAWYe51U",
        note: "Legendary bootcamp lectures. Still relevant.",
      },
      {
        type: "article",
        label: "Lilian Weng RL Blog Posts",
        url: "https://lilianweng.github.io/lil-log/",
        note: "Deep technical blog by OpenAI researcher. Best RL writing online.",
      },
      {
        type: "practice",
        label: "Gymnasium (OpenAI Gym) — Farama Foundation",
        url: "https://gymnasium.farama.org/",
        note: "Standard environments for RL practice.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // MLOPS & DEPLOYMENT
  // ═══════════════════════════════════════════════════
  {
    id: "o001",
    title: "ML Project Structure & Best Practices",
    category: "MLOps & Deployment",
    level: "intermediate",
    estimatedDays: 3,
    description:
      "Reproducibility, experiment tracking, code organisation, virtual environments, version control for ML.",
    resources: [
      {
        type: "video",
        label: "ML Project Structure — Patrick Loeber",
        url: "https://www.youtube.com/watch?v=L8ypSXwyBds",
        note: "Real-world ML project setup.",
      },
      {
        type: "article",
        label: "Cookiecutter Data Science — drivendata",
        url: "https://drivendata.github.io/cookiecutter-data-science/",
        note: "Industry-standard ML project template.",
      },
    ],
  },
  {
    id: "o002",
    title: "Experiment Tracking with MLflow / W&B",
    category: "MLOps & Deployment",
    level: "intermediate",
    estimatedDays: 3,
    description:
      "Logging metrics, hyperparameters, models. MLflow and Weights & Biases for experiment management.",
    resources: [
      {
        type: "video",
        label: "MLflow Tutorial — Krish Naik",
        url: "https://www.youtube.com/watch?v=-ESce5M5vEo",
        note: "Complete MLflow walkthrough.",
      },
      {
        type: "docs",
        label: "Weights & Biases Quickstart",
        url: "https://docs.wandb.ai/quickstart",
        note: "W&B is the industry standard for experiment tracking.",
      },
      {
        type: "video",
        label: "W&B Tutorial — Weights & Biases YouTube",
        url: "https://www.youtube.com/watch?v=gbCGMaGDTrY",
        note: "Official tutorial from W&B team.",
      },
    ],
  },
  {
    id: "o003",
    title: "Model Deployment with FastAPI & Docker",
    category: "MLOps & Deployment",
    level: "intermediate",
    estimatedDays: 5,
    description:
      "Serving models as REST APIs, containerising with Docker, basics of cloud deployment (AWS/GCP/HuggingFace Spaces).",
    resources: [
      {
        type: "video",
        label: "FastAPI for ML — Patrick Loeber",
        url: "https://www.youtube.com/watch?v=kCkpNqHaT0A",
        note: "Serve your first ML model as an API.",
      },
      {
        type: "video",
        label: "Docker for ML Engineers — Abhishek Thakur",
        url: "https://www.youtube.com/watch?v=0H2miBK_gAk",
        note: "Practical Docker for ML.",
      },
      {
        type: "article",
        label: "Deploy ML Model on HuggingFace Spaces (free)",
        url: "https://huggingface.co/docs/hub/spaces-overview",
        note: "Free hosting for ML demos with Gradio/Streamlit.",
      },
    ],
  },
  {
    id: "o004",
    title: "Model Monitoring & Drift Detection",
    category: "MLOps & Deployment",
    level: "advanced",
    estimatedDays: 3,
    description:
      "Data drift, model drift, monitoring pipelines in production, Evidently AI.",
    resources: [
      {
        type: "article",
        label: "ML Monitoring Guide — Evidently AI Blog",
        url: "https://www.evidentlyai.com/blog/machine-learning-monitoring-data-and-concept-drift",
        note: "Best practical guide on monitoring.",
      },
      {
        type: "docs",
        label: "Evidently AI Docs",
        url: "https://docs.evidentlyai.com/",
        note: "Open-source model monitoring library.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // ADVANCED TOPICS
  // ═══════════════════════════════════════════════════
  {
    id: "a001",
    title: "Graph Neural Networks",
    category: "Advanced Topics",
    level: "advanced",
    estimatedDays: 5,
    description:
      "GCN, GAT, GraphSAGE — learning on graph-structured data. Social networks, molecules, knowledge graphs.",
    resources: [
      {
        type: "course",
        label: "CS224W: ML with Graphs — Stanford (free)",
        url: "https://web.stanford.edu/class/cs224w/",
        note: "Best GNN course available. Notes + lectures free.",
      },
      {
        type: "video",
        label: "Graph Neural Networks — DeepMind",
        url: "https://www.youtube.com/watch?v=uF53xsT7mjc",
        note: "Gentle conceptual intro to GNNs.",
      },
      {
        type: "article",
        label: "A Gentle Intro to GNNs — distill.pub",
        url: "https://distill.pub/2021/gnn-intro/",
        note: "Interactive, beautiful, comprehensive.",
      },
    ],
  },
  {
    id: "a002",
    title: "Self-Supervised & Contrastive Learning",
    category: "Advanced Topics",
    level: "advanced",
    estimatedDays: 4,
    description:
      "SimCLR, MoCo, BYOL, masked autoencoders. Learning representations without labels.",
    resources: [
      {
        type: "video",
        label: "Self-Supervised Learning Overview — Yannic Kilcher",
        url: "https://www.youtube.com/watch?v=YPfUiOMYOEE",
        note: "State of the field explained.",
      },
      {
        type: "article",
        label: "The Illustrated SimCLR — Jay Alammar",
        url: "https://amitness.com/2020/03/illustrated-simclr/",
        note: "Visual walkthrough of contrastive learning.",
      },
    ],
  },
  {
    id: "a003",
    title: "ML System Design",
    category: "Advanced Topics",
    level: "advanced",
    estimatedDays: 6,
    description:
      "Designing end-to-end ML systems for production — recommendation engines, search, ranking, real-time inference.",
    resources: [
      {
        type: "book",
        label: "Designing ML Systems — Chip Huyen",
        url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",
        note: "The definitive ML systems design book.",
      },
      {
        type: "article",
        label: "ML Systems Design — Chip Huyen's newsletter",
        url: "https://huyenchip.com/",
        note: "Free blog from the same author. Must follow.",
      },
      {
        type: "video",
        label: "ML System Design Interview — Exponent",
        url: "https://www.youtube.com/watch?v=qDpRJFIt2ec",
        note: "If you want to apply this to interviews too.",
      },
    ],
  },
  {
    id: "a004",
    title: "Responsible AI & Ethics",
    category: "Advanced Topics",
    level: "intermediate",
    estimatedDays: 3,
    description:
      "Bias, fairness, interpretability (SHAP, LIME), model explainability, AI safety basics.",
    resources: [
      {
        type: "course",
        label: "Practical Deep Learning Fairness — fast.ai",
        url: "https://course.fast.ai/Lessons/lesson7.html",
        note: "Practical ethics integrated into ML.",
      },
      {
        type: "article",
        label: "Interpretable ML Book — Christoph Molnar (free)",
        url: "https://christophm.github.io/interpretable-ml-book/",
        note: "Free book on all interpretability techniques.",
      },
      {
        type: "video",
        label: "SHAP Values Explained — StatQuest",
        url: "https://www.youtube.com/watch?v=VB9uV-x0gtg",
        note: "Clear SHAP explanation with examples.",
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function groupTopicsByCategory(topics) {
  return topics.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});
}

export function getTotalDays(topics) {
  return topics.reduce((sum, t) => sum + t.estimatedDays, 0);
}

export const RESOURCE_TYPE_META = {
  video: { label: "Video", icon: "▶", color: "#e05252" },
  playlist: { label: "Playlist", icon: "☰", color: "#e07832" },
  course: { label: "Course", icon: "🎓", color: "#5b8def" },
  article: { label: "Article", icon: "📄", color: "#4caf7d" },
  book: { label: "Book", icon: "📖", color: "#9b72cf" },
  docs: { label: "Docs", icon: "⚙", color: "#3bbdbd" },
  practice: { label: "Practice", icon: "✏", color: "#d4b44a" },
};
