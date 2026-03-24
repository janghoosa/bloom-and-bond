import { useEffect, useState } from "react";
import { Card, toast } from "@heroui/react";
import { buildCompareInsight, trackEvent } from "../lib/assessment";
import { theme } from "../lib/theme";
import { drawCoupleCard } from "../lib/card-drawing";
import { Modal, PrimaryActionButton, ResultMeter, Shell } from "./common";

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
      trackEvent("card_generated", { type: "couple" });
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
      <Modal open={!!cardImageUrl} onClose={closeModal} ariaLabel="커플 카드 미리보기">
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
          두 사람의 애착유형에 따라 카드 배경색이 달라져요.
        </p>
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
      </Modal>
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
