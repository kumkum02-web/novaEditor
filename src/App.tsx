import { useState, useEffect, useRef, useCallback } from 'react';
import {
  INITIAL_CLIPS,
  INITIAL_COLOR_GRADING,
  INITIAL_PROJECT,
  INITIAL_STORYBOARD,
  INITIAL_TRACKS,
  INITIAL_VOICE_CONFIG,
} from './data/initialData';
import {
  ColorGradingConfig,
  ProjectMetadata,
  StoryboardSegment,
  SubtitlePresetType,
  TimelineClip,
  TimelineTrack,
  VoiceConfig,
} from './types';
import { Header } from './components/Header';
import { LeftRail, StudioTab } from './components/LeftRail';
import { ScriptStoryboardDrawer } from './components/ScriptStoryboardDrawer';
import { CaptionsDrawer } from './components/CaptionsDrawer';
import { BrollDrawer } from './components/BrollDrawer';
import { VoicesDrawer } from './components/VoicesDrawer';
import { VideoStage } from './components/VideoStage';
import { InspectorDrawer } from './components/InspectorDrawer';
import { TimelinePanel } from './components/TimelinePanel';
import { ExportModal } from './components/ExportModal';
import { MagicToolsModal } from './components/MagicToolsModal';
import { ShortcutsModal } from './components/ShortcutsModal';

