
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserDocuments, updateDocumentStatus, removeDocument } from "@/lib/fileService";
import { FileDocument } from "@/types";
import { useNavigate } from "react-router-dom";
import { Shield, Upload, FileUp, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [documents, setDocuments] = useState<FileDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
    
    // Set up an interval to check for new documents every 10 seconds
    const intervalId = setInterval(() => {
      fetchDocuments(true);
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchDocuments = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      const docs = await getUserDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      if (!silent) {
        toast.error("Failed to load documents");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDocuments();
    toast.success("Document list refreshed");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadDecrypted = async (docId: string) => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setProcessingId(docId);
      setIsUploading(true);
      
      // First, upload the decrypted file to Supabase Storage
      const { data: docData } = await supabase
        .from('documents')
        .select('storage_path')
        .eq('id', docId)
        .single();
      
      if (!docData) {
        throw new Error("Document not found");
      }
      
      // Upload the new file, replacing the old one
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .update(docData.storage_path, selectedFile);
      
      if (uploadError) {
        throw new Error(`Failed to upload decrypted file: ${uploadError.message}`);
      }
      
      // Update the document status to ready
      await updateDocumentStatus(docId, 'ready');
      
      // Refetch documents to update the list
      await fetchDocuments();
      
      toast.success("Decrypted document uploaded successfully");
      setSelectedFile(null);
      
      // Reset file input - Fixed by using window.document instead of document variable
      const fileInput = window.document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error("Failed to upload decrypted document:", error);
      toast.error("Failed to upload decrypted document");
    } finally {
      setIsUploading(false);
      setProcessingId(null);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      setIsDeleting(docId);
      const success = await removeDocument(docId);
      
      if (success) {
        await fetchDocuments();
        toast.success("Document removed successfully");
      } else {
        toast.error("Failed to remove document");
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Layout>
      <div className="container py-10 px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Manage document jobs and upload decrypted files
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-grow">
              <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                Upload decrypted document
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedFile ? (
                <span>Selected: {selectedFile.name}</span>
              ) : (
                <span>No file selected</span>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : documents.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.fileName}</TableCell>
                    <TableCell className="uppercase">{doc.fileType}</TableCell>
                    <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${doc.status === 'ready' ? 'bg-green-100 text-green-800' : 
                          doc.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`
                      }>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/preview/${doc.id}`)}
                        >
                          View
                        </Button>
                        {doc.status === 'pending' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUploadDecrypted(doc.id)}
                            disabled={!selectedFile || isUploading}
                            className="flex items-center gap-1"
                          >
                            {processingId === doc.id && isUploading ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <FileUp className="h-3 w-3" />
                                <span>Upload Decrypted</span>
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id)}
                          disabled={isDeleting === doc.id}
                          className="flex items-center gap-1"
                        >
                          {isDeleting === doc.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 glass-card">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-secondary">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">No documents found</h2>
            <p className="mt-2 text-muted-foreground">
              Waiting for documents to be uploaded by users.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
