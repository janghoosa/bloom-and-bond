const RESULT_STORAGE_KEY = "mbti-chat-result";
const PARTNER_RESULT_STORAGE_KEY = "mbti-chat-partner-result";
export const THEME_STORAGE_KEY = "mbti-chat-theme";

export const ROUTES = {
  intro: "/",
  assessment: "/test",
  result: "/result",
  compare: "/compare",
};

export const ASSESSMENT_MODES = {
  quick: "quick",
  deep: "deep",
};

const mbtiSections = [
  {
    id: "energy",
    title: "일상 반응 1",
    description: "평소 사람, 생각, 회복 방식과 관련된 문항입니다.",
    questions: [
      {
        id: "q1",
        axis: ["E", "I"],
        prompt: "처음 만난 모임에서도 말문이 비교적 빨리 트이는 편이다.",
        options: [
          { value: "E", title: "그렇다", description: "사람 속에서 금방 몸이 풀린다." },
          { value: "I", title: "아니다", description: "익숙해지기 전에는 관찰이 먼저다." },
        ],
      },
      {
        id: "q2",
        axis: ["E", "I"],
        prompt: "생각이 복잡할수록 누군가와 이야기하며 정리하는 편이다.",
        options: [
          { value: "E", title: "말하면서 정리", description: "대화가 곧 사고 정리다." },
          { value: "I", title: "혼자 정리 후 대화", description: "먼저 내 안에서 정리한다." },
        ],
      },
      {
        id: "q3",
        axis: ["E", "I"],
        prompt: "긴 하루를 보낸 뒤에도 사람을 만나면 오히려 살아나는 편이다.",
        options: [
          { value: "E", title: "가깝다", description: "교류가 회복의 일부다." },
          { value: "I", title: "덜 가깝다", description: "혼자 쉬는 시간이 먼저 필요하다." },
        ],
      },
      {
        id: "q4",
        axis: ["E", "I"],
        prompt: "즉석 대화보다 미리 생각할 시간이 있는 대화가 더 편하다.",
        options: [
          { value: "I", title: "그렇다", description: "준비 시간이 있어야 안정적이다." },
          { value: "E", title: "아니다", description: "즉흥 상호작용도 크게 부담되지 않는다." },
        ],
      },
      {
        id: "q17",
        axis: ["E", "I"],
        prompt: "재미있는 일이 생기면 혼자 정리하기보다 바로 나누고 싶어진다.",
        options: [
          { value: "E", title: "가깝다", description: "반응을 주고받을 때 더 생생하다." },
          { value: "I", title: "덜 가깝다", description: "내 안에서 한 번 정리한 뒤 나눈다." },
        ],
      },
    ],
  },
  {
    id: "perception",
    title: "일상 반응 2",
    description: "정보를 받아들이고 해석하는 방식과 관련된 문항입니다.",
    questions: [
      {
        id: "q5",
        axis: ["S", "N"],
        prompt: "설명을 들을 때 사례와 절차가 먼저 있어야 이해가 잘 된다.",
        options: [
          { value: "S", title: "구체가 먼저", description: "실제 예시가 있어야 감이 온다." },
          { value: "N", title: "큰 그림이 먼저", description: "맥락과 개념부터 알고 싶다." },
        ],
      },
      {
        id: "q6",
        axis: ["S", "N"],
        prompt: "새 프로젝트를 보면 현실 제약보다 가능성이 먼저 떠오른다.",
        options: [
          { value: "N", title: "그렇다", description: "될 수 있는 방향을 먼저 상상한다." },
          { value: "S", title: "아니다", description: "가능 전제보다 조건부터 점검한다." },
        ],
      },
      {
        id: "q7",
        axis: ["S", "N"],
        prompt: "기억할 때 대체로 실제 장면과 디테일이 오래 남는 편이다.",
        options: [
          { value: "S", title: "가깝다", description: "사실과 디테일이 선명하다." },
          { value: "N", title: "덜 가깝다", description: "의미와 인상 위주로 남는다." },
        ],
      },
      {
        id: "q8",
        axis: ["S", "N"],
        prompt: "상대의 말에서 문자 그대로보다 숨은 의도와 흐름을 먼저 읽는다.",
        options: [
          { value: "N", title: "그렇다", description: "표면 아래 의미를 먼저 본다." },
          { value: "S", title: "아니다", description: "있는 그대로 받아들이는 편이다." },
        ],
      },
      {
        id: "q18",
        axis: ["S", "N"],
        prompt: "처음 가보는 곳에서도 설명보다 느낌과 분위기로 방향을 잡는 편이다.",
        options: [
          { value: "N", title: "그렇다", description: "전체 감과 흐름을 먼저 따른다." },
          { value: "S", title: "아니다", description: "표지와 기준부터 확인하는 편이다." },
        ],
      },
    ],
  },
  {
    id: "judgment",
    title: "일상 반응 3",
    description: "판단과 피드백, 대인 반응과 관련된 문항입니다.",
    questions: [
      {
        id: "q9",
        axis: ["T", "F"],
        prompt: "갈등 상황에서는 공감보다 사실관계 정리가 먼저 중요하다.",
        options: [
          { value: "T", title: "그렇다", description: "정리와 기준이 우선이다." },
          { value: "F", title: "아니다", description: "감정이 정리돼야 대화가 된다." },
        ],
      },
      {
        id: "q10",
        axis: ["T", "F"],
        prompt: "누군가 서운해해도 판단이 맞다고 생각하면 그대로 말하는 편이다.",
        options: [
          { value: "T", title: "가깝다", description: "정확성이 우선이다." },
          { value: "F", title: "덜 가깝다", description: "전달 방식도 판단의 일부다." },
        ],
      },
      {
        id: "q11",
        axis: ["T", "F"],
        prompt: "팀에서 누가 소외되는지 같은 분위기 변화에 민감한 편이다.",
        options: [
          { value: "F", title: "그렇다", description: "관계 결이 쉽게 감지된다." },
          { value: "T", title: "아니다", description: "분위기보다 과업 흐름이 먼저 보인다." },
        ],
      },
      {
        id: "q12",
        axis: ["T", "F"],
        prompt: "피드백은 부드럽기보다 분명해야 실질적으로 도움이 된다.",
        options: [
          { value: "T", title: "그렇다", description: "핵심과 정확성이 중요하다." },
          { value: "F", title: "아니다", description: "수용 가능한 방식이어야 남는다." },
        ],
      },
      {
        id: "q19",
        axis: ["T", "F"],
        prompt: "누군가 실수했을 때 왜 그랬는지보다 어떤 마음이었는지가 먼저 궁금하다.",
        options: [
          { value: "F", title: "그렇다", description: "상황 뒤의 감정을 먼저 본다." },
          { value: "T", title: "아니다", description: "원인과 맥락을 먼저 정리한다." },
        ],
      },
    ],
  },
  {
    id: "lifestyle",
    title: "일상 반응 4",
    description: "일정, 마감, 변화 대응과 관련된 문항입니다.",
    questions: [
      {
        id: "q13",
        axis: ["J", "P"],
        prompt: "일정이 정리되어 있어야 마음이 편하고 집중이 잘 된다.",
        options: [
          { value: "J", title: "그렇다", description: "예측 가능성이 중요하다." },
          { value: "P", title: "아니다", description: "열어두는 편이 덜 답답하다." },
        ],
      },
      {
        id: "q14",
        axis: ["J", "P"],
        prompt: "변수 때문에 계획이 바뀌면 스트레스를 크게 느끼는 편이다.",
        options: [
          { value: "J", title: "가깝다", description: "흐트러짐이 에너지를 뺀다." },
          { value: "P", title: "덜 가깝다", description: "바뀌면 다시 맞추면 된다." },
        ],
      },
      {
        id: "q15",
        axis: ["J", "P"],
        prompt: "마감이 멀면 일단 탐색하다가 방향을 정하는 편이다.",
        options: [
          { value: "P", title: "그렇다", description: "움직이며 정하는 편이다." },
          { value: "J", title: "아니다", description: "먼저 구조부터 잡는다." },
        ],
      },
      {
        id: "q16",
        axis: ["J", "P"],
        prompt: "완료되지 않은 상태로 남겨두면 계속 신경이 쓰인다.",
        options: [
          { value: "J", title: "그렇다", description: "마무리돼야 머리가 비워진다." },
          { value: "P", title: "아니다", description: "열린 상태도 크게 문제 없다." },
        ],
      },
      {
        id: "q20",
        axis: ["J", "P"],
        prompt: "주말 약속도 대략적인 틀은 정해져 있어야 마음이 편하다.",
        options: [
          { value: "J", title: "가깝다", description: "비어 있으면 오히려 신경이 쓰인다." },
          { value: "P", title: "덜 가깝다", description: "상황 따라 흘러가도 괜찮다." },
        ],
      },
      {
        id: "q21",
        axis: ["J", "P"],
        prompt: "준비가 덜 됐더라도 일단 시작해보면 방향이 잡히는 편이다.",
        options: [
          { value: "P", title: "그렇다", description: "움직이면서 조정하는 편이다." },
          { value: "J", title: "아니다", description: "시작 전 구조가 잡혀야 안심된다." },
        ],
      },
    ],
  },
];

