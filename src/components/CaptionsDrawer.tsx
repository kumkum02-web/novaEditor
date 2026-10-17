import React from 'react';
import { SubtitlePresetType } from '../types';

interface CaptionsDrawerProps {
  subtitlePreset: SubtitlePresetType;
  onChangePreset: (p: SubtitlePresetType) => void;
}

export const CaptionsDrawer: React.FC<CaptionsDrawerProps> = ({ subtitlePreset, onChangePreset }) => {
  return (
    <section className="w-80 h-full bg-[#1a1b23] flex flex-col border-r border-[#4a4455] overflow-y-auto custom-scrollbar select-none shrink-0 p-3 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#4a4455]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-yellow-400 text-[18px]">subtitles</span>
          <h2 className="text-xs font-semibold text-[#e3e1ed]">AI Smart Captions</h2>
        </div>
        <span className="text-[10px] font-mono text-[#4edea3]">Auto-Transcribed</span>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-[#958da1] uppercase tracking-wider block">Subtitle Style</label>
        <div className="space-y-1.5">
          {[
            { id: 'karaoke', name: 'Karaoke Bounce (Viral)', color: 'text-yellow-300' },
            { id: 'hormozi', name: 'Hormozi Punch (High Retention)', color: 'text-green-400' },
            { id: 'cinematic', name: 'Cinematic Minimal (Letterbox)', color: 'text-white' },
            { id: 'cyber', name: 'Cyber 90s HUD (Cyan Border)', color: 'text-cyan-300' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onChangePreset(item.id as SubtitlePresetType)}
              className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                subtitlePreset === item.id
                  ? 'bg-[#292932] border-[#7c3aed] text-[#d2bbff] font-semibold'
                  : 'bg-[#1e1f27] border-[#4a4455] text-[#ccc3d8] hover:bg-[#292932]'
              }`}
            >
              <span className={item.color}>{item.name}</span>
              {subtitlePreset === item.id && (
                <span className="material-symbols-outlined text-[16px] text-[#d2bbff]">check</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-[#958da1] uppercase tracking-wider block">Timing &amp; Words</label>
        <div className="p-2.5 bg-[#0d0e15] rounded-lg border border-[#4a4455] space-y-2 text-xs">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-[#ccc3d8]">00:00 - 00:04</span>
            <span className="text-[#4edea3]">100% Match</span>
          </div>
          <p className="text-[#e3e1ed] text-xs">“In Neo-Shinjuku, the skyline never sleeps.”</p>
          <div className="h-px bg-[#4a4455]/40 my-1"></div>
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-[#d2bbff]">00:04 - 00:14 (Active)</span>
            <span className="text-[#4cd7f6]">Word Sync</span>
          </div>
          <p className="text-[#e3e1ed] text-xs font-semibold">“THE CITY NEVER SLEEPS”</p>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={() => alert('Exported Subtitles as .SRT file.')}
          className="w-full py-2 rounded-lg bg-[#1e1f27] hover:bg-[#292932] border border-[#4a4455] text-xs text-[#d2bbff] font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>Download .SRT / .VTT Captions</span>
        </button>
      </div>
    </section>
  );
};
