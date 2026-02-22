import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Loader2, Users, Sparkles, X } from 'lucide-react';
import { useGroups, findOrCreateGroup } from '../hooks/useGroups';
import { GroupCard } from '../components/GroupCard';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { groups, loading } = useGroups(debouncedQuery);

  const handleEnterGroup = async (id: string) => {
    navigate(`/group/${id}`);
  };

  const handleCreateOrEnter = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      toast.error('أدخل اسم المجموعة');
      return;
    }
    try {
      setCreating(true);
      const groupId = await findOrCreateGroup(trimmed);
      toast.success(`المجموعة "${trimmed}" جاهزة!`);
      navigate(`/group/${groupId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطأ غير معروف';
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const showCreate = query.trim().length > 0 && !groups.some(
    g => g.name.toLowerCase() === query.trim().toLowerCase()
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      {/* عنوان رئيسي */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white-900 rounded-3xl shadow-2xl shadow-emerald-200 mb-6">
            <img src="/icons/icon-128x128.png" alt="logo" className="w-10 h-10 rounded-2xl" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 mb-2">
           ختمت<span className="text-emerald-600">نا</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium">
          انضم إلى مجموعة أو أنشئ جديدة لبدء قراءة جماعية.
        </p>
      </div>

      {/* صندوق البحث */}
      <div className="glass-card rounded-3xl p-6 shadow-xl shadow-slate-200/60 mb-6">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
          ابحث عن مجموعة أو أنشئ واحدة
        </label>
        <div className="relative flex gap-3">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateOrEnter()}
              placeholder="اسم المجموعة (مثال: عائلة فلان)"
              className="w-full pr-12 pl-10 py-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-slate-800 placeholder-slate-300 text-right"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={handleCreateOrEnter}
            disabled={creating || !query.trim()}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-40 active:scale-95 flex-shrink-0"
          >
            {creating ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Plus size={20} />
                <span className="hidden sm:inline">دخول</span>
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 flex items-center gap-2 text-sm text-emerald-700 font-medium bg-emerald-50 rounded-xl px-4 py-2.5"
            >
              <Sparkles size={16} className="text-emerald-500 flex-shrink-0" />
              اضغط &quot;دخول&quot; لإنشاء مجموعة{' '}
              <strong>&quot;{query.trim()}&quot;</strong>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* قائمة المجموعات */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Users size={14} />
            {debouncedQuery ? 'نتائج البحث' : 'المجموعات الأخيرة'}
          </h2>
          {loading && <Loader2 size={16} className="animate-spin text-emerald-500" />}
        </div>

        <AnimatePresence mode="wait">
          {!loading && groups.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 glass-card rounded-3xl border-dashed border-2 border-slate-200"
            >
              <Users size={40} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">
                {debouncedQuery
                  ? `لا توجد مجموعة باسم "${debouncedQuery}"`
                  : 'لا توجد مجموعات بعد'}
              </p>
              <p className="text-slate-300 text-sm mt-1">
                اكتب اسماً واضغط &quot;دخول&quot; لإنشاء أول مجموعة.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {groups.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onEnter={handleEnterGroup}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* تذييل الصفحة */}
      <footer className="mt-16 text-center">
        <p className="text-slate-400 text-sm font-medium">
          طوره <span className="text-emerald-600 font-bold">عبد الله الليلي</span>
        </p>
      </footer>
    </div>
  );
}
