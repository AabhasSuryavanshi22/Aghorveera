import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getAllUsers } from './src/db/users.ts';

dotenv.config();

const PORT = 3000;
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Built-in intelligent clinical fallback generator if offline or API key missing
function generateClinicalFallback(userQuery: string, officerContext?: any): string {
  const queryLower = userQuery.toLowerCase();
  const rankAndName = officerContext ? `${officerContext.rank || 'Officer'} ${officerContext.name || ''}`.trim() : 'Officer';
  const stressScore = officerContext?.currentStressScore ?? 75;
  const zone = officerContext?.zone ?? (stressScore >= 70 ? 'high' : stressScore >= 36 ? 'medium' : 'low');
  const sleepAvg = officerContext?.sleepHoursAvg ?? 6.2;

  if (queryLower.includes('breathing') || queryLower.includes('box') || queryLower.includes('breath') || queryLower.includes('panic') || queryLower.includes('calm down')) {
    return `### Tactical Box Breathing Protocol (Combat Readiness Standard)

Greetings, ${rankAndName}. Here is the 4-4-4-4 diaphragmatic pacing protocol utilized by special forces and tactical flight crews to rapidly regulate the autonomic nervous system:

1. **Expel (Empty Lungs):** Exhale completely through the mouth, releasing all residual air for 4 seconds.
2. **Inhale (4 Seconds):** Inhale slowly and deeply through the nose into your lower diaphragm. Expand the belly, not just the upper chest.
3. **Hold (4 Seconds):** Retain the breath with lungs full. Keep your jaw, neck, and shoulders relaxed.
4. **Exhale (4 Seconds):** Smoothly empty your lungs over 4 continuous seconds.
5. **Hold Empty (4 Seconds):** Rest with lungs fully evacuated for 4 seconds before the next cycle.

*Repeat for 4 to 6 consecutive cycles (approx. 3–4 minutes).*
This protocol stimulates the vagus nerve and down-regulates acute norepinephrine release within 180 seconds.`;
  }

  if (queryLower.includes('sleep') || queryLower.includes('insomnia') || queryLower.includes('tired') || queryLower.includes('fatigue') || queryLower.includes('night')) {
    return `### Operational Sleep Optimization & NSDR Protocol

${rankAndName}, your current recorded sleep average is **${sleepAvg} hours/night** (${sleepAvg < 6 ? 'Significant deficit detected' : 'Operational baseline'}). Field conditions and high vigilance place heavy demands on REM and slow-wave restorative cycles.

**Tactical Countermeasures for Field Shifts:**
- **Non-Sleep Deep Rest (NSDR / Yoga Nidra):** If uninterrupted 8-hour sleep is operationally impossible, take a 20-minute guided NSDR session between shifts. This restores baseline striatal dopamine levels equivalent to ~90 minutes of standard rest.
- **Light Shielding & Circadian Anchor:** Minimize blue-frequency screen glare 45 minutes before sleep. Use blackout eye shields or dim red/amber illumination in staging bunkers.
- **Cooling Core Temperature:** A drop of 1°C core body temperature triggers sleep onset; keep quarters ventilated or take a lukewarm wash.
- **Caffeine Cutoff:** Cease caffeine consumption at least 6 hours before your rest window to prevent adenosine receptor blockade.`;
  }

  if (queryLower.includes('high') || queryLower.includes('alert') || queryLower.includes('score') || queryLower.includes('critical') || stressScore >= 80) {
    return `### High-Alert De-escalation & Tactical Reset

${rankAndName}, your current telemetry indicates a stress score of **${stressScore}/100** placed in the **${zone.toUpperCase()} ZONE**. 

**Immediate Clinical Directives:**
1. **Sensory Grounding (5-4-3-2-1):** High operational stress triggers cognitive tunnel vision. Acknowledge 5 visual markers in your immediate surroundings, 4 physical tactile contacts (boots, vest, weapon sling), 3 distinct auditory sounds, 2 tactical scents, and 1 slow deep breath.
2. **Physiological Sigh:** Take two consecutive quick inhales through the nose, followed by a long, slow sighing exhale through the mouth. Repeat 3 times to immediately reinflate collapsed pulmonary alveoli and slow cardiac rate.
3. **Medical Battalion Reach-out:** Remember that you can send an encrypted direct message directly to Battalion Medical Command via the **Solutions & Direct Messaging** tab. If your score exceeds 90, automatic sentinel alerts are flagged to medical staff.`;
  }

  return `### Aghorveera Clinical Healthcare Assessment

Received loud and clear, ${rankAndName}. (Telemetry Context: Stress ${stressScore}/100 • ${zone.toUpperCase()} Zone • Sleep avg ${sleepAvg}h/night).

As your tactical healthcare and psychological performance advisor, here are your recommended operational steps:
1. **Pacing & Recovery:** High-tempo duty cycles accumulate cumulative micro-fatigue. Ensure you incorporate structured 5-minute cognitive resets between shifts.
2. **Hydration & Electrolytes:** Severe mental stress depletes electrolyte balance, exacerbating irritability and decision fatigue. Maintain minimum 2.5L clean water intake with balanced sodium/potassium.
3. **Consultation Channel:** If you are experiencing persistent hyperarousal, night sweats, or emotional detachment, utilize the direct message composer in the Solutions tab to request an expedited review with the Battalion Healthcare Officer.

How can I further assist your operational readiness today?`;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Aghorveera Military Healthcare Server',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      cloudSqlConfigured: Boolean(process.env.SQL_HOST),
    });
  });

  // User sync to Cloud SQL (PostgreSQL)
  app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { displayName, role } = req.body;
      const user = await getOrCreateUser(req.user.uid, req.user.email || '', displayName, role);
      res.json({ status: 'ok', user });
    } catch (error: any) {
      console.error('Failed to sync user to Cloud SQL:', error);
      res.status(500).json({ error: 'Failed to sync user to database' });
    }
  });

  app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
    try {
      const usersList = await getAllUsers();
      res.json({ users: usersList });
    } catch (error: any) {
      console.error('Failed to fetch users from Cloud SQL:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // Healthcare Chatbot endpoint powered by Gemini (@google/genai)
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, officerContext } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      const lastUserMsg = messages[messages.length - 1];
      const userText = lastUserMsg.content || lastUserMsg.text || '';

      const ai = getAIClient();

      if (!ai) {
        // Safe intelligent fallback when GEMINI_API_KEY is not configured
        const fallbackText = generateClinicalFallback(userText, officerContext);
        return res.json({
          text: fallbackText,
          model: 'fallback-clinical-engine',
          isFallback: true,
        });
      }

      // Build context summary for system instructions
      const rank = officerContext?.rank || 'Captain';
      const name = officerContext?.name || 'Officer';
      const score = officerContext?.currentStressScore ?? 75;
      const zone = officerContext?.zone ?? 'medium';
      const sleep = officerContext?.sleepHoursAvg ?? 6.5;
      const driver = officerContext?.primaryStressDriver || 'Operational tempo';

      const systemInstruction = `You are the Aghorveera Sentinel Healthcare & Clinical Operations Advisor — an elite military clinical psychologist, combat trauma specialist, and medical officer serving in the Aghorveera Military Stress Management Network.

CURRENT OFFICER TELEMETRY:
- Officer: ${rank} ${name}
- Stress Score: ${score}/100 (Scale 0-100)
- Alert Zone: ${zone.toUpperCase()} ZONE (${score >= 70 ? 'High Alert: acute neuroendocrine elevation, combat fatigue danger' : score >= 36 ? 'Medium Zone: elevated duty strain' : 'Low Zone: balanced baseline'})
- 7-Day Sleep Average: ${sleep} hours/night
- Primary Stress Driver: ${driver}

ROLE & DIRECTIVES:
1. Address the officer with military professionalism, deep clinical empathy, and calm tactical clarity.
2. Provide evidence-based, scientifically validated countermeasures: tactical box breathing (4-4-4-4), physiological sigh, Huberman non-sleep deep rest (NSDR), circadian resets, cognitive reframing, and sensory grounding.
3. Tailor every response to the officer's real-time stress telemetry and sleep deficit. If their score is in High Alert (>70), provide immediate down-regulation techniques first.
4. If stress exceeds 90 or if they express severe distress, suicidal ideation, or incapacitating PTSD, immediately instruct them to stand down and contact the Battalion Medical Officer / CMO through the Aghorveera Direct Message Channel.
5. Format your answers clearly using Markdown headers (###), bold emphasis, and numbered tactical steps for easy reading under field conditions.`;

      // Convert messages to @google/genai format
      const contents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content || m.text || '' }],
      }));

      // Call Gemini 3.8 Flash (or fallback model)
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.6,
          maxOutputTokens: 1024,
        },
      });

      const replyText = response.text || generateClinicalFallback(userText, officerContext);

      return res.json({
        text: replyText,
        model: 'gemini-3.8-flash',
      });
    } catch (error: any) {
      console.error('Gemini Chat API Error:', error);
      const fallbackText = generateClinicalFallback(
        req.body?.messages?.[req.body.messages.length - 1]?.content || 'stress advice',
        req.body?.officerContext
      );
      return res.json({
        text: fallbackText,
        model: 'fallback-clinical-engine',
        isFallback: true,
      });
    }
  });

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Aghorveera Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
