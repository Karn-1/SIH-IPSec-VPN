import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const normalizePrediction = (prediction, fallbackLabel, fallbackConfidence) => {
  if (prediction && typeof prediction === 'object') {
    return {
      label: prediction.label || fallbackLabel,
      confidence: typeof prediction.confidence === 'number' ? prediction.confidence : fallbackConfidence,
    };
  }

  return {
    label: prediction || fallbackLabel,
    confidence: fallbackConfidence,
  };
};

const normalizeAnalysisResponse = (data) => ({
  ...data,
  ai_predictions: {
    mode: normalizePrediction(data.ai_predictions?.mode, 'Unknown', data.ai_predictions?.mode_confidence),
    traffic_type: normalizePrediction(data.ai_predictions?.traffic_type, 'Unknown', data.ai_predictions?.traffic_confidence),
    cipher: normalizePrediction(data.ai_predictions?.cipher, 'Unknown', data.ai_predictions?.cipher_confidence),
  },
  traffic_features: {
    ...data.traffic_features,
    len_mean: data.traffic_features?.len_mean ?? data.traffic_features?.packet_len_mean,
    len_std: data.traffic_features?.len_std ?? data.traffic_features?.packet_len_std,
  },
  security_assessment: {
    ...data.security_assessment,
    findings: data.security_assessment?.findings || [],
    recommendations: data.security_assessment?.recommendations || [],
  },
});

export const analyzePcap = async (pcapFile, saLogFile = null) => {
  const formData = new FormData();
  formData.append('file', pcapFile);
  
  if (saLogFile) {
    formData.append('sa_log', saLogFile);
  }

  const response = await api.post('/api/analyze', formData);
  return normalizeAnalysisResponse(response.data);
};

export const getHealth = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/health`);
  return response.data;
};

export default api;
