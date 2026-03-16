const mbtiQuestions = [
  {
    id: "q1",
    axis: "EI",
    options: [
      { key: "E", label: "사람들과 바로 어울릴 때 에너지가 오른다" },
      { key: "I", label: "혼자 정리할 시간이 있어야 컨디션이 회복된다" },
    ],
  },
  {
    id: "q2",
    axis: "SN",
    options: [
      { key: "S", label: "현실적인 정보와 구체적인 사례가 먼저 보인다" },
      { key: "N", label: "가능성과 패턴, 숨은 의미를 먼저 읽는다" },
    ],
  },
  {
    id: "q3",
    axis: "TF",
    options: [
      { key: "T", label: "판단할 때 원칙과 논리를 더 중시한다" },
      { key: "F", label: "판단할 때 사람의 감정과 관계를 더 본다" },
    ],
  },
  {
    id: "q4",
    axis: "JP",
    options: [
      { key: "J", label: "계획과 마감이 분명해야 마음이 편하다" },
      { key: "P", label: "열어두고 유연하게 움직일 때 효율이 난다" },
    ],
  },
  {
    id: "q5",
    axis: "EI",
    options: [
      { key: "E", label: "생각은 말하면서 정리되는 편이다" },
      { key: "I", label: "생각은 혼자 정리한 뒤 말하는 편이다" },
    ],
  },
  {
    id: "q6",
    axis: "SN",
    options: [
      { key: "S", label: "검증된 방법이 있으면 그걸 따르는 편이다" },
      { key: "N", label: "새로운 방식이 보이면 시험해보고 싶다" },
    ],
  },
  {
    id: "q7",
    axis: "TF",
    options: [
      { key: "T", label: "피드백은 솔직하고 정확해야 도움이 된다" },
      { key: "F", label: "피드백은 상대가 받아들일 수 있어야 의미 있다" },
    ],
  },
  {
    id: "q8",
    axis: "JP",
    options: [
      { key: "J", label: "일이 끝나야 쉰다는 느낌이 든다" },
      { key: "P", label: "중간중간 흐름을 바꾸며 일하는 편이 낫다" },
    ],
  },
];

const attachmentQuestions = [
  {
    id: "a1",
    axis: "anxiety",
    text: "상대의 반응이 늦으면 관계가 멀어지는 건 아닌지 걱정한다.",
  },
  {
    id: "a2",
    axis: "avoidance",
    text: "누군가 너무 가까워지면 부담스럽고 거리를 두고 싶어진다.",
  },
  {
    id: "a3",
    axis: "anxiety",
    text: "확신을 받아도 금방 다시 불안해질 때가 있다.",
  },
  {
    id: "a4",
    axis: "avoidance",
    text: "감정적으로 의지해야 하는 상황을 가능하면 피하려 한다.",
  },
  {
    id: "a5",
    axis: "anxiety",
    text: "상대의 작은 표정 변화에도 거절 신호를 읽으려는 편이다.",
  },
  {
    id: "a6",
    axis: "avoidance",
    text: "문제가 생기면 대화보다 혼자 정리하고 싶은 욕구가 강하다.",
  },
];

const mbtiDescriptions = {
  E: "외부 자극과 상호작용에서 추진력을 얻는 경향",
  I: "내부 정리와 집중에서 에너지를 회복하는 경향",
  S: "현실 정보와 경험 기반으로 판단하는 경향",
  N: "패턴과 가능성을 연결해 해석하는 경향",
  T: "논리와 일관성을 우선하는 판단 경향",
  F: "관계와 정서적 영향을 고려하는 판단 경향",
  J: "구조, 계획, 마감이 안정감을 주는 경향",
  P: "유연성, 탐색, 즉흥 조정이 자연스러운 경향",
};

