import React, { useState } from 'react';
import { ColorGradingConfig, SubtitlePresetType, VoiceConfig } from '../types';

interface InspectorDrawerProps {
  subtitlePreset: SubtitlePresetType;
  onChangeSubtitlePreset: (preset: SubtitlePresetType) => void;
  voiceConfig: VoiceConfig;
  onUpdateVoiceConfig: (updates: Partial<VoiceConfig>) => void;
  colorGrading: ColorGradingConfig;
  onUpdateColorGrading: (updates: Partial<ColorGradingConfig>) => void;
}

export const InspectorDrawer: React.FC<InspectorDrawerProps> = ({
  subtitlePreset,
  onChangeSubtitlePreset,
  voiceConfig,
  onUpdateVoiceConfig,
  colorGrading,
  onUpdateColorGrading,
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'voice' | 'animation'>('style');
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  // Play audio sample using browser Web Audio API
  const handleTestAudioSample = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);

      // Low pass filter for vocal warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      setIsPlayingSample(true);
      setTimeout(() => setIsPlayingSample(false), 500);
    } catch {
      // AudioContext not permitted or unsupported
    }
  };

  return (
    <aside className="w-80 h-full bg-[#1a1b23] flex flex-col shrink-0 overflow-y-auto custom-scrollbar border-l border-[#4a4455] select-none">
      {/* Inspector Header */}
      <div className="p-3 border-b border-[#4a4455] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">tune</span>
          <h2 className="text-xs font-semibold text-[#e3e1ed] font-sans">
            AI Inspector &amp; Style
          </h2>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e1f27] text-[#958da1]">
          Layer #3 Selected
        </span>
      </div>

      {/* Inspector Tabs */}
      <div className="flex border-b border-[#4a4455] bg-[#0d0e15] p-1 gap-1">
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-1 rounded text-xs font-semibold transition-colors ${
            activeTab === 'style'
              ? 'bg-[#292932] text-[#d2bbff]'
              : 'text-[#ccc3d8] hover:text-[#e3e1ed] hover:bg-[#1e1f27]'
          }`}
        >
          Visual Style
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-1 rounded text-xs font-semibold transition-colors ${
            activeTab === 'voice'
              ? 'bg-[#292932] text-[#d2bbff]'
              : 'text-[#ccc3d8] hover:text-[#e3e1ed] hover:bg-[#1e1f27]'
          }`}
        >
          AI Voice
        </button>
        <button
          onClick={() => setActiveTab('animation')}
          className={`flex-1 py-1 rounded text-xs font-semibold transition-colors ${
            activeTab === 'animation'
              ? 'bg-[#292932] text-[#d2bbff]'
              : 'text-[#ccc3d8] hover:text-[#e3e1ed] hover:bg-[#1e1f27]'
          }`}
        >
          Animation
        </button>
      </div>

      {/* Inspector Content Body */}
      <div className="p-3 space-y-4 flex-1">
        {activeTab === 'style' && (
          <>
            {/* Section 1: Subtitle Styling Presets */}
            <div>
              <label className="text-[11px] font-semibold text-[#ccc3d8] uppercase tracking-wider block mb-2">
                Subtitle Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* Preset 1: Karaoke Glow */}
                <div
                  onClick={() => onChangeSubtitlePreset('karaoke')}
                  className={`p-2.5 rounded-lg bg-[#1e1f27] cursor-pointer hover:bg-[#292932] transition-all flex flex-col justify-between h-20 shadow-sm ${
                    subtitlePreset === 'karaoke'
                      ? 'border-2 border-[#d2bbff] shadow-[#7c3aed]/20'
                      : 'border border-[#4a4455]'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold ${
                      subtitlePreset === 'karaoke' ? 'text-[#d2bbff]' : 'text-[#ccc3d8]'
                    }`}
                  >
                    Karaoke Glow
                  </span>
                  <div className="bg-black/60 p-1 rounded text-center">
                    <span className="text-[11px] font-black text-yellow-300">VIRAL</span>
                    <span className="text-[11px] font-black text-[#4cd7f6] ml-1">BOUNCE</span>
                  </div>
                </div>

                {/* Preset 2: Hormozi Bold */}
                <div
                  onClick={() => onChangeSubtitlePreset('hormozi')}
                  className={`p-2.5 rounded-lg bg-[#1e1f27] cursor-pointer hover:bg-[#292932] transition-all flex flex-col justify-between h-20 shadow-sm ${
                    subtitlePreset === 'hormozi'
                      ? 'border-2 border-[#4edea3] shadow-[#4edea3]/20'
                      : 'border border-[#4a4455]'
                  }`}
                >
                  <span
                    className={`text-[10px] font-medium ${
                      subtitlePreset === 'hormozi' ? 'text-[#4edea3] font-bold' : 'text-[#ccc3d8]'
                    }`}
                  >
                    Hormozi Punch
                  </span>
                  <div className="bg-black/50 p-1 rounded text-center">
                    <span className="text-[11px] font-black text-green-400 uppercase">HIGH FOCUS</span>
                  </div>
                </div>

                {/* Preset 3: Cinematic Minimal */}
                <div
                  onClick={() => onChangeSubtitlePreset('cinematic')}
                  className={`p-2.5 rounded-lg bg-[#1e1f27] cursor-pointer hover:bg-[#292932] transition-all flex flex-col justify-between h-20 shadow-sm ${
                    subtitlePreset === 'cinematic'
                      ? 'border-2 border-white'
                      : 'border border-[#4a4455]'
                  }`}
                >
                  <span
                    className={`text-[10px] font-medium ${
                      subtitlePreset === 'cinematic' ? 'text-white font-bold' : 'text-[#ccc3d8]'
                    }`}
                  >
                    Cinematic Fade
                  </span>
                  <div className="bg-black/40 p-1 rounded text-center">
                    <span className="text-[10px] font-serif text-white tracking-widest italic">Aesthetic</span>
                  </div>
                </div>

                {/* Preset 4: Cyber Minimal */}
                <div
                  onClick={() => onChangeSubtitlePreset('cyber')}
                  className={`p-2.5 rounded-lg bg-[#1e1f27] cursor-pointer hover:bg-[#292932] transition-all flex flex-col justify-between h-20 shadow-sm ${
                    subtitlePreset === 'cyber'
                      ? 'border-2 border-[#4cd7f6]'
                      : 'border border-[#4a4455]'
                  }`}
                >
                  <span
                    className={`text-[10px] font-medium ${
                      subtitlePreset === 'cyber' ? 'text-[#4cd7f6] font-bold' : 'text-[#ccc3d8]'
                    }`}
                  >
                    Cyber Minimal
                  </span>
                  <div className="bg-black/40 p-1 rounded text-center border border-[#03b5d3]/40">
                    <span className="text-[10px] font-mono text-cyan-300">CLEAN 90s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: AI Voiceover Engine Settings */}
            <div className="p-3 bg-[#0d0e15] rounded-lg border border-[#4a4455] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#ccc3d8] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[14px]">mic</span>
                  AI Voice Config
                </span>
                <span className="text-[10px] font-mono text-[#4edea3]">ElevenLabs V2</span>
              </div>

              {/* Voice Selection Dropdown */}
              <div>
                <label className="text-[10px] text-[#958da1] block mb-1">Speaker Model</label>
                <div className="relative">
                  <select
                    value={voiceConfig.speakerModel}
                    onChange={(e) => onUpdateVoiceConfig({ speakerModel: e.target.value })}
                    className="w-full bg-[#1e1f27] border border-[#4a4455] rounded px-2.5 py-1.5 text-xs text-[#e3e1ed] outline-none appearance-none cursor-pointer focus:border-[#d2bbff]"
                  >
                    <option value="Nova Ultra - Male Energetic (Pro)">Nova Ultra - Male Energetic (Pro)</option>
                    <option value="Kira Cyber - Female Futuristic">Kira Cyber - Female Futuristic</option>
                    <option value="Marcus Deep - Cinematic Narration">Marcus Deep - Cinematic Narration</option>
                    <option value="Elena Synth - Ambient Documentary">Elena Synth - Ambient Documentary</option>
                  </select>
                  <span className="material-symbols-outlined text-[16px] text-[#958da1] absolute right-2 top-2 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Speed Slider */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                  <span className="text-[#ccc3d8]">Speech Speed</span>
                  <span className="text-[#d2bbff] font-bold">
                    {voiceConfig.speed.toFixed(2)}x ({voiceConfig.speed > 1 ? `+${Math.round((voiceConfig.speed - 1) * 100)}%` : `${Math.round((voiceConfig.speed - 1) * 100)}%`})
                  </span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.05"
                  value={voiceConfig.speed}
                  onChange={(e) => onUpdateVoiceConfig({ speed: parseFloat(e.target.value) })}
                  className="w-full accent-[#d2bbff] h-1 bg-[#33343d] rounded-lg cursor-pointer"
                />
              </div>

              {/* Stability Slider */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                  <span className="text-[#ccc3d8]">Voice Stability</span>
                  <span className="text-[#d2bbff] font-bold">{voiceConfig.stability}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voiceConfig.stability}
                  onChange={(e) => onUpdateVoiceConfig({ stability: parseInt(e.target.value) })}
                  className="w-full accent-[#d2bbff] h-1 bg-[#33343d] rounded-lg cursor-pointer"
                />
              </div>

              {/* Voice Audition preview button */}
              <button
                onClick={handleTestAudioSample}
                className="w-full py-1 text-center text-[10px] font-mono rounded bg-[#1e1f27] hover:bg-[#292932] border border-[#4a4455] text-[#4cd7f6] flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[12px]">
                  {isPlayingSample ? 'volume_up' : 'play_circle'}
                </span>
                <span>{isPlayingSample ? 'Auditioning Voice Sample...' : 'Test Speaker Audio Sample'}</span>
              </button>
            </div>

            {/* Section 3: AI Color Grading & Atmosphere */}
            <div className="p-3 bg-[#0d0e15] rounded-lg border border-[#4a4455] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#ccc3d8] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#d2bbff] text-[14px]">palette</span>
                  AI Color Grading
                </span>
                <span className="text-[10px] text-[#d2bbff] font-bold bg-[#7c3aed]/20 px-1.5 py-0.5 rounded">
                  Cyberpunk LUT
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#e3e1ed]">{colorGrading.lutName}</span>
                <span className="font-mono text-[#4cd7f6] font-semibold">
                  Intensity: {colorGrading.intensity}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={colorGrading.intensity}
                onChange={(e) => onUpdateColorGrading({ intensity: parseInt(e.target.value) })}
                className="w-full accent-[#4cd7f6] h-1 bg-[#33343d] rounded-lg cursor-pointer"
              />
              <div className="pt-1 flex items-center justify-between text-[10px] text-[#958da1]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Teal Shadows
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span> Neon Highlights
                </span>
              </div>
            </div>

            {/* Render Status Pill Card */}
            <div className="p-2.5 rounded-lg bg-[#1e1f27] border border-[#4edea3]/30 flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse shrink-0"></div>
              <div className="text-[11px] leading-tight">
                <span className="text-[#4edea3] font-semibold block">Real-time Neural Engine Ready</span>
                <span className="text-[#958da1] text-[10px]">Timeline preview rendering in background at 60 FPS</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#0d0e15] rounded-lg border border-[#4a4455] space-y-3">
              <h3 className="text-xs font-semibold text-[#e3e1ed]">Neural Speech Modulation</h3>
              <div>
                <label className="text-[10px] text-[#958da1] block mb-1">Emotion Dynamics</label>
                <select className="w-full bg-[#1e1f27] border border-[#4a4455] rounded px-2.5 py-1.5 text-xs text-[#e3e1ed] outline-none">
                  <option>High Urgency / Cinematic Hype</option>
                  <option>Dramatic Whisper</option>
                  <option>Investigative Documentary</option>
                  <option>Casual Tech Explainer</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#958da1] block mb-1">AI Speech Ducking Threshold</label>
                <div className="flex justify-between text-[10px] font-mono text-[#4cd7f6] mb-1">
                  <span>-18 dB</span>
                  <span>Fast Attack (45ms)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  className="w-full accent-[#4cd7f6] h-1 bg-[#33343d] rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#ccc3d8]">Auto Breath Trimming</span>
                <input type="checkbox" defaultChecked className="accent-[#7c3aed] rounded cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'animation' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#0d0e15] rounded-lg border border-[#4a4455] space-y-3">
              <h3 className="text-xs font-semibold text-[#e3e1ed]">Kinetic Typography</h3>
              <div>
                <label className="text-[10px] text-[#958da1] block mb-1">Text Transition</label>
                <select className="w-full bg-[#1e1f27] border border-[#4a4455] rounded px-2.5 py-1.5 text-xs text-[#e3e1ed] outline-none">
                  <option>Karaoke Word-by-Word Bounce</option>
                  <option>Glitch Teleport</option>
                  <option>Snap Zoom Scale</option>
                  <option>Smooth Cinematic Fade</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#ccc3d8]">Motion Blur on Text</span>
                <input type="checkbox" defaultChecked className="accent-[#7c3aed] rounded cursor-pointer" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#ccc3d8]">RGB Split Chromatic Aberration</span>
                <input type="checkbox" defaultChecked className="accent-[#7c3aed] rounded cursor-pointer" />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
