import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Radio,
  RadioGroup,
  toast,
} from "@heroui/react";

const mbtiQuestions = [
  {
    id: "q1",
    axis: ["E", "I"],
    prompt: "에너지가 올라오는 쪽은 어디에 더 가깝나요?",
    options: [
      { value: "E", title: "외부 교류", description: "사람들과 부딪치며 생각이 또렷해진다." },
      { value: "I", title: "내부 정리", description: "혼자 집중할 시간이 있어야 회복된다." },
    ],
  },
  {
    id: "q2",
    axis: ["S", "N"],
    prompt: "정보를 받아들일 때 어떤 방식이 더 자연스럽나요?",
    options: [
      { value: "S", title: "구체적 사실", description: "현실 데이터와 경험을 먼저 본다." },
      { value: "N", title: "패턴과 의미", description: "가능성과 흐름을 먼저 읽는다." },
    ],
  },
  {
    id: "q3",
    axis: ["T", "F"],
    prompt: "판단할 때 무엇이 더 우선인가요?",
    options: [
      { value: "T", title: "원칙과 논리", description: "일관성과 타당성이 중요하다." },
      { value: "F", title: "감정과 관계", description: "사람에게 미치는 영향을 함께 본다." },
    ],
  },
  {
    id: "q4",
    axis: ["J", "P"],
    prompt: "일을 다루는 기본 스타일은 어떤 편인가요?",
    options: [
      { value: "J", title: "계획 중심", description: "정리된 구조와 마감이 있어야 편하다." },
      { value: "P", title: "탐색 중심", description: "열어두고 조정할 때 오히려 잘 풀린다." },
    ],
  },
  {
    id: "q5",
    axis: ["E", "I"],
    prompt: "생각을 정리하는 방식은 무엇에 더 가깝나요?",
    options: [
      { value: "E", title: "말하면서 정리", description: "대화 속에서 아이디어가 선명해진다." },
      { value: "I", title: "혼자 정리 후 말함", description: "충분히 생각한 뒤 표현하는 편이다." },
    ],
  },
  {
    id: "q6",
    axis: ["S", "N"],
    prompt: "새로운 방식을 만났을 때 어떤 반응이 더 자주 나오나요?",
    options: [
      { value: "S", title: "검증부터 확인", description: "안정성과 실효성을 먼저 살핀다." },
      { value: "N", title: "가능성부터 탐색", description: "기존과 다른 점이 흥미롭게 보인다." },
    ],
  },
  {
    id: "q7",
    axis: ["T", "F"],
    prompt: "피드백에서 더 중요하게 보는 것은 무엇인가요?",
    options: [
      { value: "T", title: "정확성", description: "직설적이어도 핵심을 찌르는 게 낫다." },
      { value: "F", title: "수용 가능성", description: "상대가 받아들일 수 있어야 의미가 있다." },
    ],
  },
  {
    id: "q8",
    axis: ["J", "P"],
    prompt: "마감과 일정이 생기면 어떤 편인가요?",
    options: [
      { value: "J", title: "끝내고 쉰다", description: "마무리된 상태가 안정감을 준다." },
      { value: "P", title: "흐름을 타며 조정", description: "중간에 바꾸면서 최적화한다." },
    ],
  },
];

const attachmentQuestions = [
  {
    id: "a1",
    axis: "anxiety",
    prompt: "상대 반응이 늦으면 관계가 멀어진 건 아닌지 걱정한다.",
  },
  {
    id: "a2",
    axis: "avoidance",
    prompt: "누군가 너무 가까워지면 갑자기 부담스럽고 멀어지고 싶다.",
  },
  {
    id: "a3",
    axis: "anxiety",
    prompt: "확신을 받아도 금방 다시 불안해질 때가 있다.",
  },
  {
    id: "a4",
    axis: "avoidance",
    prompt: "감정적으로 기대야 하는 상황이 오면 피하고 싶어진다.",
  },
  {
    id: "a5",
    axis: "anxiety",
    prompt: "작은 표정 변화도 거절 신호처럼 느껴질 때가 있다.",
  },
  {
    id: "a6",
    axis: "avoidance",
    prompt: "문제가 생기면 대화보다 혼자 정리하는 쪽으로 먼저 간다.",
  },
];

