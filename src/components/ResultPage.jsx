import { useEffect, useState } from "react";
import { Card, toast } from "@heroui/react";
import { buildCombinedInsight } from "../lib/assessment";
import { theme } from "../lib/theme";
import {
  CompatibilityCard,
  DetailInsightsCard,
  KeyPointsCard,
  PracticeGuideCard,
  ResultHero,
  ResultOverview,
} from "./result-sections";
import { PrimaryActionButton, Shell } from "./common";

const shareProfiles = {
  secure: {
    label: "자연스럽게 흐르는 타입",
    quote: "편안하게 마음을 나누고\n자연스럽게 가까워지는 사람",
    publicAttachmentLabel: "안정적으로 연결되는 타입",
    gradient: ["#fff7fb", "#ffe3ee", "#ff9fc2"],
  },
  anxious: {
    label: "연결을 소중히 여기는 타입",
    quote: "작은 신호도 놓치지 않고\n마음을 읽으려는 사람",
    publicAttachmentLabel: "마음을 세심하게 읽는 타입",
    gradient: ["#fff1f8", "#ffcde4", "#ff6fb2"],
  },
  avoidant: {
    label: "나만의 속도가 있는 타입",
    quote: "충분히 안전하다고 느낄 때\n깊이 열리는 사람",
    publicAttachmentLabel: "천천히 가까워지는 타입",
    gradient: ["#fff8fc", "#f5deeb", "#d48ab2"],
  },
  fearful: {
    label: "신중하게 마음을 여는 타입",
    quote: "진심을 나누기까지 조심스럽지만\n그만큼 깊은 사람",
    publicAttachmentLabel: "신중하게 마음을 여는 타입",
    gradient: ["#fff0f7", "#ffcadf", "#ff5ea6"],
  },
};

function getMbtiVisual(type) {
  const intuitive = type[1] === "N";
  const thinking = type[2] === "T";

  return {
    accent: intuitive ? "#d94f98" : "#cc5d98",
    accentSoft: thinking ? "rgba(182, 93, 138, 0.18)" : "rgba(255, 134, 184, 0.2)",
  };
}

function normalizeAttachmentScore(value) {
  return Math.max(0, Math.min(1, ((value ?? 3) - 1) / 4));
}

function getGradientGeometry(attachment, width, height) {
  const anxiety = normalizeAttachmentScore(attachment.anxietyValue ?? Number(attachment.anxiety));
  const avoidance = normalizeAttachmentScore(attachment.avoidanceValue ?? Number(attachment.avoidance));

  switch (attachment.key) {
    case "anxious":
      return {
        start: [width * (0.5 - avoidance * 0.12), height * (0.24 - anxiety * 0.2)],
        end: [width * (0.48 + avoidance * 0.4), height * (0.72 + avoidance * 0.24)],
      };
    case "avoidant":
      return {
        start: [width * (0.06 + anxiety * 0.18), height * (0.18 + anxiety * 0.2)],
        end: [width * (0.72 + avoidance * 0.24), height * (0.52 + avoidance * 0.28)],
      };
    case "fearful":
      return {
        start: [width * (0.48 - anxiety * 0.1), height * (0.2 - anxiety * 0.12)],
        end: [width * (0.38 + avoidance * 0.3), height * (0.76 + avoidance * 0.2)],
      };
    default:
      return {
        start: [width * (0.14 + anxiety * 0.08), height * (0.1 + anxiety * 0.08)],
        end: [width * (0.74 + avoidance * 0.14), height * (0.78 + avoidance * 0.12)],
      };
  }
}

async function drawResultCard(result) {
  const profile = shareProfiles[result.attachment.key] ?? shareProfiles.secure;
  const combined = result.combined?.points ? result.combined : buildCombinedInsight(result.mbti, result.attachment);
  const highlightPoints = combined.points.slice(0, 3);
  const visual = getMbtiVisual(result.mbti.type);
  const displayHost = typeof window !== "undefined" ? window.location.host : "bloom-and-bond.pages.dev";
  const W = 1080;
  const H = 1440;
  const PAD = 84;

  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const geometry = getGradientGeometry(result.attachment, W, H);
  const [x0, y0] = geometry.start;
  const [x1, y1] = geometry.end;
  const grad = ctx.createLinearGradient(x0, y0, x1, y1);
  grad.addColorStop(0, profile.gradient[0]);
  grad.addColorStop(0.58, profile.gradient[1]);
  grad.addColorStop(1, profile.gradient[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = visual.accent;
  ctx.font = "700 32px Pretendard";
  ctx.textBaseline = "top";
  ctx.fillText("BLOOM & BOND", PAD, PAD);

  ctx.fillStyle = "#251822";
  ctx.font = "900 210px Pretendard";
  ctx.fillText(result.mbti.type, PAD, PAD + 62);

  ctx.fillStyle = "#251822";
  ctx.font = "700 52px Pretendard";
  ctx.fillText(profile.label, PAD, PAD + 332);

  ctx.fillStyle = "#6f5564";
  ctx.font = "400 44px Pretendard";
  const lines = profile.quote.split("\n");
  ctx.fillText(`\u201C${lines[0]}`, PAD, 560);
  if (lines[1]) {
    ctx.fillText(`${lines[1]}\u201D`, PAD, 618);
  }

  ctx.fillStyle = visual.accent;
  ctx.font = "700 28px Pretendard";
  ctx.fillText("핵심 포인트", PAD, 760);

  ctx.fillStyle = "#251822";
  ctx.font = "700 36px Pretendard";
  highlightPoints.forEach((point, index) => {
    const y = 840 + index * 148;
    ctx.fillStyle = visual.accent;
    ctx.fillText(`${index + 1}.`, PAD, y);
    ctx.fillStyle = "#251822";
    wrapText(ctx, point, PAD + 56, y, W - PAD * 2 - 56, 50);
  });

  ctx.fillStyle = visual.accent;
  ctx.font = "600 28px Pretendard";
  ctx.fillText(displayHost, PAD, H - PAD - 8);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, lineY);
      line = words[i];
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    ctx.fillText(line, x, lineY);
  }
}

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
      {cardImageUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto px-4 py-6"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={closeModal}
        >
          <div
            className="relative my-auto flex w-full max-w-sm flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
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
          </div>
        </div>
      )}

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
      <ResultHero combined={combined} onRestart={onRestart} />
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
      <ResultOverview result={activeResult} mbtiSectionBars={mbtiSectionBars} attachmentOverviewBars={attachmentOverviewBars} />
      <KeyPointsCard points={combined.points} />
      <CompatibilityCard compatibility={combined.compatibility} />
      <DetailInsightsCard sections={combined.sections} />
      <PracticeGuideCard practice={combined.practice} />
      <ShareSection result={result} onCompareWithCode={onCompareWithCode} />
    </Shell>
  );
}
