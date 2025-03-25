
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { MessageSquare, Video, FileAudio, Image, Check, Shield } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Automatically redirect admins to the admin dashboard
  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  // If user is logged in, show appropriate dashboard
  if (user) {
    return (
      <div className="px-4 py-12 max-w-5xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-medical-primary to-teal-600">
            {t('welcomeBack')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('continueJourney')}
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
                  <span className="font-medium">{t('viewMyConsultations')}</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              <Link
                to="/new-consultation"
                className="flex items-center justify-between bg-medical-primary text-white rounded-lg shadow p-6 hover:shadow-md transition-shadow w-full"
              >
                <div className="flex items-center">
                  <span className="font-medium">{t('createNewConsultation')}</span>
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
                  <span className="font-medium">{t('availableConsultations')}</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          )}

          {user.role === UserRole.ADMIN && (
            <div className="space-y-4 w-full max-w-md">
              <Link
                to="/admin/dashboard"
                className="flex items-center justify-between bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow w-full"
              >
                <div className="flex items-center">
                  <Shield className="text-medical-primary mr-4" size={24} />
                  <span className="font-medium">{t('adminDashboard')}</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              <Link
                to="/admin/doctors"
                className="flex items-center justify-between bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow w-full"
              >
                <div className="flex items-center">
                  <MessageSquare className="text-medical-primary mr-4" size={24} />
                  <span className="font-medium">{t('myConsultations')}</span>
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
            {t('welcome')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('homePageMessage')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 rounded-md bg-medical-primary text-white font-medium hover:opacity-90 transition-opacity"
            >
              {t('getStarted')}
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-md border border-medical-primary text-medical-primary font-medium hover:bg-medical-secondary transition-colors"
            >
              {t('signIn')}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-medical-secondary rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="text-medical-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('myConsultations')}</h3>
            <p className="text-gray-600">
              {t('describeYourCondition')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-medical-secondary rounded-full flex items-center justify-center mb-4">
              <Video className="text-medical-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('videoCalls')}</h3>
            <p className="text-gray-600">
              {t('connectWithDoctors')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-medical-secondary rounded-full flex items-center justify-center mb-4">
              <FileAudio className="text-medical-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('voiceMemo')}</h3>
            <p className="text-gray-600">
              {t('recordVoiceDescription')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gray-50 -mx-4 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t('howItWorks')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mb-4 text-white text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">{t('createAccount')}</h3>
              <p className="text-gray-600">
                {t('signUpAsPatient')}
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mb-4 text-white text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">{t('submitConsultation')}</h3>
              <p className="text-gray-600">
                {t('describeSymptoms')}
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mb-4 text-white text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">{t('receiveMedicalAdvice')}</h3>
              <p className="text-gray-600">
                {t('doctorWillReview')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t('whyChooseDrOnline')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="w-6 h-6 bg-medical-primary rounded-full flex items-center justify-center">
                  <Check className="text-white" size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('accessToSpecializedCare')}</h3>
                <p className="text-gray-600">
                  {t('connectWithSpecialists')}
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
                <h3 className="text-lg font-semibold mb-2">{t('safeAndSecure')}</h3>
                <p className="text-gray-600">
                  {t('allMedicalInformation')}
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
                <h3 className="text-lg font-semibold mb-2">{t('noTravelRequired')}</h3>
                <p className="text-gray-600">
                  {t('getMedicalAdvice')}
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
                <h3 className="text-lg font-semibold mb-2">{t('multimediaSupport')}</h3>
                <p className="text-gray-600">
                  {t('uploadImages')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-medical-primary text-white -mx-4 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t('readyToGetStarted')}</h2>
          <p className="text-xl mb-8 opacity-90">
            {t('joinOurPlatform')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 rounded-md bg-white text-medical-primary font-medium hover:bg-opacity-90 transition-opacity"
            >
              {t('createAccount')}
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-md border border-white text-white font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              {t('signIn')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
