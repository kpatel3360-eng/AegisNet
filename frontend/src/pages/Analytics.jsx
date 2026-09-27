import React, { useEffect, useState } from 'react';
import { BarChart3, Cpu, Database, CheckCircle2, Layers } from 'lucide-react';
import { fetchModelsInfo } from '../services/api';

export const Analytics = ({ data }) => {
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    fetchModelsInfo()
      .then(setModelInfo)
      .catch((err) => console.error('Failed to load model info:', err));
  }, []);

  if (!data) return null;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">System Analytics & ML Model Metrics</h1>
            <p className="text-xs text-slate-400">Empirical validation performance metrics and model architecture specs</p>
          </div>
        </div>
      </div>

      {/* Deployed ML Models Performance Table */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Deployed AegisNet Models Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Deployment Level</th>
                <th className="py-3 px-4 font-semibold">Model Architecture</th>
                <th className="py-3 px-4 font-semibold">Target Task</th>
                <th className="py-3 px-4 font-semibold">Primary Metric</th>
                <th className="py-3 px-4 font-semibold">Validation Metric Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 font-semibold text-cyan-400">Level 1 Binary</td>
                <td className="py-3 px-4 text-white font-medium">Gradient Boosting (LGBM GBDT)</td>
                <td className="py-3 px-4 text-slate-300">BENIGN vs. ATTACK</td>
                <td className="py-3 px-4 text-slate-400">ATTACK Recall</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-400">99.96% (Accuracy: 99.89%)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 font-semibold text-purple-400">Level 2 Multiclass</td>
                <td className="py-3 px-4 text-white font-medium">Random Forest (LGBM RF)</td>
                <td className="py-3 px-4 text-slate-300">15 Attack Classes</td>
                <td className="py-3 px-4 text-slate-400">Macro Recall / Weighted F1</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-400">91.54% (Weighted F1: 99.24%)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 font-semibold text-amber-400">Traffic Forecaster</td>
                <td className="py-3 px-4 text-white font-medium">Random Forest Regressor</td>
                <td className="py-3 px-4 text-slate-300">Next 1-Min Bytes Volume</td>
                <td className="py-3 px-4 text-slate-400">R² Score</td>
                <td className="py-3 px-4 font-mono font-bold text-cyan-400">0.2124 (RMSE: 56.72 MB)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Inventory Card */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Retained Numerical Features (46)</h3>
            <p className="text-xs text-slate-400">Selected after Phase 2 variance and multicollinearity filtering</p>
          </div>
          <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
            46 Features
          </span>
        </div>

        {modelInfo?.feature_names && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 text-[11px] font-mono">
            {modelInfo.feature_names.map((feat, idx) => (
              <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-300 truncate">
                {feat}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
