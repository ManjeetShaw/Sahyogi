import Anthropic from "@anthropic-ai/sdk";
import Service from "../models/Service.js";
import ChatMessage from "../models/ChatMessage.js";

let anthropic = null;
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set on the server. Add it to server/.env to enable the AI companion."
    );
  }
  if (!anthropic) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropic;
}

const SYSTEM_PROMPT = `You are the CivicAI companion, a plain-language assistant that helps
citizens understand government services and figure out how to report public issues
(like potholes, garbage collection, streetlight outages, or water supply problems).

Rules:
- Be concise, warm, and practical. Prefer short paragraphs or a short list over long prose.
- When a listed service below is relevant, mention it by name and summarize how to apply.
- If nothing relevant is listed, say so honestly and give general guidance instead of inventing
  a specific office, form number, or law that isn't in the provided context.
- If the person describes a problem that sounds like it should be filed as a public issue report
  (roads, sanitation, water supply, electricity, public safety, parks), tell them briefly and
  suggest they use the "Report an issue" page, mentioning the matching category.
- Never ask for or store sensitive personal identifiers (national ID numbers, full addresses,
  medical details) in this chat.`;

export async function chat(req, res, next) {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "A `message` string is required." });
    }

    // Ground the assistant in the platform's actual services data so it
    // doesn't invent offices, forms, or eligibility rules.
    const services = await Service.find({}).limit(30).select("title description category howToApply");
    const servicesContext = services.length
      ? services
          .map(
            (s) =>
              `- [${s.category}] ${s.title}: ${s.description} (How to apply: ${s.howToApply})`
          )
          .join("\n")
      : "No services are currently listed on the platform.";

    const client = getClient();

    const conversation = [
      ...history
        .filter((h) => h && (h.role === "user" || h.role === "assistant") && h.content)
        .slice(-10),
      { role: "user", content: message },
    ];

    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 700,
      system: `${SYSTEM_PROMPT}\n\nCurrent services on the platform:\n${servicesContext}`,
      messages: conversation,
    });

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    await ChatMessage.create({ user: req.user.id, message, reply });

    res.json({ reply });
  } catch (err) {
    next(err);
  }
}

export async function history(req, res, next) {
  try {
    const messages = await ChatMessage.find({ user: req.user.id })
      .sort({ createdAt: 1 })
      .limit(50);
    res.json({ messages });
  } catch (err) {
    next(err);
  }
}