const attachmentSections = [
  {
    id: "anxiety",
    title: "불안 민감도",
    description: "가까운 관계에서 느끼는 예민함과 해석 경향을 살핍니다.",
    questions: [
      { id: "a1", axis: "anxiety", prompt: "상대 답장이 늦으면 관계가 식은 건 아닌지 바로 신경이 쓰인다." },
      { id: "a2", axis: "anxiety", prompt: "애정 표현을 받아도 오래 유지되지 않고 다시 확인받고 싶어진다." },
      { id: "a3", axis: "anxiety", prompt: "상대의 작은 표정 변화도 부정적 신호처럼 느껴질 때가 있다." },
      { id: "a4", axis: "anxiety", prompt: "중요한 사람일수록 나를 떠날 가능성을 자주 상상하게 된다." },
      { id: "a13", axis: "anxiety", prompt: "대화가 평소보다 짧아지면 내가 뭘 잘못했는지 먼저 떠올리게 된다." },
      { id: "a14", axis: "anxiety", prompt: "상대가 바쁘다고 해도 마음 한편에서는 거리감이 커진 것처럼 느껴질 때가 있다." },
    ],
  },
  {
    id: "avoidance",
    title: "거리 조절 반응",
    description: "거리 조절과 혼자 정리하려는 경향을 살핍니다.",
    questions: [
      { id: "a5", axis: "avoidance", prompt: "상대가 정서적으로 깊이 다가오면 갑자기 숨이 막히는 느낌이 든다." },
      { id: "a6", axis: "avoidance", prompt: "문제가 생기면 대화보다 혼자 정리하는 시간이 먼저 필요하다." },
      { id: "a7", axis: "avoidance", prompt: "누군가 나에게 많이 기대는 순간 책임감보다 부담이 먼저 올라온다." },
      { id: "a8", axis: "avoidance", prompt: "감정을 나누는 것보다 스스로 통제 가능한 거리를 유지하고 싶다." },
      { id: "a15", axis: "avoidance", prompt: "서운한 일이 있어도 바로 말하기보다 그냥 혼자 넘기는 편이 더 편하다." },
    ],
  },
  {
    id: "trust",
    title: "신뢰와 의존",
    description: "신뢰, 도움 요청, 안정감과 관련된 문항입니다.",
    questions: [
      { id: "a9", axis: "anxiety", prompt: "상대가 확실히 표현하지 않으면 마음을 쉽게 믿지 못하는 편이다." },
      { id: "a10", axis: "avoidance", prompt: "힘든 일이 있어도 도움을 요청하는 것보다 혼자 버티는 편이 편하다." },
      { id: "a11", axis: "anxiety", prompt: "관계에서 내가 더 많이 좋아하는 쪽이 될까 봐 경계할 때가 있다." },
      { id: "a12", axis: "avoidance", prompt: "너무 가까운 관계보다 적당한 거리가 있는 관계가 더 안정적으로 느껴진다." },
      { id: "a16", axis: "anxiety", prompt: "괜찮다고 말해도 정말 괜찮은 건지 한 번 더 확인하고 싶을 때가 있다." },
      { id: "a17", axis: "avoidance", prompt: "의지해도 된다는 말을 들어도 실제로 기대는 건 여전히 어색하다." },
    ],
  },
];

export const mbtiCopy = {
  E: "관계 이슈를 바깥으로 꺼내며 정리하려는 경향",
  I: "관계 이슈를 안에서 정리한 뒤 접근하려는 경향",
  S: "행동과 빈도 같은 실제 단서에 반응하는 경향",
  N: "의미와 숨은 의도를 빠르게 읽어내는 경향",
  T: "감정을 구조화하고 분석적으로 다루는 경향",
  F: "정서적 분위기와 상호작용의 결을 크게 느끼는 경향",
  J: "정의된 관계와 예측 가능한 흐름을 중요하게 보는 경향",
  P: "유연성과 여지를 남겨두는 관계 방식을 선호하는 경향",
};

const attachmentProfiles = {
  secure: {
    title: "안정 애착 경향",
    summary: "친밀감과 자율성 사이 균형을 비교적 잘 잡는 편이에요.",
  },
  anxious: {
    title: "불안 애착 경향",
    summary: "관계 신호에 민감하고 확인 욕구가 높아질 수 있는 편이에요.",
  },
  avoidant: {
    title: "회피 애착 경향",
    summary: "가까워질수록 거리 조절 욕구와 자기 통제가 커질 수 있는 편이에요.",
  },
  fearful: {
    title: "불안-회피 혼합 경향",
    summary: "가까워지고 싶지만 상처 가능성도 크게 경계하는 흐름이 함께 나타날 수 있어요.",
  },
};

