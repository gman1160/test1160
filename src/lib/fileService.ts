import { FileDocument } from "@/types";

// Storage for documents (simulating a database)
let mockDocuments: FileDocument[] = [];

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
      // Add to our mock documents
      mockDocuments.push(newDoc);
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

export const updateDocumentStatus = async (id: string, status: FileDocument['status']): Promise<FileDocument | null> => {
  const docIndex = mockDocuments.findIndex(d => d.id === id);
  
  if (docIndex === -1) {
    return Promise.resolve(null);
  }
  
  // Update the document status
  mockDocuments[docIndex] = {
    ...mockDocuments[docIndex],
    status,
    // If status is ready, add a download URL
    ...(status === 'ready' ? { 
      downloadUrl: `/download/${id}`,
      previewUrl: `/preview/${id}`
    } : {})
  };
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDocuments[docIndex]);
    }, 500);
  });
};

// Function to remove a document (for admin purposes)
export const removeDocument = async (id: string): Promise<boolean> => {
  const initialLength = mockDocuments.length;
  mockDocuments = mockDocuments.filter(doc => doc.id !== id);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDocuments.length < initialLength);
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