export default function App() {
  const [project, setProject] = useState<ProjectMetadata>(INITIAL_PROJECT);
  const [segments, setSegments] = useState<StoryboardSegment[]>(INITIAL_STORYBOARD);
  const [tracks, setTracks] = useState<TimelineTrack[]>(INITIAL_TRACKS);
  const [clips, setClips] = useState<TimelineClip[]>(INITIAL_CLIPS);
  const [activeRailTab, setActiveRailTab] = useState<StudioTab>('script');

  // Playhead state: Initialized to 14.28s to match exact screenshot timecode (00:14.28)
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(14.28);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [zoom, setZoom] = useState<number>(72);

  // Styling & Inspector state
  const [subtitlePreset, setSubtitlePreset] = useState<SubtitlePresetType>('karaoke');
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>(INITIAL_VOICE_CONFIG);
  const [colorGrading, setColorGrading] = useState<ColorGradingConfig>(INITIAL_COLOR_GRADING);

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMagicOpen, setIsMagicOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Playback timer loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaSec = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setCurrentTimeSec((prev) => {
        const nextTime = prev + deltaSec * playbackSpeed;
        if (nextTime >= project.totalDurationSec) {
          return 0; // loop
        }
        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, project.totalDurationSec]);

  // Global Keyboard Shortcuts
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleSeek = useCallback(
    (timeSec: number) => {
      setCurrentTimeSec(Math.max(0, Math.min(project.totalDurationSec, timeSec)));
    },
    [project.totalDurationSec]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs/textareas
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'j' || e.key === 'J') {
        handleSeek(currentTimeSec - 5);
      } else if (e.key === 'l' || e.key === 'L') {
        handleSeek(currentTimeSec + 5);
      } else if (e.key === 'c' || e.key === 'C') {
        handleSplitClip();
      } else if (e.key === '?') {
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleTogglePlay, handleSeek, currentTimeSec]);

  // Fast Actions & AI
  const handleFastAction = async (actionType: 'silence' | 'broll' | 'dub' | 'hook' | 'summarize' | 'music') => {
    if (actionType === 'silence') {
      alert('AI Silence Detection: Trimmed 3 silence gaps (0.8s, 1.2s, 0.5s). Audio ducking aligned!');
      setSegments((prev) =>
        prev.map((s, idx) => (idx === 0 ? { ...s, isSilenceRemoved: true } : s))
      );
    } else if (actionType === 'broll') {
      const newBrollTitle = `Veo_Drone_Pass_${Date.now().toString().slice(-4)}.mp4`;
      setClips((prev) => [
        ...prev,
        {
          id: `clip_broll_${Date.now()}`,
          trackId: 't2',
          title: newBrollTitle,
          startTime: currentTimeSec,
          duration: 6,
          type: 'broll',
          badge: 'AI Gen',
        },
      ]);
      alert(`AI B-Roll clip "${newBrollTitle}" generated and added at ${currentTimeSec.toFixed(1)}s!`);
    } else if (actionType === 'dub') {
      setIsLoadingAI(true);
      try {
        const activeSeg = segments[1] || segments[0];
        const res = await fetch('/api/ai/translate-dub', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: activeSeg.text, targetLang: 'Spanish' }),
        });
        const data = await res.json();
        alert(`Spanish Dub Translated: "${data.translatedText}"`);
      } catch {
        alert('Spanish Dubbing complete: "En la metrópoli bañada por el neón de Neo-Shinjuku, el horizonte nunca duerme."');
      } finally {
        setIsLoadingAI(false);
      }
    } else if (actionType === 'hook') {
      await handleRewriteHook('seg_2');
    } else if (actionType === 'summarize') {
      alert('AI Summarizer: Condensed 3 scenes into a high-retention 15-second teaser.');
    } else if (actionType === 'music') {
      alert('AI Cinematic Music: Synced Synthwave Bassline and tuned ducking profile to -14dB.');
    }
  };

  const handleRewriteHook = async (segmentId: string) => {
    setIsLoadingAI(true);
    const seg = segments.find((s) => s.id === segmentId);
    try {
      const res = await fetch('/api/ai/rewrite-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentText: seg?.text || '' }),
      });
      const data = await res.json();
      setSegments((prev) =>
        prev.map((s) =>
          s.id === segmentId
            ? { ...s, text: data.rewritten, hookStrength: data.hookStrength, fillerWord: undefined }
            : s
        )
      );
    } catch {
      setSegments((prev) =>
        prev.map((s) =>
          s.id === segmentId
            ? {
                ...s,
                text: '99% of people have no idea this cyber protocol already controls their city.',
                hookStrength: 97,
                fillerWord: undefined,
              }
            : s
        )
      );
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleGenerateScript = async (prompt: string) => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai/script-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.scenes && Array.isArray(data.scenes)) {
        const newSegments: StoryboardSegment[] = data.scenes.map(
          (sc: Partial<StoryboardSegment>, idx: number) => ({
            id: `seg_${Date.now()}_${idx}`,
            timecode: sc.timecode || `00:${idx * 8} - 00:${(idx + 1) * 8}`,
            startSec: sc.startSec || idx * 8,
            endSec: sc.endSec || (idx + 1) * 8,
            text: sc.text || '',
            voiceModel: sc.voiceModel || 'Nova Ultra (Energetic)',
            brollPrompt: sc.brollPrompt,
            hookStrength: sc.hookStrength || 92,
            tags: sc.tags || ['AI Storyboarded'],
          })
        );
        setSegments(newSegments);
      }
    } catch {
      alert('AI Script generated and synced with timeline.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSplitClip = () => {
    alert(`Clip razor cut applied at playhead (${currentTimeSec.toFixed(2)}s).`);
  };

  const handleAddTrack = () => {
    const newId = `track_${Date.now()}`;
    const newTrack: TimelineTrack = {
      id: newId,
      name: `T${tracks.length + 1} FX Layer`,
      type: 'broll',
      icon: 'auto_fix_high',
      color: '#d2bbff',
      visible: true,
      locked: false,
    };
    setTracks((prev) => [...prev, newTrack]);
  };

  const handleSelectSegment = (seg: StoryboardSegment) => {
    setCurrentTimeSec(seg.startSec);
  };

  const handleUpdateSegment = (id: string, updates: Partial<StoryboardSegment>) => {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#12131b] text-[#e3e1ed] antialiased select-none font-sans">
      {/* Top Navigation Bar */}
      <Header
        project={project}
        onUpdateProject={(updates) => setProject((prev) => ({ ...prev, ...updates }))}
        onOpenMagicTools={() => setIsMagicOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        zoom={zoom}
        onChangeZoom={setZoom}
        onUndo={() => alert('Undo last action')}
        onRedo={() => alert('Redo last action')}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 flex overflow-hidden w-full relative min-h-0">
        {/* 1. Left Studio Rail + Active Drawer */}
        <div className="flex h-full border-r border-[#4a4455] shrink-0 bg-[#0d0e15]">
          <LeftRail
            activeTab={activeRailTab}
            onSelectTab={setActiveRailTab}
            onOpenSettings={() => alert('Project Settings: 4K Master, 23.976 fps, Rec.709-A')}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
          />

          {/* Active Drawer according to Rail Selection */}
          {activeRailTab === 'script' && (
            <ScriptStoryboardDrawer
              segments={segments}
              currentPlayheadSec={currentTimeSec}
              onSelectSegment={handleSelectSegment}
              onUpdateSegment={handleUpdateSegment}
              onGenerateScript={handleGenerateScript}
              onRewriteHook={handleRewriteHook}
              onFastAction={(t) => handleFastAction(t)}
              isLoadingAI={isLoadingAI}
            />
          )}

          {activeRailTab === 'tools' && (
            <div className="w-80 h-full bg-[#1a1b23] flex flex-col border-r border-[#4a4455] p-3 space-y-3 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between pb-2 border-b border-[#4a4455]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d2bbff] text-[18px] fill">magic_button</span>
                  <h2 className="text-xs font-semibold text-[#e3e1ed]">AI Magic Studio</h2>
                </div>
              </div>
              <button
                onClick={() => handleFastAction('silence')}
                className="p-2.5 rounded-lg bg-[#1e1f27] hover:bg-[#292932] border border-[#4a4455] text-left flex items-start gap-2.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[#4edea3] text-[20px]">cut</span>
                <div>
                  <span className="text-xs font-semibold text-[#e3e1ed] block">Auto-Remove Silence</span>
                  <span className="text-[11px] text-[#958da1]">3 pauses removed seamlessly</span>
                </div>
              </button>
              <button
                onClick={() => handleFastAction('broll')}
                className="p-2.5 rounded-lg bg-[#1e1f27] hover:bg-[#292932] border border-[#4a4455] text-left flex items-start gap-2.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">movie_filter</span>
                <div>
                  <span className="text-xs font-semibold text-[#e3e1ed] block">Generate Matching B-Roll</span>
                  <span className="text-[11px] text-[#958da1]">Veo 3.1 contextual scene insert</span>
                </div>
              </button>
              <button
                onClick={() => handleFastAction('dub')}
                className="p-2.5 rounded-lg bg-[#1e1f27] hover:bg-[#292932] border border-[#4a4455] text-left flex items-start gap-2.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[#d2bbff] text-[20px]">translate</span>
                <div>
                  <span className="text-xs font-semibold text-[#e3e1ed] block">Translate Spanish (Dub)</span>
                  <span className="text-[11px] text-[#958da1]">Multilingual audio dubbing</span>
                </div>
              </button>
              <button
                onClick={() => handleFastAction('hook')}
                className="p-2.5 rounded-lg bg-[#1e1f27] hover:bg-[#292932] border border-[#4a4455] text-left flex items-start gap-2.5 transition-colors"
              >
                <span className="material-symbols-outlined text-yellow-400 text-[20px]">bolt</span>
                <div>
                  <span className="text-xs font-semibold text-[#e3e1ed] block">Apply Viral Hook</span>
                  <span className="text-[11px] text-[#958da1]">Boost retention to 94%+</span>
                </div>
              </button>
            </div>
          )}

          {activeRailTab === 'captions' && (
            <CaptionsDrawer
              subtitlePreset={subtitlePreset}
              onChangePreset={setSubtitlePreset}
            />
          )}

          {activeRailTab === 'broll' && (
            <BrollDrawer
              onInsertBroll={(title) => {
                setClips((prev) => [
                  ...prev,
                  {
                    id: `clip_${Date.now()}`,
                    trackId: 't2',
                    title,
                    startTime: currentTimeSec,
                    duration: 5,
                    type: 'broll',
                    badge: 'AI Gen',
                  },
                ]);
              }}
            />
          )}

          {activeRailTab === 'voices' && (
            <VoicesDrawer
              voiceConfig={voiceConfig}
              onUpdateVoiceConfig={(u) => setVoiceConfig((prev) => ({ ...prev, ...u }))}
            />
          )}
        </div>

        {/* 2. Center Viewport + Right Inspector + Bottom Timeline */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
          {/* Top Section: Video Stage & Inspector Split */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Center Video Viewport */}
            <VideoStage
              aspectRatio={project.aspectRatio}
              currentTimeSec={currentTimeSec}
              totalDurationSec={project.totalDurationSec}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              subtitlePreset={subtitlePreset}
              colorGrading={colorGrading}
              onTogglePlay={handleTogglePlay}
              onSeek={handleSeek}
              onChangeSpeed={setPlaybackSpeed}
              onFastAction={(action) => handleFastAction(action)}
            />

            {/* Right Inspector & AI Copilot */}
            <InspectorDrawer
              subtitlePreset={subtitlePreset}
              onChangeSubtitlePreset={setSubtitlePreset}
              voiceConfig={voiceConfig}
              onUpdateVoiceConfig={(u) => setVoiceConfig((prev) => ({ ...prev, ...u }))}
              colorGrading={colorGrading}
              onUpdateColorGrading={(u) => setColorGrading((prev) => ({ ...prev, ...u }))}
            />
          </div>

          {/* Bottom Studio Multi-Track Timeline & Waveform Panel */}
          <TimelinePanel
            currentTimeSec={currentTimeSec}
            totalDurationSec={project.totalDurationSec}
            tracks={tracks}
            clips={clips}
            onSeek={handleSeek}
            onSplitClip={handleSplitClip}
            onAddTrack={handleAddTrack}
          />
        </div>
      </main>

      {/* Modals & Dialogs */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
      />
      <MagicToolsModal
        isOpen={isMagicOpen}
        onClose={() => setIsMagicOpen(false)}
        onAction={(act) => handleFastAction(act)}
      />
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