export function shuffleArray(items) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function selectSectionQuestions(section, count) {
  return {
    ...section,
    questions: section.questions.slice(0, count),
  };
}

export function buildAssessmentConfig(mode) {
  const isDeepMode = mode === ASSESSMENT_MODES.deep;
  const selectedMbtiSections = mbtiSections.map((section) =>
    selectSectionQuestions(section, isDeepMode ? section.questions.length : 4),
  );
  const selectedAttachmentSections = attachmentSections.map((section) =>
    selectSectionQuestions(section, isDeepMode ? section.questions.length : 4),
  );

  return {
    mode,
    mbtiSections: selectedMbtiSections,
    attachmentSections: selectedAttachmentSections,
    mbtiQuestions: selectedMbtiSections.flatMap((section) => section.questions),
    attachmentQuestions: selectedAttachmentSections.flatMap((section) => section.questions),
  };
}

function interleaveSectionQuestions(sections) {
  const queues = shuffleArray(
    sections.map((section) => ({
      id: section.id,
      questions: shuffleArray(section.questions),
    })),
  );
  const mixed = [];
  let hasRemaining = true;

  while (hasRemaining) {
    hasRemaining = false;
    for (const queue of queues) {
      if (queue.questions.length > 0) {
        mixed.push(queue.questions.shift());
        hasRemaining = true;
      }
    }
  }

  return mixed;
}

function chunkQuestions(questions, stepCount) {
  const baseSize = Math.floor(questions.length / stepCount);
  const remainder = questions.length % stepCount;
  const chunks = [];
  let start = 0;

  for (let index = 0; index < stepCount; index += 1) {
    const size = baseSize + (index < remainder ? 1 : 0);
    chunks.push(questions.slice(start, start + size));
    start += size;
  }

  return chunks;
}

export function buildAssessmentSteps(mode = ASSESSMENT_MODES.quick) {
  const config = buildAssessmentConfig(mode);
  const mbtiStepQuestions = chunkQuestions(interleaveSectionQuestions(config.mbtiSections), 4);
  const attachmentStepQuestions = chunkQuestions(interleaveSectionQuestions(config.attachmentSections), 3);

  const mbtiSteps = mbtiStepQuestions.map((questions, index) => ({
    id: `mbti-step-${index + 1}`,
    title: `일상 반응 ${index + 1}`,
    description: "평소 선택과 반응에 관한 문항이 섞여 있습니다.",
    kind: "mbti",
    questions,
  }));

  const attachmentSteps = attachmentStepQuestions.map((questions, index) => ({
    id: `attachment-step-${index + 1}`,
    title: "관계 질문",
    description: "관계에서의 해석과 거리감에 관한 문항이 섞여 있습니다.",
    kind: "attachment",
    questions,
  }));

  return [...mbtiSteps, ...attachmentSteps].map((step, index) => ({
    ...step,
    stepNumber: index + 1,
  }));
}

export function evaluateMbti(answers, activeMbtiSections, activeMbtiQuestions) {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  for (const question of activeMbtiQuestions) {
    const value = answers[question.id];
    if (!value) {
      return null;
    }
    scores[value] += 1;
  }

  const type = [
    scores.E >= scores.I ? "E" : "I",
    scores.S >= scores.N ? "S" : "N",
    scores.T >= scores.F ? "T" : "F",
    scores.J >= scores.P ? "J" : "P",
  ].join("");

  const summary = type
    .split("")
    .map((letter) => mbtiCopy[letter])
    .join(" / ");

  const sectionScores = activeMbtiSections.map((section) => {
    const counts = {};

    section.questions.forEach((question) => {
      const value = answers[question.id];
      counts[value] = (counts[value] ?? 0) + 1;
    });

    const [left, right] = section.questions[0].axis;
    const leftCount = counts[left] ?? 0;
    const rightCount = counts[right] ?? 0;
    const dominant = leftCount >= rightCount ? left : right;

    return {
      id: section.id,
      title: section.title,
      left,
      right,
      leftCount,
      rightCount,
      total: section.questions.length,
      dominant,
      scoreText: `${left} ${leftCount} : ${right} ${rightCount}`,
    };
  });

  return { type, summary, sectionScores };
}

export function evaluateAttachment(answers, activeAttachmentSections, activeAttachmentQuestions) {
  let anxiety = 0;
  let avoidance = 0;

  for (const question of activeAttachmentQuestions) {
    const raw = answers[question.id];
    if (raw === undefined || raw === null || raw === "") return null;
    const value = Number(raw);
    if (Number.isNaN(value)) return null;
    if (question.axis === "anxiety") {
      anxiety += value;
    } else {
      avoidance += value;
    }
  }

  const anxietyQuestions = activeAttachmentQuestions.filter((question) => question.axis === "anxiety").length;
  const avoidanceQuestions = activeAttachmentQuestions.filter((question) => question.axis === "avoidance").length;
  if (!anxietyQuestions || !avoidanceQuestions) return null;
  const averageAnxiety = anxiety / anxietyQuestions;
  const averageAvoidance = avoidance / avoidanceQuestions;
  const highAnxiety = averageAnxiety >= 3.4;
  const highAvoidance = averageAvoidance >= 3.4;

  let key = "secure";
  if (highAnxiety && highAvoidance) {
    key = "fearful";
  } else if (highAnxiety) {
    key = "anxious";
  } else if (highAvoidance) {
    key = "avoidant";
  }

  const sectionScores = activeAttachmentSections.map((section) => {
    const total = section.questions.reduce((sum, question) => sum + Number(answers[question.id] ?? 0), 0);
    const average = total / section.questions.length;

    return {
      id: section.id,
      title: section.title,
      average: average.toFixed(1),
      averageValue: average,
    };
  });

  return {
    key,
    anxiety: averageAnxiety.toFixed(1),
    anxietyValue: averageAnxiety,
    avoidance: averageAvoidance.toFixed(1),
    avoidanceValue: averageAvoidance,
    sectionScores,
    ...attachmentProfiles[key],
  };
}

function getAttachmentIntensity(value) {
  if (value >= 4.2) {
    return "높음";
  }
  if (value >= 3.4) {
    return "중간";
  }
  return "낮음";
}

function getThinkingStyle(type) {
  return {
    isIntrovert: type[0] === "I",
    isIntuitive: type[1] === "N",
    isThinking: type[2] === "T",
    isFeeling: type[2] === "F",
    isJudging: type[3] === "J",
    isPerceiving: type[3] === "P",
  };
}