const attachmentProfiles = {
  secure: {
    title: "비교적 안정형",
    summary:
      "불안과 회피 점수가 모두 낮은 편입니다. 친밀감과 자율성을 동시에 다루는 균형이 비교적 안정적입니다.",
  },
  anxious: {
    title: "불안 애착 경향",
    summary:
      "관계 단서에 민감하고 확인 욕구가 높을 수 있습니다. 애정 표현이 부족하다고 느끼면 빠르게 긴장할 가능성이 있습니다.",
  },
  avoidant: {
    title: "회피 애착 경향",
    summary:
      "가까워질수록 거리 조절 욕구가 커질 수 있습니다. 감정 교류보다 독립성과 자기 통제를 우선할 가능성이 있습니다.",
  },
  fearful: {
    title: "불안-회피 혼합 경향",
    summary:
      "가까워지고 싶지만 상처 가능성도 크게 경계하는 패턴입니다. 친밀감 욕구와 거리두기 반응이 동시에 나타날 수 있습니다.",
  },
};

const combinedInsights = {
  E: "관계 스트레스를 밖으로 표현하며 해소하려는 편일 수 있습니다.",
  I: "관계 스트레스가 생기면 혼자 정리한 뒤 접근하는 방식이 더 자연스러울 수 있습니다.",
  S: "상대의 행동과 실제 빈도 같은 구체적 단서에 반응하는 편일 수 있습니다.",
  N: "상황의 의미와 숨은 의도를 확대 해석하기 쉬울 수 있습니다.",
  T: "감정을 분석하고 구조화하려는 경향이 강할 수 있습니다.",
  F: "관계 분위기와 정서적 미세 신호의 영향을 크게 받을 수 있습니다.",
  J: "관계의 정의, 약속, 일관성이 중요하게 느껴질 가능성이 큽니다.",
  P: "감정 기복이 있어도 관계를 열어둔 채 흐름을 지켜보려는 편일 수 있습니다.",
};

function renderMbtiQuestions() {
  const form = document.getElementById("mbti-form");

  mbtiQuestions.forEach((question, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question-card";

    const legend = document.createElement("legend");
    legend.textContent = `${index + 1}. ${question.axis} 축 문항`;
    fieldset.appendChild(legend);

    const optionRow = document.createElement("div");
    optionRow.className = "option-row binary-options";

    question.options.forEach((option) => {
      const label = document.createElement("label");
      label.className = "choice";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = question.id;
      input.value = option.key;

      const span = document.createElement("span");
      span.textContent = option.label;

      label.appendChild(input);
      label.appendChild(span);
      optionRow.appendChild(label);
    });

    fieldset.appendChild(optionRow);
    form.appendChild(fieldset);
  });
}

function renderAttachmentQuestions() {
  const form = document.getElementById("attachment-form");
  const labels = ["전혀 아니다", "조금 아니다", "보통", "그렇다", "매우 그렇다"];

  attachmentQuestions.forEach((question, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question-card";

    const title = document.createElement("div");
    title.className = "question-title";
    title.textContent = `${index + 1}. ${question.text}`;
    fieldset.appendChild(title);

    const optionRow = document.createElement("div");
    optionRow.className = "option-row scale-options";

    labels.forEach((labelText, labelIndex) => {
      const label = document.createElement("label");
      label.className = "choice";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = question.id;
      input.value = String(labelIndex + 1);

      const span = document.createElement("span");
      span.textContent = `${labelIndex + 1}\n${labelText}`;

      label.appendChild(input);
      label.appendChild(span);
      optionRow.appendChild(label);
    });

    fieldset.appendChild(optionRow);
    form.appendChild(fieldset);
  });
}

function getMbtiResult() {
  const scores = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  for (const question of mbtiQuestions) {
    const selected = document.querySelector(`input[name="${question.id}"]:checked`);

    if (!selected) {
      return null;
    }

    scores[selected.value] += 1;
  }

  const mbti = [
    scores.E >= scores.I ? "E" : "I",
    scores.S >= scores.N ? "S" : "N",
    scores.T >= scores.F ? "T" : "F",
    scores.J >= scores.P ? "J" : "P",
  ].join("");

  const detail = mbti
    .split("")
    .map((letter) => mbtiDescriptions[letter])
    .join(" / ");

  return { mbti, detail };
}

