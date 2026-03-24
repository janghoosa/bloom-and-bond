import { useEffect, useState } from "react";
import { Card, toast } from "@heroui/react";
import { buildCombinedInsight, trackEvent } from "../lib/assessment";
import { theme } from "../lib/theme";
import { drawResultCard, shareProfiles, getMbtiVisual } from "../lib/card-drawing";
import {
  CompatibilityCard,
  DetailInsightsCard,
  KeyPointsCard,
  PracticeGuideCard,
  ResultHero,
  ResultOverview,
} from "./result-sections";
import { Modal, PrimaryActionButton, Shell } from "./common";


function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.cssText = "position:fixed;left:-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  return Promise.resolve();
}

function QuickShareBar({ result }) {
  const [saving, setSaving] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [cardImageUrl, setCardImageUrl] = useState(null);
  const [cardBlob, setCardBlob] = useState(null);

  useEffect(() => {
    return () => { if (cardImageUrl) URL.revokeObjectURL(cardImageUrl); };
  }, [cardImageUrl]);

  const handleQuickCard = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const blob = await drawResultCard(result);
      if (!blob) { toast.warning("이미지 생성에 실패했습니다."); return; }
      trackEvent("card_generated", { type: "result", mbti: result.mbti.type, attachment: result.attachment.key });
      setCardBlob(blob);
      setCardImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      if (err.name !== "AbortError") toast.warning("이미지 생성에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    if (cardImageUrl) URL.revokeObjectURL(cardImageUrl);
    setCardImageUrl(null);
    setCardBlob(null);
  };

  const handleDownload = () => {
    if (!cardImageUrl) return;
    const link = document.createElement("a");
    link.download = result.code ? `${result.code}.png` : "result.png";
    link.href = cardImageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!cardBlob) return;
    try {
      const filename = result.code ? `${result.code}.png` : "result.png";
      const file = new File([cardBlob], filename, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        trackEvent("card_shared", { type: "result", method: "native_share" });
        await navigator.share({ files: [file] });
      } else {
        handleDownload();
      }
    } catch (err) {
      if (err.name !== "AbortError") handleDownload();
    }
  };

  const handleCopyLink = async () => {
    if (!result.code) return;
    try {
      await copyToClipboard(`${window.location.origin}/result?d=${result.code}`);
      setLinkCopied(true);
      toast.success("결과 링크가 복사되었습니다.");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.warning("복사에 실패했습니다.");
    }
  };

  return (
    <>
      <Modal open={!!cardImageUrl} onClose={closeModal} ariaLabel="결과 카드 미리보기">
        <img
          src={cardImageUrl}
          alt="결과 카드"
          className="w-full rounded-2xl shadow-2xl"
          style={{ maxWidth: 360 }}
        />
        <div className="flex w-full gap-2" style={{ maxWidth: 300 }}>
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 rounded-[20px] px-4 py-3 text-sm"
            style={{ backgroundColor: theme.panelHighlight, color: theme.text, border: `1px solid ${theme.line}` }}
          >
            이미지 저장
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 rounded-[20px] px-4 py-3 text-sm"
            style={{ backgroundColor: theme.primaryStrong, color: theme.primaryContrast, border: `1px solid ${theme.primaryEdge}` }}
          >
            공유하기
          </button>
        </div>
      </Modal>

      <div
        className="flex gap-2 rounded-[22px] border px-3 py-3"
        style={{ borderColor: theme.line, backgroundColor: theme.panelDeep }}
      >
        <button
          type="button"
          onClick={handleQuickCard}
          disabled={saving}
          className="btn-spring flex-1 rounded-[18px] px-4 py-2.5 text-sm font-bold"
          style={{
            backgroundColor: theme.primaryStrong,
            color: theme.primaryContrast,
            border: `1px solid ${theme.primaryEdge}`,
          }}
        >
          {saving ? "만드는 중..." : "카드 만들기"}
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="btn-spring flex-1 rounded-[18px] px-4 py-2.5 text-sm font-bold"
          style={{
            backgroundColor: theme.panelHighlight,
            color: theme.text,
            border: `1px solid ${theme.line}`,
          }}
        >
          {linkCopied ? "복사됨!" : "링크 복사"}
        </button>
      </div>
    </>
  );
}

