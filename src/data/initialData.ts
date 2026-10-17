import { StoryboardSegment, TimelineTrack, TimelineClip, ProjectMetadata, VoiceConfig, ColorGradingConfig } from '../types';

export const INITIAL_PROJECT: ProjectMetadata = {
  id: 'proj_cyberpunk_03',
  title: 'Cyberpunk Future Teaser v3',
  lastSaved: 'Saved 2m ago',
  aspectRatio: '16:9',
  resolution: '1080p High',
  fps: 23.976,
  colorSpace: 'REC.709-A',
  credits: 2450,
  totalDurationSec: 90, // 01:30.00
};

export const INITIAL_STORYBOARD: StoryboardSegment[] = [
  {
    id: 'seg_1',
    timecode: '00:00 - 00:04',
    startSec: 0,
    endSec: 4,
    text: 'In the neon-drenched metropolis of Neo-Shinjuku, the skyline never sleeps. Shadows dance beneath massive holographic spires.',
    voiceModel: 'Nova Ultra (Energetic)',
    brollPrompt: 'Wide shot flying cybernetic drone gliding past neon high-rise towers in violet haze',
    tags: ['0.8s silence removed', '1080p B-roll attached'],
    isSilenceRemoved: true,
  },
  {
    id: 'seg_2',
    timecode: '00:04 - 00:14',
    startSec: 4,
    endSec: 14,
    text: 'Every district has its own syndicate, but today—everything shifts. When cybernetics meet rebel code, no firewall remains unbroken.',
    voiceModel: 'Nova Ultra (Energetic)',
    brollPrompt: 'Close up hacker fingers typing on holographic keyboard with cyan matrix reflections',
    hookStrength: 94,
    fillerWord: 'uhm',
    tags: ['Action Safe', 'Subtitle Synced'],
  },
  {
    id: 'seg_3',
    timecode: '00:14 - 00:26',
    startSec: 14,
    endSec: 26,
    text: 'Watch closely as the mainframe breach unfolds before tomorrow’s dawn. Prepare for the singularity broadcast.',
    voiceModel: 'Nova Ultra (Energetic)',
    brollPrompt: 'Dramatic wide zoom into glowing red mainframe core pulsing with synthetic energy',
    hookStrength: 91,
    tags: ['Cinematic LUT Applied'],
  },
];

export const INITIAL_TRACKS: TimelineTrack[] = [
  {
    id: 't1',
    name: 'T1 Captions',
    type: 'caption',
    icon: 'subtitles',
    color: '#facc15', // yellow-400
    visible: true,
    locked: false,
  },
  {
    id: 't2',
    name: 'T2 AI B-Roll',
    type: 'broll',
    icon: 'layers',
    color: '#4cd7f6', // cyan
    visible: true,
    locked: false,
  },
  {
    id: 't3',
    name: 'T3 Main A-Roll',
    type: 'aroll',
    icon: 'videocam',
    color: '#d2bbff', // purple
    visible: true,
    locked: false,
  },
  {
    id: 'a1',
    name: 'A1 Voiceover',
    type: 'voiceover',
    icon: 'mic',
    color: '#4edea3', // emerald
    visible: true,
    locked: false,
    muted: false,
  },
  {
    id: 'a2',
    name: 'A2 Synth BGM',
    type: 'music',
    icon: 'music_note',
    color: '#acedff', // light cyan
    visible: true,
    locked: false,
    muted: false,
  },
];

