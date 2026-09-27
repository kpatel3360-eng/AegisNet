const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const fetchHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error('Health check failed');
  return response.json();
};

export const fetchDashboardSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
  if (!response.ok) throw new Error('Failed to load dashboard summary');
  return response.json();
};

export const fetchTrafficPredict = async () => {
  const response = await fetch(`${API_BASE_URL}/traffic/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Failed to fetch traffic forecast');
  return response.json();
};

export const fetchModelsInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/models`);
  if (!response.ok) throw new Error('Failed to fetch model metadata');
  return response.json();
};

export const uploadAndAnalyzeCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'CSV analysis failed');
  }
  return data;
};
