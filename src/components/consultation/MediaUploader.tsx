
import React from "react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import AudioRecorder from "@/components/AudioRecorder";
import { ConsultationStatus } from "@/types";

interface MediaUploaderProps {
  images: string[];
  setImages: (images: string[]) => void;
  voiceMemo: string;
  setVoiceMemo: (voiceMemo: string) => void;
  isUpdating: boolean;
  onUpdate: () => Promise<void>;
  consultationStatus?: ConsultationStatus;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  images,
  setImages,
  voiceMemo,
  setVoiceMemo,
  isUpdating,
  onUpdate,
  consultationStatus = ConsultationStatus.IN_PROGRESS
}) => {
  const isPending = consultationStatus === ConsultationStatus.PENDING;
  
  return (
    <div className="mt-8 mb-6 space-y-6 bg-white rounded-lg shadow-sm overflow-hidden p-6">
      <h2 className="text-xl font-semibold">
        {isPending ? "Update Consultation Information" : "Add Additional Information"}
      </h2>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Images</h3>
        <FileUpload
          onUpload={setImages}
          maxFiles={5}
          accept="image/*"
          label="Upload Images"
          description="Drag and drop images or click to browse"
          initialFiles={images}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Voice Message</h3>
        <AudioRecorder 
          onRecorded={setVoiceMemo} 
          maxTime={120}
          initialAudio={voiceMemo}
        />
      </div>
      
      <Button 
        onClick={onUpdate} 
        disabled={isUpdating}
        className="bg-medical-primary hover:opacity-90"
      >
        {isUpdating ? "Updating..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default MediaUploader;
