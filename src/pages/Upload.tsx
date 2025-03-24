
import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import FileUpload from "@/components/FileUpload";
import { FileDocument } from "@/types";
import { CheckCircle, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Upload = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<FileDocument | null>(null);
  const [trackingLink, setTrackingLink] = useState<string>("");

  const handleUploadSuccess = (document: FileDocument) => {
    setUploadedDoc(document);
    
    // Generate a tracking link
    const trackingUrl = `${window.location.origin}/preview/${document.id}`;
    setTrackingLink(trackingUrl);
    
    setIsUploaded(true);
  };

  const copyTrackingLink = () => {
    navigator.clipboard.writeText(trackingLink);
    toast.success("Tracking link copied to clipboard!");
  };

  const simulateEmailSent = () => {
    toast.success("Email sent with tracking link!");
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
            
            <div className="glass-panel p-4 mb-6">
              <p className="font-medium mb-2">Your tracking link:</p>
              <div className="flex items-center bg-secondary/50 p-2 rounded-md">
                <div className="truncate flex-grow text-sm">{trackingLink}</div>
                <Button size="sm" variant="ghost" onClick={copyTrackingLink} className="ml-2">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Use this link to track the status of your document and download it once it's ready.
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={simulateEmailSent} className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send me this link by email
              </Button>
            </div>
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
                <p>You'll receive an email with a tracking link to check the status of your document.</p>
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
