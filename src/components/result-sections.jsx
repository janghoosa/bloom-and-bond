import { Card } from "@heroui/react";
import { theme } from "../lib/theme";
import { PrimaryActionButton, ResultMeter } from "./common";

const insightEmojiMap = {
  why: "🧩",
  romance: "💗",
  conflict: "⚡",
  distance: "↔️",
  reassurance: "🫶",
};

export function ResultHero({ combined, onRestart }) {
  return (
    <section className="rounded-[28px] border px-4 py-5 sm:rounded-[36px] sm:px-8 sm:py-10" style={{ borderColor: theme.line, backgroundColor: theme.secondary }}>
      <p className="text-xs font-bold uppercase tracking-[0.24em]" style={{ color: theme.textTint }}>
        Result
      </p>
      <h1 className="font-title mt-3 text-3xl font-extrabold leading-none sm:text-5xl" style={{ color: theme.text }}>
        {combined.title}
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 sm:text-base" style={{ color: theme.textSoft }}>
        {combined.summary}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <PrimaryActionButton onPress={onRestart} fullWidth={false}>다시 검사하기</PrimaryActionButton>
      </div>
    </section>
  );
}

export function ResultOverview({ result, mbtiSectionBars, attachmentOverviewBars }) {
  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
        <Card.Header className="flex flex-col items-start gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
            성향 결과
          </p>
        <Card.Title className="font-title text-3xl font-bold" style={{ color: theme.text }}>{result.mbti.type}</Card.Title>
        <Card.Description className="text-sm leading-6" style={{ color: theme.textSoft }}>
          {result.mbti.summary}
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-3">
        {mbtiSectionBars.map((section) => (
          <ResultMeter
              key={section.id}
              label={`${section.label} ${section.subtitle ? `· ${section.subtitle}` : ""}`}
              valueText={section.dominant}
              progress={section.progress}
            detail={section.detail}
          />
        ))}
        <div className="text-xs leading-5" style={{ color: theme.textSoft }}>
          MBTI 결과는 간단한 선택형 문항을 바탕으로 하므로, 상황과 컨디션에 따라 달라질 수 있어요!
        </div>
      </Card.Content>
      </Card>

      <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
        <Card.Header className="flex flex-col items-start gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
            관계 결과
          </p>
          <Card.Title className="font-title text-3xl font-bold" style={{ color: theme.text }}>
            {result.attachment.title}
          </Card.Title>
          <Card.Description className="text-sm leading-6" style={{ color: theme.textSoft }}>
            {result.attachment.summary}
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-3">
          <div className="rounded-2xl px-4 py-3 text-sm leading-6" style={{ backgroundColor: theme.panelHighlight, color: theme.textSoft }}>
            불안과 회피는 모두 5점 만점 기준이며, 평균 3.4 이상이면 해당 경향이 높은 편으로 봅니다.
          </div>
          {attachmentOverviewBars.map((item) => (
            <ResultMeter
              key={item.id}
              label={item.label}
              valueText={item.valueText}
              progress={item.progress}
              accent={theme.primaryStrong}
            />
          ))}
        </Card.Content>
      </Card>
    </div>
  );
}

export function KeyPointsCard({ points }) {
  return (
    <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
      <Card.Header className="flex flex-col items-start gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
          종합 해석
        </p>
        <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>핵심 포인트</Card.Title>
      </Card.Header>
      <Card.Content>
        <ul className="space-y-3">
          {points.map((point) => (
            <li key={point} className="rounded-2xl px-4 py-3 text-sm leading-6" style={{ backgroundColor: theme.panelHighlight, color: theme.text }}>
              {point}
            </li>
          ))}
        </ul>
      </Card.Content>
    </Card>
  );
}

