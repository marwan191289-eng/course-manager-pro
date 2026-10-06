import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SITE_INFO } from '../data/mockData';
import {
  Award,
  Download,
  Printer,
  X,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Atom,
} from 'lucide-react';

export const CertificateModal: React.FC = () => {
  const {
    user,
    isCertificateModalOpen,
    closeCertificateModal,
    certificateCourse,
  } = useApp();

  const certRef = useRef<HTMLDivElement>(null);

  if (!isCertificateModalOpen) return null;

  const certId = `SADARA-1447-CERT-${Math.floor(10000 + Math.random() * 89999)}`;
  const issueDate = '2026-10-06';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0c1224] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/15 my-6 text-slate-900 dark:text-white">
        {/* Header Action Buttons */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2 text-cyan-500 font-bold text-sm">
            <Award className="size-5" />
            <span>شهادة إتمام معتمدة رسميًا من منصة صدارة</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>طباعة / حفظ PDF</span>
            </button>

            <button
              onClick={closeCertificateModal}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div
          ref={certRef}
          className="relative rounded-2xl border-8 border-double border-amber-600/40 bg-gradient-to-br from-amber-50/40 via-white to-cyan-50/30 dark:from-[#0a0f20] dark:via-[#090d1c] dark:to-[#081228] p-8 sm:p-14 text-center overflow-hidden shadow-inner"
        >
          {/* Subtle watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] dark:opacity-[0.06]">
            <Atom className="size-96" />
          </div>

          {/* Top Emblem & Brand */}
          <div className="flex flex-col items-center justify-center">
            <div className="size-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-[#080d1d] rounded-[14px] flex items-center justify-center">
                <Atom className="size-9 text-cyan-400" />
              </div>
            </div>
            <div className="text-2xl font-black tracking-tight mt-2 text-slate-900 dark:text-white">
              {SITE_INFO.nameAr} — SADARA
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
              بوابة التميز الأكاديمي في القدرات والتحصيلي والكيمياء
            </div>
          </div>

          {/* Title */}
          <div className="mt-8">
            <span className="text-xs font-serif italic text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest block">
              شهادة اجتياز وتفوق
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 dark:text-white mt-1">
              CERTIFICATE OF COMPLETION
            </h2>
          </div>

          {/* Recipient */}
          <div className="mt-6">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              يشهد المهندس محمود إسماعيل شلتوت وإدارة منصة صدارة بأن الطالب/ـة:
            </p>
            <div className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-2 font-serif underline decoration-amber-500/50 decoration-2 underline-offset-8">
              {user.name}
            </div>
          </div>

          {/* Course Name */}
          <div className="mt-6 max-w-xl mx-auto">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              قد أتم بنجاح واقتدار كافة متطلبات البرنامج التدريبي التفاعلي:
            </p>
            <div className="mt-2 text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-slate-100/60 dark:bg-white/5 py-2 px-4 rounded-xl border border-slate-200 dark:border-white/10">
              {certificateCourse}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              بتقدير عام: <span className="font-bold text-emerald-500">ممتاز مرتفع (+98%)</span>{' '}
              وفق معايير قياس 1447هـ.
            </p>
          </div>

          {/* Signatures & QR Block */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 grid grid-cols-3 gap-4 items-center">
            {/* Verification QR */}
            <div className="text-start">
              <div className="size-16 p-1 bg-white rounded-lg border border-slate-300 inline-block shadow-sm">
                <QrCode className="size-full text-slate-900" />
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">{certId}</div>
            </div>

            {/* Stamp */}
            <div className="flex flex-col items-center">
              <div className="size-16 rounded-full border-2 border-dashed border-amber-500/60 flex items-center justify-center text-amber-500 font-bold text-[10px] rotate-[-12deg]">
                ختم الاعتماد 1447
              </div>
              <div className="text-[10px] text-slate-400 mt-1">تاريخ الإصدار: {issueDate}</div>
            </div>

            {/* Instructor Signature */}
            <div className="text-end">
              <div className="font-serif italic font-black text-lg text-slate-900 dark:text-white">
                م. محمود شلتوت
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                المشرف الأكاديمي العام
              </div>
              <div className="text-[10px] text-cyan-500 font-mono">
                اعتماد كيمياء وهندسة نووية
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
