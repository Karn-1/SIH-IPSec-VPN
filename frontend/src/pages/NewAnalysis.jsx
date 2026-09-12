import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzePcap } from '../services/api';
import FileUploader from '../components/FileUploader';
import { Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const NewAnalysis = () => {
  const navigate = useNavigate();
  const [pcapFile, setPcapFile] = useState(null);
  const [saLogFile, setSaLogFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!pcapFile) {
      setError('Please select a PCAP file to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(10);

    try {
      setUploadProgress(30);
      const result = await analyzePcap(pcapFile, saLogFile);
      setUploadProgress(100);
      
      const storedHistory = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
      const history = [
        result,
        ...storedHistory.filter((item) => item.analysis?.id !== result.analysis?.id),
      ].slice(0, 50);
      localStorage.setItem('analysisHistory', JSON.stringify(history));
      localStorage.setItem('analysisResult', JSON.stringify(result));
      localStorage.setItem('analysisFilename', pcapFile.name);
      
      navigate('/result');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze capture. Please try again.');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const progressSteps = [
    { label: 'File uploaded', completed: uploadProgress >= 30 },
    { label: 'Reading packet capture', completed: uploadProgress >= 50 },
    { label: 'Extracting traffic features', completed: uploadProgress >= 70 },
    { label: 'Running AI analysis', completed: uploadProgress >= 85 },
    { label: 'Parsing security configuration', completed: uploadProgress >= 95 },
    { label: 'Calculating security score', completed: uploadProgress >= 100 },
  ];

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-soc-primary">Capture intake</p>
        <h1 className="text-3xl font-bold text-soc-text sm:text-4xl">New analysis</h1>
        <p className="mt-2 max-w-2xl text-soc-textSecondary">Upload a PCAP to detect traffic characteristics, IPsec mode, encryption, and security risks.</p>
      </div>

      {loading ? (
        <div className="mx-auto max-w-2xl rounded-xl border border-soc-border bg-soc-card p-8">
          <div className="flex items-center justify-center mb-8">
            <Loader2 className="h-12 w-12 animate-spin text-soc-primary" />
          </div>
          <h2 className="mb-6 text-center text-xl font-semibold text-soc-text">
            Analyzing capture
          </h2>
          <div className="space-y-3 max-w-md mx-auto">
            {progressSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-soc-success" />
                ) : (
                  <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-soc-border" />
                )}
                <span className={step.completed ? 'text-soc-text' : 'text-soc-textSecondary'}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl border border-soc-border bg-soc-card p-8">
            <h2 className="mb-6 flex items-center justify-center text-xl font-semibold text-soc-text">
              <Upload className="mr-3 h-6 w-6 text-soc-primary" />
              Analyze an IPsec packet capture
            </h2>

            <div className="space-y-6">
              <FileUploader
                onFileSelect={setPcapFile}
                accept=".pcap,.pcapng,.cap"
                label="Drop PCAP or CAP file here or browse files (required)"
              />

              <FileUploader
                onFileSelect={setSaLogFile}
                accept=".log,.txt"
                label="Upload SA log (optional)"
              />

              {error && (
                <div className="flex items-start space-x-3 rounded-lg border border-soc-danger/20 bg-soc-danger/10 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-soc-danger" />
                  <p className="text-sm text-soc-danger">{error}</p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!pcapFile}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  pcapFile
                    ? 'bg-soc-primary hover:bg-soc-primaryLight text-soc-background'
                    : 'bg-soc-border text-soc-textMuted cursor-not-allowed'
                }`}
              >
                Analyze capture
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-soc-border bg-soc-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-soc-text">File requirements</h3>
            <ul className="space-y-2 text-sm text-soc-textSecondary">
              <li className="flex items-start space-x-2">
                <span className="text-soc-primary">•</span>
                <span>PCAP, PCAPNG, or CAP format required</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-soc-primary">•</span>
                <span>Minimum 2 usable IP packets for analysis</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-soc-primary">•</span>
                <span>SA log is optional but recommended for full security assessment</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-soc-primary">•</span>
                <span>Maximum file size: 100MB</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewAnalysis;
