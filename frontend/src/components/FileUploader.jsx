import { useState } from 'react';
import { Upload, X, File } from 'lucide-react';

const FileUploader = ({ onFileSelect, accept, label }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (selectedFile) {
    return (
      <div className="bg-soc-background border border-soc-border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-soc-primary/20 rounded-lg">
              <File className="h-5 w-5 text-soc-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-soc-text">{selectedFile.name}</p>
              <p className="text-xs text-soc-textSecondary">{formatFileSize(selectedFile.size)} • {selectedFile.name.split('.').pop().toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 hover:bg-soc-cardHover rounded-lg transition-colors group"
          >
            <X className="h-4 w-4 text-soc-textSecondary group-hover:text-soc-danger" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
        dragActive
          ? 'border-soc-primary bg-soc-primary/10'
          : 'border-soc-border bg-soc-background hover:border-soc-borderLight'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-soc-card border border-soc-border rounded-full">
          <Upload className="h-8 w-8 text-soc-textSecondary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-soc-text mb-2">{label}</p>
          <p className="text-soc-text font-medium mb-1">Drop your capture here</p>
          <p className="text-sm text-soc-textSecondary">or browse from your computer</p>
          <p className="text-xs text-soc-textMuted mt-2">{accept.split(',').map(ext => ext.replace('.', '').toUpperCase()).join(' • ')}</p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
