import { useRef } from "react";
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
  themeMode,
  onToggleTheme,
}) {
  const questionRefs = useRef([]);
  const footerRef = useRef(null);

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
    <Shell themeMode={themeMode} onToggleTheme={onToggleTheme}>
      <Hero progress={progress} totalQuestions={totalQuestions} />

      <Card className="border" style={{ backgroundColor: theme.secondary, borderColor: theme.line }}>
        <Card.Header className="px-4 pt-4 sm:px-5 sm:pt-6 lg:px-5">
          <Card.Title className="font-title text-xl font-bold sm:text-2xl" style={{ color: theme.text }}>
            현재 질문
          </Card.Title>
          <Card.Description className="text-sm leading-6" style={{ color: theme.textSoft }}>
            현재 파트 문항을 모두 선택하면 다음으로 넘어갑니다.
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

          <div className="my-3 h-px sm:my-6" style={{ backgroundColor: theme.line }} />

          <div
            ref={footerRef}
            className="sticky bottom-2 z-10 -mx-1 rounded-[22px] border px-3 py-3.5 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-2 sm:shadow-none md:rounded-[24px] md:border md:px-5 md:py-4"
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
            <p className="mt-2 px-1 text-center text-sm leading-6 sm:mt-4" style={{ color: theme.textSoft }}>
              현재 파트 응답: {activeAnsweredCount} / {activeStep.questions.length}
            </p>
          </div>
        </Card.Content>
      </Card>
    </Shell>
  );
}
