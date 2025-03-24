
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import BlurredPreview from "@/components/BlurredPreview";
import { FileDocument } from "@/types";
import { getDocument } from "@/lib/fileService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Preview = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<FileDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        setError("Document ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        const doc = await getDocument(id);
        if (!doc) {
          setError("Document not found");
        } else {
          setDocument(doc);
        }
      } catch (error) {
        console.error("Failed to fetch document:", error);
        setError("Failed to load document");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  return (
    <Layout>
      <div className="container py-10 px-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
          >
            Document Preview
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Preview and unlock your document
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="glass-card p-8 text-center">
            <h2 className="text-xl font-semibold text-destructive mb-4">{error}</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the document you're looking for.
            </p>
            <Button asChild>
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        ) : document ? (
          <BlurredPreview document={document} />
        ) : null}
      </div>
    </Layout>
  );
};

export default Preview;
