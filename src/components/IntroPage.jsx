import { useState } from "react";
import { Card } from "@heroui/react";
import { theme } from "../lib/theme";
import { PrimaryActionButton, Shell } from "./common";

export function IntroPage({
  onStart,
  onCompareWithCodes,
  totalQuestions,
  totalResults,
  hasPartner,
}) {
  const [showCompareInputs, setShowCompareInputs] = useState(false);
  const [myCode, setMyCode] = useState("");
  const [partnerCode, setPartnerCode] = useState("");

  const overviewPanelStyle = {
    background: "var(--panel-deep)",
    border: "1px solid color-mix(in srgb, var(--line) 88%, white)",
  };

  const overviewCardStyle = {
    background: "var(--panel-highlight)",
    border: "1px solid color-mix(in srgb, var(--line) 78%, white)",
  };

  const overviewAccentColor = theme.primaryStrong;

  return (
    <Shell>
      {hasPartner && (
        <div
          className="rounded-2xl border px-4 py-3 text-center"
          style={{ borderColor: theme.primaryEdge, backgroundColor: theme.panelHighlight }}
        >
          <div className="text-sm font-bold" style={{ color: theme.text }}>
            상대방이 검사를 보냈어요
          </div>
          <div className="mt-1 text-xs" style={{ color: theme.textSoft }}>
            검사를 완료하면 내 상대랑 맞춰보는 화면으로 이어져요.
          </div>
        </div>
      )}
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
              Bloom & Bond - Cherry Blossom Edition
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
                모바일에서는 한 파트씩 넘기며 진행해요.
              </Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-3">
              <div className="rounded-[22px] px-4 py-4" style={overviewCardStyle}>
                <div className="text-sm font-bold" style={{ color: theme.text }}>총 문항</div>
                <div className="font-title mt-1 text-2xl font-bold" style={{ color: overviewAccentColor }}>
                  {totalQuestions}개
                </div>
              </div>
              <div className="rounded-[22px] px-4 py-4" style={overviewCardStyle}>
                <div className="text-sm font-bold" style={{ color: theme.text }}>예상 결과 조합</div>
                <div className="font-title mt-1 text-2xl font-bold" style={{ color: overviewAccentColor }}>{totalResults}개</div>
              </div>
              <div className="rounded-[22px] px-4 py-4" style={overviewCardStyle}>
                <div className="text-sm font-bold" style={{ color: theme.text }}>예상 소요 시간</div>
                <div className="font-title mt-1 text-2xl font-bold" style={{ color: overviewAccentColor }}>약 5분</div>
              </div>
              <div className="rounded-[22px] px-4 py-4" style={overviewCardStyle}>
                <div className="text-sm font-bold" style={{ color: theme.text }}>진행 방식</div>
                <div className="mt-1 text-sm leading-6" style={{ color: theme.text }}>
                  문항은 순서대로 이어지고, 결과는 마지막에 한 번에 정리돼요.
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="border-0" style={overviewPanelStyle}>
            <Card.Header className="flex flex-col items-start gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
                Match
              </p>
              <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>
                이미 감정코드가 있다면 바로 비교하기
              </Card.Title>
              <Card.Description className="text-sm leading-6" style={{ color: theme.textSoft }}>
                두 사람의 감정코드를 붙여넣으면 바로 맞춰보는 화면으로 넘어가요.
              </Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-3">
              {!showCompareInputs ? (
                <PrimaryActionButton onPress={() => setShowCompareInputs(true)} fullWidth={false}>
                  감정코드 입력하기
                </PrimaryActionButton>
              ) : (
                <>
                  <textarea
                    value={myCode}
                    onChange={(event) => setMyCode(event.target.value)}
                    placeholder="내 감정코드"
                    className="min-h-[84px] w-full rounded-[22px] border px-4 py-3 text-sm outline-none"
                    style={{ backgroundColor: theme.panelStrong, borderColor: theme.line, color: theme.text }}
                  />
                  <textarea
                    value={partnerCode}
                    onChange={(event) => setPartnerCode(event.target.value)}
                    placeholder="상대 감정코드"
                    className="min-h-[84px] w-full rounded-[22px] border px-4 py-3 text-sm outline-none"
                    style={{ backgroundColor: theme.panelStrong, borderColor: theme.line, color: theme.text }}
                  />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <PrimaryActionButton onPress={() => onCompareWithCodes(myCode, partnerCode)} fullWidth={false}>
                      바로 비교하기
                    </PrimaryActionButton>
                    <button
                      type="button"
                      onClick={() => setShowCompareInputs(false)}
                      className="min-h-[44px] rounded-[20px] border px-4 py-1.5 text-sm font-bold"
                      style={{ borderColor: theme.line, color: theme.text, backgroundColor: theme.panelHighlight }}
                    >
                      닫기
                    </button>
                  </div>
                </>
              )}
            </Card.Content>
          </Card>
        </div>
      </section>

      <p className="text-center text-xs leading-5" style={{ color: theme.textSoft }}>
        이 검사는 서버에 어떤 데이터도 저장하지 않습니다.<br />
        모든 응답과 결과는 브라우저에서만 처리되며, 페이지를 닫으면 사라집니다.
      </p>

      <div className="sticky bottom-2 z-10">
        <div className="rounded-[28px] border px-3 py-3 sm:px-4" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
          <div className="mb-2 px-2 text-center sm:mb-3">
            <div className="text-base font-bold sm:text-lg" style={{ color: theme.text }}>
              준비되면 시작해보세요
            </div>
            <div className="mt-1 text-sm leading-6 sm:text-[15px]" style={{ color: theme.textSoft }}>
              한 파트씩 진행하고, 마지막에 결과 페이지로 이동해요.
            </div>
          </div>
          <PrimaryActionButton onPress={onStart}>
            검사 시작하기
          </PrimaryActionButton>
        </div>
      </div>
    </Shell>
  );
}
