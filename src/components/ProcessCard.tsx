
import React from "react";
import { motion } from "framer-motion";
import { FileDocument } from "@/types";
import { formatFileSize } from "@/lib/fileService";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, FileIcon, Lock, Unlock, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface ProcessCardProps {
  document: FileDocument;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ document }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500 animate-pulse-soft";
      case "ready":
        return "bg-green-500";
      case "completed":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Awaiting Processing";
      case "processing":
        return "Processing";
      case "ready":
        return "Ready for Payment";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return "📄";
      case "word":
        return "📝";
      case "excel":
        return "📊";
      default:
        return "📁";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 w-full"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
          <FileIcon className="h-6 w-6 text-foreground" />
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-medium truncate max-w-xs">{document.fileName}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1 gap-2">
                <span>{formatFileSize(document.size)}</span>
                <span className="text-xs">•</span>
                <span className="flex items-center gap-1">
                  {document.isPasswordProtected ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                </span>
              </div>
            </div>
            
            <Badge variant="outline" className="flex gap-1 items-center">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(document.status)}`} />
              <span>{getStatusLabel(document.status)}</span>
            </Badge>
          </div>
          
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
            <span>Uploaded on {formatDate(document.uploadDate)}</span>
          </div>
          
          {document.status === "ready" && (
            <div className="mt-4">
              <Link 
                to={`/preview/${document.id}`}
                className="inline-flex items-center text-sm text-primary font-medium hover:text-primary/80 smooth-transition gap-1.5"
              >
                <Eye className="h-4 w-4" />
                View Preview
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProcessCard;
