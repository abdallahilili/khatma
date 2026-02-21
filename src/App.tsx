import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { GroupPage } from './pages/GroupPage';
import { CreateKhatma } from './pages/CreateKhatma';
import { KhatmaDetail } from './pages/KhatmaDetail';
import { Toaster } from 'react-hot-toast';
import InstallModal from './components/InstallModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useState } from 'react';

function App() {
   const { isInstallable, installApp } = usePWAInstall();
  const [showModal, setShowModal] = useState(true);
  return (
     <> 
     {isInstallable && showModal && (
        <InstallModal
          onInstall={() => {
            installApp();
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}

    <Router>
      <div className="min-h-screen bg-[#f8fafc]" dir="rtl">
        {/* شريط التنقل العلوي */}
        <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-100 group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-black text-xl">خ</span>
              </div>
              <span className="font-black text-slate-800 tracking-tight text-xl">
       ختمت<span className="text-emerald-600">نا</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                قراءة جماعية للقرآن الكريم
              </span>
            </div>
          </div>
        </nav>

        <main className="pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/group/:id" element={<GroupPage />} />
            <Route path="/group/:groupId/create" element={<CreateKhatma />} />
            <Route path="/create" element={<CreateKhatma />} />
            <Route path="/khatma/:id" element={<KhatmaDetail />} />
          </Routes>
        </main>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '1.25rem',
              background: '#0f172a',
              color: '#fff',
              padding: '1rem 1.5rem',
              fontWeight: 600,
              fontFamily: "'Cairo', sans-serif",
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              direction: 'rtl',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
          }}
        />
      </div>
    </Router>
    </>
  );
}

export default App;
