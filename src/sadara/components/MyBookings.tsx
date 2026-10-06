import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalendarDays, Clock, CreditCard, CheckCircle2, XCircle, Hourglass, Video } from 'lucide-react';

export const MyBookings: React.FC = () => {
  const { bookings, lang, openBookingModal, deleteBooking } = useApp();
  const ar = lang === 'ar';
  const [payNotice, setPayNotice] = useState<string | null>(null);

  const label = (s: string) =>
    ({
      pending: ar ? 'بانتظار موافقة المدرس' : 'Awaiting teacher approval',
      approved: ar ? 'تمت الموافقة — أكمل الدفع' : 'Approved — complete payment',
      confirmed: ar ? 'مؤكد ومدفوع' : 'Confirmed & paid',
      rejected: ar ? 'مرفوض' : 'Rejected',
      completed: ar ? 'مكتمل' : 'Completed',
    })[s] ?? s;

  const Icon = (s: string) => (s === 'confirmed' || s === 'completed' ? CheckCircle2 : s === 'rejected' ? XCircle : s === 'approved' ? CreditCard : Hourglass);

  return (
    <section className="sadara-panel rounded-3xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h3 className="text-xl font-black">{ar ? 'حجوزاتي' : 'My bookings'}</h3>
        <button onClick={() => openBookingModal()} className="sadara-btn-primary px-4 py-2 rounded-xl text-sm">
          {ar ? 'حجز جلسة جديدة' : 'New booking'}
        </button>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm opacity-70">{ar ? 'لا توجد حجوزات بعد.' : 'No bookings yet.'}</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => {
            const I = Icon(b.status);
            return (
              <li key={b.id} className="sadara-subtle rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="space-y-1">
                  <div className="font-bold">{b.courseOrTrack}</div>
                  <div className="text-sm opacity-75 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1"><CalendarDays className="size-4" />{b.weekday} {b.date}</span>
                    <span className="flex items-center gap-1"><Clock className="size-4" />{b.timeSlot}</span>
                    <span className="font-bold">{b.price} {ar ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <div className={`sadara-status sadara-status-${b.status} inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full`}>
                    <I className="size-3.5" /> {label(b.status)}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {b.status === 'approved' && b.paymentStatus !== 'paid' && (
                    <button
                      onClick={() =>
                        setPayNotice(
                          ar
                            ? 'بوابة الدفع الإلكتروني قيد التفعيل حالياً. سيتم إشعارك فور تفعيلها لإتمام السداد.'
                            : 'Online payment is being activated. You will be notified once it is available.',
                        )
                      }
                      className="sadara-btn-primary px-4 py-2 rounded-xl text-sm flex items-center gap-1.5"
                    >
                      <CreditCard className="size-4" /> {ar ? 'ادفع الآن' : 'Pay now'}
                    </button>
                  )}
                  {b.status === 'confirmed' && b.meetingUrl && (
                    <a href={b.meetingUrl} target="_blank" rel="noreferrer" className="sadara-btn-primary px-4 py-2 rounded-xl text-sm flex items-center gap-1.5">
                      <Video className="size-4" /> {ar ? 'دخول الجلسة' : 'Join'}
                    </a>
                  )}
                  {b.status === 'pending' && (
                    <button onClick={() => deleteBooking(b.id)} className="px-3 py-2 rounded-xl text-sm border border-current/20 opacity-70 hover:opacity-100 cursor-pointer">
                      {ar ? 'إلغاء الطلب' : 'Cancel'}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {payNotice && <p className="mt-4 text-sm font-semibold text-amber-500">{payNotice}</p>}
    </section>
  );
};
