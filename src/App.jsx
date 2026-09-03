import { useState, useRef, useEffect } from 'react';
import './App.css';
import IntroOverlay from './components/IntroOverlay.jsx';
import Landing from './components/Landing.jsx';
import TimeMachine from './components/TimeMachine.jsx';
import MuseumOfMemories from './components/MuseumOfMemories.jsx';
import SisterAwards from './components/SisterAwards.jsx';
import QuizChapter from './components/QuizChapter.jsx';
import ThreeGifts from './components/ThreeGifts.jsx';
import SecretRoomChapter from './components/SecretRoomChapter.jsx';
import FinalReveal from './components/FinalReveal.jsx';
import EditorGate from './components/EditorGate.jsx';
import PageTransition from './components/PageTransition.jsx';
import HeartsIntroModal from './components/HeartsIntroModal.jsx';
import HeartsRewardModal from './components/HeartsRewardModal.jsx';
import HeartsProgress from './components/HeartsProgress.jsx';
import GlitterEffect from './components/ui/GlitterEffect.jsx';
import MusicToggle from './components/ui/MusicToggle.jsx';
import { ToastProvider } from './components/ui/ToastContext.jsx';
import { HeartsProvider, useHearts } from './components/HeartsContext.jsx';
import { SiteContentProvider } from './context/SiteContentContext.jsx';
import { BackgroundMusicProvider } from './context/BackgroundMusicContext.jsx';

// 0 Landing, 1 TimeMachine, 2 Museum, 3 SisterAwards,
// 4 Quiz, 5 ThreeGifts, 6 SecretRoom, 7 FinalReveal
const FINAL_STAGE = 7;

function AppContent() {
  const [introDone, setIntroDone] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [unlockedStage, setUnlockedStage] = useState(0);
  const [heartsIntroSeen, setHeartsIntroSeen] = useState(false);
  const [showHeartsIntro, setShowHeartsIntro] = useState(false);
  const [showHeartsReward, setShowHeartsReward] = useState(false);

  const { allFound } = useHearts();

  const timeMachineRef = useRef(null);
  const museumRef = useRef(null);
  const awardsRef = useRef(null);
  const quizRef = useRef(null);
  const giftsRef = useRef(null);
  const secretRoomRef = useRef(null);
  const finalRevealRef = useRef(null);

  useEffect(() => {
    if (unlockedStage === 1) {
      timeMachineRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (!heartsIntroSeen) {
        setShowHeartsIntro(true);
        setHeartsIntroSeen(true);
      }
    } else if (unlockedStage === 2) {
      museumRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (unlockedStage === 3) {
      awardsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (unlockedStage === 4) {
      quizRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (unlockedStage === 5) {
      giftsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (unlockedStage === 6) {
      secretRoomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (unlockedStage === 7) {
      finalRevealRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [unlockedStage, heartsIntroSeen]);

  useEffect(() => {
    if (allFound) {
      setShowHeartsReward(true);
    }
  }, [allFound]);

  if (!introDone) {
    return <IntroOverlay onFinish={() => setIntroDone(true)} />;
  }

  return (
    <div className="app">
      <GlitterEffect />

      <PageTransition>
        <Landing
          onSecretUnlock={() => setEditorOpen(true)}
          onTrailerEnd={() => setUnlockedStage((prev) => Math.max(prev, 1))}
        />
      </PageTransition>

      {unlockedStage >= 1 && (
        <div ref={timeMachineRef}>
          <TimeMachine
            onContinue={() => setUnlockedStage((prev) => Math.max(prev, 2))}
          />
        </div>
      )}

      {unlockedStage >= 2 && (
        <div ref={museumRef}>
          <MuseumOfMemories
            onContinue={() => setUnlockedStage((prev) => Math.max(prev, 3))}
          />
        </div>
      )}

      {unlockedStage >= 3 && (
        <div ref={awardsRef}>
          <SisterAwards
            onContinue={() => setUnlockedStage((prev) => Math.max(prev, 4))}
          />
        </div>
      )}

      {unlockedStage >= 4 && (
        <div ref={quizRef}>
          <QuizChapter
            onContinue={() => setUnlockedStage((prev) => Math.max(prev, 5))}
          />
        </div>
      )}

      {unlockedStage >= 5 && (
        <div ref={giftsRef}>
          <ThreeGifts
            onContinue={() => setUnlockedStage((prev) => Math.max(prev, 6))}
          />
        </div>
      )}

      {unlockedStage >= 6 && (
        <div ref={secretRoomRef}>
          <SecretRoomChapter
            onContinue={() => setUnlockedStage((prev) => Math.max(prev, 7))}
          />
        </div>
      )}

      {unlockedStage >= 7 && (
        <div ref={finalRevealRef}>
          <FinalReveal />
        </div>
      )}

      {unlockedStage >= 1 && unlockedStage < FINAL_STAGE && <HeartsProgress />}

      <MusicToggle />

      {showHeartsIntro && (
        <HeartsIntroModal onClose={() => setShowHeartsIntro(false)} />
      )}

      {showHeartsReward && (
        <HeartsRewardModal onClose={() => setShowHeartsReward(false)} />
      )}

      {editorOpen && <EditorGate onClose={() => setEditorOpen(false)} />}
    </div>
  );
}

function App() {
  return (
    <SiteContentProvider>
      <BackgroundMusicProvider>
        <ToastProvider>
          <HeartsProvider>
            <AppContent />
          </HeartsProvider>
        </ToastProvider>
      </BackgroundMusicProvider>
    </SiteContentProvider>
  );
}

export default App;