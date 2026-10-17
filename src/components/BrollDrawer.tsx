import React, { useState } from 'react';

interface BrollDrawerProps {
  onInsertBroll: (title: string) => void;
}

export const BrollDrawer: React.FC<BrollDrawerProps> = ({ onInsertBroll }) => {
  const [brollPrompt, setBrollPrompt] = useState('Futuristic cyber drone gliding over neon metropolis');
  const [isGenerating, setIsGenerating] = useState(false);

  const libraryClips = [
    { title: 'Neon_Drone_Shot.mp4', duration: '7s', tag: 'AI Gen (Veo 3.1)', res: '4K 60p' },
    { title: 'Hologram_Glitch.mov', duration: '5s', tag: 'Overlay FX', res: '1080p' },
    { title: 'Cyber_Rain_Asphalt.mp4', duration: '9s', tag: 'Cinematic B-Roll', res: '4K' },
    { title: 'Neural_Data_Stream.mp4', duration: '6s', tag: 'Motion Graphic', res: '4K' },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onInsertBroll(`Generated_${Date.now().toString().slice(-4)}.mp4`);
      alert(`AI B-Roll clip "${brollPrompt}" generated and added to Timeline!`);
    }, 1200);
  };

  return (
    <section className="w-80 h-full bg-[#1a1b23] flex flex-col border-r border-[#4a4455] overflow-y-auto custom-scrollbar select-none shrink-0 p-3 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#4a4455]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">video_library</span>
          <h2 className="text-xs font-semibold text-[#e3e1ed]">AI B-Roll &amp; Media Bin</h2>
        </div>
        <span className="text-[10px] font-mono text-[#4cd7f6]">Veo 3.1 Lite</span>
      </div>

      {/* Generator Prompt Box */}
      <div className="p-2.5 bg-[#0d0e15] rounded-lg border border-[#4a4455] space-y-2">
        <label className="text-[10px] font-mono text-[#958da1] block">Prompt-to-Video Engine</label>
        <textarea
          value={brollPrompt}
          onChange={(e) => setBrollPrompt(e.target.value)}
          className="w-full bg-[#1e1f27] border border-[#4a4455] rounded p-2 text-xs text-[#e3e1ed] outline-none resize-none"
          rows={2}
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-1.5 rounded bg-[#4cd7f6] hover:bg-[#4cd7f6]/90 text-[#001f26] font-semibold text-xs flex items-center justify-center gap-1 shadow-sm transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[14px]">auto_videocam</span>
          <span>{isGenerating ? 'Generating Video (Veo)...' : 'Generate Clip (15 Credits)'}</span>
        </button>
      </div>

      {/* Project Media Clips */}
      <div className="space-y-2">
        <label className="text-[10px] text-[#958da1] uppercase tracking-wider block">Project Media Library</label>
        <div className="space-y-2">
          {libraryClips.map((clip, i) => (
            <div
              key={i}
              className="p-2 bg-[#1e1f27] border border-[#4a4455] rounded-lg flex items-center justify-between group hover:border-[#4cd7f6] transition-colors"
            >
              <div className="overflow-hidden pr-2">
                <span className="text-xs font-semibold text-[#e3e1ed] block truncate">{clip.title}</span>
                <span className="text-[10px] font-mono text-[#4cd7f6]">{clip.duration} • {clip.res}</span>
              </div>
              <button
                onClick={() => onInsertBroll(clip.title)}
                className="px-2 py-1 rounded bg-[#292932] group-hover:bg-[#4cd7f6] group-hover:text-[#001f26] text-xs font-semibold text-[#e3e1ed] transition-colors"
                title="Add to timeline"
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
