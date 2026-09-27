import React from 'react';
import { Radio, TrendingUp, TrendingDown, Clock, Database, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const TrafficPrediction = ({ data }) => {
  if (!data) return null;

  const traffic = data.traffic;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Radio className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Network Traffic Volume Forecasting</h1>
            <p className="text-xs text-slate-400">Time-Series AI Forecasting Model for Aggregate Network Bandwidth</p>
          </div>
        </div>
      </div>

      {/* Explicit Domain Notice */}
      <div className="flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-xs text-cyan-200">
        <AlertCircle className="h-5 w-5 shrink-0 text-cyan-400" />
        <p>
          <strong className="font-semibold text-white">Domain Notice:</strong> AegisNet traffic forecasting predicts <strong>NETWORK DATA VOLUME (Bytes/MB)</strong> derived from CIC-IDS2017 packet flows. It does not measure physical road or vehicle traffic.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        
        {/* Current Volume */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Current Interval Volume</span>
            <Clock className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-white">{traffic.current_traffic_mb} MB</h3>
            <p className="mt-1 text-xs text-slate-400">Timestamp: {traffic.current_timestamp}</p>
          </div>
        </div>

        {/* Predicted Volume */}
        <div className="glass-card rounded-2xl p-5 border-cyan-500/30">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Predicted Next 1-Min Volume</span>
            <Radio className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-cyan-400">{traffic.predicted_traffic_mb} MB</h3>
            <p className="mt-1 text-xs text-slate-400">Predicted for: {traffic.next_timestamp}</p>
          </div>
        </div>

        {/* Bandwidth Trend */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Forecasted Bandwidth Trend</span>
            {traffic.percentage_change === null || traffic.percentage_change === undefined || traffic.percentage_change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-400" />
            )}
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className={`text-3xl font-extrabold ${
                traffic.percentage_change === null || traffic.percentage_change === undefined
                  ? 'text-cyan-400'
                  : (traffic.percentage_change >= 0 ? 'text-emerald-400' : 'text-rose-400')
              }`}>
                {traffic.display_change
                  ? traffic.display_change
                  : (traffic.percentage_change !== null && traffic.percentage_change !== undefined && isFinite(traffic.percentage_change)
                      ? `${traffic.percentage_change > 0 ? '+' : ''}${traffic.percentage_change}%`
                      : 'N/A')}
              </h3>
              <span className="text-xs text-slate-400 uppercase font-semibold">({traffic.trend})</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Expected next 1-min throughput delta</p>
          </div>
        </div>

      </div>

      {/* Traffic Line Chart */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-white">Historical & Predicted Traffic Volume</h3>
            <p className="text-xs text-slate-400">1-Minute Aggregated Network Flow Throughput (MB/min)</p>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span> Historical Flow Volume
            </span>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={traffic.history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(ts) => ts.split(' ')[1] || ts} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="total_mb" name="Total Bytes (MB)" stroke="#06b6d4" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="flow_count" name="Flow Count" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
