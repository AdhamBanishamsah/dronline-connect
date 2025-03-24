
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { MessageSquare, Video, FileAudio, Image, Check } from "lucide-react";

const HomePage: React.FC = () => {
  const { user } = useAuth();

  // If user is logged in, redirect to appropriate page
  if (user) {
    return (
      <div className="px-4 py-12 max-w-5xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-medical-primary to-teal-600">
            Welcome back to DrOnline
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Continue your health journey with us. Access your dashboard to manage your consultations.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          {user.role === UserRole.PATIENT && (
            <div className="space-y-4 w-full max-w-md">
              <Link
                to="/consultations"
                className="flex items-center justify-between bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow w-full"
              >
                <div className="flex items-center">
                  <MessageSquare className="text-medical-primary mr-4" size={24} />
                  <span className="font-medium">View My Consultations</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              <Link
                to="/new-consultation"
                className="flex items-center justify-between bg-medical-primary text-white rounded-lg shadow p-6 hover:shadow-md transition-shadow w-full"
              >
                <div className="flex items-center">
                  <span className="font-medium">Create New Consultation</span>
                </div>
                <span>→</span>
              </Link>
            </div>
          )}

          {user.role === UserRole.DOCTOR && (
            <div className="space-y-4 w-full max-w-md">
              <Link
                to="/doctor/consultations"
                className="flex items-center justify-between bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow w-full"
              >
                <div className="flex items-center">
                  <MessageSquare className="text-medical-primary mr-4" size={24} />
                  <span className="font-medium">View Available Consultations</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          )}

          {user.role === UserRole.ADMIN && (
            <div className="space-y-4 w-full max-w-md">
              <Link
                to="/admin/doctors"
                className="flex items-center justify-between bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow w-full"
              >
                <div className="flex items-center">
                  <MessageSquare className="text-medical-primary mr-4" size={24} />
                  <span className="font-medium">Manage Doctor Approvals</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 animate-fade-in">
      <section className="py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-medical-primary to-teal-600">
            Online Medical Consultations for Gaza
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with healthcare professionals remotely and receive quality medical advice and consultations from the safety of your home.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 rounded-md bg-medical-primary text-white font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-md border border-medical-primary text-medical-primary font-medium hover:bg-medical-secondary transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-medical-secondary rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="text-medical-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Text Consultations</h3>
            <p className="text-gray-600">
              Describe your symptoms, upload relevant images, and get professional medical advice through secure text-based consultations.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-medical-secondary rounded-full flex items-center justify-center mb-4">
              <Video className="text-medical-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Video Calls</h3>
            <p className="text-gray-600">
              Connect with doctors through secure video calls for a more personal consultation experience when needed.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-medical-secondary rounded-full flex items-center justify-center mb-4">
              <FileAudio className="text-medical-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Voice Memos</h3>
            <p className="text-gray-600">
              Record voice descriptions of your symptoms when typing is difficult or to provide more detailed explanations.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gray-50 -mx-4 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mb-4 text-white text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600">
                Sign up as a patient to access medical consultations or as a doctor to provide healthcare services.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mb-4 text-white text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Submit a Consultation</h3>
              <p className="text-gray-600">
                Describe your symptoms, upload medical images, or record a voice memo explaining your condition.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mb-4 text-white text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Receive Medical Advice</h3>
              <p className="text-gray-600">
                A qualified doctor will review your case and provide medical advice, prescriptions, or recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose DrOnline</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="w-6 h-6 bg-medical-primary rounded-full flex items-center justify-center">
                  <Check className="text-white" size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Access to Specialized Care</h3>
                <p className="text-gray-600">
                  Connect with specialists who may not be available locally, especially during crisis situations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="w-6 h-6 bg-medical-primary rounded-full flex items-center justify-center">
                  <Check className="text-white" size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Safe and Secure</h3>
                <p className="text-gray-600">
                  All your medical information and consultations are protected with the highest security standards.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="w-6 h-6 bg-medical-primary rounded-full flex items-center justify-center">
                  <Check className="text-white" size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No Travel Required</h3>
                <p className="text-gray-600">
                  Get medical advice without leaving your home, particularly valuable during emergencies or restrictions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="w-6 h-6 bg-medical-primary rounded-full flex items-center justify-center">
                  <Check className="text-white" size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Multimedia Support</h3>
                <p className="text-gray-600">
                  Upload images, record voice memos, and use video calls for more comprehensive consultations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-medical-primary text-white -mx-4 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our platform today and connect with healthcare professionals remotely.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 rounded-md bg-white text-medical-primary font-medium hover:bg-opacity-90 transition-opacity"
            >
              Create an Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-md border border-white text-white font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
