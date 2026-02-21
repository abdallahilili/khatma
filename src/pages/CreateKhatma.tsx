import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { findOrCreateGroup } from '../hooks/useGroups';
import { ArrowRight, Save, Loader2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export function CreateKhatma() {
  const { groupId } = useParams<{ groupId: string }>();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const needsGroup = !groupId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate) return;

    try {
      setLoading(true);

      let resolvedGroupId = groupId;

      if (needsGroup) {
        if (!groupName.trim()) {
          toast.error('الرجاء إدخال اسم المجموعة');
          return;
        }
        resolvedGroupId = await findOrCreateGroup(groupName.trim());
      }

      const { data, error } = await supabase
        .from('khatma')
        .insert([{ name, start_date: startDate, group_id: resolvedGroupId }])
        .select()
        .single();

      if (error) throw error;

      toast.success('تم إنشاء الختمة بنجاح! ✓');
      navigate(`/khatma/${data.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطأ غير معروف';
      console.error(err);
      toast.error('خطأ: ' + message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (groupId) {
      navigate(`/group/${groupId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-8 transition-colors group font-medium"
      >
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        رجوع
      </button>

      <div className="glass-card rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-slate-200/50">
        <h1 className="text-3xl font-black text-slate-800 mb-2">ختمة جديدة</h1>
        <p className="text-slate-500 mb-10">
          أنشئ ختمة قرآنية جماعية في ثوانٍ.
        </p>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* حقل المجموعة (فقط إذا لم يكن groupId في الرابط) */}
          {needsGroup && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                اسم المجموعة <span className="text-emerald-500">*</span>
              </label>
              <input
                type="text"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="مثال: عائلة المسلمي"
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-white text-lg text-right"
                required
              />
              <p className="text-xs text-slate-400 mt-2 font-medium">
                ستُنشأ المجموعة تلقائياً إن لم تكن موجودة.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              اسم الختمة <span className="text-emerald-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="مثال: ختمة رمضان 1446"
              className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-white text-lg text-right"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              تاريخ البداية
            </label>
            <div className="relative">
              <Calendar size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full pr-14 pl-6 py-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-white text-lg"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-3 mt-4 text-lg active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            حفظ الختمة
          </button>
        </form>
      </div>
    </div>
  );
}
