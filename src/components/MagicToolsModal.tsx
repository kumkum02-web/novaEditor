import React, { useState } from 'react';

interface MagicToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (actionType: 'silence' | 'broll' | 'dub' | 'hook') => void;
}

export const MagicToolsModal: React.FC<MagicToolsModalProps> = ({ isOpen, onClose, onAction }) => {
  const [selectedTool, setSelectedTool] = useState<'silence' | 'broll' | 'dub' | 'hook'>('silence');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
      <div className="bg-[#1a1b23] border border-[#4a4455] rounded-xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#4a4455] flex items-center justify-between bg-[#1e1f27]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d2bbff] text-[20px] fill">magic_button</span>
            <div>
              <h3 className="text-sm font-semibold text-[#e3e1ed]">NovaClip AI Magic Suite</h3>
              <p className="text-[10px] text-[#958da1]">One-click intelligent production automations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#958da1] hover:text-[#e3e1ed] p-1 rounded hover:bg-[#292932] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tool Cards */}
        <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
          {/* Card 1: Auto-Remove Silence */}
          <div
            onClick={() => setSelectedTool('silence')}
            className={`p-3 rounded-lg cursor-pointer border transition-all ${
              selectedTool === 'silence'
                ? 'bg-[#1e1f27] border-[#4edea3] shadow-md shadow-[#4edea3]/10'
                : 'bg-[#0d0e15] border-[#4a4455] hover:border-[#958da1]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[22px]">cut</span>
              <span className="text-[10px] font-mono bg-[#007650]/30 text-[#4edea3] px-1.5 py-0.5 rounded">
                3 cuts detected
              </span>
            </div>
            <h4 className="text-xs font-semibold text-[#e3e1ed]">Auto-Remove Silence</h4>
            <p className="text-[11px] text-[#958da1] mt-1 leading-relaxed">
              Scan speech tracks for pauses &gt;0.5s and ripple-delete dead air automatically.
            </p>
          </div>

          {/* Card 2: Generate Matching B-Roll */}
          <div
            onClick={() => setSelectedTool('broll')}
            className={`p-3 rounded-lg cursor-pointer border transition-all ${
              selectedTool === 'broll'
                ? 'bg-[#1e1f27] border-[#4cd7f6] shadow-md shadow-[#4cd7f6]/10'
                : 'bg-[#0d0e15] border-[#4a4455] hover:border-[#958da1]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">movie_filter</span>
              <span className="text-[10px] font-mono bg-[#03b5d3]/30 text-[#4cd7f6] px-1.5 py-0.5 rounded">
                Veo 3.1
              </span>
            </div>
            <h4 className="text-xs font-semibold text-[#e3e1ed]">AI B-Roll Generator</h4>
            <p className="text-[11px] text-[#958da1] mt-1 leading-relaxed">
              Generate cinematic video cutaways matching script semantics and cyber visual tone.
            </p>
          </div>

          {/* Card 3: Multilingual Dubbing */}
          <div
            onClick={() => setSelectedTool('dub')}
            className={`p-3 rounded-lg cursor-pointer border transition-all ${
              selectedTool === 'dub'
                ? 'bg-[#1e1f27] border-[#d2bbff] shadow-md shadow-[#7c3aed]/10'
                : 'bg-[#0d0e15] border-[#4a4455] hover:border-[#958da1]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[#d2bbff] text-[22px]">translate</span>
              <span className="text-[10px] font-mono bg-[#7c3aed]/30 text-[#d2bbff] px-1.5 py-0.5 rounded">
                Lip Sync
              </span>
            </div>
            <h4 className="text-xs font-semibold text-[#e3e1ed]">Translate &amp; Dub</h4>
            <p className="text-[11px] text-[#958da1] mt-1 leading-relaxed">
              Localize dialogue into Spanish, Japanese, or French while preserving original voice timbre.
            </p>
          </div>

          {/* Card 4: Viral Hook Synthesizer */}
          <div
            onClick={() => setSelectedTool('hook')}
            className={`p-3 rounded-lg cursor-pointer border transition-all ${
              selectedTool === 'hook'
                ? 'bg-[#1e1f27] border-[#facc15] shadow-md shadow-[#facc15]/10'
                : 'bg-[#0d0e15] border-[#4a4455] hover:border-[#958da1]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-yellow-400 text-[22px]">bolt</span>
              <span className="text-[10px] font-mono bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded">
                94% Retention
              </span>
            </div>
            <h4 className="text-xs font-semibold text-[#e3e1ed]">Apply Viral Hook</h4>
            <p className="text-[11px] text-[#958da1] mt-1 leading-relaxed">
              Rewrite opening lines to stop the scroll using high-retention psychological hooks.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1e1f27] border-t border-[#4a4455] flex justify-between items-center">
          <span className="text-[11px] font-mono text-[#958da1]">Cost: 15 Credits</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#292932] text-[#ccc3d8] hover:text-[#e3e1ed] font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onAction(selectedTool);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-[#ede0ff] font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-[#7c3aed]/30"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Execute Action</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
