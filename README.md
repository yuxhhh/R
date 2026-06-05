# RetailPulse — AI Customer Re-engagement Agent

An autonomous AI agent that identifies at-risk retail customers and runs personalised multi-channel re-engagement campaigns across email and SMS.

---

## What it does

- Scores customers daily on churn likelihood using purchase history and RFM signals
- Autonomously decides when to reach out, which channel to use, and what to say
- Generates personalised message copy per customer using an LLM — no static templates
- Real-time dashboard showing campaign activity, churn scores, and conversion metrics
- Human-in-the-loop approval queue for high-spend campaigns

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Recharts |
| Backend | Node.js + Express |
| AI / LLM | OpenAI API |
| Database | MongoDB (events) + MySQL (customers) |
| Messaging | Twilio (SMS) + SendGrid (email) |
| Deploy | Render / Railway |

---
