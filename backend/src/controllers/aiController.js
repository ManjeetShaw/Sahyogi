import Anthropic from "@anthropic-ai/sdk";
import Service from "../models/Service.js";
import ChatMessage from "../models/ChatMessage.js";

let anthropic = null;
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set on the server. Add it to backend/.env to enable the AI companion."
    );
  }
  if (!anthropic) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropic;
}

const SYSTEM_PROMPT = `You are the Sahyogi companion, a plain-language assistant that helps
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
    const services = await Service.find({})
      .limit(30)
      .select("title description category howToApply eligibility requiredDocuments");
    const servicesContext = services.length
      ? services
          .map((s) => {
            const parts = [`- [${s.category}] ${s.title}: ${s.description} (How to apply: ${s.howToApply})`];
            if (s.eligibility) parts.push(`  Eligibility: ${s.eligibility}`);
            if (s.requiredDocuments?.length) parts.push(`  Required documents: ${s.requiredDocuments.join(", ")}`);
            return parts.join("\n");
          })
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

export async function recommend(req, res, next) {
  try {
    const { situation } = req.body;
    if (!situation || typeof situation !== "string") {
      return res.status(400).json({ message: "A `situation` string describing your circumstances is required." });
    }

    const services = await Service.find({}).limit(50).select("title category description eligibility");
    if (!services.length) {
      return res.json({ recommendations: [] });
    }

    const catalog = services
      .map((s) => `${s._id}|${s.category}|${s.title}|${s.eligibility || "no stated eligibility rule"}`)
      .join("\n");

    const client = getClient();
    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 600,
      system:
        "You are a scheme-matching assistant for a government services platform. " +
        "You are given a catalog of services as lines of `id|category|title|eligibility`, and a citizen's " +
        "description of their situation. Reply with ONLY a JSON array (no prose, no markdown fences) of up to 5 " +
        'objects: [{"id": "<service id from the catalog>", "reason": "<one short plain-language sentence>"}]. ' +
        "Only include services whose id appears in the catalog. If nothing plausibly matches, return [].",
      messages: [
        {
          role: "user",
          content: `Service catalog:\n${catalog}\n\nCitizen's situation: ${situation}`,
        },
      ],
    });

    const raw = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    let parsed = [];
    try {
      parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, ""));
    } catch {
      parsed = [];
    }

    const byId = new Map(services.map((s) => [s._id.toString(), s]));
    const recommendations = (Array.isArray(parsed) ? parsed : [])
      .filter((r) => r && byId.has(r.id))
      .slice(0, 5)
      .map((r) => ({ service: byId.get(r.id), reason: r.reason || "" }));

    res.json({ recommendations });
  } catch (err) {
    next(err);
  }
}

export async function simplify(req, res, next) {
  try {
    const { noticeText } = req.body;
    if (!noticeText || typeof noticeText !== "string") {
      return res.status(400).json({ message: "A `noticeText` string is required." });
    }
    if (noticeText.length > 6000) {
      return res.status(400).json({ message: "Notice text is too long (max 6000 characters)." });
    }

    const client = getClient();
    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 700,
      system:
        "You simplify official government notices, letters, and forms into plain language for citizens. " +
        "Structure your reply as: a one-sentence summary of what the notice is about, then a short bulleted list " +
        "of any actions the recipient must take with deadlines if present, then a short bulleted list of any " +
        "fees or penalties mentioned. Do not invent details that aren't in the notice. If something is unclear " +
        "or illegible, say so plainly instead of guessing.",
      messages: [{ role: "user", content: noticeText }],
    });

    const simplified = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    res.json({ simplified });
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
