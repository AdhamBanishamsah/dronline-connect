
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import Sidebar from "./Sidebar";

const Header: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            {user && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="mr-4 text-gray-600 hover:text-gray-900"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            )}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-medical-primary to-teal-600">
                DrOnline
              </span>
            </Link>
          </div>

          {!user && (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="py-2 px-4 rounded-md text-medical-primary border border-medical-primary hover:bg-medical-secondary transition-colors"
              >
                {t('signIn')}
              </Link>
              <Link
                to="/register"
                className="py-2 px-4 rounded-md bg-medical-primary text-white hover:opacity-90 transition-opacity"
              >
                {t('signUp')}
              </Link>
            </div>
          )}
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
