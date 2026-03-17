import { useEffect, useState } from "react";
import { Card, toast } from "@heroui/react";
import { buildCompareInsight } from "../lib/assessment";
import { theme } from "../lib/theme";
import { PrimaryActionButton, ResultMeter, Shell } from "./common";

const compareCardEmoji = {
  "잘 맞는 점": "🤝",
  "엇갈리기 쉬운 점": "⚠️",
  "대화 팁": "💬",
  "더 잘 맞춰가는 법": "🌱",
  "첫 번째 사람에게 중요한 점": "🌷",
  "두 번째 사람에게 중요한 점": "🌼",
};

function formatCompareText(text) {
  return text
    .replaceAll(". ", ".\n")
    .replaceAll("? ", "?\n");
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
  if (line) ctx.fillText(line, x, lineY);
}

const coupleGradientColors = {
  secure: { start: "#fff7fb", mid: "#ffe3ee", end: "#ff9fc2" },
  anxious: { start: "#fff1f8", mid: "#ffcde4", end: "#ff6fb2" },
  avoidant: { start: "#fff8fc", mid: "#f5deeb", end: "#d48ab2" },
  fearful: { start: "#fff0f7", mid: "#ffcadf", end: "#ff5ea6" },
};

async function drawCoupleCard(result, partnerResult, insight) {
  const displayHost = typeof window !== "undefined" ? window.location.host : "bloom-and-bond.pages.dev";
  const W = 1080;
  const H = 1440;
  const PAD = 84;

  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const myColors = coupleGradientColors[result.attachment.key] ?? coupleGradientColors.secure;
  const partnerColors = coupleGradientColors[partnerResult.attachment.key] ?? coupleGradientColors.secure;
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, myColors.start);
  grad.addColorStop(0.3, myColors.mid);
  grad.addColorStop(0.7, partnerColors.mid);
  grad.addColorStop(1, partnerColors.end);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(80, 20, 50, 0.08)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  ctx.fillStyle = "#d94f98";
  ctx.font = "700 32px Pretendard";
  const brandText = "BLOOM & BOND";
  const brandWidth = ctx.measureText(brandText).width;
  ctx.fillText(brandText, PAD, PAD);

  ctx.font = "500 32px Pretendard";
  ctx.fillText("MATCH VIEW", PAD + brandWidth + 20, PAD);

  // 두 사람 MBTI
  ctx.fillStyle = "#251822";
  ctx.font = "900 160px Pretendard";
  ctx.fillText(result.mbti.type, PAD, 160);

  ctx.fillStyle = "#d94f98";
  ctx.font = "700 52px Pretendard";
  const ampWidth = ctx.measureText("&").width;
  ctx.fillText("&", (W - ampWidth) / 2, 280);

  ctx.fillStyle = "#251822";
  ctx.font = "900 160px Pretendard";
  const partnerTypeWidth = ctx.measureText(partnerResult.mbti.type).width;
  ctx.fillText(partnerResult.mbti.type, W - PAD - partnerTypeWidth, 330);

  // 키워드
  ctx.fillStyle = "#251822";
  ctx.font = "700 44px Pretendard";
  ctx.fillText(insight.matchKeyword, PAD, 550);

  // 잘 맞는 점
  ctx.fillStyle = "#d94f98";
  ctx.font = "700 26px Pretendard";
  ctx.fillText("잘 맞는 점", PAD, 640);

  ctx.fillStyle = "#251822";
  ctx.font = "400 32px Pretendard";
  wrapText(ctx, insight.sections[0].body, PAD, 678, W - PAD * 2, 42);

  // 엇갈리기 쉬운 점
  ctx.fillStyle = "#d94f98";
  ctx.font = "700 26px Pretendard";
  ctx.fillText("엇갈리기 쉬운 점", PAD, 860);

  ctx.fillStyle = "#251822";
  ctx.font = "400 32px Pretendard";
  wrapText(ctx, insight.sections[1].body, PAD, 898, W - PAD * 2, 42);

  // 대화 팁
  ctx.fillStyle = "#d94f98";
  ctx.font = "700 26px Pretendard";
  ctx.fillText("대화 팁", PAD, 1080);

  ctx.fillStyle = "#251822";
  ctx.font = "400 32px Pretendard";
  wrapText(ctx, insight.sections[2].body, PAD, 1118, W - PAD * 2, 42);

  ctx.fillStyle = "#d94f98";
  ctx.font = "600 28px Pretendard";
  ctx.fillText(displayHost, PAD, H - PAD - 8);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function CoupleCardSection({ result, partnerResult, insight }) {
  const [saving, setSaving] = useState(false);
  const [cardImageUrl, setCardImageUrl] = useState(null);
  const [cardBlob, setCardBlob] = useState(null);

  useEffect(() => {
    return () => {
      if (cardImageUrl) URL.revokeObjectURL(cardImageUrl);
    };
  }, [cardImageUrl]);

  const handleMakeCard = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const blob = await drawCoupleCard(result, partnerResult, insight);
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

  const closeModal = () => {
    if (cardImageUrl) URL.revokeObjectURL(cardImageUrl);
    setCardImageUrl(null);
    setCardBlob(null);
  };

  const handleDownload = () => {
    if (!cardImageUrl) return;
    const link = document.createElement("a");
    link.download = `match-${result.mbti.type}-${partnerResult.mbti.type}.png`;
    link.href = cardImageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!cardBlob) return;
    try {
      const filename = `match-${result.mbti.type}-${partnerResult.mbti.type}.png`;
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

  return (
    <>
      {cardImageUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto px-6 py-12"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={closeModal}
        >
          <div
            className="relative my-auto flex w-full max-w-sm flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={cardImageUrl}
              alt="커플 카드"
              className="w-full rounded-2xl shadow-2xl"
              style={{ maxWidth: 360 }}
            />
            <div className="flex w-full gap-2" style={{ maxWidth: 360 }}>
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
            <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
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
          <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>커플 카드</Card.Title>
          <Card.Description className="text-sm leading-6" style={{ color: theme.textSoft }}>
            두 사람의 결과를 담은 카드를 만들어 공유할 수 있어요.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <button
            type="button"
            onClick={handleMakeCard}
            disabled={saving}
            className="w-full rounded-2xl border px-4 py-4 text-left"
            style={{ backgroundColor: theme.panelHighlight, borderColor: theme.line }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-title text-lg font-bold" style={{ color: theme.text }}>
                {saving ? "카드 만드는 중..." : "커플 카드 만들기"}
              </div>
              <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: theme.primaryStrong, color: theme.primaryContrast }}>
                Match
              </div>
            </div>
            <div className="mt-1 text-sm leading-6" style={{ color: theme.textSoft }}>
              두 사람의 MBTI와 관계 인사이트를 한 장에 담아요.
            </div>
          </button>
        </Card.Content>
      </Card>
    </>
  );
}

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
          <span aria-hidden="true" className="mr-2">{compareCardEmoji[title] ?? "•"}</span>
          {title}
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="rounded-2xl px-4 py-3 text-sm leading-7 whitespace-pre-line" style={{ backgroundColor: theme.panelHighlight, color: theme.text }}>
              {formatCompareText(item)}
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
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <CompareBulletsCard title="첫 번째 사람에게 중요한 점" items={insight.bullets.firstPersonFocus} />
        <CompareBulletsCard title="두 번째 사람에게 중요한 점" items={insight.bullets.secondPersonFocus} />
      </div>
      <CompareBulletsCard title="더 잘 맞춰가는 법" items={insight.bullets.sharedTips} />
      <CoupleCardSection result={result} partnerResult={partnerResult} insight={insight} />
    </Shell>
  );
}
