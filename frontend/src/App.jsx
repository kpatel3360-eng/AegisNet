import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { FileUploadModal } from './components/FileUploadModal';
import { Dashboard } from './pages/Dashboard';
import { ThreatDetection } from './pages/ThreatDetection';
import { TrafficPrediction } from './pages/TrafficPrediction';
import { Analytics } from './pages/Analytics';
import { About } from './pages/About';
import { fetchDashboardSummary } from './services/api';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchDashboardSummary();
      setData(res);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to connect to AegisNet Backend API Server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAnalysisComplete = (analysisResult) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        cybersecurity: {
          ...analysisResult,
          is_demo: false
        }
      };
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
          <p className="font-mono text-sm tracking-wider text-slate-300">Initializing AegisNet Platform...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900 p-6 text-center shadow-2xl">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-3" />
          <h2 className="text-lg font-bold text-white">Connection Error</h2>
          <p className="mt-2 text-xs text-slate-400">{error}</p>
          <button
            onClick={loadData}
            className="mt-5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        
        <Navbar
          onOpenUpload={() => setIsUploadOpen(true)}
          isDemoMode={data?.cybersecurity?.is_demo}
        />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard data={data} onOpenUpload={() => setIsUploadOpen(true)} />} />
            <Route path="/threats" element={<ThreatDetection data={data} />} />
            <Route path="/traffic" element={<TrafficPrediction data={data} />} />
            <Route path="/analytics" element={<Analytics data={data} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <FileUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onAnalysisComplete={handleAnalysisComplete}
        />

        <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
          <p>AEGISNET &copy; 2026 — AI-Powered Network Intelligence & Cyber Security Monitoring Platform</p>
        </footer>

      </div>
    </BrowserRouter>
  );
}
