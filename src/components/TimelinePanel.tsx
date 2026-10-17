import React, { useRef, useState } from 'react';
import { TimelineClip, TimelineTrack } from '../types';

interface TimelinePanelProps {
  currentTimeSec: number;
  totalDurationSec: number;
  tracks: TimelineTrack[];
  clips: TimelineClip[];
  onSeek: (timeSec: number) => void;
  onSplitClip?: () => void;
  onAddTrack?: () => void;
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({
  currentTimeSec,
  totalDurationSec,
  tracks,
  clips,
  onSeek,
  onSplitClip,
  onAddTrack,
}) => {
  const [viewMode, setViewMode] = useState<'track' | 'script'>('track');
  const [magnetSnap, setMagnetSnap] = useState(true);
  const [zoomScale, setZoomScale] = useState(45); // slider 1-100
  const rulerContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingPlayhead = useRef(false);

  // Pixels per second calculation based on zoomScale
  // In the original HTML: 00:00=0, 00:05=160px => 32px per sec.
  const pxPerSec = 32 * (zoomScale / 45);

  // Playhead left offset in px
  const playheadLeft = currentTimeSec * pxPerSec;

  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerContainerRef.current) return;
    const rect = rulerContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newSec = Math.max(0, Math.min(totalDurationSec, clickX / pxPerSec));
    onSeek(newSec);
  };

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    isDraggingPlayhead.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingPlayhead.current || !rulerContainerRef.current) return;
      const rect = rulerContainerRef.current.getBoundingClientRect();
      const currentX = moveEvent.clientX - rect.left;
      const newSec = Math.max(0, Math.min(totalDurationSec, currentX / pxPerSec));
      onSeek(newSec);
    };

    const handleMouseUp = () => {
      isDraggingPlayhead.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <footer className="h-64 bg-[#0d0e15] border-t border-[#4a4455] flex flex-col shrink-0 select-none">
      {/* Timeline Control Toolbar Header */}
      <div className="h-10 px-4 bg-[#1a1b23] border-b border-[#4a4455] flex items-center justify-between shrink-0">
        {/* View Switcher Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-[#0d0e15] p-0.5 rounded-lg border border-[#4a4455] flex items-center">
            <button
              onClick={() => setViewMode('script')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                viewMode === 'script'
                  ? 'bg-[#7c3aed] text-[#ede0ff] font-semibold shadow-sm'
                  : 'bg-[#1e1f27] text-[#ccc3d8] hover:text-[#e3e1ed]'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">description</span>
              <span>Script View</span>
            </button>
            <button
              onClick={() => setViewMode('track')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                viewMode === 'track'
                  ? 'bg-[#7c3aed] text-[#ede0ff] font-semibold shadow-sm'
                  : 'bg-[#1e1f27] text-[#ccc3d8] hover:text-[#e3e1ed]'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">timeline</span>
              <span>Precision Multi-Track</span>
            </button>
          </div>

          <div className="h-4 w-px bg-[#4a4455] mx-1"></div>

          {/* Editing Tools: Split, Ripple, Snap, Add */}
          <div className="flex items-center gap-1">
            <button
              onClick={onSplitClip}
              className="p-1.5 rounded hover:bg-[#1e1f27] text-[#ccc3d8] hover:text-[#e3e1ed] transition-colors"
              title="Split Clip / Razor (C)"
            >
              <span className="material-symbols-outlined text-[16px]">content_cut</span>
            </button>
            <button
              onClick={() => alert('Ripple Delete performed: empty gaps collapsed.')}
              className="p-1.5 rounded hover:bg-[#1e1f27] text-[#ccc3d8] hover:text-[#e3e1ed] transition-colors"
              title="Ripple Delete (D)"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            </button>
            <button
              onClick={() => setMagnetSnap(!magnetSnap)}
              className={`p-1.5 rounded border transition-colors ${
                magnetSnap
                  ? 'bg-[#7c3aed]/20 text-[#d2bbff] border-[#d2bbff]/30'
                  : 'text-[#958da1] border-transparent hover:bg-[#1e1f27]'
              }`}
              title={`Magnet Snap ${magnetSnap ? 'Enabled' : 'Disabled'} (N)`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_goldenratio</span>
            </button>
            <button
              onClick={onAddTrack}
              className="p-1.5 rounded hover:bg-[#1e1f27] text-[#ccc3d8] hover:text-[#e3e1ed] transition-colors"
              title="Add Track (+)"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
            </button>
          </div>
        </div>

        {/* Timeline Timecode Marks & Zoom Scale */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#958da1] text-[16px]">zoom_out</span>
            <input
              type="range"
              min="20"
              max="90"
              value={zoomScale}
              onChange={(e) => setZoomScale(parseInt(e.target.value))}
              className="w-24 accent-[#d2bbff] h-1 bg-[#33343d] rounded-lg cursor-pointer"
            />
            <span className="material-symbols-outlined text-[#958da1] text-[16px]">zoom_in</span>
          </div>
          <span className="text-[11px] font-mono text-[#958da1]">
            Scale: 1s = {Math.round(pxPerSec * 2.5)}px
          </span>
        </div>
      </div>

      {/* Tracks Canvas Area */}
      <div className="flex-1 flex overflow-x-auto overflow-y-hidden relative custom-scrollbar bg-[#0a0b10]">
        {/* Track Header Labels Column (Fixed Left) */}
        <div className="w-44 bg-[#1a1b23] border-r border-[#4a4455] flex flex-col shrink-0 select-none z-20">
          {/* Time Ruler Spacer */}
          <div className="h-6 border-b border-[#4a4455]/60 bg-[#0d0e15] px-2 flex items-center">
            <span className="text-[10px] font-mono text-[#958da1]">TRACKS</span>
          </div>

          {/* Track 1: Captions */}
          <div className="h-9 px-2 flex items-center justify-between border-b border-[#4a4455]/40 bg-[#1a1b23]/60 hover:bg-[#1e1f27] transition-colors">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="material-symbols-outlined text-yellow-400 text-[14px]">subtitles</span>
              <span className="text-[11px] font-semibold truncate">T1 Captions</span>
            </div>
            <div className="flex items-center gap-1 text-[#958da1]">
              <button className="hover:text-[#e3e1ed]">
                <span className="material-symbols-outlined text-[13px]">visibility</span>
              </button>
              <button className="hover:text-[#e3e1ed]">
                <span className="material-symbols-outlined text-[13px]">lock</span>
              </button>
            </div>
          </div>

          {/* Track 2: Overlay / B-Roll */}
          <div className="h-9 px-2 flex items-center justify-between border-b border-[#4a4455]/40 bg-[#1a1b23]/60 hover:bg-[#1e1f27] transition-colors">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[14px]">layers</span>
              <span className="text-[11px] font-semibold truncate">T2 AI B-Roll</span>
            </div>
            <div className="flex items-center gap-1 text-[#958da1]">
              <button className="hover:text-[#e3e1ed]">
                <span className="material-symbols-outlined text-[13px]">visibility</span>
              </button>
              <button className="hover:text-[#e3e1ed]">
                <span className="material-symbols-outlined text-[13px]">lock</span>
              </button>
            </div>
          </div>

          {/* Track 3: Main Video / A-Roll */}
          <div className="h-9 px-2 flex items-center justify-between border-b border-[#4a4455]/40 bg-[#1a1b23]/60 hover:bg-[#1e1f27] transition-colors">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="material-symbols-outlined text-[#d2bbff] text-[14px]">videocam</span>
              <span className="text-[11px] font-semibold truncate">T3 Main A-Roll</span>
            </div>
            <div className="flex items-center gap-1 text-[#958da1]">
              <button className="hover:text-[#e3e1ed]">
                <span className="material-symbols-outlined text-[13px]">visibility</span>
              </button>
              <button className="hover:text-[#e3e1ed]">
                <span className="material-symbols-outlined text-[13px]">lock</span>
              </button>
            </div>
          </div>

          {/* Track 4: Voiceover */}
          <div className="h-9 px-2 flex items-center justify-between border-b border-[#4a4455]/40 bg-[#1a1b23]/60 hover:bg-[#1e1f27] transition-colors">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="material-symbols-outlined text-[#4edea3] text-[14px]">mic</span>
              <span className="text-[11px] font-semibold truncate">A1 Voiceover</span>
            </div>
            <div className="flex items-center gap-1 text-[#958da1]">
              <button className="hover:text-[#e3e1ed]">
                <span className="material-symbols-outlined text-[13px]">volume_up</span>
              </button>
              <button className="hover:text-[#e3e1ed]">
                <span className="material-symbols-outlined text-[13px]">lock</span>
              </button>
            </div>
          </div>

          {/* Track 5: Ambient Music / Ducking */}
          <div className="h-9 px-2 flex items-center justify-between border-b border-[#4a4455]/40 bg-[#1a1b23]/60 hover:bg-[#1e1f27] transition-colors">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="material-symbols-outlined text-[#acedff] text-[14px]">music_note</span>
              <span className="text-[11px] font-semibold truncate">A2 Synth BGM</span>
            </div>
            <div className="flex items-center gap-1 text-[#958da1]">
              <button className="hover:text-[#e3e1ed]">
                <span className="material-symbols-outlined text-[13px]">volume_up</span>
              </button>
              <button className="hover:text-[#e3e1ed]">
                <span className="material-symbols-outlined text-[13px]">lock</span>
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Scroller & Lanes Area */}
        <div
          ref={rulerContainerRef}
          onClick={handleRulerClick}
          className="flex-1 min-w-[1200px] flex flex-col relative cursor-pointer"
        >
          {/* Time Ruler Bar */}
          <div className="h-6 border-b border-[#4a4455]/60 bg-[#0d0e15] flex items-center text-[10px] font-mono text-[#958da1] select-none relative">
            <div className="absolute left-0 pl-2">00:00</div>
            <div
              className="absolute pl-2 border-l border-[#4a4455]/40 h-3 flex items-center"
              style={{ left: `${5 * pxPerSec}px` }}
            >
              00:05
            </div>
            <div
              className="absolute pl-2 border-l border-[#4a4455]/40 h-3 flex items-center"
              style={{ left: `${10 * pxPerSec}px` }}
            >
              00:10
            </div>
            <div
              className="absolute pl-2 border-l border-[#d2bbff]/50 h-3 flex items-center text-[#d2bbff] font-bold"
              style={{ left: `${15 * pxPerSec}px` }}
            >
              00:15
            </div>
            <div
              className="absolute pl-2 border-l border-[#4a4455]/40 h-3 flex items-center"
              style={{ left: `${20 * pxPerSec}px` }}
            >
              00:20
            </div>
            <div
              className="absolute pl-2 border-l border-[#4a4455]/40 h-3 flex items-center"
              style={{ left: `${25 * pxPerSec}px` }}
            >
              00:25
            </div>
            <div
              className="absolute pl-2 border-l border-[#4a4455]/40 h-3 flex items-center"
              style={{ left: `${30 * pxPerSec}px` }}
            >
              00:30
            </div>
          </div>

          {/* Track 1 Lane: Captions Blocks */}
          <div className="h-9 border-b border-[#4a4455]/40 relative flex items-center px-1 bg-[#0d0e15]/30">
            {/* Block 1 */}
            <div
              className="absolute h-7 bg-[#1e1f27] border border-yellow-500/50 rounded flex items-center px-2 shadow-sm"
              style={{ left: '0px', width: `${4.5 * pxPerSec}px` }}
            >
              <span className="text-[10px] font-bold text-yellow-300 truncate">“In Neo-Shinjuku...”</span>
            </div>
            {/* Selected / Current Word Synced Subtitle Block */}
            <div
              className="absolute h-7 bg-yellow-500/20 border-2 border-yellow-400 rounded flex items-center justify-between px-2 shadow-[0_0_10px_rgba(250,204,21,0.25)]"
              style={{ left: `${5 * pxPerSec}px`, width: `${9 * pxPerSec}px` }}
            >
              <span className="text-[10px] font-extrabold text-yellow-300 truncate">
                “THE CITY NEVER SLEEPS”
              </span>
              <span className="text-[9px] font-mono text-yellow-400 bg-yellow-400/20 px-1 rounded ml-1">
                Karaoke
              </span>
            </div>
          </div>

          {/* Track 2 Lane: Overlay / B-Roll Clips */}
          <div className="h-9 border-b border-[#4a4455]/40 relative flex items-center px-1 bg-[#0d0e15]/30">
            <div
              className="absolute h-7 bg-[#03b5d3]/20 border border-[#4cd7f6]/60 rounded flex items-center justify-between px-2"
              style={{ left: `${4 * pxPerSec}px`, width: `${8 * pxPerSec}px` }}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[12px]">auto_awesome</span>
                <span className="text-[10px] font-medium text-[#4cd7f6] truncate">Neon_Drone_Shot.mp4</span>
              </div>
              <span className="text-[9px] font-mono text-[#4cd7f6] bg-[#4cd7f6]/20 px-1 rounded ml-1">
                AI Gen
              </span>
            </div>
            <div
              className="absolute h-7 bg-[#1e1f27] border border-[#4a4455] rounded flex items-center px-2"
              style={{ left: `${13.7 * pxPerSec}px`, width: `${6 * pxPerSec}px` }}
            >
              <span className="text-[10px] font-medium text-[#e3e1ed] truncate">Hologram_Glitch.mov</span>
            </div>
          </div>

          {/* Track 3 Lane: Main Video / A-Roll Filmstrip */}
          <div className="h-9 border-b border-[#4a4455]/40 relative flex items-center px-1 bg-[#0d0e15]/30">
            {/* Clip 1 */}
            <div
              className="absolute h-7 bg-[#292932] border-2 border-[#d2bbff] rounded flex items-center justify-between px-2 overflow-hidden shadow-sm"
              style={{ left: '0px', width: `${10 * pxPerSec}px` }}
            >
              <span className="text-[10px] font-semibold text-[#d2bbff] truncate z-10">
                Cyberpunk_Master_A_Roll_01.mp4
              </span>
              <span className="text-[9px] font-mono text-[#eaddff] z-10">4K 60p</span>
              {/* Filmstrip Thumbnail Micro Simulation */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d2bbff_1px,transparent_1px)] [background-size:8px_8px]"></div>
            </div>
            {/* Clip 2 */}
            <div
              className="absolute h-7 bg-[#1e1f27] border border-[#4a4455] rounded flex items-center justify-between px-2 overflow-hidden"
              style={{ left: `${10.3 * pxPerSec}px`, width: `${12 * pxPerSec}px` }}
            >
              <span className="text-[10px] font-medium text-[#e3e1ed] truncate z-10">
                Cyberpunk_Master_A_Roll_02.mp4
              </span>
              <span className="text-[9px] font-mono text-[#958da1] z-10">Cut 02</span>
            </div>
          </div>

          {/* Track 4 Lane: AI Voiceover (Cyan Dynamic Waveform) */}
          <div className="h-9 border-b border-[#4a4455]/40 relative flex items-center px-1 bg-[#0d0e15]/30">
            <div
              className="absolute h-7 bg-[#007650]/20 border border-[#4edea3]/50 rounded flex items-center px-2 relative overflow-hidden"
              style={{ left: '0px', width: `${21 * pxPerSec}px` }}
            >
              <span className="text-[10px] font-semibold text-[#4edea3] mr-2 shrink-0 z-10">
                VO_Nova_Energetic_01.wav
              </span>
              {/* Dynamic Waveform Bars Simulated with CSS Flex */}
              <div className="flex-1 flex items-center gap-[2px] h-full py-1 opacity-80 overflow-hidden">
                <span className="w-[3px] h-2 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-4 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-5 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-3 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-1 bg-[#4edea3] rounded-full"></span>
                {/* Marked Silence Gap */}
                <span className="w-8 h-3 bg-[#93000a]/40 border border-dashed border-[#ffb4ab]/70 rounded flex items-center justify-center text-[7px] text-[#ffb4ab] font-mono font-bold">
                  SILENCE
                </span>
                <span className="w-[3px] h-4 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-6 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-5 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-2 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-5 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-6 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-3 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-2 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-5 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-4 bg-[#4edea3] rounded-full"></span>
                <span className="w-[3px] h-2 bg-[#4edea3] rounded-full"></span>
              </div>
            </div>
          </div>

          {/* Track 5 Lane: Synth BGM Waveform with Audio Ducking */}
          <div className="h-9 border-b border-[#4a4455]/40 relative flex items-center px-1 bg-[#0d0e15]/30">
            <div
              className="absolute h-7 bg-[#1e1f27] border border-[#4a4455] rounded flex items-center px-2 relative overflow-hidden"
              style={{ left: '0px', width: `${28 * pxPerSec}px` }}
            >
              <span className="text-[10px] font-medium text-[#acedff] mr-2 shrink-0 z-10 flex items-center gap-1">
                Synthwave_Loop_Ducked.mp3
                <span className="material-symbols-outlined text-[12px] text-[#d2bbff]" title="AI Speech Ducking Active">
                  graphic_eq
                </span>
              </span>
              {/* Low-amplitude audio waveform during ducking */}
              <div className="flex-1 flex items-center gap-[2px] h-full py-2 opacity-50 overflow-hidden">
                <span className="w-[2px] h-1.5 bg-[#acedff] rounded-full"></span>
                <span className="w-[2px] h-2 bg-[#acedff] rounded-full"></span>
                <span className="w-[2px] h-1.5 bg-[#acedff] rounded-full"></span>
                <span className="w-[2px] h-2.5 bg-[#acedff] rounded-full"></span>
                <span className="w-[2px] h-2 bg-[#acedff] rounded-full"></span>
                <span className="w-[2px] h-1.5 bg-[#acedff] rounded-full"></span>
                <span className="w-[2px] h-2 bg-[#acedff] rounded-full"></span>
                <span className="w-[2px] h-3 bg-[#acedff] rounded-full"></span>
                <span className="w-[2px] h-2 bg-[#acedff] rounded-full"></span>
                <span className="w-[2px] h-1.5 bg-[#acedff] rounded-full"></span>
                <span className="w-[2px] h-2 bg-[#acedff] rounded-full"></span>
                <span className="w-[2px] h-2.5 bg-[#acedff] rounded-full"></span>
                <span className="w-[2px] h-1.5 bg-[#acedff] rounded-full"></span>
              </div>
            </div>
          </div>

          {/* Glowing Purple Playhead Marker & Scrubber Line */}
          <div
            onMouseDown={handlePlayheadMouseDown}
            style={{ left: `${playheadLeft}px` }}
            className="absolute top-0 bottom-0 w-0 z-30 flex flex-col items-center pointer-events-auto cursor-ew-resize transition-all duration-75"
          >
            {/* Inverted Pentagon Grab Handle Head */}
            <div
              className="w-4 h-4 bg-[#d2bbff] text-[#3f008e] flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.9)] playhead-polygon"
              title="Drag playhead to scrub timeline"
            ></div>
            {/* Playhead Needle with Drop Glow Line */}
            <div className="w-[1.5px] h-full bg-[#d2bbff] shadow-[0_0_10px_#7c3aed,0_0_18px_#d2bbff]"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};