function buildAttachmentWhy(attachment) {
  const anxietyLevel = getAttachmentIntensity(attachment.anxietyValue ?? Number(attachment.anxiety));
  const avoidanceLevel = getAttachmentIntensity(attachment.avoidanceValue ?? Number(attachment.avoidance));

  if (attachment.key === "avoidant") {
    if (avoidanceLevel === "높음") {
      return "가까워질수록 마음을 열기보다 혼자 정리하는 쪽으로 빠르게 기울 수 있어요. 기대고 싶지 않아서라기보다, 기대는 순간 부담과 실망 가능성이 같이 커질 수 있다고 느껴질 때가 있기 때문이에요.";
    }
    return "기본적으로는 거리를 조절하면서 안정감을 찾는 편이에요. 감정이 커질수록 바로 공유하기보다 스스로 정리한 뒤 돌아오려는 반응이 먼저 나올 수 있어요.";
  }

  if (attachment.key === "anxious") {
    if (anxietyLevel === "높음") {
      return "관계의 작은 변화도 크게 읽힐 수 있고, 확인받고 싶은 마음이 빠르게 올라올 수 있어요. 사랑이 부족해서라기보다 신호가 불분명할 때 불안이 먼저 작동하는 구조에 가까워요.";
    }
    return "확인 욕구와 관계 신호에 대한 민감도가 약간 높은 편이에요. 애정 표현이 줄어들거나 반응이 늦어지면 의미를 더 크게 해석하게 될 수 있어요.";
  }

  if (attachment.key === "fearful") {
    return "가까워지고 싶은 마음과 다칠까 경계하는 마음이 동시에 강하게 작동할 수 있어요. 그래서 붙고 싶다가도 갑자기 닫히는 식의 양가 반응이 나타날 수 있어요.";
  }

  return "친밀감과 거리감 사이에서 균형을 잘 잡는 편이에요. 다만 피로하거나 안전감이 흔들릴 때는 누구나 불안이나 회피 반응이 잠깐 올라올 수 있어요.";
}

function buildRomanceInsight(mbti, attachment) {
  const style = getThinkingStyle(mbti.type);

  if (attachment.key === "avoidant") {
    if (style.isThinking && style.isJudging) {
      return "연애에서는 마음이 없어 보인다기보다, 감정을 표현하기 전에 먼저 정리하고 통제하려는 편이에요. 특히 TJ 성향이 강하면 행동으로 책임지는 건 자연스럽지만, '보고 싶다', '서운했다', '힘들다' 같은 약한 문장을 바로 꺼내는 속도는 늦을 수 있어요.";
    }
    if (style.isIntrovert) {
      return "마음이 생겨도 바로 표현하기보다 안전하다고 느낄 때까지 안쪽에서 오래 정리하게 될 수 있어요. 가까워질수록 말수가 줄거나 혼자만의 시간이 더 필요해질 수 있어요.";
    }
    return "호감이 있어도 감정 표현이 천천히 나오는 편일 수 있어요. 관계를 소홀히 해서라기보다 가까워질수록 자기 통제와 거리 조절 욕구가 커질 수 있기 때문이에요.";
  }

  if (attachment.key === "anxious") {
    if (style.isFeeling) {
      return "좋아하는 사람에게 정서적으로 깊이 연결되고 싶어 하는 욕구가 큰 편이에요. 다만 애정 표현의 온도나 반응 속도가 달라질 때 관계 의미를 빠르게 확대 해석할 수 있어요.";
    }
    return "상대와의 연결이 흔들린다고 느끼면 생각보다 빨리 확인 욕구가 올라올 수 있어요. 평소에는 이성적으로 보여도 연애 안에서는 답장, 말투, 거리감 같은 신호에 예민해질 수 있어요.";
  }

  if (attachment.key === "fearful") {
    return "끌림과 경계가 같이 커서 관계 초반에는 더 흔들릴 수 있어요. 가까워지고 싶지만 상처 가능성도 크게 느껴져서, 다정함을 원하면서도 동시에 한 발 물러서는 반응이 반복될 수 있어요.";
  }

  if (style.isThinking && style.isJudging) {
    return "연애에서도 책임감과 일관성을 중요하게 보는 편이에요. 표현은 담백할 수 있지만 약속, 행동, 구조를 통해 관계를 지키려는 경향이 분명한 편이에요.";
  }

  return "관계 안에서 유연하게 연결을 만들어가는 편이에요. 표현 방식이 화려하지 않아도 안정적으로 마음을 주고받을 기반은 있는 편이에요.";
}

function buildConflictInsight(mbti, attachment) {
  const style = getThinkingStyle(mbti.type);

  if (attachment.key === "avoidant" || attachment.key === "fearful") {
    if (style.isThinking) {
      return "갈등이 생기면 감정 교류보다 문제 구조를 먼저 정리하려 할 수 있어요. 이때 상대는 '공감이 없다'고 느끼고, 본인은 '정리도 못 하고 더 커진다'고 느끼면서 서로 엇갈릴 수 있어요.";
    }
    return "갈등이 올라올수록 바로 마주하기보다 잠깐 거리를 두고 정리하려는 반응이 나올 수 있어요. 하지만 설명 없이 물러나면 상대는 거절이나 단절처럼 느낄 수 있어서, 잠깐 멈추더라도 언제 다시 대화할지 같이 말해주는 편이 중요해요.";
  }

  if (attachment.key === "anxious") {
    return "갈등 상황에서 핵심 쟁점보다 '나를 밀어내는 건가'가 먼저 크게 느껴질 수 있어요. 그래서 설명을 듣기 전에 마음을 확인받고 싶어질 수 있고, 상대가 차갑게 반응하면 갈등 강도가 빠르게 올라갈 수 있어요.";
  }

  if (style.isFeeling) {
    return "갈등에서도 감정 결을 놓치지 않으려는 편이에요. 다만 분위기를 지나치게 읽으면 실제 문제보다 정서 신호에 더 크게 흔들릴 수 있어요.";
  }

  return "갈등에서는 감정보다 기준과 해결 순서를 먼저 세우려는 편이에요. 이 강점은 문제 해결에는 유리하지만, 초반 공감이 빠지면 관계 대화에서는 차갑게 들릴 수 있어요.";
}

function buildDistanceInsight(mbti, attachment) {
  const style = getThinkingStyle(mbti.type);

  if (attachment.key === "avoidant") {
    return "거리감이 필요한 순간이 분명한 편이에요. 문제는 혼자 정리하는 시간이 필요할 때 그 이유를 말하지 않으면, 상대는 '밀어낸다'고 해석하고 본인은 더 숨 막히게 느끼는 악순환이 생길 수 있다는 점이에요.";
  }

  if (attachment.key === "fearful") {
    return "가까워지고 싶은 욕구와 거리 두고 싶은 욕구가 번갈아 올라올 수 있어요. 그래서 어느 날은 깊게 연결되고 싶다가도, 바로 다음 순간에는 선을 긋고 싶어지는 식의 흔들림이 나타날 수 있어요.";
  }

  if (attachment.key === "anxious") {
    return `조금만 멀어져도 실제 거리보다 더 크게 느껴질 수 있어요. 특히 ${style.isIntuitive ? "의미를 빠르게 읽는 성향" : "디테일 신호를 세게 읽는 성향"}이 더해지면 답장 텀, 표정, 말투 변화가 관계 전체의 신호처럼 해석될 수 있어요.`;
  }

  return "거리감 조절이 안정적인 편이에요. 다만 피로하거나 관계가 불명확할 때는 누구나 잠깐 더 붙고 싶거나, 반대로 혼자 정리하고 싶어질 수 있어요.";
}

