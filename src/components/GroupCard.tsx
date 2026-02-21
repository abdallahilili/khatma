import { Users, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import type { KhatmaGroup } from '../types';

interface GroupCardProps {
  group: KhatmaGroup;
  onEnter: (id: string) => void;
}

export function GroupCard({ group, onEnter }: GroupCardProps) {
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onEnter(group.id)}
      className="w-full glass-card rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-4 group text-right"
    >
      {/* يسار: سهم */}
      <ChevronLeft
        size={20}
        className="text-slate-300 group-hover:text-emerald-500 group-hover:-translate-x-1 transition-all flex-shrink-0"
      />

      {/* وسط: اسم + تاريخ */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 text-lg truncate">{group.name}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          أُنشئت في{' '}
          {new Date(group.created_at).toLocaleDateString('ar-DZ', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* يمين: أيقونة */}
      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
        <Users size={22} className="text-emerald-600" />
      </div>
    </motion.button>
  );
}
