# AURA — Autonomous Unified Resolution Agent

**"It doesn't just answer tickets. It investigates them."**

A multi-agent AI customer support system built for the **Customer Support** hackathon track. AURA routes incoming issues to specialist agents, investigates root causes across orders/tickets/knowledge base, auto-resolves what it safely can, and hands everything else to a human with a complete **Context Capsule** instead of a raw chat log — then learns from every resolution.

Built with **Next.js 14 + TypeScript + Tailwind**, reasoning powered by **Qwen**, orchestrated as a set of clean agent nodes designed to map directly onto an **EnterPro** workflow graph in production.

---

## ✨ The Wow Factors (what to point out to judges)

| # | Feature | Where to see it |
|---|---|---|
| 1 | **Live Agent Network Diagram** — an animated pipeline (Router → 4 specialist agents → Reasoning → Escalation) that lights up node by node as the real agent handling the case changes | Home page, appears the instant you send a case |
| 2 | **Data Source Evidence Panel** — Customer Profile / Order Records / Ticket History / Knowledge Base flip from pending to ✓ found in real time, visually proving cross-source investigation | Home page, next to the network diagram |
| 3 | **Live Reasoning Timeline** — full chain-of-thought streams into view step by step, fully transparent | Home page, below the evidence panel |
| 4 | **Root-Cause Detective** — traces symptom → actual cause across orders + tickets + KB, not just a category tag | Reasoning steps text |
| 5 | **Confidence Gauge** — a circular meter (not just a number) shown on every resolution and every Context Capsule | Home page result card, Agent Dashboard |
| 6 | **Context Capsule Handoff** — structured case file (sentiment trend, confidence, attempted actions, recommendation) instead of a chat transcript | Agent Dashboard, after an escalation |
| 7 | **Self-Learning Loop** — resolving a capsule auto-drafts a new KB article, confirmed with a toast | Agent Dashboard → "Resolve this case" |
| 8 | **Multimodal Screenshot Analysis** — attach a real screenshot; AURA calls a vision-capable Qwen model if configured, and is honest (not fake) when it isn't | Home page → 📎 attach icon |
| 9 | **System Pulse** — live stats strip (cases handled, auto-resolve rate) that updates in real time as you run cases | Top of Home page |
| 10 | **Churn Radar + Emerging Complaint Signals** — recurring issue clusters, at-risk customer scoring, and keyword-frequency trend detection | `/analytics` page |
| 11 | **Toast confirmations** — visible feedback the instant an action is taken (refund executed, case escalated, KB updated) | Bottom-right, throughout |
| 12 | **Reset Demo button** — clears session state instantly for a clean re-run between judge walkthroughs | Top nav, circular arrow icon |

---

## 🚀 Quick Start (local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). **No API key required** — the app runs fully on a built-in local reasoning engine + 4 scripted demo scenarios, so it works perfectly offline or with zero setup.

## ☁️ Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Leave all settings as default (Next.js is auto-detected) → **Deploy**.
4. That's it — no environment variables are required for the demo to work.

