
export interface FileDocument {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'word' | 'excel' | 'other';
  size: number;
  uploadDate: string;
  status: 'pending' | 'processing' | 'ready' | 'completed';
  previewUrl?: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  isPasswordProtected: boolean;
}

export interface User {
  id: string;
  email: string;
  documents: FileDocument[];
}
