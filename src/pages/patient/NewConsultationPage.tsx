
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useConsultations } from "@/context/ConsultationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUpload from "@/components/FileUpload";
import AudioRecorder from "@/components/AudioRecorder";
import { ArrowLeft } from "lucide-react";
import { consultationService } from "@/services/consultationService";
import { DiseaseSelectOption } from "@/types/disease";
import { useLanguage } from "@/context/LanguageContext";

const NewConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { createConsultation, isLoading } = useConsultations();
  const { t, language } = useLanguage();

  const [diseaseId, setDiseaseId] = useState("");
  const [diseaseOptions, setDiseaseOptions] = useState<DiseaseSelectOption[]>([]);
  const [description, setDescription] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [voiceMemo, setVoiceMemo] = useState("");
  const [error, setError] = useState("");
  const [isLoadingDiseases, setIsLoadingDiseases] = useState(true);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setIsLoadingDiseases(true);
        const diseases = await consultationService.getAllDiseases();
        const options = diseases.map(disease => ({
          value: disease.id,
          label: language === 'ar' ? disease.name_ar : disease.name_en
        }));
        setDiseaseOptions(options);
      } catch (error) {
        console.error("Failed to load diseases:", error);
        setError(t('failedToLoadDiseases'));
      } finally {
        setIsLoadingDiseases(false);
      }
    };

    fetchDiseases();
  }, [language, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!diseaseId) {
      setError(t('pleaseSelectDisease'));
      return;
    }

    if (!description) {
      setError(t('pleaseProvideDescription'));
      return;
    }

    try {
      await createConsultation({
        diseaseId,
        description,
        symptoms,
        images: images.length > 0 ? images : undefined,
        voiceMemo: voiceMemo || undefined,
      });
      navigate("/consultations");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(t('failedToCreateConsultation'));
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/consultations" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t('newConsultation')}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/consultations")}
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-medical-primary hover:opacity-90"
            disabled={isLoading || isLoadingDiseases}
          >
            {isLoading ? t('submitting') : t('submitConsultation')}
          </Button>
        </div>
      </div>

      <p className="text-gray-600 mb-8">
        {t('startNewConsultation')}
      </p>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="disease">{t('diseaseOrHealthCondition')}</Label>
            {isLoadingDiseases ? (
              <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
            ) : (
              <Select value={diseaseId} onValueChange={setDiseaseId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectDiseaseOrHealthCondition')} />
                </SelectTrigger>
                <SelectContent>
                  {diseaseOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              placeholder={t('describeYourCondition')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptoms">{t('symptoms')}</Label>
            <Input
              id="symptoms"
              placeholder={t('enterYourSymptoms')}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('uploadImagesOptional')}</Label>
            <p className="text-sm text-gray-500 mb-2">
              {t('addPhotosRelatedToCondition')}
            </p>
            <FileUpload
              onUpload={setImages}
              label={t('uploadImages')}
              description={t('dragAndDropImageFiles')}
              maxFiles={5}
              accept="image/*"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('voiceMemoOptional')}</Label>
            <p className="text-sm text-gray-500 mb-2">
              {t('recordVoiceDescription')}
            </p>
            <AudioRecorder onRecorded={setVoiceMemo} maxTime={60} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewConsultationPage;
