import React from 'react';
import { Shield, ShieldAlert, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

export const ThreatDetection = ({ data }) => {
  if (!data) return null;

  const { summary, attack_distribution, recent_detections } = data.cybersecurity;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Threat Detection Center</h1>
            <p className="text-xs text-slate-400">Level 1 Binary & Level 2 Multiclass AI Classification Analysis</p>
          </div>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium">Total Evaluated Flows</p>
          <p className="text-xl font-extrabold text-white mt-1">{summary.total_flows.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium">Benign Network Flows</p>
          <p className="text-xl font-extrabold text-emerald-400 mt-1">{summary.benign_flows.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium">Malicious Attack Flows</p>
          <p className="text-xl font-extrabold text-rose-400 mt-1">{summary.attack_flows.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium">Overall Threat Rate</p>
          <p className="text-xl font-extrabold text-amber-400 mt-1">{summary.attack_percentage}%</p>
        </div>
      </div>

      {/* Attack Categories Table */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Detected Attack Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Attack Category</th>
                <th className="py-3 px-4 font-semibold">Detected Flow Count</th>
                <th className="py-3 px-4 font-semibold">Percentage of Total</th>
                <th className="py-3 px-4 font-semibold">Severity Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {attack_distribution.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.label === 'BENIGN' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    {item.label}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{item.count.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">{item.percentage}%</td>
                  <td className="py-3 px-4">
                    <span className={`rounded-md px-2 py-0.5 font-bold ${
                      item.label === 'BENIGN'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : item.percentage > 10
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {item.label === 'BENIGN' ? 'Low' : item.percentage > 10 ? 'High Risk' : 'Medium Risk'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Detections Detailed Table */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Individual Flow Classifications</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Flow Index</th>
                <th className="py-3 px-4 font-semibold">Level 1 Binary Status</th>
                <th className="py-3 px-4 font-semibold">Level 2 Attack Classification</th>
                <th className="py-3 px-4 font-semibold">Model Confidence</th>
                <th className="py-3 px-4 font-semibold">Risk Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recent_detections.map((det) => (
                <tr key={det.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-mono text-slate-400">#{det.flow_index}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-bold ${
                      det.binary_prediction === 'BENIGN'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {det.binary_prediction === 'BENIGN' ? <CheckCircle className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                      {det.binary_prediction}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-white">{det.attack_type}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">{det.confidence}%</td>
                  <td className="py-3 px-4">
                    <span className={`rounded px-2 py-0.5 font-bold ${
                      det.risk === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {det.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
