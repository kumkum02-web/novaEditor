import React, { useState } from 'react';
import { StoryboardSegment } from '../types';

interface ScriptStoryboardDrawerProps {
  segments: StoryboardSegment[];
  currentPlayheadSec: number;
  onSelectSegment: (segment: StoryboardSegment) => void;
  onUpdateSegment: (id: string, updates: Partial<StoryboardSegment>) => void;
  onGenerateScript: (prompt: string) => Promise<void>;
  onRewriteHook: (segmentId: string) => Promise<void>;
  onFastAction: (actionType: 'broll' | 'hook' | 'summarize' | 'music') => void;
  isLoadingAI?: boolean;
}

export const ScriptStoryboardDrawer: React.FC<ScriptStoryboardDrawerProps> = ({
  segments,
  currentPlayheadSec,
  onSelectSegment,
  onUpdateSegment,
  onGenerateScript,
  onRewriteHook,
  onFastAction,
  isLoadingAI = false,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!promptInput.trim() || isLoadingAI) return;
    await onGenerateScript(promptInput);
    setPromptInput('');
  };

  return (
    <section className="w-80 h-full bg-[#1a1b23] flex flex-col border-r border-[#4a4455] overflow-hidden select-none shrink-0">
      {/* Panel Header */}
      <div className="p-3 border-b border-[#4a4455] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#d2bbff] text-[18px]">auto_videocam</span>
          <h2 className="text-xs font-semibold text-[#e3e1ed] tracking-wide font-sans">
            AI Script &amp; Storyboard
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#007650]/30 text-[#4edea3] border border-[#4edea3]/40">
          Synced
        </span>
      </div>

      {/* AI Prompt Box & Action Chips */}
      <div className="p-3 border-b border-[#4a4455]/60 bg-[#0d0e15]">
        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleGenerate();
              }
            }}
            className="w-full bg-[#1e1f27] border border-[#4a4455] focus:border-[#d2bbff] focus:ring-1 focus:ring-[#d2bbff] rounded-lg p-2.5 text-xs text-[#e3e1ed] placeholder:text-[#958da1] resize-none custom-scrollbar outline-none transition-all"
            placeholder="Describe your scene, paste raw transcript, or ask AI to re-write hooks..."
            rows={3}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoadingAI}
            className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-[#7c3aed] text-[#ede0ff] text-[11px] font-semibold flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow-sm disabled:opacity-50"
          >
            <span>{isLoadingAI ? 'Thinking...' : 'Generate'}</span>
            <span className="material-symbols-outlined text-[14px]">send</span>
          </button>
        </div>

        {/* Quick Action Chips */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          <button
            onClick={() => onFastAction('broll')}
            className="px-2 py-0.5 rounded-full bg-[#7c3aed]/15 border border-[#d2bbff]/30 text-[#eaddff] hover:bg-[#7c3aed]/25 text-[11px] font-medium flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[12px]">smart_display</span> Generate B-Roll
          </button>
          <button
            onClick={() => onFastAction('hook')}
            className="px-2 py-0.5 rounded-full bg-[#1e1f27] border border-[#4a4455] text-[#ccc3d8] hover:text-[#e3e1ed] text-[11px] font-medium flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[12px]">offline_bolt</span> Insert Hook
          </button>
          <button
            onClick={() => onFastAction('summarize')}
            className="px-2 py-0.5 rounded-full bg-[#1e1f27] border border-[#4a4455] text-[#ccc3d8] hover:text-[#e3e1ed] text-[11px] font-medium flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[12px]">content_cut</span> Summarize
          </button>
          <button
            onClick={() => onFastAction('music')}
            className="px-2 py-0.5 rounded-full bg-[#1e1f27] border border-[#4a4455] text-[#ccc3d8] hover:text-[#e3e1ed] text-[11px] font-medium flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[12px]">music_note</span> Cinematic Music
          </button>
        </div>
      </div>

      {/* Interactive Script Storyboard List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {segments.map((seg) => {
          const isCurrentTime =
            currentPlayheadSec >= seg.startSec && currentPlayheadSec < seg.endSec;
          const isFirstSegment = seg.id === 'seg_1';

          return (
            <div
              key={seg.id}
              onClick={() => onSelectSegment(seg)}
              className={`p-2.5 rounded-lg cursor-pointer transition-all ${
                isCurrentTime
                  ? 'bg-[#292932] border-l-2 border-[#4cd7f6] border border-[#4a4455]/60 shadow-sm ring-1 ring-[#4cd7f6]/30'
                  : isFirstSegment
                  ? 'bg-[#1e1f27] border-l-2 border-[#d2bbff] border border-[#4a4455]/60 shadow-sm hover:border-[#d2bbff]/60'
                  : 'bg-[#1e1f27] border border-[#4a4455]/40 opacity-80 hover:opacity-100 hover:border-[#4a4455]'
              }`}
            >
              {/* Header: Timecode and Voice Model badge */}
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#4a4455]/40">
                <span
                  className={`text-xs font-mono font-bold flex items-center gap-1.5 ${
                    isCurrentTime
                      ? 'text-[#4cd7f6]'
                      : isFirstSegment
                      ? 'text-[#d2bbff]'
                      : 'text-[#ccc3d8]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isCurrentTime
                        ? 'bg-[#4cd7f6]'
                        : isFirstSegment
                        ? 'bg-[#d2bbff] animate-pulse'
                        : 'bg-[#958da1]'
                    }`}
                  ></span>
                  [{seg.timecode}]
                </span>

                <span className="text-[10px] text-[#4cd7f6] font-medium flex items-center gap-1 bg-[#03b5d3]/20 px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[12px]">graphic_eq</span>
                  {seg.voiceModel}
                </span>
              </div>

              {/* Spoken Prose */}
              {editingId === seg.id ? (
                <textarea
                  value={seg.text}
                  onChange={(e) => onUpdateSegment(seg.id, { text: e.target.value })}
                  onBlur={() => setEditingId(null)}
                  autoFocus
                  className="w-full bg-[#0d0e15] border border-[#7c3aed] text-xs text-[#e3e1ed] p-1.5 rounded outline-none"
                  rows={2}
                />
              ) : (
                <p
                  onDoubleClick={() => setEditingId(seg.id)}
                  className="text-xs text-[#e3e1ed] leading-relaxed select-text"
                  title="Double-click to edit script text directly"
                >
                  {seg.id === 'seg_2' && seg.fillerWord ? (
                    <>
                      Every district has its own syndicate, but today—
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateSegment(seg.id, {
                            fillerWord: undefined,
                            text: seg.text.replace('uhm—', ''),
                          });
                        }}
                        className="bg-[#93000a]/40 text-[#ffb4ab] px-1 rounded line-through text-[11px] cursor-pointer hover:bg-[#93000a]"
                        title="Click to remove filler word instantly"
                      >
                        {seg.fillerWord}
                      </span>
                      —everything shifts. When cybernetics meet rebel code, no firewall remains unbroken.
                    </>
                  ) : (
                    seg.text
                  )}
                </p>
              )}

              {/* Tags / Actions footer */}
              {seg.id === 'seg_1' && (
                <div className="mt-2 flex items-center gap-2">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('0.8s silence trimmed from audio stream.');
                    }}
                    className="px-1.5 py-0.5 rounded bg-[#93000a]/40 text-[#ffb4ab] text-[10px] font-mono flex items-center gap-0.5 border border-[#ffb4ab]/30 cursor-pointer hover:bg-[#93000a]"
                  >
                    <span className="material-symbols-outlined text-[11px]">close</span>
                    [0.8s silence removed]
                  </span>
                  <span className="text-[10px] text-[#4edea3] flex items-center gap-0.5 font-medium">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    1080p B-roll attached
                  </span>
                </div>
              )}

              {seg.id === 'seg_2' && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-[#958da1] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">smart_toy</span>
                    AI Hook Strength: {seg.hookStrength || 94}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRewriteHook(seg.id);
                    }}
                    className="text-[10px] text-[#d2bbff] hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[12px]">replay</span>
                    Regenerate
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