*(Alternative: install the [Vercel CLI](https://vercel.com/docs/cli) and run `vercel` from this folder.)*

### Optional: enable real Qwen reasoning

Copy `.env.example` to `.env.local` (locally) or add the same variables under Vercel → Project → Settings → Environment Variables:

```
QWEN_API_KEY=your_key_here
QWEN_API_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
```

With a key set, free-text messages get classified and reasoned about by the real Qwen model, and KB articles are LLM-drafted instead of templated. Attaching a screenshot will also trigger a real vision call (`QWEN_VISION_MODEL`, defaults to `qwen-vl-plus`). Without any key, everything still works — see `lib/agents/qwen.ts`.

---

## 🎬 90-Second Judge Demo Script

1. **Home page** → click **💳 Duplicate Charge**. Narrate: *"Watch the agent network light up — Router hands off to Billing, evidence panel confirms it's pulling from order records, ticket history, and the knowledge base in real time."* Let the reasoning timeline finish, point out the confidence gauge and auto-refund action.
2. Click **⚠️ Cancel Subscription** → narrate: *"This time confidence is only 55% and it's a $4,800 Enterprise account — the system knows not to auto-act, and instead builds a Context Capsule."* Point out the toast confirming the escalation.
3. Go to **Agent Dashboard** → *"This is what a human agent sees — full case file, sentiment trend, exactly what was already tried, and a recommended action. Zero 'can you repeat the issue' moments."* Type a resolution note, click **Resolve** → point out the toast and the new KB article that just appeared (self-learning loop).
4. Back on **Home**, try typing a free-text message and **attach a real screenshot** using the 📎 icon — narrate that this is genuine multimodal input, not just text.
5. Go to **Churn Radar** (`/analytics`) → *"Every ticket feeds this — recurring issue clusters, emerging complaint signals, and at-risk customers, so the business sees problems before they cause churn."*
6. Close with the architecture: *"Router → Specialist Agents → Reasoning Engine → Escalation Intelligence → Self-Learning Loop, powered by Qwen, and structured so every stage is a clean node ready to be orchestrated by EnterPro in production."*

*(Tip: use the reset icon in the top nav to clear state for a clean re-run before judging starts.)*

---

## 🏗️ Architecture

```
Customer message
    │
    ▼
Router Agent (Qwen)              — intent, urgency, sentiment, customer match
    │
    ▼
Specialist Agent                 — Billing / Technical / Order / Account
    │  reads: orders.json, tickets.json, knowledgeBase.json
    ▼
Reasoning / Root-Cause Engine    — synthesizes evidence, states root cause
    │
    ▼
Escalation Intelligence          — decides auto-resolve vs escalate + confidence
    │
    ├── Auto-Resolve ──────────► Customer notified directly
    │
    └── Escalate ──────────────► Context Capsule ──► Agent Dashboard
                                                          │
                                                          ▼
                                              Self-Learning Loop
                                              (new KB article drafted)
                                                          │
                                                          ▼
                                          Churn Radar / CX Analytics
```

## 📁 Project Structure

```
app/
  page.tsx                 Customer chat demo (scenario buttons + free text)
  dashboard/page.tsx        Agent Dashboard (Context Capsules + KB growth)
  analytics/page.tsx        Churn Radar / CX Analytics
  api/investigate/route.ts  Main investigation endpoint
  api/draft-kb/route.ts     Self-learning KB drafting endpoint
  layout.tsx, globals.css   Root layout, fonts, dark theme

components/
  AgentNetworkDiagram.tsx  Live pipeline diagram (Wow #1)
  EvidencePanel.tsx        Cross-source investigation proof (Wow #2)
  ReasoningTimeline.tsx    Live streaming agent reasoning (Wow #3)
  ConfidenceGauge.tsx      Circular confidence meter (Wow #5)
  ContextCapsuleCard.tsx   Structured handoff card (Wow #6)
  ChurnRadar.tsx           Recurring issue + churn risk dashboard
  TrendingIssues.tsx       Emerging complaint keyword detection
  ToastStack.tsx           Action confirmation toasts (Wow #11)
  Nav.tsx                  Top navigation + reset demo

lib/
  agents/
    qwen.ts                 Qwen API wrapper — text + vision, graceful no-key fallback
    classify.ts              Intent/urgency/sentiment classification
    knowledgeBase.ts          KB search (RAG-style keyword retrieval)
    investigate.ts            Core orchestrator — Router → Specialist → Reasoning → Escalation (+ screenshot analysis)
    scenarios.ts              4 fully-scripted demo cases for reliable judging
  context/AppStateContext.tsx  Client-side app state (capsules, KB, tickets, toasts)
  data/                     Mock customers, orders, tickets, KB articles
  types.ts                  Shared TypeScript interfaces
```

## 🔧 Tech Stack

- **Frontend:** Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- **AI Reasoning:** Qwen (via OpenAI-compatible chat completions API), with a deterministic local fallback so the app never breaks without a key
- **Orchestration:** Custom agent-node pipeline in `lib/agents/`, structured to map 1:1 onto an EnterPro workflow graph (Router node → Specialist nodes → Escalation node)
- **Data layer:** JSON-seeded mock customers/orders/tickets/KB (swap for Postgres + a vector DB in production)
- **Charts:** Recharts
- **Deployment:** Zero-config on Vercel

## ⚠️ Known Simplifications (be upfront about these with judges)

- **State persistence** uses `localStorage` on the client rather than a database, because Vercel serverless functions are stateless between invocations. This keeps the demo 100% reliable without infra setup — swap `lib/context/AppStateContext.tsx` for real API reads/writes against Postgres to go to production.
- **Knowledge base retrieval** is keyword-overlap based, not true vector-embedding similarity search — the interface (`searchKnowledgeBase`) is designed so a real vector DB can be dropped in without touching any caller.
- **EnterPro** is represented architecturally (each agent function is an isolated node ready to be registered in a workflow graph) rather than calling a live EnterPro SDK, since no EnterPro credentials/sandbox were available during the hackathon build window.
- **Mock data** (5 customers, 4 orders, 8 tickets, 6 KB articles) stands in for a real CRM/order database — the four demo scenarios are scripted against this data for guaranteed-reliable live judging.

Being upfront about these trade-offs, and clearly showing where the production upgrade path is, is intentional — it's stronger than pretending everything is already at enterprise scale.
