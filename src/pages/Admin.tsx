
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
import { getUserDocuments, updateDocumentStatus } from "@/lib/fileService";
import { FileDocument } from "@/types";
import { useNavigate } from "react-router-dom";
import { Shield, Upload, FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const [documents, setDocuments] = useState<FileDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await getUserDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
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
      
      // Simulate uploading the decrypted file
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the document status to ready
      await updateDocumentStatus(docId, 'ready');
      
      // Refetch documents to update the list
      await fetchDocuments();
      
      toast.success("Decrypted document uploaded successfully");
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error("Failed to upload decrypted document:", error);
      toast.error("Failed to upload decrypted document");
    } finally {
      setIsUploading(false);
      setProcessingId(null);
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
          <Button onClick={fetchDocuments} variant="outline">
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
