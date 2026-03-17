import { Card } from "@heroui/react";
import { buildCompareInsight } from "../lib/assessment";
import { theme } from "../lib/theme";
import { PrimaryActionButton, ResultMeter, Shell } from "./common";

function CompareHero({ insight, onBack }) {
  return (
    <section
      className="rounded-[28px] border px-4 py-5 sm:rounded-[36px] sm:px-8 sm:py-10"
      style={{ borderColor: theme.line, backgroundColor: theme.secondary }}
    >
      <p className="text-xs font-bold uppercase tracking-[0.24em]" style={{ color: theme.textTint }}>
        Match View
      </p>
      <h1 className="font-title mt-3 text-3xl font-bold sm:text-5xl" style={{ color: theme.text }}>
        내 상대랑 맞춰보기
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 sm:text-base" style={{ color: theme.textSoft }}>
        {insight.summary}
      </p>
      <div className="mt-6">
        <PrimaryActionButton onPress={onBack} fullWidth={false}>두 사람 세부 결과 보러가기</PrimaryActionButton>
      </div>
    </section>
  );
}

function CoupleSnapshot({ label, result }) {
  const bars = [
    {
      label: "불안 반응",
      valueText: `${result.attachment.anxiety} / 5.0`,
      progress: ((result.attachment.anxietyValue ?? Number(result.attachment.anxiety)) / 5) * 100,
    },
    {
      label: "회피 반응",
      valueText: `${result.attachment.avoidance} / 5.0`,
      progress: ((result.attachment.avoidanceValue ?? Number(result.attachment.avoidance)) / 5) * 100,
    },
  ];

  return (
    <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
      <Card.Header className="flex flex-col items-start gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
          {label}
        </p>
        <Card.Title className="font-title text-3xl font-bold" style={{ color: theme.text }}>
          {result.mbti.type}
        </Card.Title>
        <Card.Description className="text-sm leading-6" style={{ color: theme.textSoft }}>
          {result.attachment.title}
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-3">
        {bars.map((bar) => (
          <ResultMeter
            key={bar.label}
            label={bar.label}
            valueText={bar.valueText}
            progress={bar.progress}
          />
        ))}
      </Card.Content>
    </Card>
  );
}

function CompareBulletsCard({ title, items }) {
  return (
    <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
      <Card.Header className="flex flex-col items-start gap-2">
        <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>
          {title}
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="rounded-2xl px-4 py-3 text-sm leading-6" style={{ backgroundColor: theme.panelHighlight, color: theme.text }}>
              {item}
            </li>
          ))}
        </ul>
      </Card.Content>
    </Card>
  );
}

export function ComparePage({ result, partnerResult, onBack }) {
  const insight = buildCompareInsight(result, partnerResult);

  return (
    <Shell>
      <CompareHero insight={insight} onBack={onBack} />
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <CoupleSnapshot label="나" result={result} />
        <CoupleSnapshot label="상대" result={partnerResult} />
      </div>
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
        <CompareBulletsCard title="잘 맞는 점" items={insight.bullets.strengths} />
        <CompareBulletsCard title="엇갈리기 쉬운 점" items={insight.bullets.friction} />
        <CompareBulletsCard title="대화 팁" items={insight.bullets.tips} />
      </div>
      <CompareBulletsCard title="더 잘 맞춰가는 법" items={insight.bullets.betterWays} />
    </Shell>
  );
}
