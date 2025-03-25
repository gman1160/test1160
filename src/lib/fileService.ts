import { FileDocument } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (file: File): Promise<FileDocument> => {
  // First check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  
  if (!userId) {
    throw new Error("User must be authenticated to upload files");
  }
  
  console.log("Uploading file:", file.name);
  
  // Generate a unique file path
  const fileId = uuidv4();
  const fileExtension = file.name.split('.').pop();
  const storagePath = `${userId}/${fileId}.${fileExtension}`;
  
  // Upload file to Supabase Storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from('documents')
    .upload(storagePath, file);
    
  if (storageError) {
    console.error("Storage upload error:", storageError);
    throw new Error(`Failed to upload file: ${storageError.message}`);
  }

  // Create document metadata
  const newDoc: Omit<FileDocument, "id"> = {
    fileName: file.name,
    fileType: getFileType(file),
    size: file.size,
    uploadDate: new Date().toISOString(),
    status: "pending",
    thumbnailUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Uploading...",
    isPasswordProtected: true
  };
  
  // Insert document record in database
  const { data: docData, error: docError } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      file_name: newDoc.fileName,
      file_type: newDoc.fileType,
      file_size: newDoc.size,
      file_path: storageData.path,
      storage_path: storagePath,
      original_file_name: file.name,
      is_password_protected: newDoc.isPasswordProtected,
      status: newDoc.status,
      thumbnail_url: newDoc.thumbnailUrl,
    })
    .select('*')
    .single();
    
  if (docError) {
    console.error("Document insert error:", docError);
    throw new Error(`Failed to save document metadata: ${docError.message}`);
  }
  
  // Map database record to FileDocument type
  return mapDbDocToFileDocument(docData);
};

export const getUserDocuments = async (): Promise<FileDocument[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('upload_date', { ascending: false });
    
  if (error) {
    console.error("Error fetching documents:", error);
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }
  
  return data.map(mapDbDocToFileDocument);
};

export const getDocument = async (id: string): Promise<FileDocument | null> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (error) {
    console.error("Error fetching document:", error);
    throw new Error(`Failed to fetch document: ${error.message}`);
  }
  
  return data ? mapDbDocToFileDocument(data) : null;
};

export const updateDocumentStatus = async (id: string, status: FileDocument['status']): Promise<FileDocument | null> => {
  // Create update data object
  const updateData: any = { status };
  
  // If status is ready, add download URL and preview URL
  if (status === 'ready') {
    const { data } = await supabase
      .from('documents')
      .select('storage_path')
      .eq('id', id)
      .single();
      
    if (data?.storage_path) {
      // Generate URLs for the file
      const { data: urlData } = await supabase.storage
        .from('documents')
        .createSignedUrl(data.storage_path, 60 * 60 * 24); // 24 hour expiry
        
      if (urlData?.signedUrl) {
        updateData.download_url = urlData.signedUrl;
        updateData.preview_url = urlData.signedUrl;
      }
    }
  }
  
  const { data, error } = await supabase
    .from('documents')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();
    
  if (error) {
    console.error("Error updating document status:", error);
    throw new Error(`Failed to update document status: ${error.message}`);
  }
  
  return mapDbDocToFileDocument(data);
};

export const removeDocument = async (id: string): Promise<boolean> => {
  // First get the storage path
  const { data: docData } = await supabase
    .from('documents')
    .select('storage_path')
    .eq('id', id)
    .single();
    
  // Delete from the database
  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
    
  if (dbError) {
    console.error("Error deleting document from database:", dbError);
    throw new Error(`Failed to delete document: ${dbError.message}`);
  }
  
  // If we have a storage path, delete the file too
  if (docData?.storage_path) {
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([docData.storage_path]);
      
    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
      // Continue anyway as the database record is deleted
    }
  }
  
  return true;
};

// Helper to map database document to FileDocument type
const mapDbDocToFileDocument = (dbDoc: any): FileDocument => {
  return {
    id: dbDoc.id,
    fileName: dbDoc.file_name,
    fileType: dbDoc.file_type as 'pdf' | 'word' | 'excel' | 'other',
    size: dbDoc.file_size,
    uploadDate: dbDoc.upload_date,
    status: dbDoc.status as 'pending' | 'processing' | 'ready' | 'completed',
    downloadUrl: dbDoc.download_url,
    previewUrl: dbDoc.preview_url,
    thumbnailUrl: dbDoc.thumbnail_url,
    isPasswordProtected: dbDoc.is_password_protected
  };
};

// Keep existing format functions the same
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
