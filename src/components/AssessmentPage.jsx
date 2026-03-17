import { useEffect, useRef, useState } from "react";
import { Card } from "@heroui/react";
import { theme } from "../lib/theme";
import {
  BinaryQuestion,
  Hero,
  PrimaryActionButton,
  ScaleQuestion,
  Shell,
  StepCard,
} from "./common";

export function AssessmentPage({
  steps,
  activeStep,
  currentStep,
  totalSteps,
  totalQuestions,
  activeAnsweredCount,
  isCurrentStepComplete,
  progress,
  onNextStep,
  onAnalyze,
  mbtiAnswers,
  attachmentAnswers,
  setMbtiAnswers,
  setAttachmentAnswers,
}) {
  const questionRefs = useRef([]);
  const footerRef = useRef(null);
  const heroRef = useRef(null);
  const [showStickyProgress, setShowStickyProgress] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 640) {
      return undefined;
    }

    const target = heroRef.current;
    if (!target) {
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setShowStickyProgress(!entry.isIntersecting);
      },
      { threshold: 0.08 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 640) {
      return;
    }

    window.setTimeout(() => {
      questionRefs.current[0]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  }, [currentStep]);

  const scrollToNextTarget = (questionIndex) => {
    if (typeof window === "undefined" || window.innerWidth >= 640) {
      return;
    }

    window.setTimeout(() => {
      const nextQuestion = questionRefs.current[questionIndex + 1];
      const nextTarget = nextQuestion ?? footerRef.current;
      nextTarget?.scrollIntoView({
        behavior: "smooth",
        block: nextQuestion ? "center" : "nearest",
      });
    }, 180);
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

      <div className="space-y-3 sm:space-y-4">
      <Card className="border" style={{ backgroundColor: theme.secondary, borderColor: theme.line }}>
        <Card.Header className="px-4 pt-4 sm:px-5 sm:pt-6 lg:px-5">
          <Card.Title className="font-title text-xl font-bold sm:text-2xl" style={{ color: theme.text }}>
            현재 질문
          </Card.Title>
          <Card.Description className="text-sm leading-6" style={{ color: theme.textSoft }}>
            현재 파트 문항을 모두 선택하면 다음으로 넘어갈 수 있어요.
          </Card.Description>
        </Card.Header>
        <Card.Content className="px-0 pb-3 sm:px-0 sm:pb-6 md:px-5 md:pb-7 lg:px-6">
          <StepCard step={activeStep}>
            {activeStep.questions.map((question, questionIndex) => {
              const questionNumber =
                steps.slice(0, currentStep).reduce((sum, step) => sum + step.questions.length, 0) +
                questionIndex +
                1;

              if (activeStep.kind === "mbti") {
                return (
                  <div
                    key={question.id}
                    ref={(element) => {
                      questionRefs.current[questionIndex] = element;
                    }}
                  >
                    <BinaryQuestion
                      number={questionNumber}
                      question={question}
                      value={mbtiAnswers[question.id]}
                      onChange={(value) => {
                        setMbtiAnswers((current) => ({ ...current, [question.id]: value }));
                        scrollToNextTarget(questionIndex);
                      }}
                    />
                  </div>
                );
              }

              return (
                <div
                  key={question.id}
                  ref={(element) => {
                    questionRefs.current[questionIndex] = element;
                  }}
                >
                  <ScaleQuestion
                    number={questionNumber}
                    question={question}
                    value={attachmentAnswers[question.id]}
                    onChange={(value) => {
                      setAttachmentAnswers((current) => ({ ...current, [question.id]: value }));
                      scrollToNextTarget(questionIndex);
                    }}
                  />
                </div>
              );
            })}
          </StepCard>
        </Card.Content>
      </Card>

      <div
        ref={footerRef}
        className="sticky bottom-2 z-10 rounded-[22px] border px-3 py-3.5 backdrop-blur sm:static sm:px-4 sm:py-4 md:rounded-[24px] md:px-5 md:py-4"
        style={{ borderColor: theme.line, backgroundColor: theme.panelDeep }}
      >
        <div className="mb-2 text-center text-xs font-bold uppercase tracking-[0.18em] sm:mb-4" style={{ color: theme.textSoft }}>
          Step {activeStep.stepNumber} / {totalSteps}
        </div>
        {currentStep === totalSteps - 1 ? (
          <PrimaryActionButton onPress={onAnalyze} disabled={!isCurrentStepComplete}>결과 보기</PrimaryActionButton>
        ) : (
          <PrimaryActionButton onPress={onNextStep} disabled={!isCurrentStepComplete}>다음 스텝</PrimaryActionButton>
        )}
      </div>
      </div>
    </Shell>
  );
}