function buildReassuranceInsight(mbti, attachment) {
  const style = getThinkingStyle(mbti.type);

  if (attachment.key === "anxious") {
    return `확인 욕구가 올라올 때 필요한 건 거창한 답보다 일관된 신호에 가까워요. 특히 ${style.isFeeling ? "정서적 톤" : "명확한 표현과 반복 가능한 약속"}이 안정감을 크게 좌우할 수 있어요.`;
  }

  if (attachment.key === "avoidant") {
    return "확인을 덜 원한다기보다, 확인이 깊어질수록 부담이 같이 커질 수 있어요. 그래서 안심이 필요해도 먼저 말하지 못하고 닫는 식으로 반응할 수 있어요.";
  }

  if (attachment.key === "fearful") {
    return "확인받고 싶은 마음과 확인받는 순간 생기는 부담이 동시에 움직일 수 있어요. 그래서 안심을 주는 말이 들어와도 바로 믿기보다 한 번 더 물러나는 반응이 나타날 수 있어요.";
  }

  return "확인 욕구는 대체로 안정적인 편이지만, 관계가 흐려질 때는 명확한 말 한마디가 여전히 중요할 수 있어요. 안정형도 모호함이 길어지면 흔들릴 수 있어요.";
}

function buildPracticeTips(mbti, attachment) {
  const style = getThinkingStyle(mbti.type);
  const tips = [];

  if (attachment.key === "avoidant" || attachment.key === "fearful") {
    tips.push({
      label: "가장 먼저",
      title: "브레이크 문장 만들기",
      example: "\"잠깐 정리하고 다시 말할게\"",
      description: "감정이 올라왔을 때 바로 해명하거나 닫히기 전에 시간을 버는 문장을 먼저 꺼내는 연습이 도움이 될 수 있어요.",
    });
    tips.push({
      label: "지금 바로",
      title: "상태를 말로 전달하기",
      example: "\"오늘 좀 지쳤어\" / \"지금은 혼자 정리할 시간이 조금 필요해\"",
      description: "행동으로만 챙기는 방식이 익숙하다면, 하루 한 번은 상태를 말로 전달하는 연습이 도움이 될 수 있어요.",
    });
  }

  if (attachment.key === "anxious" || attachment.key === "fearful") {
    tips.push({
      label: "중요",
      title: "추측 대신 사실 확인하기",
      example: "\"내가 이렇게 느꼈는데 맞아?\"",
      description: "불안이 올라올 때 추측을 확정하지 말고, 사실 확인 문장을 한 단계 두는 편이 도움이 될 수 있어요.",
    });
  }

  if (style.isThinking) {
    tips.push({
      label: "익숙해지면",
      title: "감정 번역 먼저 하기",
      example: "\"그래서 속상했구나\"",
      description: "갈등 초반에는 해결책보다 감정 번역을 먼저 두는 쪽이 더 효과적일 수 있어요. 정리는 그 다음에 가는 흐름이 좋아요.",
    });
  }

  if (style.isJudging) {
    tips.push({
      label: "기억해두기",
      title: "의도와 감정을 함께 말하기",
      example: "\"내가 피한 건 아니고, 지금 정리할 시간이 조금 필요했어\"",
      description: "계획과 책임만으로는 정서적 안전감이 충분하지 않을 수 있어서, 의도와 감정을 짧게라도 같이 말해주는 쪽이 좋아요.",
    });
  }

  if (!tips.length) {
    tips.push({
      label: "지금 바로",
      title: "한 문장 더 설명하기",
      example: "\"괜찮아\" 대신 \"괜찮긴 한데 조금 더 생각할 시간이 필요해\"",
      description: "지금의 강점을 유지하면서도, 애매한 순간에 감정과 의도를 한 문장 더 설명하는 연습이 결과를 더 안정적으로 만들어줄 수 있어요.",
    });
  }

  return tips.map((tip, index) => ({
    ...tip,
    priority: `${index + 1}. ${tip.label}`,
  }));
}

function pushUnique(items, value) {
  if (value && !items.includes(value)) {
    items.push(value);
  }
}

