import { useState } from "react";
import { Card } from "@heroui/react";
import { ASSESSMENT_MODES } from "../lib/assessment";
import { theme } from "../lib/theme";
import { ModeChoiceCard, PrimaryActionButton, Shell } from "./common";

export function IntroPage({
  onStart,
  quickTotalQuestions,
  deepTotalQuestions,
  totalResults,
  themeMode,
  onToggleTheme,
}) {
  const [selectedMode, setSelectedMode] = useState(ASSESSMENT_MODES.quick);

  const overviewPanelStyle = {
    background: "var(--panel-deep)",
    border: "1px solid color-mix(in srgb, var(--line) 88%, white)",
  };

  const overviewCardStyle =
    themeMode === "dark"
      ? {
          background: "var(--panel-strong)",
          border: "1px solid color-mix(in srgb, var(--line) 70%, transparent)",
        }
      : {
          background: "var(--panel-highlight)",
          border: "1px solid color-mix(in srgb, var(--line) 78%, white)",
        };

  const overviewAccentColor = themeMode === "dark" ? "var(--text)" : theme.primaryStrong;

  return (
    <Shell themeMode={themeMode} onToggleTheme={onToggleTheme}>
      <section
        className="relative overflow-hidden rounded-[28px] border px-4 py-5 sm:rounded-[40px] sm:px-8 sm:py-12"
        style={{
          color: theme.text,
          borderColor: theme.line,
          backgroundColor: theme.secondary,
        }}
      >
        <div className="relative space-y-4 sm:space-y-6">
          <div className="space-y-4 sm:space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: theme.textTint }}>
              Cherry Blossom Edition
            </p>
            <h1 className="font-title max-w-3xl text-4xl font-extrabold leading-snug sm:text-5xl lg:text-6xl" style={{ color: theme.text }}>
              나를 읽고 관계를
              <br />
              이해하는 검사
            </h1>
            <p className="max-w-2xl text-sm leading-7 sm:text-base" style={{ color: theme.textSoft }}>
              사람을 만날 때 MBTI는 자주 확인하지만, 애착 패턴까지 함께 들여다보는 경우는
              많지 않습니다. 이 검사는 서로의 관계 반응을 조금 더 이해하고, 상처 주기보다
              배려하는 방향으로 연결되길 바라는 마음에서 만들었습니다.
            </p>
          </div>

          <Card className="border-0" style={overviewPanelStyle}>
            <Card.Header className="flex flex-col items-start gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
                Overview
              </p>
              <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>
                검사 구성
              </Card.Title>
              <Card.Description className="text-sm leading-6" style={{ color: theme.textSoft }}>
                모바일 기준으로 한 파트씩 넘기며 진행합니다.
              </Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-3">
              <div className="rounded-[22px] px-4 py-4" style={overviewCardStyle}>
                <div className="text-sm font-bold" style={{ color: theme.text }}>총 문항</div>
                <div className="font-title mt-1 text-2xl font-bold" style={{ color: overviewAccentColor }}>
                  간단 {quickTotalQuestions}개 / 자세히 {deepTotalQuestions}개
                </div>
              </div>
              <div className="rounded-[22px] px-4 py-4" style={overviewCardStyle}>
                <div className="text-sm font-bold" style={{ color: theme.text }}>예상 결과 조합</div>
                <div className="font-title mt-1 text-2xl font-bold" style={{ color: overviewAccentColor }}>{totalResults}개</div>
              </div>
              <div className="rounded-[22px] px-4 py-4" style={overviewCardStyle}>
                <div className="text-sm font-bold" style={{ color: theme.text }}>진행 방식</div>
                <div className="mt-1 text-sm leading-6" style={{ color: theme.text }}>
                  먼저 검사 길이를 고른 뒤, 질문 스텝으로 이동하고 마지막에 결과 전용 페이지로 넘어갑니다.
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="border-0" style={overviewPanelStyle}>
            <Card.Header className="flex flex-col items-start gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
                Mode
              </p>
              <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>
                검사 길이 선택
              </Card.Title>
              <Card.Description className="text-sm leading-6" style={{ color: theme.textSoft }}>
                먼저 가볍게 볼지, 조금 더 자세히 볼지 선택할 수 있습니다.
              </Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-3">
              <ModeChoiceCard
                title="간단 보기"
                description="핵심 문항만 빠르게 보고 결과를 확인합니다."
                meta={`${quickTotalQuestions}문항`}
                selected={selectedMode === ASSESSMENT_MODES.quick}
                onSelect={() => setSelectedMode(ASSESSMENT_MODES.quick)}
              />
              <ModeChoiceCard
                title="자세히 보기"
                description="문항을 더 넓게 확인해서 결과를 조금 더 세밀하게 읽습니다."
                meta={`${deepTotalQuestions}문항`}
                selected={selectedMode === ASSESSMENT_MODES.deep}
                onSelect={() => setSelectedMode(ASSESSMENT_MODES.deep)}
              />
            </Card.Content>
          </Card>
        </div>
      </section>

      <div className="sticky bottom-2 z-10">
        <div className="rounded-[28px] border px-3 py-3 sm:px-4" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
          <div className="mb-2 px-2 text-center sm:mb-3">
            <div className="text-sm font-bold" style={{ color: theme.text }}>
              준비되면 원하는 길이로 시작하면 된다
            </div>
            <div className="mt-1 text-xs leading-5" style={{ color: theme.textSoft }}>
              선택한 길이에 맞춰 한 파트씩 진행하고, 마지막에 결과 페이지로 이동합니다.
            </div>
          </div>
          <PrimaryActionButton onPress={() => onStart(selectedMode)}>
            {selectedMode === ASSESSMENT_MODES.deep ? "자세히 시작하기" : "간단히 시작하기"}
          </PrimaryActionButton>
        </div>
      </div>
    </Shell>
  );
}
