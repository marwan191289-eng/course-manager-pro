import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Body = z.object({
  lesson: z.object({ title: z.string().max(300), notes: z.string().max(3000), formula: z.string().max(500) }),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) })).min(1).max(20),
});

export const Route = createFileRoute("/api/ai-tutor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response(JSON.stringify({ error: "طلب غير صالح" }), { status: 400 });
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response(JSON.stringify({ error: "المساعد غير مُفعّل" }), { status: 500 });
        const { lesson, messages } = parsed.data;
        const runId = request.headers.get("X-Lovable-AIG-Run-ID");
        const headers: Record<string, string> = { "Content-Type": "application/json", "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "fetch" };
        if (runId) headers["X-Lovable-AIG-Run-ID"] = runId;
        try {
          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
            method: "POST",
            signal: request.signal,
            headers,
            body: JSON.stringify({
              model: "openai/gpt-6-astra",
              stream: true,
              store: false,
              reasoning: { effort: "low" },
              instructions: `أنت المساعد التعليمي الذكي لمنصة صدارة (للمهندس محمود شلتوت) لاختبارات القدرات والتحصيلي. اشرح المفاهيم خطوة بخطوة ببساطة وبالعربية (أو بلغة السؤال)، واستخدم أمثلة قصيرة. التزم بمحتوى الدرس قدر الإمكان، واجعل الإجابة أقل من 250 كلمة.\n\nالدرس الحالي: ${lesson.title}\nالقاعدة الأساسية: ${lesson.formula}\nملاحظات الدرس: ${lesson.notes}`,
              input: messages.map((m) => ({ role: m.role, content: m.content })),
            }),
          });
          if (!upstream.ok) {
            const msg = upstream.status === 402 ? "انتهى رصيد المساعد الذكي مؤقتاً" : upstream.status === 429 ? "ضغط كبير، حاول بعد قليل" : "تعذر الحصول على إجابة";
            return new Response(JSON.stringify({ error: msg }), { status: upstream.status });
          }
          const out = new Headers({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform" });
          upstream.headers.forEach((v, k) => { if (k.toLowerCase().startsWith("x-lovable-aig-")) out.set(k, v); });
          return new Response(upstream.body, { status: 200, headers: out });
        } catch (e) {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          throw e;
        }
      },
    },
  },
});
