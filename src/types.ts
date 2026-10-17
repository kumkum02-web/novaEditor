export type AspectRatio = '16:9' | '9:16' | '1:1';

export type SubtitlePresetType = 'karaoke' | 'hormozi' | 'cinematic' | 'cyber';

export interface StoryboardSegment {
  id: string;
  timecode: string;
  startSec: number;
  endSec: number;
  text: string;
  voiceModel: string;
  brollPrompt?: string;
  hookStrength?: number;
  tags?: string[];
  fillerWord?: string;
  isSilenceRemoved?: boolean;
}

export interface TimelineClip {
  id: string;
  trackId: string;
  title: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  type: 'caption' | 'broll' | 'aroll' | 'voiceover' | 'music';
  badge?: string;
  meta?: string;
  active?: boolean;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'caption' | 'broll' | 'aroll' | 'voiceover' | 'music';
  icon: string;
  color: string;
  visible: boolean;
  locked: boolean;
  muted?: boolean;
}

export interface VoiceConfig {
  speakerModel: string;
  speed: number;
  stability: number;
  pitch: number;
}

export interface ColorGradingConfig {
  lutName: string;
  intensity: number;
  shadowColor: string;
  highlightColor: string;
}

export interface ProjectMetadata {
  id: string;
  title: string;
  lastSaved: string;
  aspectRatio: AspectRatio;
  resolution: string;
  fps: number;
  colorSpace: string;
  credits: number;
  totalDurationSec: number;
}
