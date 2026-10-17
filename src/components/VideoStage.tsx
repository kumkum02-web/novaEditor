import React, { useState, useEffect, useRef } from 'react';
import { AspectRatio, ColorGradingConfig, SubtitlePresetType } from '../types';
import { ASSETS } from '../data/initialData';

interface VideoStageProps {
  aspectRatio: AspectRatio;
  currentTimeSec: number;
  totalDurationSec: number;
  isPlaying: boolean;
  playbackSpeed: number;
  subtitlePreset: SubtitlePresetType;
  colorGrading: ColorGradingConfig;
  onTogglePlay: () => void;
  onSeek: (timeSec: number) => void;
  onChangeSpeed: (speed: number) => void;
  onFastAction: (actionType: 'silence' | 'broll' | 'dub' | 'hook') => void;
}

export const VideoStage: React.FC<VideoStageProps> = ({
  aspectRatio,
  currentTimeSec,
  totalDurationSec,
  isPlaying,
  playbackSpeed,
  subtitlePreset,
  colorGrading,
  onTogglePlay,
  onSeek,
  onChangeSpeed,
  onFastAction,
}) => {
  const [showGuides, setShowGuides] = useState(true);
  const [resolution, setResolution] = useState('1080p High');
  const [showResMenu, setShowResMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageContainerRef = useRef<HTMLDivElement>(null);

  // Subtitle drag position
  const [subtitlePos, setSubtitlePos] = useState({ y: 40 }); // bottom offset in px
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);

  // Format seconds to mm:ss.ms
  const formatTimecode = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = Math.floor(totalSec % 60);
    const ms = Math.floor((totalSec % 1) * 100);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  // Fullscreen handler
  const handleToggleFullscreen = () => {
    if (!stageContainerRef.current) return;
    if (!document.fullscreenElement) {
      stageContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Determine current subtitle text based on playhead time
  let activeSubtitleText = {
    part1: 'THE CITY',
    part2: 'NEVER SLEEPS',
    submeta: 'Karaoke Bounce • Word Sync',
  };
  if (currentTimeSec < 4) {
    activeSubtitleText = {
      part1: 'IN NEO-SHINJUKU',
      part2: 'THE SKYLINE NEVER SLEEPS',
      submeta: '00:00 - 00:04 • Segment #1',
    };
  } else if (currentTimeSec >= 14) {
    activeSubtitleText = {
      part1: 'WATCH CLOSELY',
      part2: 'THE MAINFRAME BREACH',
      submeta: '00:14 - 00:26 • Segment #3',
    };
  }

  // Filter styles from Color Grading intensity
  const lutFilterStyle = {
    filter: `saturate(${100 + (colorGrading.intensity - 50) * 0.8}%) contrast(${
      100 + (colorGrading.intensity - 50) * 0.5
    }%) hue-rotate(${(colorGrading.intensity - 85) * 0.4}deg)`,
  };

  // Subtitle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = dragStartYRef.current - e.clientY;
      dragStartYRef.current = e.clientY;
      setSubtitlePos((prev) => ({
        y: Math.max(10, Math.min(180, prev.y + deltaY)),
      }));
    };
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <section
      ref={stageContainerRef}
      className="flex-1 flex flex-col bg-[#0d0e15] relative border-r border-[#4a4455] overflow-hidden select-none min-h-0"
    >
      {/* Viewport Header Toolbar */}
      <div className="h-9 px-4 flex items-center justify-between border-b border-[#4a4455]/60 bg-[#1a1b23]/60 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[#ccc3d8] text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_6px_#4edea3]"></span>
            <span>GPU ACCELERATED PREVIEW</span>
          </div>
          <span className="text-[#958da1]">/</span>
          <span className="text-[11px] font-mono text-[#ccc3d8]">COLOR: REC.709-A</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Guides Toggle */}
          <button
            onClick={() => setShowGuides(!showGuides)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 transition-colors ${
              showGuides
                ? 'bg-[#1e1f27] text-[#d2bbff] border border-[#d2bbff]/40'
                : 'text-[#ccc3d8] hover:text-[#e3e1ed] hover:bg-[#1e1f27]'
            }`}
            title="Toggle Title Safe Guides"
          >
            <span className="material-symbols-outlined text-[13px]">grid_4x4</span>
            <span>Guides {showGuides ? 'On' : 'Off'}</span>
          </button>

          {/* Resolution Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowResMenu(!showResMenu)}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#1e1f27] text-[#4cd7f6] border border-[#4cd7f6]/30 flex items-center gap-1"
              title="Resolution"
            >
              <span>{resolution}</span>
              <span className="material-symbols-outlined text-[12px]">arrow_drop_down</span>
            </button>
            {showResMenu && (
              <div className="absolute right-0 top-7 w-32 bg-[#1e1f27] border border-[#4a4455] rounded-md shadow-xl py-1 z-50 text-xs font-mono">
                {['720p Fast', '1080p High', '4K Cinema'].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setResolution(r);
                      setShowResMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1 hover:bg-[#292932] ${
                      resolution === r ? 'text-[#4cd7f6] font-bold' : 'text-[#e3e1ed]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Full Screen */}
          <button
            onClick={handleToggleFullscreen}
            className="p-1 text-[#ccc3d8] hover:text-[#e3e1ed] hover:bg-[#1e1f27] rounded transition-colors"
            title="Full Screen (F)"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>
        </div>
      </div>

      {/* Video Monitor Stage Area */}
      <div className="flex-1 flex items-center justify-center p-3 bg-[#090a0f] relative overflow-hidden min-h-0">
        {/* Frame Container responding to Aspect Ratio */}
        <div
          className={`relative max-h-full max-w-full rounded-md overflow-hidden shadow-2xl border border-[#4a4455]/80 group flex items-center justify-center transition-all duration-300 ${
            aspectRatio === '16:9'
              ? 'aspect-video w-full max-w-3xl'
              : aspectRatio === '9:16'
              ? 'aspect-[9/16] h-full max-h-[460px]'
              : 'aspect-square h-full max-h-[460px]'
          }`}
        >
          {/* Video Frame Visual Layer */}
          <img
            className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out"
            alt="Cyberpunk high-tech video production still"
            referrerPolicy="no-referrer"
            style={{
              ...lutFilterStyle,
              transform: isPlaying ? 'scale(1.025)' : 'scale(1)',
            }}
            src={ASSETS.mainCyberpunkVideoStill}
          />

          {/* Safe Area Overlay */}
          {showGuides && (
            <div className="absolute inset-[8%] border border-dashed border-cyan-400/25 pointer-events-none flex flex-col justify-between p-2">
              <span className="text-[9px] font-mono text-cyan-400/50">TITLE SAFE 90%</span>
              <span className="text-[9px] font-mono text-cyan-400/50 self-end">ACTION SAFE</span>
            </div>
          )}

          {/* Top Left Live Watermark / Telemetry */}
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-[#0d0e15]/85 backdrop-blur-md px-2 py-1 rounded border border-[#4a4455]/60 z-10 pointer-events-none">
            <span className={`w-2 h-2 rounded-full bg-[#ffb4ab] ${isPlaying ? 'animate-ping' : ''}`}></span>
            <span className="text-[10px] font-mono text-[#e3e1ed] font-bold tracking-wider">REC AI-V3</span>
            <span className="text-[#958da1] text-[10px]">|</span>
            <span className="text-[10px] font-mono text-[#4edea3]">23.976 FPS</span>
          </div>

          {/* Interactive Subtitle Bounding Box with Highlight */}
          <div
            onMouseDown={handleMouseDown}
            style={{ bottom: `${subtitlePos.y}px` }}
            className={`absolute left-1/2 -translate-x-1/2 w-4/5 max-w-lg cursor-move border-2 border-[#d2bbff]/90 bg-black/45 backdrop-blur-sm rounded-lg p-2.5 shadow-[0_0_20px_rgba(124,58,237,0.45)] flex flex-col items-center transition-all ${
              isPlaying ? 'scale-[1.01]' : ''
            }`}
            title="Drag vertically to reposition subtitle box"
          >
            {/* Bounding Box Corner Grips */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#d2bbff] border-2 border-white rounded-sm shadow-sm pointer-events-none"></div>
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#d2bbff] border-2 border-white rounded-sm shadow-sm pointer-events-none"></div>
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#d2bbff] border-2 border-white rounded-sm shadow-sm pointer-events-none"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#d2bbff] border-2 border-white rounded-sm shadow-sm pointer-events-none"></div>

            {/* Subtitle Live Typography according to selected Preset */}
            {subtitlePreset === 'karaoke' && (
              <div className="text-center font-sans">
                <span className="text-yellow-300 font-extrabold text-xl md:text-2xl tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(253,224,71,0.85)]">
                  {activeSubtitleText.part1}
                </span>
                <span className="text-[#acedff] font-black text-xl md:text-2xl tracking-wider uppercase drop-shadow-[0_2px_12px_rgba(76,215,246,0.95)] ml-2">
                  {activeSubtitleText.part2}
                </span>
                <div className="text-[9px] font-mono text-[#eaddff] mt-1 tracking-widest uppercase">
                  {activeSubtitleText.submeta}
                </div>
              </div>
            )}

            {subtitlePreset === 'hormozi' && (
              <div className="text-center">
                <div className="bg-black/80 px-3 py-1 rounded inline-block">
                  <span className="text-green-400 font-black text-xl md:text-2xl tracking-wide uppercase">
                    {activeSubtitleText.part1} {activeSubtitleText.part2}
                  </span>
                </div>
                <div className="text-[9px] font-mono text-green-300 mt-1 uppercase font-bold tracking-widest">
                  HIGH RETENTION • HORMOZI IMPACT
                </div>
              </div>
            )}

            {subtitlePreset === 'cinematic' && (
              <div className="text-center">
                <span className="text-white font-serif italic text-xl md:text-2xl tracking-widest">
                  “{activeSubtitleText.part1.toLowerCase()} {activeSubtitleText.part2.toLowerCase()}”
                </span>
                <div className="text-[9px] font-mono text-slate-300 mt-1 tracking-widest">
                  CINEMATIC LETTERBOX 2.39:1
                </div>
              </div>
            )}

            {subtitlePreset === 'cyber' && (
              <div className="text-center border border-[#4cd7f6]/60 bg-black/60 px-4 py-1 rounded">
                <span className="text-cyan-300 font-mono font-bold text-lg md:text-xl tracking-widest uppercase">
                  &gt; {activeSubtitleText.part1} {activeSubtitleText.part2} _
                </span>
                <div className="text-[9px] font-mono text-cyan-400 mt-1">
                  CYBER MINIMAL 90s HUD
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick AI Floating Command Bar (Positioned under monitor) */}
      <div className="px-4 py-2 bg-[#1a1b23] border-t border-[#4a4455]/70 flex items-center justify-between shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-[#d2bbff] font-medium flex items-center gap-1 mr-1">
            <span className="material-symbols-outlined text-[14px]">auto_fix_high</span> Fast Actions:
          </span>
          <button
            onClick={() => onFastAction('silence')}
            className="px-2.5 py-1 rounded-md bg-[#1e1f27] border border-[#4a4455] hover:border-[#d2bbff] text-[#e3e1ed] text-[11px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[#4edea3] text-[14px]">cut</span>
            <span>Auto-Remove Silence (3 cuts)</span>
          </button>
          <button
            onClick={() => onFastAction('broll')}
            className="px-2.5 py-1 rounded-md bg-[#1e1f27] border border-[#4a4455] hover:border-[#d2bbff] text-[#e3e1ed] text-[11px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[#4cd7f6] text-[14px]">movie_filter</span>
            <span>Generate Matching B-Roll</span>
          </button>
          <button
            onClick={() => onFastAction('dub')}
            className="px-2.5 py-1 rounded-md bg-[#1e1f27] border border-[#4a4455] hover:border-[#d2bbff] text-[#e3e1ed] text-[11px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[#d2bbff] text-[14px]">translate</span>
            <span>Translate Spanish (Dub)</span>
          </button>
          <button
            onClick={() => onFastAction('hook')}
            className="px-2.5 py-1 rounded-md bg-[#7c3aed]/20 border border-[#d2bbff]/40 text-[#d2bbff] text-[11px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[#d2bbff] text-[14px]">bolt</span>
            <span>Apply Viral Hook</span>
          </button>
        </div>

        {/* Master Audio Level Meter Indicator */}
        <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-[#4a4455]">
          <span className="text-[10px] font-mono text-[#958da1]">L/R</span>
          <div className="flex flex-col gap-0.5">
            <div className="w-20 h-1.5 bg-[#33343d] rounded-full overflow-hidden flex">
              <div
                className="bg-[#4edea3] transition-all duration-75"
                style={{ width: isPlaying ? `${Math.floor(Math.random() * 20) + 55}%` : '70%' }}
              ></div>
              <div
                className="bg-[#4cd7f6] transition-all duration-75"
                style={{ width: isPlaying ? `${Math.floor(Math.random() * 10) + 10}%` : '15%' }}
              ></div>
              <div className="w-1 bg-[#ffb4ab]"></div>
            </div>
            <div className="w-20 h-1.5 bg-[#33343d] rounded-full overflow-hidden flex">
              <div
                className="bg-[#4edea3] transition-all duration-75"
                style={{ width: isPlaying ? `${Math.floor(Math.random() * 15) + 50}%` : '60%' }}
              ></div>
              <div
                className="bg-[#4cd7f6] transition-all duration-75"
                style={{ width: isPlaying ? `${Math.floor(Math.random() * 10) + 12}%` : '20%' }}
              ></div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#4edea3]">-6.2dB</span>
        </div>
      </div>

      {/* Video Transport Bar */}
      <div className="h-11 px-4 bg-[#0d0e15] border-t border-[#4a4455] flex items-center justify-between shrink-0">
        {/* Timecode */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[#d2bbff] font-bold text-sm tracking-widest bg-[#7c3aed]/10 px-2 py-0.5 rounded border border-[#d2bbff]/20">
            {formatTimecode(currentTimeSec)}
          </span>
          <span className="text-[#958da1] text-xs">/</span>
          <span className="text-[#ccc3d8] text-xs">{formatTimecode(totalDurationSec)}</span>
        </div>

        {/* Central Transport Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSeek(0)}
            className="p-1 text-[#ccc3d8] hover:text-[#e3e1ed] rounded hover:bg-[#1e1f27] transition-colors"
            title="Previous Keyframe (Home)"
          >
            <span className="material-symbols-outlined text-[18px]">skip_previous</span>
          </button>
          <button
            onClick={() => onSeek(Math.max(0, currentTimeSec - 5))}
            className="p-1 text-[#ccc3d8] hover:text-[#e3e1ed] rounded hover:bg-[#1e1f27] transition-colors"
            title="Step Back 5s (J / Left Arrow)"
          >
            <span className="material-symbols-outlined text-[18px]">replay_5</span>
          </button>
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-[#ede0ff] flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.5)] active:scale-95 transition-all"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            <span className="material-symbols-outlined text-[20px] fill">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <button
            onClick={() => onSeek(Math.min(totalDurationSec, currentTimeSec + 5))}
            className="p-1 text-[#ccc3d8] hover:text-[#e3e1ed] rounded hover:bg-[#1e1f27] transition-colors"
            title="Step Forward 5s (L / Right Arrow)"
          >
            <span className="material-symbols-outlined text-[18px]">forward_5</span>
          </button>
          <button
            onClick={() => onSeek(26)}
            className="p-1 text-[#ccc3d8] hover:text-[#e3e1ed] rounded hover:bg-[#1e1f27] transition-colors"
            title="Next Keyframe (End)"
          >
            <span className="material-symbols-outlined text-[18px]">skip_next</span>
          </button>
        </div>

        {/* Playback Mode & Loop */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-2 py-0.5 rounded bg-[#1e1f27] text-[#ccc3d8] hover:text-[#e3e1ed] hover:bg-[#292932] border border-[#4a4455] flex items-center gap-1"
            >
              <span>{playbackSpeed}x</span>
              <span className="material-symbols-outlined text-[12px]">expand_more</span>
            </button>
            {showSpeedMenu && (
              <div className="absolute right-0 bottom-8 w-20 bg-[#1e1f27] border border-[#4a4455] rounded-md shadow-xl py-1 z-50">
                {[0.5, 1.0, 1.25, 1.5, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onChangeSpeed(s);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-0.5 hover:bg-[#292932] ${
                      playbackSpeed === s ? 'text-[#d2bbff] font-bold' : 'text-[#e3e1ed]'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-1 rounded hover:bg-[#1e1f27] transition-colors ${
              isLooping ? 'text-[#d2bbff]' : 'text-[#958da1]'
            }`}
            title={`Loop Playback (${isLooping ? 'On' : 'Off'})`}
          >
            <span className="material-symbols-outlined text-[18px]">repeat</span>
          </button>
        </div>
      </div>
    </section>
  );
};