function getAttachmentResult() {
  let anxiety = 0;
  let avoidance = 0;

  for (const question of attachmentQuestions) {
    const selected = document.querySelector(`input[name="${question.id}"]:checked`);

    if (!selected) {
      return null;
    }

    const value = Number(selected.value);

    if (question.axis === "anxiety") {
      anxiety += value;
    } else {
      avoidance += value;
    }
  }

  const normalizedAnxiety = anxiety / 3;
  const normalizedAvoidance = avoidance / 3;
  const highAnxiety = normalizedAnxiety >= 3.4;
  const highAvoidance = normalizedAvoidance >= 3.4;

  let profileKey = "secure";

  if (highAnxiety && highAvoidance) {
    profileKey = "fearful";
  } else if (highAnxiety) {
    profileKey = "anxious";
  } else if (highAvoidance) {
    profileKey = "avoidant";
  }

  return {
    profileKey,
    anxiety: normalizedAnxiety.toFixed(1),
    avoidance: normalizedAvoidance.toFixed(1),
    ...attachmentProfiles[profileKey],
  };
}

function buildCombinedAnalysis(mbti, attachment) {
  const letters = mbti.split("");
  const title = `${mbti} · ${attachment.title}`;

  let summary =
    "성격 선호와 관계 반응을 같이 보면, 스트레스 상황에서 왜 다른 사람과 어긋나는지 더 선명하게 읽을 수 있습니다.";

  if (attachment.profileKey === "anxious") {
    summary =
      "관계 안정성에 대한 민감도가 높은 편이라, MBTI의 기본 소통 방식이 확인 욕구와 결합될 가능성이 큽니다.";
  } else if (attachment.profileKey === "avoidant") {
    summary =
      "기본 성향 위에 거리 조절 욕구가 얹혀 있어서, 오해 없이 혼자 정리할 시간과 감정 대화의 균형이 중요합니다.";
  } else if (attachment.profileKey === "fearful") {
    summary =
      "가까워지고 싶은 욕구와 상처를 피하려는 반응이 동시에 작동할 수 있어, MBTI 성향보다 관계 안전감이 더 큰 변수가 될 수 있습니다.";
  }

  const points = letters.map((letter) => combinedInsights[letter]);
  points.push(
    `애착 점수는 불안 ${attachment.anxiety} / 회피 ${attachment.avoidance}로 집계되었습니다.`,
  );

  if (attachment.profileKey === "anxious") {
    points.push("관계 신호를 해석할 때 즉시 결론내리기보다 사실 확인 단계를 두는 것이 도움이 됩니다.");
  }

  if (attachment.profileKey === "avoidant") {
    points.push("거리두기 자체를 문제로 보기보다, 언제 혼자 정리하고 언제 다시 대화할지 합의하는 것이 효과적입니다.");
  }

  if (attachment.profileKey === "fearful") {
    points.push("끌림과 방어가 번갈아 나올 수 있으므로, 감정이 커질수록 속도보다 예측 가능성을 확보하는 편이 낫습니다.");
  }

  if (attachment.profileKey === "secure") {
    points.push("상대와 갈등이 생겨도 회복 대화를 시도할 기반이 있는 편으로 볼 수 있습니다.");
  }

  return { title, summary, points };
}

function analyze() {
  const mbti = getMbtiResult();
  const attachment = getAttachmentResult();

  if (!mbti || !attachment) {
    window.alert("모든 문항에 응답해야 결과를 분석할 수 있습니다.");
    return;
  }

  const combined = buildCombinedAnalysis(mbti.mbti, attachment);
  document.getElementById("mbti-result").textContent = mbti.mbti;
  document.getElementById("mbti-summary").textContent = mbti.detail;
  document.getElementById("attachment-result").textContent = attachment.title;
  document.getElementById("attachment-summary").textContent = attachment.summary;
  document.getElementById("combined-title").textContent = combined.title;
  document.getElementById("combined-summary").textContent = combined.summary;

  const pointsList = document.getElementById("combined-points");
  pointsList.innerHTML = "";

  combined.points.forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    pointsList.appendChild(item);
  });

  document.getElementById("result").classList.remove("hidden");
  document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "start" });
}

renderMbtiQuestions();
renderAttachmentQuestions();
document.getElementById("analyze-button").addEventListener("click", analyze);
