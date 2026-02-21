import { CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import type { JuzAssignment } from '../types';

interface JuzGridProps {
  assignments: JuzAssignment[];
  selectedJuz: number[];
  submitting: boolean;
  onToggle: (num: number) => void;
}

export function JuzGrid({ assignments, selectedJuz, submitting, onToggle }: JuzGridProps) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
      {Array.from({ length: 30 }, (_, i) => i + 1).map((number) => {
        const assignment = assignments.find((a) => a.juz_number === number);
        const isTermine = assignment?.status === 'TERMINE';
        const isEnCours = assignment?.status === 'EN_COURS';
        const isSelected = selectedJuz.includes(number);
        const isTaken = !!assignment;

        return (
          <button
            key={number}
            disabled={isTaken || submitting}
            onClick={() => onToggle(number)}
            title={
              isTermine
                ? `الجزء ${number} — مكتمل بواسطة ${assignment?.participant_name}`
                : isEnCours
                ? `الجزء ${number} — قيد القراءة بواسطة ${assignment?.participant_name}`
                : `الجزء ${number} — متاح`
            }
            className={cn(
              'relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 transform active:scale-90 border-2 select-none',
              isTermine
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                : isEnCours
                ? 'bg-rose-50 border-rose-100 text-rose-600 cursor-not-allowed'
                : isSelected
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-200 -translate-y-0.5 z-10'
                : 'bg-white border-slate-100 text-slate-700 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
            )}
          >
            {/* Label tiny */}
            <span
              className={cn(
                'text-[9px] uppercase font-black tracking-widest leading-none mb-0.5',
                isSelected ? 'text-blue-200' : isTermine ? 'text-slate-300' : isEnCours ? 'text-rose-300' : 'text-slate-300'
              )}
            >
              جزء
            </span>

            {/* Number */}
            <span className="text-lg sm:text-xl font-black leading-none">{number}</span>

            {/* EN_COURS: participant name truncated */}
            {isEnCours && assignment && (
              <span className="text-[9px] font-bold mt-0.5 truncate w-full text-center px-1 text-rose-500 leading-none">
                {assignment.participant_name.split(' ')[0]}
              </span>
            )}

            {/* TERMINE tick */}
            {isTermine && (
              <CheckCircle2 size={10} className="mt-0.5 text-slate-400" />
            )}

            {/* Available green dot */}
            {!isTaken && !isSelected && (
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}

            {/* Selected check */}
            {isSelected && (
              <div className="absolute bottom-1 right-1">
                <CheckCircle2 size={11} className="text-blue-200" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
