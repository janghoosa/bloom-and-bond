import { Card, Radio, RadioGroup } from "@heroui/react";
import { theme } from "../lib/theme";

export function PrimaryActionButton({ children, onPress, fullWidth = true, disabled = false }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onPress}
      disabled={disabled}
      aria-disabled={disabled}
      className={`${fullWidth ? "w-full" : ""} inline-flex min-h-[44px] items-center justify-center rounded-[20px] px-7 py-1.5 text-[15px] tracking-[0.01em] transition-opacity sm:px-8 ${
        disabled ? "opacity-55" : ""
      }`}
      style={{
        backgroundColor: disabled ? theme.panelHighlight : theme.primaryStrong,
        color: disabled ? theme.textSoft : theme.primaryContrast,
        border: `1px solid ${disabled ? theme.line : theme.primaryEdge}`,
      }}
    >
      <span className="inline-flex w-full items-center justify-center gap-2">
        <span className="text-[18px] leading-none sm:text-[19px]">{children}</span>
        <span aria-hidden="true" className="text-[20px] leading-none sm:text-[21px]">→</span>
      </span>
    </button>
  );
}

export function ResultMeter({ label, valueText, progress, accent = theme.primaryStrong, detail }) {
  return (
    <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: theme.panelHighlight }}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-bold" style={{ color: theme.text }}>{label}</div>
        <div className="text-sm font-bold" style={{ color: accent }}>{valueText}</div>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: theme.panelStrong }}>
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${progress}%`, backgroundColor: accent }}
        />
      </div>
      {detail ? <div className="mt-2 text-sm leading-6" style={{ color: theme.textSoft }}>{detail}</div> : null}
    </div>
  );
}

export function ModeChoiceCard({ title, description, meta, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-[24px] border px-4 py-4 text-left transition-colors"
      style={{
        backgroundColor: selected ? theme.panelHighlight : theme.panelStrong,
        borderColor: selected ? theme.primaryStrong : theme.line,
        boxShadow: selected ? `inset 0 0 0 1px ${theme.primaryStrong}` : "none",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="font-title text-xl font-bold" style={{ color: theme.text }}>{title}</div>
        <div
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{ backgroundColor: selected ? theme.primaryStrong : theme.panel, color: selected ? theme.primaryContrast : theme.text }}
        >
          {meta}
        </div>
      </div>
      <div className="mt-2 text-sm leading-6" style={{ color: theme.textSoft }}>{description}</div>
    </button>
  );
}

export function Shell({ children }) {
  return (
    <div className="min-h-screen" style={{ color: theme.text }}>
      <div className="mx-auto w-full max-w-[1400px] px-3 pt-3 pb-3 sm:px-6 sm:pt-8 sm:pb-8 lg:px-8 lg:pt-10 lg:pb-10">
        <div className="grid grid-cols-1 xl:grid-cols-[180px_minmax(0,960px)_180px] xl:gap-6">
          <aside className="hidden xl:block" aria-hidden="true" />
          <div className="flex min-w-0 flex-col gap-3 sm:gap-6">
            <div className="h-[52px] sm:h-[56px]" aria-hidden="true" />
            {children}
            <div className="pt-2 text-center text-xs sm:pt-4" style={{ color: theme.textSoft }}>
              <div>Bloom & Bond by hoosa</div>
              <a
                href="https://forms.gle/7vFUs9qPqbgN1thq5"
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block underline underline-offset-4"
                style={{ color: theme.textSoft }}
              >
                의견 보내기
              </a>
            </div>
          </div>
          <aside className="hidden xl:block" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export function Hero({ progress, totalQuestions }) {
  return (
    <section
      className="relative overflow-hidden rounded-[28px] border px-4 py-4 sm:rounded-[36px] sm:px-8 sm:py-10"
      style={{
        color: theme.text,
        borderColor: theme.line,
        backgroundColor: theme.secondary,
      }}
    >
      <div className="relative flex flex-col gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.26em]" style={{ color: theme.textTint }}>
            Bloom & Bond
          </p>
          <h1 className="font-title max-w-3xl text-3xl font-extrabold leading-[1.02] sm:text-5xl lg:text-6xl" style={{ color: theme.text }}>
            <span className="block">답변은 자연스럽게,</span>
            <span className="mt-1 block sm:mt-2">결과는 분리해서 읽습니다</span>
          </h1>
          <p className="max-w-2xl text-sm leading-6 sm:text-base sm:leading-7" style={{ color: theme.textSoft }}>
            너무 깊게 고민하지 않아도 됩니다. 평소에 더 가까운 쪽을 고르다 보면,
            마지막에 성향과 관계 반응을 한 번에 정리해서 볼 수 있어요.
          </p>
          <div className="inline-flex rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: theme.panel }}>
            총 {totalQuestions}문항
          </div>
        </div>

        <Card className="border shadow-none backdrop-blur-sm" style={{ backgroundColor: theme.panelDeep, borderColor: theme.line }}>
          <Card.Header className="flex flex-col items-start gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: theme.textTint }}>
              Progress
            </p>
            <Card.Title className="font-title text-2xl font-bold" style={{ color: theme.text }}>{progress}% 완료</Card.Title>
            <Card.Description className="text-sm leading-6" style={{ color: theme.textSoft }}>
              모든 문항을 답하면 결과 페이지로 이동해요.
            </Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-4">
            <div className="h-3 overflow-hidden rounded-full" style={{ backgroundColor: theme.panelStrong }}>
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${theme.primaryStrong} 0%, ${theme.secondaryStrong} 100%)`,
                }}
              />
            </div>
          </Card.Content>
        </Card>
      </div>
    </section>
  );
}

