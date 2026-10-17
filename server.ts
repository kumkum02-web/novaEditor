import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: Generate Script & Storyboard
app.post('/api/ai/script-generate', async (req, res) => {
  try {
    const { prompt, tone = 'Cyberpunk Thriller' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (ai) {
      const promptInstruction = `You are a Hollywood-grade video director and TikTok/YouTube viral retention specialist.
Create a structured 3-part or 4-part video storyboard from this scene idea:
"${prompt}" (Tone: ${tone})

Return a JSON array of scenes, where each object has:
- timecode: string (e.g. "00:00 - 00:05", "00:05 - 00:15", "00:15 - 00:26")
- startSec: number
- endSec: number
- text: string (spoken voiceover text with rich pacing)
- voiceModel: string (e.g. "Nova Ultra (Energetic)", "Kira Cyber (Futuristic)")
- brollPrompt: string (visual camera shot description)
- hookStrength: number (80 to 99)
- tags: string array (e.g. ["silence removed", "1080p B-roll attached"])

Respond with valid JSON only.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptInstruction,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text?.trim() || '[]';
      try {
        const scenes = JSON.parse(text);
        return res.json({ scenes });
      } catch {
        // Fall through to fallback
      }
    }

    // High-quality fallback scenes if API not configured
    res.json({
      scenes: [
        {
          timecode: '00:00 - 00:04',
          startSec: 0,
          endSec: 4,
          text: `In the neon-drenched metropolis of Neo-Shinjuku, the skyline never sleeps. Shadows dance beneath massive holographic spires.`,
          voiceModel: 'Nova Ultra (Energetic)',
          brollPrompt: 'Wide shot flying cybernetic drone gliding past neon high-rise towers in violet haze',
          hookStrength: 96,
          tags: ['0.8s silence removed', '1080p B-roll attached'],
        },
        {
          timecode: '00:04 - 00:14',
          startSec: 4,
          endSec: 14,
          text: `Every district has its own syndicate, but today—everything shifts. When cybernetics meet rebel code, no firewall remains unbroken.`,
          voiceModel: 'Nova Ultra (Energetic)',
          brollPrompt: 'Close up hacker fingers typing on holographic keyboard with cyan matrix reflections',
          hookStrength: 94,
          tags: ['Action Safe', 'Subtitle Synced'],
        },
        {
          timecode: '00:14 - 00:26',
          startSec: 14,
          endSec: 26,
          text: `Watch closely as the mainframe breach unfolds before tomorrow's dawn. Prepare for the singularity broadcast.`,
          voiceModel: 'Nova Ultra (Energetic)',
          brollPrompt: 'Dramatic wide zoom into glowing red mainframe core pulsing with synthetic energy',
          hookStrength: 91,
          tags: ['Cinematic LUT Applied'],
        },
      ],
    });
  } catch (error) {
    console.error('Script generation error:', error);
    res.status(500).json({ error: 'Failed to generate script' });
  }
});

// API: Rewrite Hook for maximum viral retention
app.post('/api/ai/rewrite-hook', async (req, res) => {
  try {
    const { currentText, style = 'viral' } = req.body;
    if (ai && currentText) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Rewrite this opening sentence into an ultra-high retention video hook (style: ${style}). Keep it under 20 words, punchy, curiosity-inducing, with no fluff:\n\n"${currentText}"`,
      });
      const rewritten = response.text?.trim()?.replace(/^["']|["']$/g, '');
      return res.json({ rewritten, hookStrength: Math.floor(Math.random() * 8) + 92 });
    }

    const hooks = [
      "99% of people have no idea this cyber protocol already controls their city.",
      "Before you swipe away, look at what happens when rebel code breaches the central core.",
      "They swore this firewall was unbreakable—until midnight hit.",
    ];
    res.json({
      rewritten: hooks[Math.floor(Math.random() * hooks.length)],
      hookStrength: 95,
    });
  } catch {
    res.json({
      rewritten: "When cybernetics meet rebel code, no firewall remains unbroken.",
      hookStrength: 94,
    });
  }
});

// API: Suggest B-Roll
app.post('/api/ai/suggest-broll', async (req, res) => {
  try {
    const { scriptLine } = req.body;
    if (ai && scriptLine) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Provide 3 cinematic B-roll camera shot prompts for this line: "${scriptLine}". Return JSON array with fields: title, prompt, durationSec, cameraAngle.`,
        config: { responseMimeType: 'application/json' },
      });
      const json = JSON.parse(response.text || '[]');
      return res.json({ suggestions: json });
    }

    res.json({
      suggestions: [
        {
          title: "Neon_Drone_Shot.mp4",
          prompt: "Futuristic neon skyscrapers with high speed aerial drone dive",
          durationSec: 4.5,
          cameraAngle: "FPV Aerial Dive",
        },
        {
          title: "Hologram_Glitch.mov",
          prompt: "Prismatic neon HUD holographic glitch over rainy asphalt street",
          durationSec: 3.2,
          cameraAngle: "Low Angle Close-up",
        },
        {
          title: "Neural_Interface_Macro.mp4",
          prompt: "Macro shot of luminous cybernetic iris shifting from amber to cyan",
          durationSec: 5.0,
          cameraAngle: "Macro Extreme Close-Up",
        },
      ],
    });
  } catch {
    res.json({ suggestions: [] });
  }
});

// API: Translate & Dub
app.post('/api/ai/translate-dub', async (req, res) => {
  const { text = '', targetLang = 'Spanish' } = req.body || {};
  try {
    if (ai && text) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Translate this spoken script to ${targetLang} maintaining cinematic rhythm and natural speech flow:\n\n"${text}"`,
      });
      return res.json({ translatedText: response.text?.trim() });
    }

    const fallbacks: Record<string, string> = {
      Spanish: "En la metrópoli bañada por el neón de Neo-Shinjuku, el horizonte nunca duerme.",
      Japanese: "ネオンに染まったネオ新宿の摩天楼に、夜の眠りは訪れない。",
      French: "Dans la métropole baignée de néons de Néo-Shinjuku, l'horizon ne dort jamais.",
    };
    res.json({ translatedText: fallbacks[targetLang] || `[${targetLang}] ${text}` });
  } catch {
    res.json({ translatedText: text });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NovaClip Studio running on http://localhost:${PORT}`);
  });
}

startServer();
