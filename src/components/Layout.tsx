
import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <motion.main 
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <footer className="py-6 px-6 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="mb-4 md:mb-0">
          © {new Date().getFullYear()} DocUnlock. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-foreground smooth-transition focus-ring">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-foreground smooth-transition focus-ring">
            Terms of Service
          </a>
          <a href="#" className="hover:text-foreground smooth-transition focus-ring">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
