import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJuzAssignments } from '../hooks/useJuzAssignments';
import {
  ArrowRight,
  User,
  CheckCircle2,
  Loader2,
  Book,
  ToggleRight,
  ListChecks,
  X,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { JuzGrid } from '../components/JuzGrid';
import { ProgressBar } from '../components/ProgressBar';
import type { JuzStatus } from '../types';

export function KhatmaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { khatma, assignments, loading, error, refresh } = useJuzAssignments(id);

  const [selectedJuz, setSelectedJuz] = useState<number[]>([]);
  const [participantName, setParticipantName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const toggleJuz = (number: number) => {
    const isTaken = assignments.some(a => a.juz_number === number);
    if (isTaken) return;
    setSelectedJuz(prev =>
      prev.includes(number) ? prev.filter(n => n !== number) : [...prev, number]
    );
  };

  const handleValidate = async () => {
    if (selectedJuz.length === 0) {
      toast.error('الرجاء اختيار جزء واحد على الأقل');
      return;
    }
    if (!participantName.trim()) {
      toast.error('الرجاء إدخال اسمك');
      return;
    }
    try {
      setSubmitting(true);
      const insertData = selectedJuz.map(juz_number => ({
        khatma_id: id,
        juz_number,
        participant_name: participantName.trim(),
        status: 'EN_COURS' as JuzStatus,
      }));
      const { error } = await supabase.from('juz_assignment').insert(insertData);
      if (error) {
        if (error.code === '23505') {
          throw new Error('أحد الأجزاء المختارة تم أخذه للتو من قِبل شخص آخر.');
        }
        throw error;
      }
      toast.success('تم تسجيل مشاركتك بنجاح! ✓');
      setSelectedJuz([]);
      setParticipantName('');
      refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطأ غير معروف';
      toast.error(message);
      refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (assignmentId: string, currentStatus: JuzStatus) => {
    const newStatus: JuzStatus = currentStatus === 'EN_COURS' ? 'TERMINE' : 'EN_COURS';
    try {
      setTogglingId(assignmentId);
      const { error } = await supabase
        .from('juz_assignment')
        .update({ status: newStatus })
        .eq('id', assignmentId);
      if (error) throw error;
      toast.success(newStatus === 'TERMINE' ? '✓ تم تعليم الجزء مقروءاً!' : 'أُعيد الجزء إلى قيد القراءة');
      refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطأ غير معروف';
      toast.error(message);
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="text-emerald-800 font-medium">جارٍ تحميل التفاصيل...</p>
      </div>
    );
  }

  if (error || !khatma) {
    return (
      <div className="text-center py-24 px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-3xl max-w-md mx-auto mb-8">
          <p className="font-bold mb-2">حدث خطأ</p>
          <p className="text-sm opacity-80">{error || 'الختمة غير موجودة'}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mx-auto text-emerald-600 font-bold hover:underline"
        >
          <ArrowRight size={18} /> رجوع
        </button>
      </div>
    );
  }

  const terminedCount = assignments.filter(a => a.status === 'TERMINE').length;
  const enCoursAssignments = assignments.filter(a => a.status === 'EN_COURS');
  const terminedAssignments = assignments.filter(a => a.status === 'TERMINE');
  const percentage = Math.round((assignments.length / 30) * 100);
  const isKhatmaFull = assignments.length >= 30;

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 animate-fade-in pb-36">
      {/* ─── الترويسة ─── */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm flex-shrink-0"
        >
          <ArrowRight size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 truncate">{khatma.name}</h1>
          <p className="text-slate-400 text-xs font-medium">
            بدأت في{' '}
            {new Date(khatma.start_date).toLocaleDateString('ar-DZ', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* ─── شريط التقدم ─── */}
      <div className="glass-card rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-500">{assignments.length}/30 جزء مُسنَد</span>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-rose-500">{enCoursAssignments.length} قيد القراءة</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-600">{terminedCount} مكتمل</span>
          </div>
        </div>
        <ProgressBar percentage={percentage} showText={false} />
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-emerald-600 font-bold">
            {Math.round((terminedCount / 30) * 100)}% مقروء
          </span>
          <span className="text-xs text-slate-400 font-medium">{percentage}% مُسنَد</span>
        </div>
      </div>

      {/* ─── الختمة مكتملة ─── */}
      <AnimatePresence>
        {isKhatmaFull && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-5 p-5 bg-gradient-to-l from-emerald-600 to-emerald-500 text-white rounded-2xl flex items-center gap-4 shadow-xl shadow-emerald-100 overflow-hidden"
          >
            <div className="bg-white/20 p-2 rounded-full flex-shrink-0">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <h2 className="text-lg font-black">الختمة مكتملة! 🎉</h2>
              <p className="text-emerald-50 text-sm font-medium">
                تقبّل الله من الجميع. بارك الله في المشاركين!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── الأجزاء المُسنَدة (قائمة) — في الأعلى ─── */}
      {assignments.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <ListChecks size={14} />
            الأجزاء المُسنَدة ({assignments.length})
          </h2>

          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-slate-100">
            {/* قيد القراءة */}
            {enCoursAssignments
              .sort((a, b) => a.juz_number - b.juz_number)
              .map(assignment => (
                <motion.div
                  key={assignment.id}
                  layout
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <button
                    onClick={() => handleToggleStatus(assignment.id, assignment.status)}
                    disabled={togglingId === assignment.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition-colors active:scale-95 flex-shrink-0"
                  >
                    {togglingId === assignment.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={12} />
                    )}
                    <span className="hidden sm:inline">تم</span>
                  </button>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="font-bold text-slate-700 text-sm truncate">{assignment.participant_name}</p>
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-wide">قيد القراءة</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border-2 border-rose-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-black text-rose-600">{assignment.juz_number}</span>
                  </div>
                </motion.div>
              ))}

            {/* مكتمل */}
            {terminedAssignments
              .sort((a, b) => a.juz_number - b.juz_number)
              .map(assignment => (
                <motion.div
                  key={assignment.id}
                  layout
                  className="flex items-center gap-3 px-4 py-3 opacity-60"
                >
                  <button
                    onClick={() => handleToggleStatus(assignment.id, assignment.status)}
                    disabled={togglingId === assignment.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 border border-slate-200 text-slate-500 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 transition-colors active:scale-95 flex-shrink-0"
                  >
                    {togglingId === assignment.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <ToggleRight size={12} />
                    )}
                    <span className="hidden sm:inline">إعادة</span>
                  </button>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="font-bold text-slate-500 text-sm truncate">{assignment.participant_name}</p>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wide">✓ مكتمل</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-black text-slate-400">{assignment.juz_number}</span>
                  </div>
                </motion.div>
              ))}
          </div>
        </section>
      )}

      {/* ─── الدليل ─── */}
      <div className="flex items-center gap-4 mb-4 px-1 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-bold">متاح</span>
          <div className="w-4 h-4 rounded-md bg-white border-2 border-slate-200" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-bold">قيد القراءة</span>
          <div className="w-4 h-4 rounded-md bg-rose-50 border-2 border-rose-200" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-bold">مكتمل</span>
          <div className="w-4 h-4 rounded-md bg-slate-100 border-2 border-slate-300" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-bold">اختيارك</span>
          <div className="w-4 h-4 rounded-md bg-blue-600" />
        </div>
      </div>

      {/* ─── شبكة الأجزاء ─── */}
      <section className="mb-4">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Book size={14} />
          اختر أجزاءك
        </h2>
        <JuzGrid
          assignments={assignments}
          selectedJuz={selectedJuz}
          submitting={submitting}
          onToggle={toggleJuz}
        />
      </section>

      {/* ─── شريط المشاركة — ثابت دائماً في الأسفل ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-2xl safe-bottom">
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-3 space-y-2">

          {/* الأجزاء المختارة — تظهر فقط عند الاختيار */}
          <AnimatePresence>
            {selectedJuz.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 flex-wrap pb-2">
                  <span className="text-xs font-black text-slate-400 tracking-widest flex-shrink-0">
                    {selectedJuz.length} جزء:
                  </span>
                  {selectedJuz
                    .sort((a, b) => a - b)
                    .map(n => (
                      <motion.button
                        key={n}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        onClick={() => toggleJuz(n)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded-lg font-black text-xs shadow active:scale-95"
                      >
                        {n}
                        <X size={10} />
                      </motion.button>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* الاسم + تأكيد — دائم الظهور */}
          <div className="flex gap-2">
            <button
              onClick={handleValidate}
              disabled={submitting || !participantName.trim() || selectedJuz.length === 0}
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all active:scale-95 flex-shrink-0',
                participantName.trim() && selectedJuz.length > 0
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              )}
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : 'تأكيد'}
            </button>
            <div className="relative flex-1">
              <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                value={participantName}
                onChange={e => setParticipantName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleValidate()}
                placeholder="أدخل اسمك ثم اضغط تأكيد"
                className="w-full pr-9 pl-3 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium text-right"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}