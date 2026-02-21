import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface ProgressBarProps {
  percentage: number;
  className?: string;
  showText?: boolean;
}

export function ProgressBar({ percentage, className, showText = true }: ProgressBarProps) {
  const isCompleted = percentage >= 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-1">
        {showText && (
          <span className={cn(
            "text-sm font-medium",
            isCompleted ? "text-emerald-700" : "text-emerald-600"
          )}>
            {isCompleted ? "Complétée 🎉" : `${Math.round(percentage)}%`}
          </span>
        )}
      </div>
      <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full",
            isCompleted ? "bg-emerald-600" : "bg-emerald-500"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, percentage)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