function ShareSection({ result, onCompareWithCode }) {
  const [saving, setSaving] = useState(false);
  const [cardImageUrl, setCardImageUrl] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [cardBlob, setCardBlob] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [compareCode, setCompareCode] = useState("");

  useEffect(() => {
    return () => {
      if (cardImageUrl) URL.revokeObjectURL(cardImageUrl);
    };
  }, [cardImageUrl]);

  const handleMakeCard = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const blob = await drawResultCard(result);
      if (!blob) {
        toast.warning("이미지 생성에 실패했습니다.");
        return;
      }
      setCardBlob(blob);
      setCardImageUrl(URL.createObjectURL(blob));
    } catch {
      toast.warning("이미지 생성에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const hasCode = !!result.code;

  const handleCopyLink = async () => {
    if (!hasCode) return;
    try {
      const url = `${window.location.origin}/result?d=${result.code}`;
      await copyToClipboard(url);
      setLinkCopied(true);
      toast.success("결과 링크가 복사되었습니다.");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.warning("복사에 실패했습니다.");
    }
  };

  const handleCopyCode = async () => {
    if (!hasCode) return;
    try {
      await copyToClipboard(result.code);
      setCodeCopied(true);
      toast.success("감정코드가 복사되었습니다.");
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      toast.warning("복사에 실패했습니다.");
    }
  };

  const closeModal = () => {
    if (cardImageUrl) URL.revokeObjectURL(cardImageUrl);
    setCardImageUrl(null);
    setCardBlob(null);
  };

  const handleDownload = () => {
    if (!cardImageUrl) return;
    const link = document.createElement("a");
    link.download = result.code ? `${result.code}.png` : "result.png";
    link.href = cardImageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareFromModal = async () => {
    if (!cardBlob) return;
    try {
      const filename = result.code ? `${result.code}.png` : "result.png";
      const file = new File([cardBlob], filename, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        handleDownload();
      }
    } catch (err) {
      if (err.name !== "AbortError") handleDownload();
    }
  };

  const itemStyle = { backgroundColor: theme.panelHighlight, borderColor: theme.line };

  return (
    <>
      <Modal open={!!cardImageUrl} onClose={closeModal} ariaLabel="결과 카드 미리보기">
        <img
          src={cardImageUrl}
          alt="결과 카드"
          className="w-full rounded-2xl shadow-2xl"
          style={{ maxWidth: 360 }}
        />
        <div className="flex w-full gap-2" style={{ maxWidth: 300 }}>
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 rounded-[20px] px-4 py-3 text-sm"
            style={{
              backgroundColor: theme.panelHighlight,
              color: theme.text,
              border: `1px solid ${theme.line}`,
            }}
          >
            이미지 저장
          </button>
          <button
            type="button"
            onClick={handleShareFromModal}
            className="flex-1 rounded-[20px] px-4 py-3 text-sm"
            style={{
              backgroundColor: theme.primaryStrong,
              color: theme.primaryContrast,
              border: `1px solid ${theme.primaryEdge}`,
            }}
          >
            공유하기
          </button>
        </div>
        <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.62)" }}>
          같은 유형이어도 점수와 반응 강도에 따라 카드 배경은 조금씩 달라질 수 있어요.
        </p>
        <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.62)" }}>
          모바일에서는 이미지를 길게 눌러 저장할 수도 있어요
        </p>
        <button
          type="button"
          onClick={closeModal}
          className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full border text-lg font-bold"
          style={{ backgroundColor: "rgba(255,255,255,0.88)", borderColor: theme.line, color: theme.text }}
          aria-label="닫기"
        >
          ×
        </button>
      </Modal>

      <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
        <Card.Header className="flex flex-col items-start gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>Share</p>
          <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>결과 공유</Card.Title>
          <Card.Description className="text-sm leading-6" style={{ color: theme.textSoft }}>
            결과 카드를 저장하거나 상대에게 검사를 보낼 수 있어요.
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-3">
          <button
            type="button"
            onClick={handleMakeCard}
            disabled={saving}
            className="w-full rounded-2xl border px-4 py-4 text-left"
            style={itemStyle}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-title text-lg font-bold" style={{ color: theme.text }}>
                {saving ? "카드 만드는 중..." : "결과 카드 만들기"}
              </div>
              <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: theme.primaryStrong, color: theme.primaryContrast }}>
                Story
              </div>
            </div>
            <div className="mt-1 text-sm leading-6" style={{ color: theme.textSoft }}>
              인스타 스토리나 피드에 올릴 수 있는 카드를 만들어요.
            </div>
            <div className="mt-3 text-xs font-semibold" style={{ color: theme.textTint }}>
              큰 미리보기 이미지로 저장할 수 있어요
            </div>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full rounded-2xl border px-4 py-4 text-left"
            style={itemStyle}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-title text-lg font-bold" style={{ color: theme.text }}>
                {linkCopied ? "복사됨!" : "결과 링크 복사"}
              </div>
              <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: theme.panelStrong, color: theme.text }}>
                Link
              </div>
            </div>
            <div className="mt-1 text-sm leading-6" style={{ color: theme.textSoft }}>
              내 결과를 볼 수 있는 링크를 복사해요.
            </div>
            <div className="mt-3 text-xs font-semibold" style={{ color: theme.textTint }}>
              바로 열어볼 수 있는 주소를 보낼 수 있어요
            </div>
          </button>
          <button
            type="button"
            onClick={handleCopyCode}
            className="w-full rounded-2xl border px-4 py-4 text-left"
            style={itemStyle}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-title text-lg font-bold" style={{ color: theme.text }}>
                {codeCopied ? "복사됨!" : "감정코드 복사"}
              </div>
              <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: theme.primaryStrong, color: theme.primaryContrast }}>
                Code
              </div>
            </div>
            <div className="mt-1 text-sm leading-6" style={{ color: theme.textSoft }}>
              내 결과 코드를 복사해서 상대에게 보낼 수 있어요.
            </div>
            <div className="mt-3 text-xs font-semibold" style={{ color: theme.textTint }}>
              비교 화면에서 바로 붙여넣을 수 있어요
            </div>
          </button>
          <div className="rounded-2xl border px-4 py-4" style={itemStyle}>
            <div className="flex items-center justify-between gap-3">
              <div className="font-title text-lg font-bold" style={{ color: theme.text }}>
                내 상대랑 맞춰보기
              </div>
              <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: theme.panelStrong, color: theme.text }}>
                Match
              </div>
            </div>
            <div className="mt-1 text-sm leading-6" style={{ color: theme.textSoft }}>
              상대의 감정코드를 붙여넣으면 두 사람의 결과를 같이 볼 수 있어요.
            </div>
            <textarea
              value={compareCode}
              onChange={(event) => setCompareCode(event.target.value)}
              placeholder="상대의 감정코드를 붙여넣어주세요"
              className="mt-3 min-h-[96px] w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: theme.panelStrong, borderColor: theme.line, color: theme.text }}
            />
            <div className="mt-3">
              <PrimaryActionButton onPress={() => onCompareWithCode(compareCode)} fullWidth={false}>
                내 상대랑 맞춰보기
              </PrimaryActionButton>
            </div>
          </div>
        </Card.Content>
      </Card>
    </>
  );
}