const mbtiCopy = {
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
    title: "비교적 안정형",
    summary: "친밀감과 자율성 사이 균형이 비교적 안정적입니다.",
  },
  anxious: {
    title: "불안 애착 경향",
    summary: "관계 신호에 민감하고 확인 욕구가 높아질 가능성이 있습니다.",
  },
  avoidant: {
    title: "회피 애착 경향",
    summary: "가까워질수록 거리 조절 욕구와 자기 통제가 커질 수 있습니다.",
  },
  fearful: {
    title: "불안-회피 혼합 경향",
    summary: "가까워지고 싶지만 상처 가능성도 크게 경계하는 패턴입니다.",
  },
};

function evaluateMbti(answers) {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  for (const question of mbtiQuestions) {
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

  return { type, summary };
}

function evaluateAttachment(answers) {
  let anxiety = 0;
  let avoidance = 0;

  for (const question of attachmentQuestions) {
    const value = Number(answers[question.id]);

    if (!value) {
      return null;
    }

    if (question.axis === "anxiety") {
      anxiety += value;
    } else {
      avoidance += value;
    }
  }

  const averageAnxiety = anxiety / 3;
  const averageAvoidance = avoidance / 3;
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

  return {
    key,
    anxiety: averageAnxiety.toFixed(1),
    avoidance: averageAvoidance.toFixed(1),
    ...attachmentProfiles[key],
  };
}

function buildCombinedInsight(mbti, attachment) {
  const points = mbti.type.split("").map((letter) => mbtiCopy[letter]);
  points.push(`애착 점수는 불안 ${attachment.anxiety}, 회피 ${attachment.avoidance}입니다.`);

  if (attachment.key === "anxious") {
    points.push("확인 욕구가 올라갈 때는 추측보다 사실 확인 단계를 하나 더 두는 편이 낫습니다.");
  }

  if (attachment.key === "avoidant") {
    points.push("거리두기 자체보다 언제 다시 대화로 돌아올지를 합의하는 것이 더 중요합니다.");
  }

  if (attachment.key === "fearful") {
    points.push("끌림과 방어가 함께 작동할 수 있어, 속도보다 안전감 확보가 우선입니다.");
  }

  if (attachment.key === "secure") {
    points.push("갈등이 생겨도 회복 대화로 복귀할 기반이 비교적 탄탄한 편입니다.");
  }

  return {
    title: `${mbti.type} · ${attachment.title}`,
    summary:
      attachment.key === "secure"
        ? "기본 성향과 관계 패턴이 크게 충돌하지 않는 편입니다."
        : "성격 선호 위에 애착 반응이 덧씌워지므로, 갈등 상황에서는 평소의 MBTI 특징보다 애착 패턴이 더 크게 드러날 수 있습니다.",
    points,
  };
}

function SectionCard({ title, description, children }) {
  return (
    <Card
      className="border border-white/50 bg-white/80 shadow-[0_24px_80px_rgba(34,53,40,0.08)] backdrop-blur"
      radius="lg"
    >
      <Card.Header className="flex flex-col items-start gap-2 px-6 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
          Assessment
        </p>
        <Card.Title className="text-2xl font-black text-slate-900">{title}</Card.Title>
        <Card.Description className="max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </Card.Description>
      </Card.Header>
      <Card.Content className="px-6 pb-6">{children}</Card.Content>
    </Card>
  );
}

function MbtiQuestion({ question, value, onChange }) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-5">
      <p className="mb-4 text-sm font-semibold tracking-[0.04em] text-slate-900">{question.prompt}</p>
      <RadioGroup
        name={question.id}
        value={value ?? null}
        onChange={onChange}
        variant="secondary"
        className="gap-3"
      >
        {question.options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            className="rounded-2xl border border-slate-200 px-4 py-4 data-[selected=true]:border-emerald-500 data-[selected=true]:bg-emerald-50"
          >
            <Radio.Content className="gap-1">
              <span className="text-sm font-bold text-slate-900">{option.title}</span>
              <span className="text-sm text-slate-500">{option.description}</span>
            </Radio.Content>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}

function AttachmentQuestion({ question, value, onChange }) {
  const labels = [
    { score: "1", text: "전혀 아니다" },
    { score: "2", text: "조금 아니다" },
    { score: "3", text: "보통이다" },
    { score: "4", text: "그렇다" },
    { score: "5", text: "매우 그렇다" },
  ];

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-5">
      <p className="mb-4 text-sm font-semibold tracking-[0.04em] text-slate-900">{question.prompt}</p>
      <RadioGroup
        name={question.id}
        value={value ?? null}
        onChange={onChange}
        orientation="horizontal"
        variant="secondary"
        className="grid gap-2 sm:grid-cols-5"
      >
        {labels.map((label) => (
          <Radio
            key={label.score}
            value={label.score}
            className="rounded-2xl border border-slate-200 px-3 py-4 text-center data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-50"
          >
            <Radio.Content className="items-center gap-1">
              <span className="text-sm font-bold text-slate-900">{label.score}</span>
              <span className="text-xs text-slate-500">{label.text}</span>
            </Radio.Content>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}

export default function App() {
  const [mbtiAnswers, setMbtiAnswers] = useState({});
  const [attachmentAnswers, setAttachmentAnswers] = useState({});
  const [result, setResult] = useState(null);

  const progress = useMemo(() => {
    const answered =
      Object.keys(mbtiAnswers).length + Object.keys(attachmentAnswers).length;
    const total = mbtiQuestions.length + attachmentQuestions.length;
    return Math.round((answered / total) * 100);
  }, [attachmentAnswers, mbtiAnswers]);

  const handleAnalyze = () => {
    const mbti = evaluateMbti(mbtiAnswers);
    const attachment = evaluateAttachment(attachmentAnswers);

    if (!mbti || !attachment) {
      toast.warning("모든 문항에 응답해야 종합 분석이 가능합니다.");
      return;
    }

    setResult({
      mbti,
      attachment,
      combined: buildCombinedInsight(mbti, attachment),
    });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6efe4_0%,#fbf8f3_38%,#eef6f1_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[36px] border border-white/60 bg-[#13231f] px-6 py-8 text-white shadow-[0_30px_120px_rgba(12,23,20,0.32)] sm:px-8 sm:py-10">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top,rgba(80,211,172,0.35),transparent_55%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-emerald-300">
                Self Mapping Lab
              </p>
              <h1 className="max-w-3xl text-4xl font-black leading-none sm:text-5xl lg:text-6xl">
                MBTI와 애착유형을
                <br />
                같이 읽어야 관계가 보입니다
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                성격 선호와 관계 반응을 분리해서 보지 않고, 불안과 회피의 작동 방식까지
                한 화면에서 종합 분석합니다. 개인 진단 초안이나 상담용 인터뷰 도구로 쓰기
                쉬운 구조로 만들었습니다.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  color="success"
                  size="lg"
                  className="font-bold"
                  onPress={handleAnalyze}
                >
                  지금 결과 계산하기
                </Button>
                <div className="rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-slate-200">
                  총 {mbtiQuestions.length + attachmentQuestions.length}문항
                </div>
              </div>
            </div>

            <Card className="border border-white/10 bg-white/10 text-white shadow-none backdrop-blur-sm">
              <Card.Header className="flex flex-col items-start gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                  Progress
                </p>
                <Card.Title className="text-2xl font-black">{progress}% 완료</Card.Title>
                <Card.Description className="text-sm leading-6 text-slate-200">
                  MBTI와 애착 문항을 모두 답하면 즉시 종합 결과를 계산합니다.
                </Card.Description>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4">
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#f59e0b_0%,#34d399_100%)] transition-[width] duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-black/10 p-4">
                    <div className="font-bold text-emerald-200">MBTI</div>
                    <div className="mt-1 text-slate-200">
                      {Object.keys(mbtiAnswers).length} / {mbtiQuestions.length}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-black/10 p-4">
                    <div className="font-bold text-orange-200">애착유형</div>
                    <div className="mt-1 text-slate-200">
                      {Object.keys(attachmentAnswers).length} / {attachmentQuestions.length}
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionCard
            title="MBTI 테스트"
            description="각 문항에서 더 가까운 선택지를 고르세요. 4축 점수를 바탕으로 16가지 성향 중 현재 우세한 조합을 계산합니다."
          >
            <div className="space-y-4">
              {mbtiQuestions.map((question) => (
                <MbtiQuestion
                  key={question.id}
                  question={question}
                  value={mbtiAnswers[question.id]}
                  onChange={(value) =>
                    setMbtiAnswers((current) => ({ ...current, [question.id]: value }))
                  }
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="애착유형 테스트"
            description="1점부터 5점까지 현재 관계 반응과 얼마나 가까운지 표시하세요. 불안 축과 회피 축을 따로 평균 내서 유형을 계산합니다."
          >
            <div className="space-y-4">
              {attachmentQuestions.map((question) => (
                <AttachmentQuestion
                  key={question.id}
                  question={question}
                  value={attachmentAnswers[question.id]}
                  onChange={(value) =>
                    setAttachmentAnswers((current) => ({
                      ...current,
                      [question.id]: value,
                    }))
                  }
                />
              ))}
            </div>
            <div className="my-6 h-px bg-slate-200" />
            <Button
              size="lg"
              color="warning"
              className="w-full font-bold"
              onPress={handleAnalyze}
            >
              종합 결과 분석하기
            </Button>
          </SectionCard>
        </div>

        {result ? (
          <SectionCard
            title="종합 결과"
            description="기본 성향과 관계 반응을 함께 읽은 결과입니다. MBTI 자체보다, 스트레스 상황에서 어떤 애착 반응이 겹치는지까지 같이 봐야 해석이 선명해집니다."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="border border-emerald-100 bg-emerald-50 shadow-none">
                <Card.Header className="flex flex-col items-start gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                    MBTI
                  </p>
                  <Card.Title className="text-3xl font-black text-slate-900">
                    {result.mbti.type}
                  </Card.Title>
                  <Card.Description className="text-sm leading-6 text-slate-600">
                    {result.mbti.summary}
                  </Card.Description>
                </Card.Header>
              </Card>

              <Card className="border border-orange-100 bg-orange-50 shadow-none">
                <Card.Header className="flex flex-col items-start gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                    Attachment
                  </p>
                  <Card.Title className="text-3xl font-black text-slate-900">
                    {result.attachment.title}
                  </Card.Title>
                  <Card.Description className="text-sm leading-6 text-slate-600">
                    {result.attachment.summary}
                  </Card.Description>
                </Card.Header>
              </Card>
            </div>

            <Card className="mt-4 border border-slate-200 bg-slate-950 text-white shadow-none">
              <Card.Header className="flex flex-col items-start gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                  Combined Reading
                </p>
                <Card.Title className="text-3xl font-black">{result.combined.title}</Card.Title>
                <Card.Description className="text-sm leading-6 text-slate-300">
                  {result.combined.summary}
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <ul className="space-y-3">
                  {result.combined.points.map((point) => (
                    <li
                      key={point}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </Card.Content>
            </Card>
          </SectionCard>
        ) : null}
      </div>
    </div>
  );
}
