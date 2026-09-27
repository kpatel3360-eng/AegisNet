import React from 'react';
import { Activity, ShieldAlert, Zap, TrendingUp, AlertTriangle, CheckCircle, Radio } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';

const COLORS = ['#10b981', '#f43f5e', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];

export const Dashboard = ({ data, onOpenUpload }) => {
  if (!data) return null;

  const { cybersecurity, traffic, models } = data;
  const summary = cybersecurity.summary;
  const attackDist = cybersecurity.attack_distribution;
  const recentDetections = cybersecurity.recent_detections;

  // Data for BENIGN vs ATTACK Pie Chart
  const pieData = [
    { name: 'BENIGN Flows', value: summary.benign_flows },
    { name: 'Attack Flows', value: summary.attack_flows }
  ];

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Network Security Command Center</h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time cyber threat detection & network volume forecasting engine
          </p>
        </div>
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 self-start rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 transition-all cursor-pointer"
        >
          <Zap className="h-4 w-4" />
          Analyze Network CSV
        </button>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* 1. Total Flows */}
        <div className="glass-card glass-card-hover rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Flows</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-white">{summary.total_flows.toLocaleString()}</h3>
            <p className="mt-1 text-xs text-slate-400">Evaluated network packet flows</p>
          </div>
        </div>

        {/* 2. Attack Flows */}
        <div className="glass-card glass-card-hover rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Attack Flows</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-rose-400">{summary.attack_flows.toLocaleString()}</h3>
            <p className="mt-1 text-xs text-slate-400">Detected malicious activities</p>
          </div>
        </div>

        {/* 3. Attack Rate */}
        <div className="glass-card glass-card-hover rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Threat Rate</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-extrabold text-white">{summary.attack_percentage}%</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                summary.risk_level === 'Low' ? 'bg-emerald-500/20 text-emerald-400' :
                summary.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-rose-500/20 text-rose-400'
              }`}>
                {summary.risk_level} Risk
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Top attack: <span className="text-cyan-400 font-semibold">{summary.most_common_attack}</span></p>
          </div>
        </div>

        {/* 4. Traffic Forecast */}
        <div className="glass-card glass-card-hover rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Forecasted Traffic</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Radio className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-extrabold text-cyan-400">{traffic.predicted_traffic_mb} MB/min</h3>
              <span className="text-xs text-slate-400 font-semibold">
                ({traffic.display_change
                  ? traffic.display_change
                  : (traffic.percentage_change !== null && traffic.percentage_change !== undefined && isFinite(traffic.percentage_change)
                      ? `${traffic.percentage_change > 0 ? '+' : ''}${traffic.percentage_change}%`
                      : 'N/A')})
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Predicted next 1-min network volume</p>
          </div>
        </div>

      </div>

      {/* Threat Overview Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* BENIGN vs ATTACK Pie Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white mb-1">Traffic Classification</h3>
          <p className="text-xs text-slate-400 mb-4">Binary Level 1 Model Predictions</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs text-slate-300">BENIGN ({summary.benign_flows})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500"></span>
              <span className="text-xs text-slate-300">ATTACK ({summary.attack_flows})</span>
            </div>
          </div>
        </div>

        {/* Attack Distribution Bar Chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-base font-semibold text-white mb-1">Attack Type Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">Level 2 Multiclass Detection Categories</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackDist.filter(d => d.label !== 'BENIGN')}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Real-Time Traffic & Recent Detections Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Traffic Volume Forecast Chart */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Network Traffic Forecast</h3>
              <p className="text-xs text-slate-400">1-Minute Aggregate Throughput (MB/min)</p>
            </div>
            <span className="rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20">
              Forecaster R² = 0.2124
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={traffic.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 9 }} tickFormatter={(ts) => ts.split(' ')[1] || ts} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="total_mb" name="Traffic (MB)" stroke="#06b6d4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Detections */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white mb-1">Recent Flow Detections</h3>
          <p className="text-xs text-slate-400 mb-4">Latest Classified Network Packet Flows</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Flow ID</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Attack Type</th>
                  <th className="py-2.5 px-3 font-semibold">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentDetections.slice(0, 6).map((det) => (
                  <tr key={det.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-mono text-slate-300">#{det.flow_index}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
                        det.binary_prediction === 'BENIGN'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {det.binary_prediction === 'BENIGN' ? <CheckCircle className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                        {det.binary_prediction}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-white">{det.attack_type}</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-400">{det.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
