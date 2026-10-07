import { useRef, useState } from 'react';
import { Sparkles, Send, Square } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function AiTutor({ lesson }: { lesson: { title: string; notes: string; formula: string } }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const ask = async (q: string) => {
    if (!q.trim() || busy) return;
    setError('');
    const history: Msg[] = [...msgs, { role: 'user', content: q.trim() }];
    setMsgs([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson, messages: history.slice(-12) }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'تعذر الحصول على إجابة');
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      let text = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const d = line.slice(5).trim();
          if (!d || d === '[DONE]') continue;
          try {
            const ev = JSON.parse(d);
            if (ev.type === 'response.output_text.delta' && ev.delta) {
              text += ev.delta;
              setMsgs([...history, { role: 'assistant', content: text }]);
            } else if (ev.type === 'response.failed' || ev.type === 'error') {
              throw new Error('تعذر إكمال الإجابة');
            }
          } catch (e) {
            if (e instanceof Error && e.message === 'تعذر إكمال الإجابة') throw e;
          }
        }
      }
      if (!text) setMsgs(history);
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) {
        setError(e instanceof Error ? e.message : 'خطأ غير متوقع');
        setMsgs((m) => (m[m.length - 1]?.content ? m : m.slice(0, -1)));
      }
    } finally {
      setBusy(false);
    }
  };

  const suggestions = ['اشرح لي فكرة هذا الدرس ببساطة', 'أعطني مثالاً محلولاً خطوة بخطوة', 'ما الأخطاء الشائعة في هذا الموضوع؟'];

  return (
    <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] shadow-xl overflow-hidden flex flex-col h-[560px] text-start">
      <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center gap-3">
        <div className="size-10 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center"><Sparkles className="size-5" /></div>
        <div>
          <div className="font-bold text-sm text-slate-900 dark:text-white">المساعد الذكي للدروس</div>
          <div className="text-[11px] text-slate-500">يشرح لك: {lesson.title}</div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {msgs.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => ask(s)} className="text-xs px-3 py-2 rounded-full border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10">{s}</button>
            ))}
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-cyan-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white'}`}>
              {m.content || (busy ? 'جاري التفكير…' : '')}
            </div>
          </div>
        ))}
        {error && <div className="text-xs text-red-500">{error}</div>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="p-3 border-t border-slate-100 dark:border-white/10 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اسأل عن أي مفهوم في الدرس…" className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-sm text-slate-900 dark:text-white outline-none" />
        {busy ? (
          <button type="button" onClick={() => abortRef.current?.abort()} className="px-4 rounded-xl bg-slate-500 text-white"><Square className="size-4" /></button>
        ) : (
          <button type="submit" className="px-4 rounded-xl bg-cyan-500 text-white"><Send className="size-4" /></button>
        )}
      </form>
    </div>
  );
}
