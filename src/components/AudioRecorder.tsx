
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Trash } from "lucide-react";

interface AudioRecorderProps {
  onRecorded: (audioUrl: string) => void;
  maxTime?: number; // in seconds
  initialAudio?: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecorded, 
  maxTime = 60,
  initialAudio = ""
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>(initialAudio);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialAudio && !audioUrl) {
      setAudioUrl(initialAudio);
    }
  }, [initialAudio, audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecorded(url);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prevTime => {
          const newTime = prevTime + 1;
          // If max time reached, stop recording
          if (newTime >= maxTime) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access your microphone. Please check your settings and try again.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
      onRecorded("");
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-4">
      {!audioUrl ? (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex flex-col items-center space-y-4">
            {isRecording ? (
              <>
                <div className="text-lg font-medium text-red-500 animate-pulse">
                  Recording... {formatTime(recordingTime)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(recordingTime / maxTime) * 100}%` }}
                  ></div>
                </div>
                <Button 
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Square size={16} className="mr-2" />
                  Stop Recording
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-center mb-4">
                  Record a voice message explaining your symptoms or concerns.
                  <br />
                  Maximum recording time: {formatTime(maxTime)}
                </p>
                <Button 
                  onClick={startRecording}
                  className="bg-medical-primary hover:opacity-90"
                >
                  <Mic size={16} className="mr-2" />
                  Start Recording
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex flex-col space-y-4">
            <p className="text-gray-700 font-medium">Voice Message:</p>
            <audio controls src={audioUrl} className="w-full"></audio>
            <Button 
              onClick={deleteRecording}
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              <Trash size={16} className="mr-2" />
              Delete Recording
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
