import { useEffect, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { UserPlus, Trash2 } from 'lucide-react';
import { listStudents, createStudent, updateStudentRole, deleteStudent } from '@/lib/admin-users.functions';

type Row = Awaited<ReturnType<typeof listStudents>>[number];

export default function StudentsManager() {
  const list = useServerFn(listStudents);
  const create = useServerFn(createStudent);
  const update = useServerFn(updateStudentRole);
  const remove = useServerFn(deleteStudent);
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ name: '', email: '', password: '', phone: '', gender: 'male' as 'male' | 'female', role: 'student' as 'student' | 'admin' });

  const load = () => list().then(setRows).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg('');
    try {
      await create({ data: f });
      setMsg(`✓ تم إنشاء حساب ${f.gender === 'female' ? 'الطالبة' : 'الطالب'} ${f.name} — يمكنه الدخول الآن بالبريد وكلمة المرور.`);
      setF({ ...f, name: '', email: '', password: '', phone: '' });
      load();
    } catch (err) { setMsg((err as Error).message); }
    setBusy(false);
  };

  const inp = 'w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 outline-none';
  const sel = inp + ' [&>option]:bg-white [&>option]:text-slate-900';

  return (
    <div className="space-y-6 text-start">
      <form onSubmit={submit} className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] space-y-3">
        <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2"><UserPlus className="size-5 text-cyan-500" />إنشاء حساب طالب / طالبة</h4>
        <div className="grid sm:grid-cols-2 gap-3">
          <input required className={inp} placeholder="الاسم الكامل" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input required type="email" className={inp} placeholder="البريد الإلكتروني" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <input required minLength={8} className={inp} placeholder="كلمة المرور (8 أحرف على الأقل)" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <input className={inp} placeholder="رقم الجوال" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <select className={sel} value={f.gender} onChange={(e) => setF({ ...f, gender: e.target.value as any })}>
            <option value="male">طالب</option><option value="female">طالبة</option>
          </select>
          <select className={sel} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as any })}>
            <option value="student">دور: طالب (بوابة الطالب)</option><option value="admin">دور: مدير (لوحة الإدارة)</option>
          </select>
        </div>
        <button disabled={busy} className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-sm disabled:opacity-60">{busy ? 'جاري الإنشاء…' : 'إنشاء الحساب'}</button>
        {msg && <div className="text-sm text-cyan-600 dark:text-cyan-400">{msg}</div>}
      </form>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224]">
        <h4 className="font-bold text-base text-slate-900 dark:text-white mb-4">الحسابات المسجلة ({rows.length})</h4>
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 flex flex-wrap items-center gap-3 justify-between text-sm">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{r.name || '—'}</div>
                <div className="text-xs text-slate-500">{r.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <select className={sel + ' !w-auto !py-1.5'} value={r.gender} onChange={(e) => update({ data: { id: r.id, role: r.role as any, gender: e.target.value as any } }).then(load).catch((er) => setMsg(er.message))}>
                  <option value="male">طالب</option><option value="female">طالبة</option>
                </select>
                <select className={sel + ' !w-auto !py-1.5'} value={r.role} onChange={(e) => update({ data: { id: r.id, role: e.target.value as any, gender: r.gender } }).then(load).catch((er) => setMsg(er.message))}>
                  <option value="student">طالب</option><option value="admin">مدير</option>
                </select>
                <button onClick={() => confirm('حذف هذا الحساب نهائياً؟') && remove({ data: { id: r.id } }).then(load).catch((er) => setMsg(er.message))} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"><Trash2 className="size-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