export const INITIAL_CLIPS: TimelineClip[] = [
  // T1 Captions
  {
    id: 'clip_cap_1',
    trackId: 't1',
    title: '“In Neo-Shinjuku...”',
    startTime: 0,
    duration: 4.5,
    type: 'caption',
  },
  {
    id: 'clip_cap_2',
    trackId: 't1',
    title: '“THE CITY NEVER SLEEPS”',
    startTime: 5.5,
    duration: 8.5,
    type: 'caption',
    badge: 'Karaoke',
    active: true,
  },
  // T2 AI B-Roll
  {
    id: 'clip_broll_1',
    trackId: 't2',
    title: 'Neon_Drone_Shot.mp4',
    startTime: 3.5,
    duration: 7,
    type: 'broll',
    badge: 'AI Gen',
  },
  {
    id: 'clip_broll_2',
    trackId: 't2',
    title: 'Hologram_Glitch.mov',
    startTime: 12,
    duration: 5,
    type: 'broll',
  },
  // T3 Main A-Roll
  {
    id: 'clip_aroll_1',
    trackId: 't3',
    title: 'Cyberpunk_Master_A_Roll_01.mp4',
    startTime: 0,
    duration: 9,
    type: 'aroll',
    meta: '4K 60p',
    active: true,
  },
  {
    id: 'clip_aroll_2',
    trackId: 't3',
    title: 'Cyberpunk_Master_A_Roll_02.mp4',
    startTime: 9.5,
    duration: 11,
    type: 'aroll',
    meta: 'Cut 02',
  },
  // A1 Voiceover
  {
    id: 'clip_vo_1',
    trackId: 'a1',
    title: 'VO_Nova_Energetic_01.wav',
    startTime: 0,
    duration: 19,
    type: 'voiceover',
  },
  // A2 Synth BGM
  {
    id: 'clip_bgm_1',
    trackId: 'a2',
    title: 'Synthwave_Loop_Ducked.mp3',
    startTime: 0,
    duration: 25,
    type: 'music',
  },
];

export const INITIAL_VOICE_CONFIG: VoiceConfig = {
  speakerModel: 'Nova Ultra - Male Energetic (Pro)',
  speed: 1.1,
  stability: 78,
  pitch: 0,
};

export const INITIAL_COLOR_GRADING: ColorGradingConfig = {
  lutName: 'Teal & Orange Cyberpunk',
  intensity: 85,
  shadowColor: '#22d3ee',
  highlightColor: '#fb923c',
};

// Hotlinked media assets from the provided HTML
export const ASSETS = {
  mainCyberpunkVideoStill: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYipn_0Z0KJwFkj1DYWAJgRSAwN_nQSICoJybdRUUwMMkXhJNOjtCSK02Umd-i7TMGyPRYSh-BAdmytZdUC2Ts5skJ0I8SsKwdcPPN-XjrA-jx-KhbM17LotmTQEmIaAJ_CZKMzUQ3rjR_qgIl9BmMFiNDsVNhe_T8xDb2ECH06gKDPJBe343a_7JreuBoq6vc6e3_lx41EPoShZW1MbRMq03kjbpWPOwpIzK5sJZZlEKMqFceB0Ie',
  creatorAvatar1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMAQIs1HRuVAKLJcS-NQUkQECZlwLZws_UmHsfQyIxUimNEwWwHaxx3RzwIecv4VYdFB77i2_y2AY1ytjXO9VMnJ6fezZrFGc91Qfp6t_v75RM-QOUSBRt6uSWbcvKRcIX7MhKKFfvkA57Mx_4X9k6yCi5O2chdsW9_OqDPTXNRVoyRnOSb-Zi0yD8tfLahXiJ4d2vWWy1Flq4fkENl3y1SctNb4RM_NMPH8z42KFJ1XYAXNy_Z6nA',
  creatorAvatar2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGph9hyiU_lfXhLVIDo9FFW9JGVQC6fRnKnPQ7HaQGSYwqhGVQWkrKG-KKK0SHKS-M_guOgJEwOWeWf9FD7VhKkav61ZTwEGI78O5CnsbuGmT_fdk5r4Bns6tktsj73bpdUQAffX6-kR473UwyFabKs2zzQB9qIld69yYaOUXfOKQ7XgogqxPtBImD28HeqwqLGuP-pFO1WRk-nkqryQsBd05GO4rrUWAOjCys6A52s-0yketpaPXs',
};
