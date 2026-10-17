import React from 'react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause Video' },
    { key: 'J / L', desc: 'Step Back 5s / Step Forward 5s' },
    { key: 'Home / End', desc: 'Jump to Beginning / Jump to End' },
    { key: 'C', desc: 'Split Razor Tool at Playhead' },
    { key: 'D', desc: 'Ripple Delete Selected Gap' },
    { key: 'N', desc: 'Toggle Magnetic Timeline Snapping' },
    { key: 'F', desc: 'Toggle Fullscreen Monitor' },
    { key: 'Cmd + Z', desc: 'Undo Recent Action' },
    { key: 'Cmd + Shift + Z', desc: 'Redo Action' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
      <div className="bg-[#1a1b23] border border-[#4a4455] rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-[#4a4455] flex items-center justify-between bg-[#1e1f27]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d2bbff] text-[20px]">keyboard</span>
            <h3 className="text-sm font-semibold text-[#e3e1ed]">Studio Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#958da1] hover:text-[#e3e1ed] p-1 rounded hover:bg-[#292932] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 divide-y divide-[#4a4455]/40 text-xs">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-2 flex items-center justify-between">
              <span className="text-[#ccc3d8]">{sc.desc}</span>
              <kbd className="px-2 py-0.5 bg-[#0d0e15] border border-[#4a4455] rounded text-[11px] font-mono text-[#d2bbff]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#1e1f27] border-t border-[#4a4455] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#7c3aed] text-[#ede0ff] text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
