import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Upload, FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container max-w-6xl mx-auto">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white mx-auto"
            >
              <ShieldCheck size={40} />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-balance max-w-3xl mx-auto">
              Secure Document Decryption Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your password-protected documents and let us handle the decryption. 
              Fast, secure, and confidential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link to="/upload" className="flex items-center gap-2">
                  Get Started <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-secondary/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Our process is simple, secure, and designed with your privacy in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Upload className="h-8 w-8" />,
                title: "Upload Document",
                description: "Securely upload your password-protected PDF, Word, or Excel document."
              },
              {
                icon: <FileText className="h-8 w-8" />,
                title: "We Process It",
                description: "Our team will decrypt your document and prepare it for delivery."
              },
              {
                icon: <CreditCard className="h-8 w-8" />,
                title: "Pay & Download",
                description: "Preview the unlocked document, pay a small fee, and download it."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-background flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Why Choose Our Service</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              We offer a secure, reliable, and easy-to-use solution for all your document decryption needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Secure Processing",
                description: "Your documents are processed with the highest security standards. We never store your decrypted files longer than necessary."
              },
              {
                title: "Fast Turnaround",
                description: "Most documents are processed within hours, so you won't be kept waiting."
              },
              {
                title: "Transparent Pricing",
                description: "A simple, one-time fee per document. No subscriptions or hidden costs."
              },
              {
                title: "Supports Multiple Formats",
                description: "We can handle password-protected PDFs, Microsoft Word documents, and Excel spreadsheets."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 to-blue-500/10">
        <div className="container max-w-6xl mx-auto">
          <div className="glass-panel rounded-2xl p-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Unlock Your Documents?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Our secure platform is ready to help you access your password-protected files quickly and easily.
            </p>
            <Button size="lg" asChild>
              <Link to="/upload" className="flex items-center gap-2">
                Upload Document Now <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
