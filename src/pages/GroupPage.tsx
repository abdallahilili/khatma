import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, BookOpen, Loader2, ChevronLeft, Calendar, Hash, CheckCircle2, Award } from 'lucide-react';
import { useKhatmasByGroup } from '../hooks/useKhatmasByGroup';
import { ProgressBar } from '../components/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';

export function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { khatmas, groupName, loading, error } = useKhatmasByGroup(id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="text-emerald-800 font-medium">جارٍ تحميل المجموعة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-3xl max-w-md mx-auto mb-8">
          <p className="font-bold mb-2">خطأ</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mx-auto text-emerald-600 font-bold hover:underline"
        >
          <ArrowRight size={18} /> رجوع
        </button>
      </div>
    );
  }

  const completedCount = khatmas.filter(k => k.total_taken >= 30).length;

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 animate-fade-in">

      {/* ─── الترويسة ─── */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 mb-5 transition-colors group font-medium text-sm"
        >
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          العودة إلى المجموعات
        </button>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">مجموعة</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 truncate">{groupName}</h1>
            <p className="text-slate-400 font-medium mt-1 text-sm">
              {khatmas.length} ختمة{khatmas.length !== 1 ? '' : ''}
              {completedCount > 0 && (
                <span className="mr-2 text-emerald-600">
                  • {completedCount} مكتملة 🎉
                </span>
              )}
            </p>
          </div>

          <button
            onClick={() => navigate(`/group/${id}/create`)}
            className="flex-shrink-0 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95 text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">ختمة جديدة</span>
            <span className="sm:hidden">إنشاء</span>
          </button>
        </div>
      </div>

      {/* ─── إحصائيات ─── */}
      {khatmas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 flex items-center gap-3 mb-5"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm">
              {khatmas.reduce((acc, k) => acc + k.total_taken, 0)} جزء مُسنَد إجمالاً
            </p>
            <p className="text-slate-400 text-xs font-medium">
              في {khatmas.length} ختمة
            </p>
          </div>
        </motion.div>
      )}

      {/* ─── قائمة الختمات ─── */}
      <AnimatePresence>
        {khatmas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 glass-card rounded-[2rem] border-dashed border-2 border-emerald-200"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <BookOpen className="text-emerald-300" size={32} />
            </div>
            <p className="text-slate-500 text-lg font-medium">لا توجد ختمات في هذه المجموعة</p>
            <button
              onClick={() => navigate(`/group/${id}/create`)}
              className="bg-emerald-100 text-emerald-700 px-5 py-2.5 rounded-xl font-bold mt-5 hover:bg-emerald-200 transition-colors inline-flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              أنشئ أول ختمة الآن!
            </button>
          </motion.div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-slate-100">
            {khatmas.map((khatma, index) => {
              const isCompleted = khatma.total_taken >= 30;
              return (
                <motion.button
                  key={khatma.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => navigate(`/khatma/${khatma.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-emerald-50/50 transition-colors group text-right active:bg-emerald-50"
                >
                  {/* يسار: رمز */}
                  <ChevronLeft
                    size={18}
                    className="text-slate-300 group-hover:text-emerald-500 group-hover:-translate-x-1 transition-all flex-shrink-0"
                  />

                  {/* وسط: تفاصيل */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-row-reverse justify-end">
                      <p className="font-bold text-slate-800 text-sm truncate">{khatma.name}</p>
                      {isCompleted && (
                        <span className="flex-shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          مكتملة
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mb-2 flex-row-reverse justify-end">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} className="text-emerald-400" />
                        {new Date(khatma.start_date).toLocaleDateString('ar-DZ', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Hash size={11} className="text-emerald-400" />
                        {khatma.total_taken}/30 جزء
                      </span>
                    </div>
                    <ProgressBar percentage={khatma.percentage} showText={false} />
                  </div>

                  {/* يمين: رقم / علامة */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-emerald-100' : 'bg-slate-50 border border-slate-100'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 size={20} className="text-emerald-600" />
                    ) : (
                      <span className="text-sm font-black text-slate-500">{index + 1}</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
