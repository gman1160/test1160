
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Menu, X, Shield, Upload as UploadIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <motion.header
      className={`sticky top-0 z-40 w-full transition-all ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              D
            </div>
            <span className="font-bold text-xl hidden md:inline-block">
              Decryptor
            </span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link
              to="/"
              className={`text-sm transition-colors hover:text-foreground/80 ${
                location.pathname === "/"
                  ? "text-foreground font-medium"
                  : "text-foreground/60"
              }`}
            >
              Home
            </Link>
            <Link
              to="/upload"
              className={`text-sm transition-colors hover:text-foreground/80 ${
                location.pathname === "/upload"
                  ? "text-foreground font-medium"
                  : "text-foreground/60"
              }`}
            >
              Upload
            </Link>
            {isAuthenticated && (
              <Link
                to="/admin"
                className={`text-sm transition-colors hover:text-foreground/80 ${
                  location.pathname === "/admin"
                    ? "text-foreground font-medium"
                    : "text-foreground/60"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!isLoading && (
            isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                variant="ghost"
                size="sm"
                className="gap-1.5"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )
          )}
          
          <Button asChild size="sm">
            <Link to="/upload" className="gap-1.5">
              <UploadIcon className="h-4 w-4" />
              Upload Document
            </Link>
          </Button>
        </div>

        <button
          className="block md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-background z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container flex flex-col h-full py-6">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  D
                </div>
                <span className="font-bold text-xl">Decryptor</span>
              </Link>
              <button
                onClick={toggleMenu}
                className="p-2"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-lg">
              <Link
                to="/"
                className={`py-2 transition-colors ${
                  location.pathname === "/"
                    ? "text-foreground font-medium"
                    : "text-foreground/60"
                }`}
              >
                Home
              </Link>
              <Link
                to="/upload"
                className={`py-2 transition-colors ${
                  location.pathname === "/upload"
                    ? "text-foreground font-medium"
                    : "text-foreground/60"
                }`}
              >
                Upload
              </Link>
              {isAuthenticated && (
                <Link
                  to="/admin"
                  className={`py-2 transition-colors flex items-center gap-2 ${
                    location.pathname === "/admin"
                      ? "text-foreground font-medium"
                      : "text-foreground/60"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              
              <div className="mt-auto pt-6 border-t">
                {!isLoading && (
                  isAuthenticated ? (
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate("/auth")}
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </Button>
                  )
                )}
                
                <Button
                  asChild
                  className="w-full mt-4 gap-2"
                >
                  <Link to="/upload">
                    <UploadIcon className="h-5 w-5" />
                    Upload Document
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
