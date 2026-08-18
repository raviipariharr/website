import { useState, useRef, useEffect } from 'react';
import './App.css';
import Landing from './components/Landing.jsx';
import TimeMachine from './components/TimeMachine.jsx';
import MuseumOfMemories from './components/MuseumOfMemories.jsx';
import SisterAwards from './components/SisterAwards.jsx';
import SecretRoomChapter from './components/SecretRoomChapter.jsx';
import EditorGate from './components/EditorGate.jsx';
import PageTransition from './components/PageTransition.jsx';
import HeartsIntroModal from './components/HeartsIntroModal.jsx';
import HeartsRewardModal from './components/HeartsRewardModal.jsx';
import HeartsProgress from './components/HeartsProgress.jsx';
import { ToastProvider } from './components/ui/ToastContext.jsx';
import { HeartsProvider, useHearts } from './components/HeartsContext.jsx';
import { SiteContentProvider } from './context/SiteContentContext.jsx';

function AppContent() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [unlockedStage, setUnlockedStage] = useState(0);
  const [heartsIntroSeen, setHeartsIntroSeen] = useState(false);
  const [showHeartsIntro, setShowHeartsIntro] = useState(false);
  const [showHeartsReward, setShowHeartsReward] = useState(false);

  const { allFound } = useHearts();

  const timeMachineRef = useRef(null);
  const museumRef = useRef(null);
  const awardsRef = useRef(null);
  const secretRoomRef = useRef(null);

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
      secretRoomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [unlockedStage, heartsIntroSeen]);

  useEffect(() => {
    if (allFound) {
      setShowHeartsReward(true);
    }
  }, [allFound]);

  return (
    <div className="app">
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
        <div ref={secretRoomRef}>
          <SecretRoomChapter onContinue={() => {}} />
        </div>
      )}

      {unlockedStage >= 1 && <HeartsProgress />}

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
      <ToastProvider>
        <HeartsProvider>
          <AppContent />
        </HeartsProvider>
      </ToastProvider>
    </SiteContentProvider>
  );
}

export default App;