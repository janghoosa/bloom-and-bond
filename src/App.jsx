import { useEffect, useMemo, useState } from "react";
import { toast } from "@heroui/react";
import {
  ASSESSMENT_MODES,
  ROUTES,
  THEME_STORAGE_KEY,
  buildAssessmentConfig,
  buildAssessmentSteps,
  buildCombinedInsight,
  clearStoredResult,
  evaluateAttachment,
  evaluateMbti,
  getInitialTheme,
  loadStoredResult,
  navigateTo,
  persistResult,
  replaceTo,
} from "./lib/assessment";
import { AssessmentPage } from "./components/AssessmentPage";
import { IntroPage } from "./components/IntroPage";
import { ResultPage } from "./components/ResultPage";

export default function App() {
  const quickAssessmentConfig = useMemo(() => buildAssessmentConfig(ASSESSMENT_MODES.quick), []);
  const deepAssessmentConfig = useMemo(() => buildAssessmentConfig(ASSESSMENT_MODES.deep), []);

  const [themeMode, setThemeMode] = useState(() => getInitialTheme());
  const [mbtiAnswers, setMbtiAnswers] = useState({});
  const [attachmentAnswers, setAttachmentAnswers] = useState({});
  const [assessmentMode, setAssessmentMode] = useState(ASSESSMENT_MODES.quick);
  const [assessmentConfig, setAssessmentConfig] = useState(() => buildAssessmentConfig(ASSESSMENT_MODES.quick));
  const [assessmentSteps, setAssessmentSteps] = useState(() => buildAssessmentSteps(ASSESSMENT_MODES.quick));
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(() => loadStoredResult());
  const [route, setRoute] = useState(() =>
    window.location.pathname === ROUTES.result && loadStoredResult()
      ? ROUTES.result
      : window.location.pathname === ROUTES.assessment
        ? ROUTES.assessment
        : ROUTES.intro,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute =
        window.location.pathname === ROUTES.result && loadStoredResult()
          ? ROUTES.result
          : window.location.pathname === ROUTES.assessment
            ? ROUTES.assessment
            : ROUTES.intro;

      setRoute(nextRoute);

      if (nextRoute === ROUTES.result) {
        setResult(loadStoredResult());
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (window.location.pathname === ROUTES.result && !result) {
      replaceTo(ROUTES.intro);
      setRoute(ROUTES.intro);
    }
  }, [result]);

  const activeStep = assessmentSteps[currentStep];
  const activeAnswers = activeStep.kind === "mbti" ? mbtiAnswers : attachmentAnswers;
  const activeAnsweredCount = activeStep.questions.filter((question) => activeAnswers[question.id]).length;
  const isCurrentStepComplete = activeAnsweredCount === activeStep.questions.length;

  const progress = useMemo(() => {
    const answered = Object.keys(mbtiAnswers).length + Object.keys(attachmentAnswers).length;
    const total = assessmentConfig.mbtiQuestions.length + assessmentConfig.attachmentQuestions.length;
    return Math.round((answered / total) * 100);
  }, [
    assessmentConfig.attachmentQuestions.length,
    assessmentConfig.mbtiQuestions.length,
    attachmentAnswers,
    mbtiAnswers,
  ]);

  const resetAssessmentState = (mode = ASSESSMENT_MODES.quick) => {
    clearStoredResult();
    setResult(null);
    setMbtiAnswers({});
    setAttachmentAnswers({});
    setAssessmentMode(mode);
    setAssessmentConfig(buildAssessmentConfig(mode));
    setAssessmentSteps(buildAssessmentSteps(mode));
    setCurrentStep(0);
  };

  const handleAnalyze = () => {
    const mbti = evaluateMbti(
      mbtiAnswers,
      assessmentConfig.mbtiSections,
      assessmentConfig.mbtiQuestions,
    );
    const attachment = evaluateAttachment(
      attachmentAnswers,
      assessmentConfig.attachmentSections,
      assessmentConfig.attachmentQuestions,
    );

    if (!mbti || !attachment) {
      toast.warning("아직 선택하지 않은 선택지를 선택해주세요.");
      return;
    }

    const nextResult = {
      mode: assessmentMode,
      mbti,
      attachment,
      combined: buildCombinedInsight(mbti, attachment),
    };

    persistResult(nextResult);
    setResult(nextResult);
    navigateTo(ROUTES.result);
    setRoute(ROUTES.result);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextStep = () => {
    if (!isCurrentStepComplete) {
      toast.warning("아직 선택하지 않은 선택지를 선택해주세요.");
      return;
    }

    setCurrentStep((current) => Math.min(current + 1, assessmentSteps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestart = () => {
    resetAssessmentState(ASSESSMENT_MODES.quick);
    navigateTo(ROUTES.intro);
    setRoute(ROUTES.intro);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStart = (mode) => {
    const nextMode = mode ?? ASSESSMENT_MODES.quick;
    resetAssessmentState(nextMode);
    replaceTo(ROUTES.assessment);
    setRoute(ROUTES.assessment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleTheme = () => {
    setThemeMode((current) => (current === "dark" ? "light" : "dark"));
  };

  if (route === ROUTES.result && result) {
    return (
      <ResultPage
        result={result}
        onRestart={handleRestart}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  if (route === ROUTES.intro) {
    return (
      <IntroPage
        onStart={handleStart}
        quickTotalQuestions={quickAssessmentConfig.mbtiQuestions.length + quickAssessmentConfig.attachmentQuestions.length}
        deepTotalQuestions={deepAssessmentConfig.mbtiQuestions.length + deepAssessmentConfig.attachmentQuestions.length}
        totalResults={16 * 4}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  return (
    <AssessmentPage
      steps={assessmentSteps}
      activeStep={activeStep}
      currentStep={currentStep}
      totalSteps={assessmentSteps.length}
      totalQuestions={assessmentConfig.mbtiQuestions.length + assessmentConfig.attachmentQuestions.length}
      activeAnsweredCount={activeAnsweredCount}
      isCurrentStepComplete={isCurrentStepComplete}
      progress={progress}
      onNextStep={handleNextStep}
      onAnalyze={handleAnalyze}
      mbtiAnswers={mbtiAnswers}
      attachmentAnswers={attachmentAnswers}
      setMbtiAnswers={setMbtiAnswers}
      setAttachmentAnswers={setAttachmentAnswers}
      themeMode={themeMode}
      onToggleTheme={handleToggleTheme}
    />
  );
}
