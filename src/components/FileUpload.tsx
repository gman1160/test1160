
import React, { useState, useRef } from "react";
import { Upload, File, X, Lock, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadFile, validateFile } from "@/lib/fileService";
import { FileDocument } from "@/types";

interface FileUploadProps {
  onSuccess?: (document: FileDocument) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isPassworded, setIsPassworded] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const validation = validateFile(selectedFile);
    
    if (!validation.valid) {
      toast.error(validation.message || "Invalid file");
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submitFile = async () => {
    if (!file) return;
    
    setIsUploading(true);
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 400);
    
    try {
      const document = await uploadFile(file);
      
      // Ensure 100% at the end
      setUploadProgress(100);
      
      // Delay completion for better UX
      setTimeout(() => {
        toast.success("File uploaded successfully!");
        if (onSuccess) {
          onSuccess(document);
        }
      }, 500);
      
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        removeFile();
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center ${
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 hover:bg-secondary/50"
        } smooth-transition`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Upload your encrypted document</h3>
              <p className="text-muted-foreground mt-1">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: PDF, Word, Excel (Max 25MB)
              </p>
            </div>
            <Button 
              onClick={handleUploadClick}
              className="mt-4"
            >
              Select File
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass-card p-4 flex items-center">
              <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center mr-3 flex-shrink-0">
                <File className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-grow text-left truncate">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button 
                onClick={removeFile}
                className="ml-2 p-1.5 rounded-full hover:bg-secondary smooth-transition focus-ring"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 justify-center">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPassworded(true)}
                  className={`p-2 rounded-md flex items-center gap-1.5 ${
                    isPassworded 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "border hover:bg-secondary"
                  } smooth-transition`}
                >
                  <Lock className="h-4 w-4" />
                  <span className="text-sm font-medium">Password Protected</span>
                  {isPassworded && <Check className="h-3.5 w-3.5 ml-1" />}
                </button>
              </div>
            </div>
            
            {isUploading ? (
              <div className="space-y-3">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            ) : (
              <Button onClick={submitFile} className="w-full">
                Upload Document
              </Button>
            )}
          </div>
        )}
      </div>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
      />
    </div>
  );
};

export default FileUpload;
