
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import ProcessCard from "@/components/ProcessCard";
import { FileDocument } from "@/types";
import { getUserDocuments } from "@/lib/fileService";
import { Upload, FileBox, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [documents, setDocuments] = useState<FileDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const userDocs = await getUserDocuments();
        setDocuments(userDocs);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <Layout>
      <div className="container max-w-4xl py-10 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Documents</h1>
            <p className="text-muted-foreground mt-1">
              View the status of your documents and download when ready
            </p>
          </div>
          <Button asChild>
            <Link to="/upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload New
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc) => (
              <ProcessCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass-card"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <FileBox className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No documents yet</h2>
            <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
              You haven't uploaded any documents yet. Upload a document to get started.
            </p>
            <Button asChild>
              <Link to="/upload">Upload Your First Document</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
