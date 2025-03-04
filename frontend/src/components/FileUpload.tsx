import { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api.service';
import { 
  FileUploadContainer, 
  FileInputLabel, 
  FileInput, 
  SelectedFileInfo, 
  UploadButton, 
  StatusContainer, 
  ErrorMessage,
  ProgressBar,
  ProgressBarFill,
  StatusBadge
} from '../styles/AppComponents';
import { UploadResponse } from '../types/upload-response.interface';
import { FileUploadProps } from '../types/props.interface';

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadDetails, setUploadDetails] = useState<UploadResponse | null>(null);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Please select a valid CSV file');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setUploadStatus(null);
    setError(null);
    setUploadDetails(null);
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    try {
      setIsUploading(true);
      setError(null);
      setUploadStatus('Sending file...');
      const response = await apiService.uploadCsvFile(selectedFile);      
      setUploadDetails(response);
      setUploadStatus(`Upload started. Status: ${response.status}`);
      startStatusPolling(response.id);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file. Please try again.');
      setUploadStatus(null);
    } finally {
      setIsUploading(false);
    }
  };
  const startStatusPolling = (id: string) => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    checkUploadStatus(id);
    const intervalId = window.setInterval(() => {
      checkUploadStatus(id);
    }, 2000);
    setPollingInterval(intervalId);
  };

  const checkUploadStatus = async (id: string) => {
    try {
      const statusResponse = await apiService.checkUploadStatus(id);
      setUploadDetails(statusResponse);
      if (statusResponse.status === 'pending') {
        setUploadStatus('Upload pending. Waiting for processing to start...');
      } else if (statusResponse.status === 'processing') {
        setUploadStatus(`Processing file... ${statusResponse.totalRows} rows detected.`);
      } else if (statusResponse.status === 'finished') {
        setUploadStatus(`Processing completed successfully! ${statusResponse.totalRows} rows processed.`);
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        if (onUploadSuccess) {
          onUploadSuccess(id);
        }
      } else if (statusResponse.status === 'failed') {
        setUploadStatus('File processing failed.');
        setError('The file processing failed. Please check the format and try again.');
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
      }
    } catch (error) {
      console.error('Error checking status:', error);
      setError('Failed to check the processing status.');
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
  };

  const getStatusBadgeColor = (status: string | undefined) => {
    if (!status) return 'gray';
    switch (status.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'processing':
        return 'blue';
      case 'finished':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getProgressWidth = () => {
    if (!uploadDetails) return '0%';
    switch (uploadDetails.status) {
      case 'pending':
        return '10%';
      case 'processing':
        return '50%';
      case 'finished':
        return '100%';
      case 'failed':
        return '100%';
      default:
        return '0%';
    }
  };

  return (
    <FileUploadContainer>
      <h2>Upload CSV File</h2>      
      <FileInputLabel>
        {selectedFile ? 'Change file' : 'Select CSV file'}
        <FileInput
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={isUploading || (uploadDetails?.status === 'processing')}
        />
      </FileInputLabel>      
      {selectedFile && (
        <SelectedFileInfo>
          <p>Selected file: {selectedFile.name}</p>
          <button 
            type="button" 
            onClick={handleClearFile}
            disabled={isUploading || (uploadDetails?.status === 'processing')}
          >
            Clear
          </button>
        </SelectedFileInfo>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}      
      <UploadButton 
        onClick={handleUpload}
        disabled={!selectedFile || isUploading || (uploadDetails?.status === 'processing')}
      >
        {isUploading ? 'Sending...' : 'Send File'}
      </UploadButton>      
      {uploadDetails && (
        <StatusContainer>
          <h3>Upload Status</h3>
          <StatusBadge color={getStatusBadgeColor(uploadDetails.status)}>
            {uploadDetails.status.toUpperCase()}
          </StatusBadge>
          <p>{uploadStatus}</p>
          {(uploadDetails.status === 'pending' || uploadDetails.status === 'processing' || uploadDetails.status === 'finished') && (
            <ProgressBar>
              <ProgressBarFill width={getProgressWidth()} />
            </ProgressBar>
          )}
          <div style={{ marginTop: '15px' }}>
            <p><strong>Batch ID:</strong> {uploadDetails.id}</p>
            <p><strong>Total Rows:</strong> {uploadDetails.totalRows || 'Calculating...'}</p>
            <p><strong>Created:</strong> {formatDate(uploadDetails.createdAt)}</p>
            {uploadDetails.finishedAt && (
              <p><strong>Finished:</strong> {formatDate(uploadDetails.finishedAt)}</p>
            )}
          </div>
        </StatusContainer>
      )}
    </FileUploadContainer>
  );
};

export default FileUpload; 