function buildCompatibilityInsight(mbti, attachment) {
  const style = getThinkingStyle(mbti.type);
  const goodMatchTraits = [];
  const hardMatchTraits = [];
  const reasons = [];

  if (attachment.key === "anxious") {
    pushUnique(goodMatchTraits, "안정형 애착에 가깝고, 반응과 애정 표현이 꾸준한 사람");
    pushUnique(hardMatchTraits, "회피 애착 경향이 강해서 거리 두기로 갈등을 넘기기 쉬운 사람");
    pushUnique(reasons, "확인 욕구가 올라올 때는 모호함보다 일관된 신호가 훨씬 큰 안정감을 줄 수 있어요.");
  } else if (attachment.key === "avoidant") {
    pushUnique(goodMatchTraits, "안정형 애착에 가깝고, 속도를 재촉하기보다 경계를 존중해주는 사람");
    pushUnique(hardMatchTraits, "불안 애착 경향이 강해서 즉각적인 확인과 밀착을 자주 요구하는 사람");
    pushUnique(reasons, "가까워질수록 혼자 정리할 시간이 필요할 수 있어서, 그 시간을 거절로 해석하지 않는 상대와 더 편해질 수 있어요.");
  } else if (attachment.key === "fearful") {
    pushUnique(goodMatchTraits, "안정형 애착에 가깝고, 급하게 몰아붙이지 않으면서도 꾸준히 신호를 주는 사람");
    pushUnique(hardMatchTraits, "불안과 회피 반응이 모두 높아서 관계 온도가 크게 출렁이기 쉬운 사람");
    pushUnique(reasons, "가까워지고 싶은 마음과 경계하는 마음이 같이 올라올 수 있어서, 속도는 느긋하지만 반응은 한결같은 사람이 더 안전하게 느껴질 수 있어요.");
  } else {
    pushUnique(goodMatchTraits, "애착 반응이 안정적이고, 감정 표현이 예측 가능한 사람");
    pushUnique(hardMatchTraits, "애정 표현과 거리 조절이 들쑥날쑥해서 관계 리듬이 자주 흔들리는 사람");
    pushUnique(reasons, "기본 균형은 있는 편이라도, 관계 리듬이 반복해서 흔들리면 원래 성향보다 피로가 더 크게 느껴질 수 있어요.");
  }

  if (style.isThinking) {
    pushUnique(goodMatchTraits, "감정만 던지기보다 맥락과 이유를 함께 말해주는 F 성향 또는 균형 잡힌 사람");
    pushUnique(hardMatchTraits, "감정 강도는 높지만 무엇이 필요한지는 설명하지 않는 사람");
    pushUnique(reasons, "문제를 이해하고 풀어가는 흐름이 보여야 마음이 덜 막힐 수 있어서, 감정과 맥락을 같이 말해주는 상대가 더 편할 수 있어요.");
  } else {
    pushUnique(goodMatchTraits, "감정을 숨기지 않고 따뜻하게 확인해주는 F 성향의 사람");
    pushUnique(hardMatchTraits, "정리와 해결만 먼저 내세워서 감정 확인이 늦어지는 T 성향의 사람");
    pushUnique(reasons, "정서적 톤과 반응의 결을 크게 읽는 편이라, 내용이 맞아도 차갑게 들리면 관계 피로가 더 빠르게 쌓일 수 있어요.");
  }

  if (style.isJudging) {
    pushUnique(goodMatchTraits, "약속과 관계 흐름이 일정한 J 성향의 사람");
    pushUnique(hardMatchTraits, "관계 정의와 계획을 계속 미루는 P 성향의 사람");
    pushUnique(reasons, "예측 가능한 흐름이 있어야 안정감이 커질 수 있어서, 애매함이 길어지는 관계에서는 불필요한 소모가 생길 수 있어요.");
  } else {
    pushUnique(goodMatchTraits, "대화를 열어두고 상황에 따라 유연하게 맞춰주는 P 성향의 사람");
    pushUnique(hardMatchTraits, "모든 감정 반응을 바로 정의하고 확정하려는 J 성향의 사람");
    pushUnique(reasons, "여지를 남겨두는 관계 방식이 익숙한 편이라, 속도를 너무 빨리 고정하려는 흐름은 부담으로 느껴질 수 있어요.");
  }

  if (style.isIntrovert) {
    pushUnique(goodMatchTraits, "혼자 정리할 시간도 관계의 일부로 이해해주는 사람");
    pushUnique(hardMatchTraits, "침묵이나 답장 텀을 바로 거절 신호로 읽는 사람");
  } else {
    pushUnique(goodMatchTraits, "대화를 통해 풀되 상대 속도도 함께 맞춰주는 사람");
    pushUnique(hardMatchTraits, "문제가 생기면 같이 닫혀서 대화 창구가 빠르게 사라지는 사람");
  }

  if (style.isIntuitive) {
    pushUnique(goodMatchTraits, "표면보다 의도와 맥락을 함께 읽어주는 N 성향의 사람");
    pushUnique(hardMatchTraits, "말의 표면만 보면서 숨은 불편함을 오래 놓치는 사람");
  } else {
    pushUnique(goodMatchTraits, "행동, 빈도, 약속처럼 눈에 보이는 신호를 꾸준히 보여주는 사람");
    pushUnique(hardMatchTraits, "분위기만 남기고 실제 행동 신호는 부족한 사람");
  }

  return {
    goodMatch: goodMatchTraits.slice(0, 3),
    hardMatch: hardMatchTraits.slice(0, 3),
    reason: reasons.slice(0, 3),
    reasonSummary: "MBTI 궁합보다도, 애착 안정감과 소통 속도가 함께 맞는지가 더 중요할 수 있어요.",
  };
}

export function buildCombinedInsight(mbti, attachment) {
  const anxietyLevel = getAttachmentIntensity(attachment.anxietyValue ?? Number(attachment.anxiety));
  const avoidanceLevel = getAttachmentIntensity(attachment.avoidanceValue ?? Number(attachment.avoidance));
  const points = [
    ...mbti.type.split("").map((letter) => mbtiCopy[letter]),
    `애착 점수는 5점 만점 기준이며, 높을수록 해당 반응이 더 자주 강하게 올라온다는 뜻이에요. 현재는 불안 ${attachment.anxiety}, 회피 ${attachment.avoidance}예요.`,
  ];

  return {
    title: `${mbti.type} · ${attachment.title}`,
    summary:
      attachment.key === "secure"
        ? "기본 성향과 관계 패턴이 크게 충돌하지 않는 편이에요. 다만 성향의 표현 방식과 관계 안에서의 안심 방식은 분리해서 보는 편이 더 정확할 수 있어요."
        : `성격 선호 위에 애착 반응이 덧씌워지는 구조라, 평소의 MBTI 특징보다 관계 안에서의 안전감 문제가 더 크게 드러날 수 있어요. 현재는 불안 반응과 회피 반응이 각각 ${anxietyLevel}, ${avoidanceLevel} 정도로 나타나는 편이에요.`,
    points,
    sections: [
      { id: "why", title: "왜 이렇게 반응할 수 있나", body: buildAttachmentWhy(attachment) },
      { id: "romance", title: "연애에서의 기본 패턴", body: buildRomanceInsight(mbti, attachment) },
      { id: "conflict", title: "갈등이 생겼을 때", body: buildConflictInsight(mbti, attachment) },
      { id: "distance", title: "거리감이 생길 때", body: buildDistanceInsight(mbti, attachment) },
      { id: "reassurance", title: "확인 욕구와 안심 방식", body: buildReassuranceInsight(mbti, attachment) },
    ],
    compatibility: buildCompatibilityInsight(mbti, attachment),
    practice: buildPracticeTips(mbti, attachment),
  };
}

function getAxisWord(letter) {
  return {
    E: "대화하며 풀어가기",
    I: "혼자 생각을 정리하기",
    S: "구체적인 신호 보기",
    N: "숨은 의미 읽기",
    T: "문제를 정리하고 해결하기",
    F: "감정과 분위기 살피기",
    J: "예측 가능한 흐름을 선호하기",
    P: "여지를 두고 유연하게 가기",
  }[letter];
}

