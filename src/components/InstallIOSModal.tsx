export default function InstallIOSModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl text-center">
        <h2 className="text-xl font-bold mb-3 text-emerald-700">
          📲 تثبيت التطبيق
        </h2>

        <p className="text-gray-600 text-sm mb-4">
          لتثبيت التطبيق على iPhone:
        </p>

        <ol className="text-right text-sm text-gray-700 mb-5 space-y-2">
          <li>1️⃣ اضغط على زر المشاركة ⬆️</li>
          <li>2️⃣ اختر "Add to Home Screen"</li>
          <li>3️⃣ اضغط "Add"</li>
        </ol>

        <button
          onClick={onClose}
          className="bg-emerald-600 text-white rounded-lg py-2 px-4"
        >
          حسناً
        </button>
      </div>
    </div>
  );
}