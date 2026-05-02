(function () {
  const TASKS_KEY = "operon_agent_tasks_v1";
  const QUEUE_KEY = "operon_task_queue_v1";
  const RUN_MODE_LIMITS = {
    default: 3,
    long: 10,
    overnight: 25
  };
  const ACTIVE_STATUSES = {
    pending: true,
    todo: true,
    next_batch: true,
    in_progress: true
  };
  const CATEGORY_WEIGHTS = {
    conversion: 1.6,
    seo: 1.2,
    content: 1.1,
    backlink: 0.68,
    analytics: 0.85,
    pricing: 0.8,
    technical: 0.75
  };

  function createUuid() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (char) {
      const random = Math.random() * 16 | 0;
      const value = char === "x" ? random : (random & 0x3 | 0x8);
      return value.toString(16);
    });
  }

  function scoreTask(task) {
    const baseScore = ((task.impact_score || 0) * (task.confidence_score || 0)) / Math.max(task.effort_score || 1, 1);
    const weightedScore = baseScore * (CATEGORY_WEIGHTS[task.category] || 1);
    return Number(weightedScore.toFixed(2));
  }

  function readTasks() {
    try {
      return JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeTasks(tasks) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }

  function readQueue() {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeQueue(tasks) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(tasks));
  }

  function normaliseQueuePayload(payload) {
    const tasks = Array.isArray(payload) ? payload : ((payload && payload.tasks) || []);
    return tasks.filter(Boolean);
  }

  function getRunLimit(modeOrLimit) {
    if (typeof modeOrLimit === "number") {
      return Math.max(Math.floor(modeOrLimit), 1);
    }
    if (typeof modeOrLimit === "string" && RUN_MODE_LIMITS[modeOrLimit]) {
      return RUN_MODE_LIMITS[modeOrLimit];
    }
    if (modeOrLimit && typeof modeOrLimit === "object") {
      if (typeof modeOrLimit.limit === "number") {
        return getRunLimit(modeOrLimit.limit);
      }
      if (modeOrLimit.mode) {
        return getRunLimit(modeOrLimit.mode);
      }
    }
    return RUN_MODE_LIMITS.default;
  }

  function getRankedPendingTasks(tasks) {
    return normaliseQueuePayload(tasks).filter(function (task) {
      return ACTIVE_STATUSES[task.status || "pending"];
    }).sort(function (first, second) {
      const firstScore = Number(first.priority_score) || 0;
      const secondScore = Number(second.priority_score) || 0;
      return secondScore - firstScore;
    });
  }

  async function loadBacklogFromUrl(url) {
    const response = await fetch(url || "task_queue.json");
    const payload = await response.json();
    const queue = normaliseQueuePayload(payload);
    if (queue.length) {
      writeQueue(queue.map(function (task) {
        return Object.assign({ source: "task_queue_json" }, task);
      }));
    }
    return queue;
  }

  function getBaseTasks(projectState) {
    const state = projectState || {};
    return [
      {
        title: "Improve Step 4 measurement completion rate",
        category: "conversion",
        impact_score: 9,
        effort_score: 4,
        confidence_score: 8,
        assigned_agent: "cro",
        reason: "Measurement choice is one of the highest-friction points in the quote funnel.",
        expected_impact: "More quote starts progress from area selection into extras and submission."
      },
      {
        title: "Expand suburb coverage for higher-demand Sydney locations",
        category: "seo",
        impact_score: 9,
        effort_score: 5,
        confidence_score: 8,
        assigned_agent: "seo",
        reason: "The suburb SEO system is now established and needs broader geographic coverage to capture more local quote intent.",
        expected_impact: "More high-intent local landing pages and wider Sydney suburb relevance."
      },
      {
        title: "Track quote abandonment at the area step",
        category: "analytics",
        impact_score: 8,
        effort_score: 3,
        confidence_score: 9,
        assigned_agent: "builder",
        reason: "Step 4 is likely a friction point and needs direct visibility.",
        expected_impact: "Better visibility into where leads are leaking."
      },
      {
        title: "Deepen local differentiation on remaining suburb pages",
        category: "content",
        impact_score: 8,
        effort_score: 4,
        confidence_score: 7,
        assigned_agent: "seo",
        reason: "The strongest suburb pages now set a higher standard that the remaining local pages should match.",
        expected_impact: "Stronger local rankings and better suburb relevance."
      },
      {
        title: "Add backlink target: TrueLocal",
        category: "backlink",
        impact_score: 7,
        effort_score: 2,
        confidence_score: 9,
        assigned_agent: "seo",
        reason: "Local citation gains are fast and commercially relevant.",
        expected_impact: "Better local trust signals and citation coverage."
      },
      {
        title: "Add revenue status update workflow to admin page",
        category: "pricing",
        impact_score: 9,
        effort_score: 5,
        confidence_score: 7,
        assigned_agent: "revenue",
        reason: "Lead-to-revenue visibility is required to optimise for profit, not just traffic.",
        expected_impact: "Clearer view of win rate, revenue and margin."
      },
      {
        title: "Strengthen blog-to-suburb and suburb-to-product internal linking",
        category: "seo",
        impact_score: 7,
        effort_score: 3,
        confidence_score: 8,
        assigned_agent: "seo",
        reason: "The product, suburb and blog pages now need tighter internal-link paths to pass relevance cleanly.",
        expected_impact: "Better crawl paths and stronger topical clustering around money pages."
      },
      {
        title: "Seed supplier backlink outreach list",
        category: "backlink",
        impact_score: 7,
        effort_score: 3,
        confidence_score: 8,
        assigned_agent: "seo",
        reason: "Supplier and installer-partner links are directly relevant and realistic.",
        expected_impact: "More relevant backlinks and referral opportunities."
      },
      {
        title: "Audit mobile quote summary visibility",
        category: "technical",
        impact_score: 7,
        effort_score: 3,
        confidence_score: 7,
        assigned_agent: "cro",
        reason: "Mobile users need clear totals and reassurance without friction.",
        expected_impact: "Better mobile completion and more confident submissions."
      },
      {
        title: "Strengthen footer and support-page conversion cues",
        category: "conversion",
        impact_score: 6,
        effort_score: 3,
        confidence_score: 7,
        assigned_agent: "cro",
        reason: "Users who do not convert immediately still need clear re-entry points into the quote flow.",
        expected_impact: "More supporting-page visitors return to the main quote funnel."
      }
    ].map(function (task) {
      return Object.assign({
        id: createUuid(),
        created_at: new Date().toISOString(),
        status: "todo",
        priority_score: 0
      }, task);
    }).map(function (task) {
      task.priority_score = scoreTask(task);
      if (state.totalQuotes > 0 && task.title === "Add revenue status update workflow to admin page") {
        task.priority_score += 2;
      }
      return task;
    });
  }

  function generateNextTasks(projectState) {
    const tasks = getBaseTasks(projectState).sort(function (first, second) {
      return second.priority_score - first.priority_score;
    }).slice(0, 10);
    writeTasks(tasks);
    const existingQueue = readQueue();
    if (!existingQueue.length || existingQueue.every(function (task) { return task.source === "generated"; })) {
      writeQueue(tasks.map(function (task, index) {
        return {
          id: task.id,
          title: task.title,
          category: task.category,
          priority_score: task.priority_score,
          impact: task.expected_impact || "",
          status: index < 3 ? "next_batch" : "pending",
          source: "generated"
        };
      }));
    }
    return tasks;
  }

  function getExecutionBatch(modeOrLimit) {
    const queue = readQueue();
    return getRankedPendingTasks(queue).slice(0, getRunLimit(modeOrLimit));
  }

  window.OperonTaskEngine = {
    generateNextTasks: generateNextTasks,
    readTasks: readTasks,
    readQueue: readQueue,
    writeQueue: writeQueue,
    getExecutionBatch: getExecutionBatch,
    getRunLimit: getRunLimit,
    loadBacklogFromUrl: loadBacklogFromUrl,
    runModeLimits: Object.assign({}, RUN_MODE_LIMITS),
    scoreTask: scoreTask
  };
}());