export function buildCompareInsight(myResult, partnerResult) {
  const myType = myResult.mbti.type;
  const partnerType = partnerResult.mbti.type;
  const sameCode = myResult.code && partnerResult.code && myResult.code === partnerResult.code;
  const sameLetters = myType.split("").filter((letter, index) => partnerType[index] === letter);
  const differentLetters = myType
    .split("")
    .map((letter, index) => [letter, partnerType[index]])
    .filter(([left, right]) => left !== right);

  const myAttachment = myResult.attachment.key;
  const partnerAttachment = partnerResult.attachment.key;
  const sameAttachment = myAttachment === partnerAttachment;
  const anxiousAvoidantPair =
    (myAttachment === "anxious" && partnerAttachment === "avoidant") ||
    (myAttachment === "avoidant" && partnerAttachment === "anxious");
  const fearfulIncluded = myAttachment === "fearful" || partnerAttachment === "fearful";
  const secureIncluded = myAttachment === "secure" || partnerAttachment === "secure";

  const summary = sameAttachment
    ? `두 사람 모두 ${myResult.attachment.title} 반응이 비슷해서, 편한 부분도 닮아 있고 예민해지는 지점도 함께 겹칠 수 있어요.`
    : anxiousAvoidantPair
      ? "두 사람 중 한 사람은 더 확인하고 싶고, 다른 한 사람은 더 정리할 시간이 필요해서 가까워질수록 속도 차이가 크게 느껴질 수 있어요."
      : secureIncluded
        ? "두 사람 중 한 사람이 관계 리듬을 더 안정적으로 잡아줄 수 있어요. 다만 그 사람이 계속 맞춰주는 구조가 되지 않게 보는 게 중요해요."
        : "두 사람의 관계 반응 속도가 조금 달라서, 같은 상황도 전혀 다르게 받아들일 수 있어요.";

  const strengths = [];
  if (sameLetters.length >= 2) {
    strengths.push(`MBTI 기준으로 ${sameLetters.map(getAxisWord).join(", ")} 방식이 닮아 있어서 기본 리듬이 잘 맞을 수 있어요.`);
  }
  if (secureIncluded) {
    strengths.push("둘 중 한 사람이 관계의 중심을 조금 더 단단하게 잡아주면, 감정이 올라오는 순간에도 관계가 덜 흔들릴 수 있어요.");
  }
  if (myType[2] === partnerType[2]) {
    strengths.push(myType[2] === "T" ? "두 사람 모두 대화에서 핵심을 빨리 잡는 편이라, 문제를 정리하는 속도도 빠를 수 있어요." : "두 사람 모두 감정 결을 중요하게 봐서, 서로의 서운함을 눈치채는 힘은 좋은 편이에요.");
  }
  if (!strengths.length) {
    strengths.push("두 사람의 기본 성향이 다르더라도, 서로의 차이를 빨리 말로 설명해주면 오히려 부족한 부분을 보완하는 관계가 될 수 있어요.");
  }

  const friction = [];
  if (anxiousAvoidantPair) {
    friction.push("확인받고 싶은 마음과 혼자 정리하고 싶은 마음이 부딪히면, 한 사람은 더 다가가고 다른 사람은 더 물러나는 악순환이 생길 수 있어요.");
  }
  if (fearfulIncluded) {
    friction.push("가까워지고 싶은 마음과 경계하는 마음이 같이 움직이면, 어느 날은 다정하고 어느 날은 갑자기 닫히는 식의 온도 차가 크게 느껴질 수 있어요.");
  }
  if (differentLetters.some(([left, right]) => (left === "T" && right === "F") || (left === "F" && right === "T"))) {
    friction.push("한 사람은 정리와 해결을 먼저 원하고, 다른 사람은 감정 확인을 먼저 원해서 같은 갈등도 순서가 엇갈릴 수 있어요.");
  }
  if (differentLetters.some(([left, right]) => (left === "J" && right === "P") || (left === "P" && right === "J"))) {
    friction.push("관계를 확실히 정리하고 싶은 마음과 조금 더 열어두고 싶은 마음이 부딪히면 약속, 답장, 계획에서 서운함이 쌓일 수 있어요.");
  }
  if (!friction.length) {
    friction.push("두 사람이 닮은 점이 많을수록 갈등 방식도 비슷해져서, 한 번 꼬이면 대화가 같은 방향으로 굳어버릴 수 있어요.");
  }

  const tips = [];
  tips.push(anxiousAvoidantPair ? "감정이 올라왔을 때는 바로 결론을 내리기보다, 언제 다시 이야기할지 시간을 먼저 합의해두는 편이 좋아요." : "갈등이 생기면 누가 맞는지보다 지금 필요한 게 공감인지 정리인지 먼저 확인해보세요.");
  tips.push(sameLetters.length >= 2 ? "닮은 점은 편안함으로 가져가고, 다른 점이 보이는 순간에는 왜 그렇게 반응하는지 한 문장 더 설명해보면 좋아요." : "다른 점이 보일수록 해석하지 말고 번역해주는 말이 중요해요. '나는 이렇게 느꼈어'를 자주 써보는 편이 좋아요.");
  tips.push("관계가 흔들리는 순간에만 대화하지 말고, 평소 편한 순간에 서로 안심되는 방식과 부담되는 방식을 미리 말해두면 두 사람 모두 덜 지치고 갈등도 덜 커질 수 있어요.");

  const betterWays = [];
  if (sameCode) {
    betterWays.push("두 사람의 반응 구조가 거의 같다면, 서운함을 느끼는 지점도 비슷할 가능성이 커요. 그래서 '나는 이럴 때 이렇게 받아들여'를 먼저 말해두면 오해를 많이 줄일 수 있어요.");
    betterWays.push("서로 닮았다는 이유로 설명을 생략하면 오히려 같이 조용해질 수 있어요. 편하다고 느끼는 순간일수록 상태를 짧게라도 말로 확인해보는 편이 좋아요.");
    betterWays.push("같은 방식으로 닫히거나 같은 방식으로 불안해질 수 있으니, 갈등이 생기면 둘 중 한 사람은 반드시 대화 브레이크 문장을 먼저 꺼내는 약속을 정해두면 좋아요.");
  } else {
    betterWays.push("서로 다른 반응이 보일수록 누가 예민한지가 아니라, 반응 순서가 다르다고 보는 편이 좋아요. 한 사람은 먼저 공감을, 다른 사람은 먼저 정리를 원할 수 있어요.");
    betterWays.push("상대가 왜 저렇게까지 느끼는지 이해가 안 될 때는 해석보다 질문이 먼저예요. '이럴 때 어떤 말이 제일 안심돼?'처럼 구체적으로 묻는 편이 도움이 돼요.");
    betterWays.push("차이를 줄이려 하기보다 역할을 나눠보는 것도 좋아요. 한 사람은 분위기를 열고, 다른 사람은 흐름을 정리하는 식으로 각자의 강점을 쓰면 관계가 더 안정될 수 있어요.");
  }

  if (anxiousAvoidantPair) {
    betterWays.push("확인하고 싶은 사람은 필요한 말을 짧게 요청하고, 정리 시간이 필요한 사람은 돌아올 시간을 같이 말해주는 방식으로 속도 차이를 다루는 연습이 중요해요.");
  }

  if (fearfulIncluded) {
    betterWays.push("마음이 가까워졌다가 갑자기 멀어지는 순간이 반복될 수 있으니, 그 변화 자체를 이상하게 보지 말고 '지금은 조금 천천히 가고 싶어' 같은 중간 문장을 자주 써보는 편이 좋아요.");
  }

  return {
    title: `${myType} · ${partnerType}`,
    summary,
    sections: [
      { id: "strength", title: "잘 맞는 점", body: strengths[0] },
      { id: "friction", title: "엇갈리기 쉬운 점", body: friction[0] },
      { id: "tip", title: "대화 팁", body: tips[0] },
    ],
    bullets: {
      strengths,
      friction,
      tips,
      betterWays,
    },
  };
}

