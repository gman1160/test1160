
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import FileUpload from "@/components/FileUpload";
import { FileDocument } from "@/types";
import { CheckCircle } from "lucide-react";

const Upload = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<FileDocument | null>(null);
  const navigate = useNavigate();

  const handleUploadSuccess = (document: FileDocument) => {
    setUploadedDoc(document);
    setIsUploaded(true);
    
    // Redirect to dashboard after a delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold">Upload Your Document</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Upload your password-protected document and we'll decrypt it for you.
            We support PDF, Word, and Excel formats.
          </p>
        </motion.div>

        {isUploaded ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Upload Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your document has been uploaded successfully. We'll start processing it right away.
            </p>
            <p className="text-sm">
              Redirecting you to your dashboard...
            </p>
          </motion.div>
        ) : (
          <FileUpload onSuccess={handleUploadSuccess} />
        )}

        <div className="mt-16">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
            <ol className="space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5">1</span>
                <p>We'll receive your uploaded document and begin the decryption process.</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5">2</span>
                <p>Once processing is complete, you'll receive a notification and can view a blurred preview.</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5">3</span>
                <p>After payment, you'll get immediate access to download your decrypted document.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
