
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { User, UserRole } from "@/types";
import { X, User as UserIcon, MessageSquare, Plus, LayoutDashboard } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSwitchLanguage = () => {
    // In a real app, this would toggle between languages
    // For now, we'll just show a console message
    console.log("Switching language");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{user.fullName}</span>
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="p-4 flex flex-col h-[calc(100%-160px)]">
        {user.role === UserRole.PATIENT && (
          <>
            <Link
              to="/consultations"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
              onClick={onClose}
            >
              <MessageSquare size={20} />
              <span>My Consultations</span>
            </Link>
            <Link
              to="/new-consultation"
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-medical-primary text-white mt-2 hover:opacity-90"
              onClick={onClose}
            >
              <Plus size={20} />
              <span>New Consultation</span>
            </Link>
          </>
        )}

        {user.role === UserRole.DOCTOR && (
          <Link
            to="/doctor/consultations"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            onClick={onClose}
          >
            <MessageSquare size={20} />
            <span>Available Consultations</span>
          </Link>
        )}

        {user.role === UserRole.ADMIN && (
          <>
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
              onClick={onClose}
            >
              <LayoutDashboard size={20} />
              <span>Admin Dashboard</span>
            </Link>
            <Link
              to="/admin/doctors"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 mt-2"
              onClick={onClose}
            >
              <UserIcon size={20} />
              <span>Manage Doctors</span>
            </Link>
          </>
        )}

        <Link
          to="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 mt-2"
          onClick={onClose}
        >
          <UserIcon size={20} />
          <span>My Profile</span>
        </Link>
      </nav>

      <div className="absolute bottom-0 left-0 w-full p-4 border-t">
        <button
          onClick={handleSwitchLanguage}
          className="flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-gray-100 text-medical-primary mb-2"
        >
          <span className="text-sm">Switch to Arabic</span>
        </button>
        <Button
          variant="destructive"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full"
        >
          {isLoggingOut ? "Signing Out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
