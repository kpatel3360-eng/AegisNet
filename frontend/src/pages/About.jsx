import React from 'react';
import { Info, Shield, ArrowRight, Code, Database, Cpu, Layers } from 'lucide-react';

export const About = () => {
  const steps = [
    { title: 'CIC-IDS2017 Dataset', desc: 'Raw cybersecurity network flow capture' },
    { title: 'Data Inspection', desc: 'Phase 1 anomaly & feature quality audit' },
    { title: 'Preprocessing', desc: 'Phase 2 cleaning, encoding & scaling' },
    { title: 'Level 1 Detection', desc: 'Binary BENIGN vs. ATTACK classification' },
    { title: 'Level 2 Classification', desc: '15 Multiclass attack category identification' },
    { title: 'Traffic Forecasting', desc: 'Phase 4 1-minute volume predictions' },
    { title: 'AegisNet Dashboard', desc: 'Interactive real-time monitoring platform' },
  ];

  const techStack = [
    { name: 'Python', role: 'Machine Learning & Pipeline Engine' },
    { name: 'Flask & Flask-CORS', role: 'REST API Backend Framework' },
    { name: 'React 18 & Vite', role: 'Interactive Single-Page Frontend' },
    { name: 'Tailwind CSS', role: 'Modern Dark Cybersecurity Styling' },
    { name: 'scikit-learn & LightGBM', role: 'Classification & Regression ML' },
    { name: 'pandas & NumPy', role: 'Data Manipulation & Feature Vectors' },
    { name: 'joblib', role: 'Model Persistence & Unpickling' },
    { name: 'Recharts', role: 'Interactive Data Visualizations' },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Info className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">About AegisNet Platform</h1>
            <p className="text-xs text-slate-400">AI-Powered Network Intelligence & Cybersecurity Monitoring System</p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-2">Platform Architecture & Mission</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          AegisNet is an end-to-end artificial intelligence platform engineered for enterprise network security and traffic intelligence.
          Trained on over 2.5 million network flows from the benchmark CIC-IDS2017 dataset, AegisNet combines a two-level machine learning cyber attack detection pipeline with time-series bandwidth forecasting models.
        </p>
      </div>

      {/* End-to-End Pipeline Diagram */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-6">End-to-End AegisNet Pipeline</h3>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={idx} className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-400">
                  {idx + 1}
                </span>
              </div>
              <h4 className="mt-3 text-xs font-bold text-white">{step.title}</h4>
              <p className="mt-1 text-[11px] text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Core Technology Stack</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {techStack.map((tech, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <span className="font-mono text-xs font-bold text-cyan-400">{tech.name}</span>
              <p className="mt-1 text-[11px] text-slate-400">{tech.role}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
