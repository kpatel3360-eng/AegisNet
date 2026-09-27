import React, { useState } from 'react';
import { X, UploadCloud, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { uploadAndAnalyzeCSV } from '../services/api';

export const FileUploadModal = ({ isOpen, onClose, onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Invalid file type. Only CSV files are supported.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File size exceeds 100MB limit.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const result = await uploadAndAnalyzeCSV(file);
      onAnalysisComplete(result);
      onClose();
    } catch (err) {
      setError(err.message || 'Error processing network traffic file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Analyze Network Traffic</h3>
              <p className="text-xs text-slate-400">Upload CIC-IDS2017 compatible CSV</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            dragOver
              ? 'border-cyan-500 bg-cyan-500/5'
              : file
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
          }`}
        >
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              <button
                onClick={() => setFile(null)}
                className="mt-2 text-xs text-rose-400 hover:underline"
              >
                Remove file
              </button>
            </div>
          ) : (
            <>
              <UploadCloud className="h-10 w-10 text-slate-500 mb-3" />
              <p className="text-sm font-medium text-slate-200">
                Drag and drop your network flow CSV file here
              </p>
              <p className="mt-1 text-xs text-slate-400">or click to browse from device (max 100MB)</p>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-semibold text-slate-950 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing with AegisNet ML...
              </>
            ) : (
              'Run ML Analysis'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
