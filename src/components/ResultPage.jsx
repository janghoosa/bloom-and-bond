import { Card } from "@heroui/react";
import { buildCombinedInsight } from "../lib/assessment";
import { theme } from "../lib/theme";
import { PrimaryActionButton, ResultMeter, Shell } from "./common";

export function ResultPage({ result, onRestart, themeMode, onToggleTheme }) {
  const combined = result.combined?.sections ? result.combined : buildCombinedInsight(result.mbti, result.attachment);
  const mbtiAxisLabels = {
    energy: { label: "E / I", subtitle: "외향형 / 내향형", order: ["E", "I"] },
    perception: { label: "N / S", subtitle: "직관형 / 감각형", order: ["N", "S"] },
    judgment: { label: "T / F", subtitle: "사고형 / 감정형", order: ["T", "F"] },
    lifestyle: { label: "J / P", subtitle: "판단형 / 인식형", order: ["J", "P"] },
  };

  const mbtiSectionBars = result.mbti.sectionScores.map((section) => {
    const leftCount = section.leftCount ?? Number(section.scoreText.match(/\b([A-Z]) (\d+)/)?.[2] ?? 0);
    const rightCount = section.rightCount ?? Number(section.scoreText.match(/: [A-Z] (\d+)/)?.[1] ?? 0);
    const total = section.total ?? leftCount + rightCount;
    const dominantCount = Math.max(leftCount, rightCount);
    const axisInfo = mbtiAxisLabels[section.id];
    const scoreMap = {
      [section.left]: leftCount,
      [section.right]: rightCount,
    };
    const orderedScoreText = axisInfo
      ? `${axisInfo.order[0]} ${scoreMap[axisInfo.order[0]] ?? 0} : ${axisInfo.order[1]} ${scoreMap[axisInfo.order[1]] ?? 0}`
      : section.scoreText;

    return {
      ...section,
      label: axisInfo?.label ?? section.title,
      subtitle: axisInfo?.subtitle ?? "",
      progress: total ? (dominantCount / total) * 100 : 0,
      detail: `우세: ${section.dominant} · ${orderedScoreText}`,
    };
  });

  const attachmentOverviewBars = [
    {
      id: "anxiety",
      label: "불안 반응",
      valueText: `${result.attachment.anxiety} / 5.0`,
      progress: ((result.attachment.anxietyValue ?? Number(result.attachment.anxiety)) / 5) * 100,
    },
    {
      id: "avoidance",
      label: "회피 반응",
      valueText: `${result.attachment.avoidance} / 5.0`,
      progress: ((result.attachment.avoidanceValue ?? Number(result.attachment.avoidance)) / 5) * 100,
    },
  ];

  return (
    <Shell themeMode={themeMode} onToggleTheme={onToggleTheme}>
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
            <div
              className="rounded-2xl px-4 py-3 text-sm leading-6"
              style={{ backgroundColor: theme.panelHighlight, color: theme.textSoft }}
            >
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

      <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
        <Card.Header className="flex flex-col items-start gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
            종합 해석
          </p>
          <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>핵심 포인트</Card.Title>
        </Card.Header>
        <Card.Content>
          <ul className="space-y-3">
            {combined.points.map((point) => (
              <li key={point} className="rounded-2xl px-4 py-3 text-sm leading-6" style={{ backgroundColor: theme.panelHighlight, color: theme.textSoft }}>
                {point}
              </li>
            ))}
          </ul>
        </Card.Content>
      </Card>

      <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
        <Card.Header className="flex flex-col items-start gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
            세부 해석
          </p>
          <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>
            관계 안에서 어떻게 나타날 수 있나
          </Card.Title>
        </Card.Header>
        <Card.Content className="space-y-3">
          {combined.sections.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border px-4 py-4"
              style={{ backgroundColor: theme.panelHighlight, borderColor: theme.line }}
            >
              <div className="font-title text-xl font-bold" style={{ color: theme.text }}>
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
          <ul className="space-y-3">
            {combined.practice.map((point) => (
              <li key={point} className="rounded-2xl px-4 py-3 text-sm leading-6" style={{ backgroundColor: theme.panelHighlight, color: theme.text }}>
                {point}
              </li>
            ))}
          </ul>
        </Card.Content>
      </Card>
    </Shell>
  );
}
