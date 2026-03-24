import { useEffect, useRef, useState } from "react";
import { theme } from "../lib/theme";
import {
  BinaryQuestion,
  Hero,
  PrimaryActionButton,
  ScaleQuestion,
  Shell,
} from "./common";

export function AssessmentPage({
  steps,
  activeStep,
  currentStep,
  totalSteps,
  totalQuestions,
  progress,
  onNextStep,
  onAnalyze,
  mbtiAnswers,
  attachmentAnswers,
  setMbtiAnswers,
  setAttachmentAnswers,
}) {
  const heroRef = useRef(null);
  const questionRef = useRef(null);
  const [showStickyProgress, setShowStickyProgress] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 640) return undefined;
    const target = heroRef.current;
    if (!target) return undefined;

    const observer = new window.IntersectionObserver(
      ([entry]) => setShowStickyProgress(!entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      if (typeof window === "undefined") return;
      if (window.innerWidth >= 640) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        questionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
    return () => clearTimeout(id);
  }, [currentStep]);

  const question = activeStep.questions[0];
  const questionNumber = currentStep + 1;
  const isLastStep = currentStep === totalSteps - 1;
  const answers = activeStep.kind === "mbti" ? mbtiAnswers : attachmentAnswers;
  const setAnswers = activeStep.kind === "mbti" ? setMbtiAnswers : setAttachmentAnswers;
  const currentValue = answers[question.id];
  const isAnswered = currentValue != null;

  const handleAnswer = (value) => {
    setAnswers((current) => ({ ...current, [question.id]: value }));
  };

  return (
    <Shell>
      <div className={`sticky top-2 z-20 pb-2 sm:hidden ${showStickyProgress ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"} transition-all duration-200`}>
        <div className="mx-4">
          <div className="card__content flex flex-col gap-4">
            <div className="px-4">
              <div className="h-3 overflow-hidden rounded-full" style={{ backgroundColor: theme.panelStrong }}>
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${theme.primaryStrong} 0%, ${theme.secondaryStrong} 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={heroRef}>
        <Hero progress={progress} totalQuestions={totalQuestions} />
      </div>

      <div ref={questionRef} className="space-y-3 sm:space-y-4">
        <div className="mb-3 text-center">
          <span
            className="text-xs font-bold uppercase tracking-[0.18em]"
            style={{ color: theme.textSoft }}
          >
            {questionNumber} / {totalQuestions}
          </span>
        </div>

        {activeStep.kind === "mbti" ? (
          <BinaryQuestion
            number={questionNumber}
            question={question}
            value={currentValue}
            onChange={handleAnswer}
          />
        ) : (
          <ScaleQuestion
            number={questionNumber}
            question={question}
            value={currentValue}
            onChange={handleAnswer}
          />
        )}

        <div
          className="sticky bottom-2 z-10 rounded-[22px] border px-3 py-3.5 backdrop-blur sm:static sm:mx-auto sm:max-w-md sm:px-4 sm:py-4 md:rounded-[24px] md:px-5 md:py-4"
          style={{ borderColor: theme.line, backgroundColor: theme.panelDeep }}
        >
          {isLastStep ? (
            <PrimaryActionButton onPress={onAnalyze} disabled={!isAnswered}>결과 보기</PrimaryActionButton>
          ) : (
            <PrimaryActionButton onPress={() => onNextStep(true)} disabled={!isAnswered}>다음</PrimaryActionButton>
          )}
        </div>
      </div>
    </Shell>
  );
}