export function StepCard({ step, children }) {
  return (
    <div className="rounded-[24px] border p-3 sm:rounded-[32px] sm:p-5" style={{ borderColor: theme.line, backgroundColor: theme.panelDeep }}>
      <div className="mb-3 flex flex-col gap-1.5 px-2 sm:mb-4 sm:gap-2 sm:px-3">
        <div className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold tracking-[0.16em]" style={{ backgroundColor: theme.primaryStrong, color: "#2b1522" }}>
          STEP {step.stepNumber}
        </div>
        <h3 className="font-title text-xl font-bold" style={{ color: theme.text }}>{step.title}</h3>
        <p className="text-sm leading-6" style={{ color: theme.textSoft }}>{step.description}</p>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function BinaryQuestion({ number, question, value, onChange }) {
  const radioBaseStyle = {
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    minHeight: "auto",
    margin: "0",
    rowGap: "0.25rem",
  };

  return (
    <div className="rounded-[20px] border px-3.5 pb-3.5 pt-2.5 sm:rounded-[28px] sm:p-5" style={{ borderColor: theme.line, backgroundColor: theme.panel }}>
      <p className="mb-1.5 text-sm font-semibold leading-6 tracking-[0.02em] sm:mb-3" style={{ color: theme.text }}>
        {number}. {question.prompt}
      </p>
      <RadioGroup aria-label={question.prompt} name={question.id} value={value ?? null} onChange={onChange} className="gap-2">
        {question.options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            className="rounded-2xl border px-4 py-1 min-h-[44px] data-[selected=true]:border-transparent sm:py-3 sm:min-h-[76px]"
            style={
              value === option.value
                ? {
                    ...radioBaseStyle,
                    backgroundColor: theme.panelHighlight,
                    boxShadow: `inset 0 0 0 2px ${theme.primaryStrong}`,
                    borderColor: "transparent",
                  }
                : { ...radioBaseStyle, borderColor: theme.line, backgroundColor: theme.panelStrong }
            }
          >
            <Radio.Content className="gap-1" style={{ margin: 0, padding: "0.125rem 0" }}>
              <span className="text-sm font-bold" style={{ color: theme.text }}>{option.title}</span>
              <span className="text-sm" style={{ color: theme.textSoft }}>{option.description}</span>
            </Radio.Content>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}

export function ScaleQuestion({ number, question, value, onChange }) {
  const radioBaseStyle = {
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    minHeight: "auto",
    margin: "0",
    rowGap: "0.25rem",
  };

  const labels = [
    { score: "1", text: "전혀 아니다" },
    { score: "2", text: "조금 아니다" },
    { score: "3", text: "보통이다" },
    { score: "4", text: "그렇다" },
    { score: "5", text: "매우 그렇다" },
  ];

  return (
    <div className="rounded-[20px] border px-3.5 pb-3.5 pt-2.5 sm:rounded-[28px] sm:p-5" style={{ borderColor: theme.line, backgroundColor: theme.panel }}>
      <p className="mb-1.5 text-sm font-semibold leading-6 tracking-[0.02em] sm:mb-3" style={{ color: theme.text }}>
        {number}. {question.prompt}
      </p>
      <RadioGroup aria-label={question.prompt} name={question.id} value={value ?? null} onChange={onChange} className="grid grid-cols-5 gap-2">
        {labels.map((label) => (
          <Radio
            key={label.score}
            value={label.score}
            className="rounded-2xl border px-2 py-1 min-h-[40px] text-center data-[selected=true]:border-transparent sm:px-3 sm:py-3 sm:min-h-[64px]"
            style={
              value === label.score
                ? {
                    ...radioBaseStyle,
                    backgroundColor: theme.panelHighlight,
                    boxShadow: `inset 0 0 0 2px ${theme.primaryStrong}`,
                    borderColor: "transparent",
                  }
                : { ...radioBaseStyle, borderColor: theme.line, backgroundColor: theme.panelStrong }
            }
          >
            <Radio.Content className="w-full items-center justify-center gap-0.5 text-center whitespace-nowrap" style={{ margin: 0, padding: "0.125rem 0" }}>
              <span className="inline-block min-w-[0.95rem] text-center text-xs font-bold sm:text-sm" style={{ color: theme.text }}>
                {label.score}
              </span>
              <span className="text-[10px] sm:text-xs" style={{ color: theme.textSoft }}>{label.text}</span>
            </Radio.Content>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
