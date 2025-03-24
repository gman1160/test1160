
import { FileDocument } from "@/types";

// Mock data for demonstration purposes
const mockDocuments: FileDocument[] = [
  {
    id: "doc-1",
    fileName: "Financial_Report_2023.pdf",
    fileType: "pdf",
    size: 2500000,
    uploadDate: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: "ready",
    previewUrl: "/preview/doc-1",
    thumbnailUrl: "https://placehold.co/600x400/e2e8f0/475569?text=PDF+Preview",
    isPasswordProtected: true
  },
  {
    id: "doc-2",
    fileName: "Business_Plan.docx",
    fileType: "word",
    size: 1800000,
    uploadDate: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "processing",
    thumbnailUrl: "https://placehold.co/600x400/e2e8f0/475569?text=DOCX+Processing",
    isPasswordProtected: true
  }
];

export const uploadFile = async (file: File): Promise<FileDocument> => {
  // In a real app, this would upload to a server
  console.log("Uploading file:", file.name);
  
  // Create a new document object
  const newDoc: FileDocument = {
    id: `doc-${Date.now().toString(36)}`,
    fileName: file.name,
    fileType: getFileType(file),
    size: file.size,
    uploadDate: new Date().toISOString(),
    status: "pending",
    thumbnailUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Uploading...",
    isPasswordProtected: true
  };
  
  // In a real app, we would add this to the database
  // For now, let's simulate a network request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newDoc);
    }, 1500);
  });
};

export const getUserDocuments = async (): Promise<FileDocument[]> => {
  // In a real app, this would fetch from a server
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockDocuments]);
    }, 800);
  });
};

export const getDocument = async (id: string): Promise<FileDocument | null> => {
  const doc = mockDocuments.find(d => d.id === id);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(doc || null);
    }, 500);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' bytes';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
};

export const getFileType = (file: File): 'pdf' | 'word' | 'excel' | 'other' => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  if (extension === 'pdf') {
    return 'pdf';
  } else if (['doc', 'docx'].includes(extension)) {
    return 'word';
  } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
    return 'excel';
  } else {
    return 'other';
  }
};

export const validateFile = (file: File): { valid: boolean; message?: string } => {
  // Check file type
  const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
  
  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: 'Invalid file type. Please upload a PDF, Word, or Excel document.' 
    };
  }
  
  // Check file size (max 25MB)
  if (file.size > 25 * 1024 * 1024) {
    return { 
      valid: false, 
      message: 'File is too large. Maximum size is 25MB.' 
    };
  }
  
  return { valid: true };
};
