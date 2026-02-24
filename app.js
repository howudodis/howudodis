const tracks = {
  quiz: {
    title: "Practice Quizzes",
    description: "Quick questions to reinforce core MLO concepts.",
    questions: [
      {
        prompt: "What is the primary goal of MLOps?",
        options: [
          "Only model training speed",
          "Reliable deployment and lifecycle management for ML systems",
          "Replacing data engineers",
          "Avoiding model monitoring"
        ],
        answer: 1
      },
      {
        prompt: "Which metric is best to detect class imbalance impact?",
        options: ["Accuracy only", "F1-score", "CPU utilization", "Latency"],
        answer: 1
      },
      {
        prompt: "What should happen after model deployment?",
        options: [
          "Nothing, deployment is final",
          "Continuous monitoring and retraining triggers",
          "Delete training data",
          "Disable logs"
        ],
        answer: 1
      }
    ]
  },
  exam: {
    title: "Mock Exams",
    description: "Exam-style questions with a little more depth.",
    questions: [
      {
        prompt: "A model's data distribution shifts in production. Best first action?",
        options: [
          "Ignore unless users complain",
          "Validate drift with monitoring signals and evaluate on recent data",
          "Increase server memory",
          "Delete old model artifacts"
        ],
        answer: 1
      },
      {
        prompt: "Why use feature stores in ML systems?",
        options: [
          "For GPU acceleration",
          "To ensure consistent feature definitions across training and inference",
          "To remove CI/CD pipelines",
          "To replace version control"
        ],
        answer: 1
      },
      {
        prompt: "What does CI/CD in MLOps commonly include?",
        options: [
          "Manual retraining only",
          "Automated testing, packaging, and deployment of models/services",
          "Only frontend builds",
          "A single notebook"
        ],
        answer: 1
      },
      {
        prompt: "Best way to track experiments?",
        options: [
          "Rely on memory",
          "Use experiment tracking with metrics, params, and artifacts",
          "Store in random text files",
          "Don't track failed runs"
        ],
        answer: 1
      }
    ]
  },
  final: {
    title: "Final Test",
    description: "Comprehensive checkpoint before your official assessment.",
    questions: [
      {
        prompt: "Which practice most improves reproducibility?",
        options: [
          "Changing libraries frequently",
          "Pinning dependencies and versioning data + code",
          "Skipping random seeds",
          "Using local-only notebooks"
        ],
        answer: 1
      },
      {
        prompt: "Model latency rises after release. A strong response is to:",
        options: [
          "Disable monitoring",
          "Profile inference pipeline, optimize bottlenecks, and roll out safely",
          "Retrain without investigation",
          "Ignore if accuracy is stable"
        ],
        answer: 1
      },
      {
        prompt: "What is a model card used for?",
        options: [
          "Database schema migration",
          "Documenting model behavior, limitations, and intended use",
          "Cloud billing reports",
          "Hardware benchmark only"
        ],
        answer: 1
      },
      {
        prompt: "Why keep a holdout test set untouched?",
        options: [
          "To speed up training",
          "To estimate generalization without leakage",
          "To lower storage costs",
          "To replace validation sets"
        ],
        answer: 1
      },
      {
        prompt: "What should trigger retraining in production?",
        options: [
          "Any calendar date",
          "Observed drift/performance thresholds and business requirements",
          "Only new hardware",
          "User interface updates"
        ],
        answer: 1
      }
    ]
  }
};

const form = document.getElementById("question-form");
const titleEl = document.getElementById("section-title");
const descriptionEl = document.getElementById("section-description");
const resultEl = document.getElementById("result");
const submitBtn = document.getElementById("submit-btn");
const retryBtn = document.getElementById("retry-btn");
const attemptsEl = document.getElementById("attempts");
const bestScoreEl = document.getElementById("best-score");
const lastScoreEl = document.getElementById("last-score");

const progress = {
  attempts: 0,
  best: 0,
  last: null
};

let activeTrack = "quiz";

function renderQuestions(trackKey) {
  const track = tracks[trackKey];
  titleEl.textContent = track.title;
  descriptionEl.textContent = track.description;
  form.innerHTML = "";
  resultEl.className = "result";
  resultEl.textContent = "Select answers and submit when ready.";
  retryBtn.disabled = true;

  track.questions.forEach((question, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = `${index + 1}. ${question.prompt}`;
    fieldset.appendChild(legend);

    question.options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      label.className = "option";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `q-${index}`;
      radio.value = String(optionIndex);

      label.appendChild(radio);
      label.append(` ${option}`);
      fieldset.appendChild(label);
    });

    form.appendChild(fieldset);
  });
}

function updateProgress(score) {
  progress.attempts += 1;
  progress.last = score;
  progress.best = Math.max(progress.best, score);

  attemptsEl.textContent = `Attempts: ${progress.attempts}`;
  bestScoreEl.textContent = `Best Score: ${progress.best}%`;
  lastScoreEl.textContent = `Last Score: ${progress.last}%`;
}

submitBtn.addEventListener("click", () => {
  const { questions, title } = tracks[activeTrack];
  let correct = 0;

  questions.forEach((question, index) => {
    const selected = form.querySelector(`input[name="q-${index}"]:checked`);
    if (selected && Number(selected.value) === question.answer) {
      correct += 1;
    }
  });

  const score = Math.round((correct / questions.length) * 100);
  updateProgress(score);

  const passed = score >= 70;
  resultEl.className = `result ${passed ? "success" : "fail"}`;
  resultEl.innerHTML = `<strong>${title} Score: ${score}%</strong><br>${
    passed
      ? "Great work! You're on track for your MLO assessment."
      : "Keep practicing and review weak areas before moving on."
  }`;

  retryBtn.disabled = false;
});

retryBtn.addEventListener("click", () => {
  renderQuestions(activeTrack);
});

document.querySelectorAll(".track-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".track-btn")
      .forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    activeTrack = button.dataset.track;
    renderQuestions(activeTrack);
  });
});

renderQuestions(activeTrack);
