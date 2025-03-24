
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileDocument } from "@/types";
import { Lock, CreditCard, Download, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface BlurredPreviewProps {
  document: FileDocument;
}

const BlurredPreview: React.FC<BlurredPreviewProps> = ({ document }) => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setUnlocked(true);
      setIsProcessing(false);
      toast.success("Payment successful! Document unlocked.");
    }, 2000);
  };

  const togglePreview = () => {
    setIsPreviewing(!isPreviewing);
  };

  const handleDownload = () => {
    toast.success("Document downloaded successfully!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-card p-6 relative">
        <div className="absolute right-6 top-6 z-10">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={togglePreview}
          >
            {isPreviewing ? (
              <>
                <EyeOff className="h-4 w-4" /> Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Show Preview
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="w-full aspect-[4/3] bg-secondary rounded-lg overflow-hidden relative mb-6">
            {isPreviewing ? (
              <motion.div
                initial={{ filter: "blur(16px)" }}
                animate={{ filter: unlocked ? "blur(0px)" : "blur(16px)" }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                {document.thumbnailUrl && (
                  <img
                    src={document.thumbnailUrl}
                    alt="Document preview"
                    className="w-full h-full object-contain"
                  />
                )}
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-background/80 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Preview Hidden</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click "Show Preview" to see a blurred preview of your document
                  </p>
                </div>
              </div>
            )}

            {!unlocked && isPreviewing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-panel rounded-lg p-6 max-w-xs text-center">
                  <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold">Document Locked</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pay the decryption fee to unlock this document
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="w-full">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">{document.fileName}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                This document is {unlocked ? "unlocked" : "locked"} and requires payment to access.
              </p>
            </div>

            {!unlocked ? (
              <div className="bg-secondary/50 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold mb-2">$9.99</div>
                <p className="text-sm text-muted-foreground mb-4">
                  One-time decryption fee
                </p>
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  <CreditCard className="h-4 w-4" />
                  {isProcessing ? "Processing..." : "Pay & Unlock Document"}
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
              >
                <Button 
                  className="flex items-center gap-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Download Document
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlurredPreview;
