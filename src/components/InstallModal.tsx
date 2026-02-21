import { motion } from "framer-motion";

interface Props {
  onInstall: () => void;
  onClose: () => void;
}

export default function InstallModal({ onInstall, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl text-center"
      >
        <h2 className="text-xl font-bold mb-3 text-emerald-700">
          📲 تثبيت التطبيق
        </h2>

        <p className="text-gray-600 mb-5 text-sm">
          أضف التطبيق إلى الشاشة الرئيسية للوصول السريع بدون متصفح.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2 text-gray-600"
          >
            لاحقاً
          </button>

          <button
            onClick={onInstall}
            className="flex-1 bg-emerald-600 text-white rounded-lg py-2"
          >
            تثبيت
          </button>
        </div>
      </motion.div>
    </div>
  );
}