import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "@heroui/react";
import {
  ASSESSMENT_MODES,
  ROUTES,
  buildAssessmentConfig,
  buildAssessmentSteps,
  buildCombinedInsight,
  clearPartnerCode,
  clearStoredPartnerResult,
  clearStoredResult,
  encodeAnswers,
  evaluateAttachment,
  evaluateFromCode,
  evaluateMbti,
  loadPartnerCode,
  loadStoredPartnerResult,
  loadStoredResult,
  navigateTo,
  persistPartnerResult,
  persistResult,
  replaceTo,
  storePartnerCode,
  trackEvent,
} from "./lib/assessment";
import { EmptyResultPage, RevealScreen } from "./components/common";
import { AssessmentPage } from "./components/AssessmentPage";
import { ComparePage } from "./components/ComparePage";
import { IntroPage } from "./components/IntroPage";
import { ResultPage } from "./components/ResultPage";

const DEFAULT_ASSESSMENT_MODE = ASSESSMENT_MODES.deep;

export default function App() {
  const assessmentBaseConfig = useMemo(() => buildAssessmentConfig(DEFAULT_ASSESSMENT_MODE), []);

  const [mbtiAnswers, setMbtiAnswers] = useState({});
  const [attachmentAnswers, setAttachmentAnswers] = useState({});
  const [assessmentMode, setAssessmentMode] = useState(DEFAULT_ASSESSMENT_MODE);
  const [assessmentConfig, setAssessmentConfig] = useState(() => buildAssessmentConfig(DEFAULT_ASSESSMENT_MODE));
  const [assessmentSteps, setAssessmentSteps] = useState(() => buildAssessmentSteps(DEFAULT_ASSESSMENT_MODE));
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const resultCode = params.get("d");
    if (resultCode && window.location.pathname === ROUTES.result) {
      const shared = evaluateFromCode(resultCode);
      if (shared) return shared;
    }
    return loadStoredResult();
  });
  const [partnerResult, setPartnerResult] = useState(() => loadStoredPartnerResult());
  const [hasPartner, setHasPartner] = useState(() => !!loadPartnerCode());
  const [revealData, setRevealData] = useState(null);
  const revealTimerRef = useRef(null);
  const [route, setRoute] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("d") && window.location.pathname === ROUTES.result) return ROUTES.result;
    if (window.location.pathname === ROUTES.compare && loadStoredResult() && loadStoredPartnerResult()) return ROUTES.compare;
    if (window.location.pathname === ROUTES.result && loadStoredResult()) return ROUTES.result;
    if (window.location.pathname === ROUTES.assessment) return ROUTES.assessment;
    return ROUTES.intro;
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const fromCode = params.get("from");
    if (fromCode) {
      storePartnerCode(fromCode);
      setHasPartner(true);
      window.history.replaceState({}, "", ROUTES.intro);
      return;
    }

    const resultCode = params.get("d");
    if (resultCode && window.location.pathname === ROUTES.result) {
      const shared = evaluateFromCode(resultCode);
      if (shared) {
        persistResult(shared);
        setResult(shared);
        setRoute(ROUTES.result);
        window.history.replaceState({}, "", ROUTES.result);
      } else {
        window.history.replaceState({}, "", ROUTES.result);
      }
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute =
        window.location.pathname === ROUTES.compare && loadStoredResult() && loadStoredPartnerResult()
          ? ROUTES.compare
          : window.location.pathname === ROUTES.result && loadStoredResult()
          ? ROUTES.result
          : window.location.pathname === ROUTES.assessment
            ? ROUTES.assessment
            : ROUTES.intro;
      setRoute(nextRoute);
      if (nextRoute === ROUTES.result) setResult(loadStoredResult());
      if (nextRoute === ROUTES.compare) {
        setResult(loadStoredResult());
        setPartnerResult(loadStoredPartnerResult());
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);


  useEffect(() => {
    if (window.location.pathname === ROUTES.compare && (!result || !partnerResult)) {
      replaceTo(result ? ROUTES.result : ROUTES.intro);
      setRoute(result ? ROUTES.result : ROUTES.intro);
    }
  }, [partnerResult, result]);

  const activeStep = assessmentSteps[currentStep];
  const activeAnswers = activeStep.kind === "mbti" ? mbtiAnswers : attachmentAnswers;
  const activeAnsweredCount = activeStep.questions.filter((q) => activeAnswers[q.id]).length;
  const isCurrentStepComplete = activeAnsweredCount === activeStep.questions.length;

  const progress = useMemo(() => {
    const answered = Object.keys(mbtiAnswers).length + Object.keys(attachmentAnswers).length;
    const total = assessmentConfig.mbtiQuestions.length + assessmentConfig.attachmentQuestions.length;
    return Math.round((answered / total) * 100);
  }, [assessmentConfig.attachmentQuestions.length, assessmentConfig.mbtiQuestions.length, attachmentAnswers, mbtiAnswers]);

  const resetAssessmentState = (mode = DEFAULT_ASSESSMENT_MODE) => {
    clearStoredResult();
    clearStoredPartnerResult();
    setResult(null);
    setPartnerResult(null);
    setMbtiAnswers({});
    setAttachmentAnswers({});
    setAssessmentMode(mode);
    setAssessmentConfig(buildAssessmentConfig(mode));
    setAssessmentSteps(buildAssessmentSteps(mode));
    setCurrentStep(0);
    setRevealData(null);
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  };

  const finalizeAnalysis = (nextResult) => {
    const partnerCode = loadPartnerCode();
    let partnerDecoded = null;
    if (partnerCode) {
      partnerDecoded = evaluateFromCode(partnerCode);
      if (partnerDecoded) {
        setPartnerResult(partnerDecoded);
        persistPartnerResult(partnerDecoded);
      }
      clearPartnerCode();
      setHasPartner(false);
    }

    persistResult(nextResult);
    setResult(nextResult);
    setRevealData(null);
    if (partnerDecoded) {
      navigateTo(ROUTES.compare);
      setRoute(ROUTES.compare);
    } else {
      navigateTo(ROUTES.result);
      setRoute(ROUTES.result);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnalyze = () => {
    const mbti = evaluateMbti(mbtiAnswers, assessmentConfig.mbtiSections, assessmentConfig.mbtiQuestions);
    const attachment = evaluateAttachment(attachmentAnswers, assessmentConfig.attachmentSections, assessmentConfig.attachmentQuestions);

    if (!mbti || !attachment) {
      toast.warning("아직 선택하지 않은 선택지를 선택해주세요.");
      return;
    }

    const code = encodeAnswers(assessmentMode, mbtiAnswers, attachmentAnswers);
    const nextResult = { mode: assessmentMode, mbti, attachment, combined: buildCombinedInsight(mbti, attachment), code };

    trackEvent("test_complete", {
      mbti_type: mbti.type,
      attachment_type: attachment.key,
      anxiety_score: attachment.anxiety,
      avoidance_score: attachment.avoidance,
      assessment_mode: assessmentMode,
    });

    setRevealData(nextResult);
    revealTimerRef.current = setTimeout(() => {
      finalizeAnalysis(nextResult);
    }, 1800);
  };

  const handleRevealSkip = () => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    if (revealData) {
      finalizeAnalysis(revealData);
    }
  };

  const stepLockRef = useRef(false);
  const handleNextStep = (force = false) => {
    if (stepLockRef.current) return;
    if (!force && !isCurrentStepComplete) {
      toast.warning("아직 선택하지 않은 선택지를 선택해주세요.");
      return;
    }
    stepLockRef.current = true;
    setTimeout(() => { stepLockRef.current = false; }, 300);
    trackEvent("step_complete", { step: currentStep + 1, total_steps: assessmentSteps.length });
    setCurrentStep((current) => Math.min(current + 1, assessmentSteps.length - 1));
    if (window.innerWidth >= 640) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestart = () => {
    setPartnerResult(null);
    resetAssessmentState(DEFAULT_ASSESSMENT_MODE);
    navigateTo(ROUTES.intro);
    setRoute(ROUTES.intro);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStart = () => {
    const nextMode = DEFAULT_ASSESSMENT_MODE;
    trackEvent("test_start", { assessment_mode: nextMode });
    resetAssessmentState(nextMode);
    replaceTo(ROUTES.assessment);
    setRoute(ROUTES.assessment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenCompare = () => {
    if (!result || !partnerResult) return;
    navigateTo(ROUTES.compare);
    setRoute(ROUTES.compare);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCompareWithCode = (partnerCode) => {
    if (!result) return;
    const normalized = partnerCode.trim();

    if (!normalized) {
      toast.warning("상대의 감정코드를 붙여넣어주세요.");
      return;
    }

    const partner = evaluateFromCode(normalized);
    if (!partner) {
      toast.warning("감정코드를 다시 확인해주세요.");
      return;
    }

    setPartnerResult(partner);
    persistPartnerResult(partner);
    navigateTo(ROUTES.compare);
    setRoute(ROUTES.compare);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCompareWithCodes = (myCode, otherCode) => {
    const myNormalized = myCode.trim();
    const otherNormalized = otherCode.trim();

    if (!myNormalized || !otherNormalized) {
      toast.warning("두 감정코드를 모두 붙여넣어주세요.");
      return;
    }

    const myParsed = evaluateFromCode(myNormalized);
    const partnerParsed = evaluateFromCode(otherNormalized);

    if (!myParsed || !partnerParsed) {
      toast.warning("감정코드를 다시 확인해주세요.");
      return;
    }

    persistResult(myParsed);
    persistPartnerResult(partnerParsed);
    setResult(myParsed);
    setPartnerResult(partnerParsed);
    navigateTo(ROUTES.compare);
    setRoute(ROUTES.compare);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToResult = () => {
    if (!result) return;
    navigateTo(ROUTES.result);
    setRoute(ROUTES.result);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (revealData) {
    return (
      <RevealScreen
        mbtiType={revealData.mbti.type}
        attachmentTitle={revealData.attachment.title}
        onSkip={handleRevealSkip}
      />
    );
  }

  if (route === ROUTES.compare && result && partnerResult) {
    return <ComparePage result={result} partnerResult={partnerResult} onBack={handleBackToResult} />;
  }

  if (route === ROUTES.result) {
    if (!result) {
      return <EmptyResultPage onStart={handleStart} />;
    }
    return (
      <ResultPage
        result={result}
        partnerResult={partnerResult}
        onRestart={handleRestart}
        onOpenCompare={handleOpenCompare}
        onCompareWithCode={handleCompareWithCode}
      />
    );
  }

  if (route === ROUTES.intro) {
    return (
      <IntroPage
        onStart={handleStart}
        onCompareWithCodes={handleCompareWithCodes}
        totalQuestions={assessmentBaseConfig.mbtiQuestions.length + assessmentBaseConfig.attachmentQuestions.length}
        totalResults={16 * 4}
        hasPartner={hasPartner}
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
      progress={progress}
      onNextStep={handleNextStep}
      onAnalyze={handleAnalyze}
      mbtiAnswers={mbtiAnswers}
      attachmentAnswers={attachmentAnswers}
      setMbtiAnswers={setMbtiAnswers}
      setAttachmentAnswers={setAttachmentAnswers}
    />
  );
}
