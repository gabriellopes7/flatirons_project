export interface UploadResponse {
  id: string;
  totalRows: number;
  status: 'pending' | 'processing' | 'finished' | 'failed';
  createdAt: string;
  finishedAt: string | null;
}