export function loadStoredResult() {
  try {
    const raw = window.sessionStorage.getItem(RESULT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function persistResult(result) {
  window.sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
}

export function clearStoredResult() {
  window.sessionStorage.removeItem(RESULT_STORAGE_KEY);
}

export function loadStoredPartnerResult() {
  try {
    const raw = window.sessionStorage.getItem(PARTNER_RESULT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function persistPartnerResult(result) {
  window.sessionStorage.setItem(PARTNER_RESULT_STORAGE_KEY, JSON.stringify(result));
}

export function clearStoredPartnerResult() {
  window.sessionStorage.removeItem(PARTNER_RESULT_STORAGE_KEY);
}

export function navigateTo(pathname) {
  window.history.pushState({}, "", pathname);
}

export function replaceTo(pathname) {
  window.history.replaceState({}, "", pathname);
}

export function getInitialTheme() {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const PARTNER_STORAGE_KEY = "mbti-chat-partner";
const CODE_PREFIX = "bb3_";
const CODE_SECRET = "BloomBondCherry";
const MBTI_TYPES = [
  "ISTJ", "ISFJ", "INFJ", "INTJ",
  "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP",
  "ESTJ", "ESFJ", "ENFJ", "ENTJ",
];
const ATTACHMENT_KEYS = ["secure", "anxious", "avoidant", "fearful"];
const MBTI_SECTION_META = [
  { id: "energy", pair: ["E", "I"], index: 0 },
  { id: "perception", pair: ["S", "N"], index: 1 },
  { id: "judgment", pair: ["T", "F"], index: 2 },
  { id: "lifestyle", pair: ["J", "P"], index: 3 },
];

function bytesToBase64Url(bytes) {
  const binary = String.fromCharCode(...bytes);
  return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = window.atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function obfuscatePayload(payload) {
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(payload);
  const secretBytes = encoder.encode(CODE_SECRET);
  const obfuscated = payloadBytes.map((byte, index) => byte ^ secretBytes[index % secretBytes.length]);
  return bytesToBase64Url(obfuscated);
}

function deobfuscatePayload(payload) {
  const decoder = new TextDecoder();
  const payloadBytes = base64UrlToBytes(payload);
  const secretBytes = new TextEncoder().encode(CODE_SECRET);
  const restored = payloadBytes.map((byte, index) => byte ^ secretBytes[index % secretBytes.length]);
  return decoder.decode(restored);
}

export function encodeAnswers(mode, mbtiAnswers, attachmentAnswers) {
  const config = buildAssessmentConfig(mode);
  const mbti = evaluateMbti(mbtiAnswers, config.mbtiSections, config.mbtiQuestions);
  const attachment = evaluateAttachment(attachmentAnswers, config.attachmentSections, config.attachmentQuestions);

  if (!mbti || !attachment) {
    return "";
  }

  return encodeResult(mode, mbti, attachment);
}

export function decodeAnswers(code) {
  if (!code?.startsWith(CODE_PREFIX)) {
    return null;
  }

  try {
    const raw = deobfuscatePayload(code.slice(CODE_PREFIX.length));
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function evaluateFromCode(code) {
  const decoded = decodeAnswers(code);
  if (!decoded) return null;
  const mode = decoded.m === "d" ? ASSESSMENT_MODES.deep : ASSESSMENT_MODES.quick;
  const mbtiType = MBTI_TYPES[decoded.t];
  const attachmentKey = ATTACHMENT_KEYS[decoded.k];
  const anxietyValue = (decoded.a ?? 0) / 10;
  const avoidanceValue = (decoded.v ?? 0) / 10;

  if (!mbtiType || !attachmentKey) return null;

  const mbti = rebuildMbtiFromCompact(mode, mbtiType, decoded.s ?? []);
  const attachment = {
    key: attachmentKey,
    anxiety: anxietyValue.toFixed(1),
    anxietyValue,
    avoidance: avoidanceValue.toFixed(1),
    avoidanceValue,
    sectionScores: [],
    ...attachmentProfiles[attachmentKey],
  };

  return { mode, mbti, attachment, combined: buildCombinedInsight(mbti, attachment), code };
}

function quantizeStrength(section) {
  const dominantCount = Math.max(section.leftCount ?? 0, section.rightCount ?? 0);
  const ratio = section.total ? dominantCount / section.total : 0.5;
  if (ratio >= 0.95) return 3;
  if (ratio >= 0.8) return 2;
  if (ratio >= 0.65) return 1;
  return 0;
}

function dequantizeCounts(total, strengthLevel) {
  const dominantCount = [
    Math.ceil(total / 2),
    Math.ceil(total * 0.65),
    Math.ceil(total * 0.8),
    total,
  ][strengthLevel] ?? Math.ceil(total / 2);
  return [dominantCount, total - dominantCount];
}

export function encodeResult(mode, mbti, attachment) {
  const payload = {
    m: mode === ASSESSMENT_MODES.deep ? "d" : "q",
    t: MBTI_TYPES.indexOf(mbti.type),
    k: ATTACHMENT_KEYS.indexOf(attachment.key),
    a: Math.round((attachment.anxietyValue ?? Number(attachment.anxiety)) * 10),
    v: Math.round((attachment.avoidanceValue ?? Number(attachment.avoidance)) * 10),
    s: (mbti.sectionScores ?? []).map(quantizeStrength),
  };

  return `${CODE_PREFIX}${obfuscatePayload(JSON.stringify(payload))}`;
}

function rebuildMbtiFromCompact(mode, type, strengths) {
  const config = buildAssessmentConfig(mode);
  const summary = type
    .split("")
    .map((letter) => mbtiCopy[letter])
    .join(" / ");

  const sectionScores = config.mbtiSections.map((section, index) => {
    const meta = MBTI_SECTION_META[index];
    const dominant = type[meta.index];
    const [left, right] = meta.pair;
    const total = section.questions.length;
    const [dominantCount, weakCount] = dequantizeCounts(total, strengths[index] ?? 1);
    const isLeftDominant = dominant === left;

    return {
      id: meta.id,
      title: section.title,
      left,
      right,
      leftCount: isLeftDominant ? dominantCount : weakCount,
      rightCount: isLeftDominant ? weakCount : dominantCount,
      total,
      dominant,
      scoreText: `${left} ${isLeftDominant ? dominantCount : weakCount} : ${right} ${isLeftDominant ? weakCount : dominantCount}`,
    };
  });

  return { type, summary, sectionScores };
}

export function trackEvent(name, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

export function storePartnerCode(code) {
  window.sessionStorage.setItem(PARTNER_STORAGE_KEY, code);
}

export function loadPartnerCode() {
  return window.sessionStorage.getItem(PARTNER_STORAGE_KEY);
}

export function clearPartnerCode() {
  window.sessionStorage.removeItem(PARTNER_STORAGE_KEY);
}
