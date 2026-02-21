import { Calendar, ChevronRight, Hash, CheckCircle2 } from 'lucide-react';
import type { KhatmaWithProgress } from '../types';
import { ProgressBar } from './ProgressBar';
import { motion } from 'framer-motion';

interface KhatmaCardProps {
  khatma: KhatmaWithProgress;
  onEnter: (id: string) => void;
}

export function KhatmaCard({ khatma, onEnter }: KhatmaCardProps) {
  const isCompleted = khatma.total_taken >= 30;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`glass-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
        isCompleted ? 'ring-2 ring-emerald-200' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-800 mb-1 truncate">{khatma.name}</h3>
          <div className="flex flex-wrap items-center text-slate-500 text-sm gap-3">
            <span className="flex items-center gap-1">
              <Calendar size={14} className="text-emerald-500 flex-shrink-0" />
              {new Date(khatma.start_date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <Hash size={14} className="text-emerald-500 flex-shrink-0" />
              {khatma.total_taken}/30 Juz
            </span>
          </div>
        </div>
        {isCompleted && (
          <div className="ml-3 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1.5 rounded-full">
              <CheckCircle2 size={12} />
              Complétée
            </span>
          </div>
        )}
      </div>

      <ProgressBar percentage={khatma.percentage} className="mb-6" />

      <button
        onClick={() => onEnter(khatma.id)}
        className="w-full bg-emerald-800 text-white rounded-xl py-3 px-4 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors group"
      >
        {isCompleted ? 'Voir les détails 🎉' : 'Entrer dans la Khatma'}
        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
