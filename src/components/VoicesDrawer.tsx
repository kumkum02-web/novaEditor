import React from 'react';
import { VoiceConfig } from '../types';

interface VoicesDrawerProps {
  voiceConfig: VoiceConfig;
  onUpdateVoiceConfig: (updates: Partial<VoiceConfig>) => void;
}

export const VoicesDrawer: React.FC<VoicesDrawerProps> = ({ voiceConfig, onUpdateVoiceConfig }) => {
  const voices = [
    { name: 'Nova Ultra - Male Energetic (Pro)', desc: 'High retention, punchy YouTube pace', lang: 'English (US)' },
    { name: 'Kira Cyber - Female Futuristic', desc: 'Sleek, sci-fi narration with synthetic warmth', lang: 'English (UK)' },
    { name: 'Marcus Deep - Cinematic Narration', desc: 'Baritone, documentary trailer presence', lang: 'English (US)' },
    { name: 'Elena Synth - Ambient Documentary', desc: 'Smooth, relaxing pacing', lang: 'Spanish (ES)' },
  ];

  return (
    <section className="w-80 h-full bg-[#1a1b23] flex flex-col border-r border-[#4a4455] overflow-y-auto custom-scrollbar select-none shrink-0 p-3 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#4a4455]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4edea3] text-[18px]">record_voice_over</span>
          <h2 className="text-xs font-semibold text-[#e3e1ed]">AI Voice Actors</h2>
        </div>
        <span className="text-[10px] font-mono text-[#4edea3]">ElevenLabs V2</span>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-[#958da1] uppercase tracking-wider block">Voice Models</label>
        <div className="space-y-2">
          {voices.map((v, i) => {
            const isSelected = voiceConfig.speakerModel === v.name;
            return (
              <div
                key={i}
                onClick={() => onUpdateVoiceConfig({ speakerModel: v.name })}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#292932] border-[#4edea3] shadow-sm'
                    : 'bg-[#1e1f27] border-[#4a4455] hover:border-[#958da1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-[#4edea3]' : 'text-[#e3e1ed]'}`}>
                    {v.name.split(' - ')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-[#958da1] bg-[#0d0e15] px-1 rounded">
                    {v.lang}
                  </span>
                </div>
                <p className="text-[11px] text-[#958da1] mt-1">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 bg-[#0d0e15] rounded-lg border border-[#4a4455] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#e3e1ed]">Voice Cloning Studio</span>
          <span className="text-[9px] font-mono text-[#d2bbff] bg-[#7c3aed]/20 px-1 rounded">Pro Feature</span>
        </div>
        <p className="text-[11px] text-[#958da1]">
          Upload 60 seconds of clean speech audio to clone your own custom creator voice.
        </p>
        <button
          onClick={() => alert('Clone Voice: Select 60s sample MP3/WAV file from your device.')}
          className="w-full py-1.5 rounded bg-[#1e1f27] hover:bg-[#292932] border border-[#4a4455] text-xs text-[#e3e1ed] font-medium flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[14px]">upload_file</span>
          <span>Upload Voice Sample</span>
        </button>
      </div>
    </section>
  );
};
