
import React, { useState, useRef } from "react";
import { Mic, Square, Play, Trash } from "lucide-react";

interface AudioRecorderProps {
  onRecorded: (audioUrl: string) => void;
  maxTime?: number; // in seconds
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecorded, maxTime = 60 }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecorded(url);
        audioChunksRef.current = [];
        
        // Stop all tracks in the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prevTime => {
          // If we've reached max time, stop recording
          if (prevTime >= maxTime - 1) {
            stopRecording();
            return maxTime;
          }
          return prevTime + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access your microphone. Please check your browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      onRecorded("");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      {audioUrl ? (
        <div className="flex flex-col space-y-3">
          <audio 
            ref={audioRef} 
            src={audioUrl} 
            onEnded={() => setPlaying(false)} 
            className="hidden"
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={playing ? () => {
                audioRef.current?.pause();
                setPlaying(false);
              } : playAudio}
              className="flex items-center justify-center bg-medical-primary text-white rounded-full w-10 h-10"
            >
              {playing ? <Square size={16} /> : <Play size={16} />}
            </button>
            <div className="text-sm text-gray-500">Recorded message</div>
            <button
              type="button"
              onClick={resetRecording}
              className="flex items-center justify-center bg-red-100 text-red-500 rounded-full w-10 h-10"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              className={`flex items-center justify-center ${
                recording ? "bg-red-500" : "bg-medical-primary"
              } text-white rounded-full w-12 h-12`}
            >
              {recording ? <Square size={20} /> : <Mic size={20} />}
            </button>
            <div className="text-sm">
              {recording ? (
                <div className="flex items-center">
                  <span className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-red-500 font-medium">Recording: {formatTime(recordingTime)}</span>
                </div>
              ) : (
                <span className="text-gray-500">Tap to record (max {formatTime(maxTime)})</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