export function ResultPage({ result, partnerResult, onRestart, onOpenCompare, onCompareWithCode }) {
  const [activeTab, setActiveTab] = useState("me");
  const activeResult = activeTab === "partner" && partnerResult ? partnerResult : result;
  const combined =
    activeResult.combined?.sections && activeResult.combined?.practice && activeResult.combined?.compatibility
      ? activeResult.combined
      : buildCombinedInsight(activeResult.mbti, activeResult.attachment);

  const mbtiAxisLabels = {
    energy: { label: "E / I", subtitle: "외향형 / 내향형", order: ["E", "I"] },
    perception: { label: "N / S", subtitle: "직관형 / 감각형", order: ["N", "S"] },
    judgment: { label: "T / F", subtitle: "사고형 / 감정형", order: ["T", "F"] },
    lifestyle: { label: "J / P", subtitle: "판단형 / 인식형", order: ["J", "P"] },
  };

  const mbtiSectionBars = activeResult.mbti.sectionScores.map((section) => {
    const leftCount = section.leftCount ?? Number(section.scoreText.match(/\b([A-Z]) (\d+)/)?.[2] ?? 0);
    const rightCount = section.rightCount ?? Number(section.scoreText.match(/: [A-Z] (\d+)/)?.[1] ?? 0);
    const total = section.total ?? leftCount + rightCount;
    const dominantCount = Math.max(leftCount, rightCount);
    const axisInfo = mbtiAxisLabels[section.id];
    const scoreMap = { [section.left]: leftCount, [section.right]: rightCount };
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
      valueText: `${activeResult.attachment.anxiety} / 5.0`,
      progress: ((activeResult.attachment.anxietyValue ?? Number(activeResult.attachment.anxiety)) / 5) * 100,
    },
    {
      id: "avoidance",
      label: "회피 반응",
      valueText: `${activeResult.attachment.avoidance} / 5.0`,
      progress: ((activeResult.attachment.avoidanceValue ?? Number(activeResult.attachment.avoidance)) / 5) * 100,
    },
  ];

  return (
    <Shell>
      <div className="animate-section"><ResultHero combined={combined} onRestart={onRestart} /></div>
      <div className="animate-section"><QuickShareBar result={activeResult} /></div>
      {partnerResult && (
        <Card className="border" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
          <Card.Header className="flex flex-col items-start gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>Match</p>
            <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>
              두 사람 결과를 같이 볼 수 있어요
            </Card.Title>
            <Card.Description className="text-sm leading-6" style={{ color: theme.textSoft }}>
              여기서는 내 결과와 상대 결과를 번갈아 보고, 자세한 해석은 비교 화면에서 함께 볼 수 있어요.
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveTab("me")}
                className="rounded-2xl border px-4 py-4 text-left transition-colors"
                style={{
                  backgroundColor: activeTab === "me" ? theme.panelHighlight : theme.panel,
                  borderColor: activeTab === "me" ? theme.primaryStrong : theme.line,
                }}
              >
                <div className="text-sm font-bold" style={{ color: theme.text }}>내 결과</div>
                <div className="font-title mt-1 text-2xl font-bold" style={{ color: theme.text }}>
                  {result.attachment.title}
                </div>
                <div className="mt-2 text-sm leading-6" style={{ color: theme.textSoft }}>
                  {result.mbti.type} · 불안 {result.attachment.anxiety} / 회피 {result.attachment.avoidance}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("partner")}
                className="rounded-2xl border px-4 py-4 text-left transition-colors"
                style={{
                  backgroundColor: activeTab === "partner" ? theme.panelHighlight : theme.panel,
                  borderColor: activeTab === "partner" ? theme.primaryStrong : theme.line,
                }}
              >
                <div className="text-sm font-bold" style={{ color: theme.text }}>상대 결과</div>
                <div className="font-title mt-1 text-2xl font-bold" style={{ color: theme.text }}>
                  {partnerResult.attachment.title}
                </div>
                <div className="mt-2 text-sm leading-6" style={{ color: theme.textSoft }}>
                  {partnerResult.mbti.type} · 불안 {partnerResult.attachment.anxiety} / 회피 {partnerResult.attachment.avoidance}
                </div>
              </button>
            </div>
            <PrimaryActionButton onPress={onOpenCompare} fullWidth={false}>내 상대랑 맞춰보기</PrimaryActionButton>
          </Card.Content>
        </Card>
      )}
      <div className="animate-section"><ResultOverview result={activeResult} mbtiSectionBars={mbtiSectionBars} attachmentOverviewBars={attachmentOverviewBars} /></div>
      <div className="animate-section"><KeyPointsCard points={combined.points} /></div>
      <div className="animate-section"><CompatibilityCard compatibility={combined.compatibility} /></div>
      <div className="animate-section"><DetailInsightsCard sections={combined.sections} /></div>
      <div className="animate-section"><PracticeGuideCard practice={combined.practice} /></div>
      <div className="animate-section"><ShareSection result={result} onCompareWithCode={onCompareWithCode} /></div>
    </Shell>
  );
}