export function PrimaryInsightCard({ section }) {
  return (
    <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
      <Card.Header className="flex flex-col items-start gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
          세부 해석
        </p>
        <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>
          왜 이런 반응이 올라올 수 있을까
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="rounded-2xl border px-4 py-4" style={{ backgroundColor: theme.panelHighlight, borderColor: theme.line }}>
          <div className="font-title text-xl font-bold" style={{ color: theme.text }}>
            {section.title}
          </div>
          <div className="mt-2.5 h-px" style={{ backgroundColor: theme.line }} />
          <div className="mt-3 text-sm leading-7" style={{ color: theme.text }}>
            {section.body}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

export function DetailInsightsCard({ sections }) {
  return (
    <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
      <Card.Header className="flex flex-col items-start gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
          세부 해석
        </p>
        <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>
          관계 안에서 어떻게 나타날 수 있을까
        </Card.Title>
      </Card.Header>
      <Card.Content className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="rounded-2xl border px-4 py-4" style={{ backgroundColor: theme.panelHighlight, borderColor: theme.line }}>
            <div className="font-title text-xl font-bold" style={{ color: theme.text }}>
              <span aria-hidden="true" className="mr-2">{insightEmojiMap[section.id] ?? "•"}</span>
              {section.title}
            </div>
            <div className="mt-2.5 h-px" style={{ backgroundColor: theme.line }} />
            <div className="mt-3 text-sm leading-7" style={{ color: theme.text }}>
              {section.body}
            </div>
          </div>
        ))}
      </Card.Content>
    </Card>
  );
}

function splitSentences(text) {
  return text.split(/(?<=\.\s)/).map((s) => s.trim()).filter(Boolean);
}

function CompatibilityList({ items }) {
  const raw = Array.isArray(items) ? items : [items];
  const list = raw.flatMap(splitSentences);
  return (
    <ul className="mt-3 space-y-2">
      {list.map((item) => (
        <li key={item} className="text-sm leading-6" style={{ color: theme.text }}>
          · {item}
        </li>
      ))}
    </ul>
  );
}

export function CompatibilityCard({ compatibility }) {
  return (
    <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
      <Card.Header className="flex flex-col items-start gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
          관계 궁합
        </p>
        <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>
          어떤 상대와 더 편할 수 있을까
        </Card.Title>
      </Card.Header>
      <Card.Content className="space-y-3">
        <div className="rounded-2xl border px-4 py-4" style={{ backgroundColor: theme.panelHighlight, borderColor: theme.line }}>
          <div className="font-title text-lg font-bold" style={{ color: theme.text }}>
            🤝 잘 맞을 수 있는 상대
          </div>
          <CompatibilityList items={compatibility.goodMatch} />
        </div>

        <div className="rounded-2xl border px-4 py-4" style={{ backgroundColor: theme.panelHighlight, borderColor: theme.line }}>
          <div className="font-title text-lg font-bold" style={{ color: theme.text }}>
            ⚠️ 부딪히기 쉬운 상대
          </div>
          <CompatibilityList items={compatibility.hardMatch} />
        </div>

        <div className="rounded-2xl border px-4 py-4" style={{ backgroundColor: theme.panelHighlight, borderColor: theme.line }}>
          <div className="font-title text-lg font-bold" style={{ color: theme.text }}>
            🧠 왜 그런지
          </div>
          <CompatibilityList items={compatibility.reason} />
          <p className="mt-3 text-sm leading-7 font-medium" style={{ color: theme.textTint }}>
            {compatibility.reasonSummary}
          </p>
        </div>
      </Card.Content>
    </Card>
  );
}

export function PracticeGuideCard({ practice }) {
  return (
    <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
      <Card.Header className="flex flex-col items-start gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
          연습 가이드
        </p>
        <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>
          지금 연습하면 좋은 포인트
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="space-y-3">
          {practice.map((item) => (
            <div key={`${item.priority}-${item.title}`} className="rounded-2xl border px-4 py-4" style={{ backgroundColor: theme.panelHighlight, borderColor: theme.line }}>
              <div className="flex items-center justify-between gap-3">
                <div className="font-title text-lg font-bold" style={{ color: theme.text }}>
                  {item.title}
                </div>
                <div className="text-sm font-extrabold sm:text-base" style={{ color: theme.primaryStrong }}>
                  {item.priority}
                </div>
              </div>
              <div
                className="mt-3 rounded-xl border px-3 py-2 text-sm font-bold"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--panel-soft) 72%, var(--panel-highlight) 28%)",
                  borderColor: theme.line,
                  color: theme.text,
                }}
              >
                {item.example}
              </div>
              <div className="mt-3 text-sm leading-6" style={{ color: theme.textSoft }}>
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
