
import React from "react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import AudioRecorder from "@/components/AudioRecorder";

interface MediaUploaderProps {
  images: string[];
  setImages: (images: string[]) => void;
  voiceMemo: string;
  setVoiceMemo: (voiceMemo: string) => void;
  isUpdating: boolean;
  onUpdate: () => Promise<void>;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  images,
  setImages,
  voiceMemo,
  setVoiceMemo,
  isUpdating,
  onUpdate
}) => {
  return (
    <div className="mt-8 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Add or Update Images</h3>
        <FileUpload
          onUpload={setImages}
          maxFiles={5}
          accept="image/*"
          label="Upload Images"
          description="Drag and drop images or click to browse"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Record Voice Message</h3>
        <AudioRecorder 
          onRecorded={setVoiceMemo} 
          maxTime={120}
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
