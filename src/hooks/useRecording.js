import { useState, useCallback } from 'react';

export const useRecording = ({
  recording,
  setRecording,
  recordingTimeElapsed,
  setRecordingTimeElapsed,
  recordingIntervalRef,
  canvasSize,
  getSortedElementsForExport,
  drawElementToCanvas,
  recordingDuration,
  videoQuality,
  videoFormat,
  preloadImages
}) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingStartTime, setRecordingStartTime] = useState(null);

  // Browser compatibility check - FIXED: Remove duplicate declaration
  const checkRecordingCompatibility = useCallback(() => {
    if (typeof MediaRecorder === 'undefined') {
      alert('Your browser does not support video recording. Please try Chrome, Firefox, or Edge.');
      return false;
    }
    
    const canvas = document.createElement('canvas');
    if (typeof canvas.captureStream !== 'function') {
      alert('Your browser does not support canvas recording. Please try Chrome or Firefox.');
      return false;
    }
    
    return true;
  }, []);

  // Enhanced startRecording function with MP4 support
  const startRecording = useCallback(async () => {
    try {
      if (recording) {
        console.log('Recording already in progress');
        return;
      }

      if (!checkRecordingCompatibility()) return;
      
      await preloadImages();
      
      setRecording(true);
      setRecordingStartTime(Date.now());
      setRecordingTimeElapsed(0);
      
      const canvas = document.createElement('canvas');
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      let stream;
      try {
        stream = canvas.captureStream(30);
      } catch (error) {
        console.error('Error capturing stream:', error);
        alert('Your browser does not support canvas recording. Please try Chrome or Firefox.');
        setRecording(false);
        setRecordingStartTime(null);
        return;
      }
      
      const getSupportedMimeType = () => {
        const mimeTypes = [
          'video/mp4;codecs=h264',
          'video/mp4;codecs=avc1.42E01E',
          'video/mp4;codecs=avc1.42801E',
          'video/webm;codecs=vp9',
          'video/webm;codecs=vp8',
          'video/webm'
        ];
        
        const preferredTypes = videoFormat === 'mp4' 
          ? mimeTypes.filter(type => type.includes('mp4'))
          : mimeTypes.filter(type => type.includes('webm'));
        
        const allTypes = [...preferredTypes, ...mimeTypes];
        
        for (let mimeType of allTypes) {
          if (MediaRecorder.isTypeSupported(mimeType)) {
            console.log('Supported MIME type:', mimeType);
            return mimeType;
          }
        }
        
        return null;
      };
      
      const mimeType = getSupportedMimeType();
      
      if (!mimeType) {
        alert('Your browser does not support any video recording formats. Please try Chrome.');
        setRecording(false);
        setRecordingStartTime(null);
        return;
      }
      
      const options = { mimeType };
      
      switch(videoQuality) {
        case 'low':
          options.videoBitsPerSecond = 1000000;
          break;
        case 'medium':
          options.videoBitsPerSecond = 2500000;
          break;
        case 'high':
        default:
          options.videoBitsPerSecond = 5000000;
          break;
      }
      
      const recorder = new MediaRecorder(stream, options);
      
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        try {
          if (chunks.length === 0) {
            console.warn('No data recorded');
            return;
          }

          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          
          let extension = 'webm';
          if (mimeType.includes('mp4')) {
            extension = 'mp4';
          } else if (videoFormat === 'gif') {
            extension = 'gif';
          }
          
          a.download = `sowntra-animation-${new Date().getTime()}.${extension}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          console.log('Recording saved successfully');
        } catch (error) {
          console.error('Error creating download:', error);
          alert('Error creating video file. Please try again.');
        } finally {
          setRecording(false);
          setRecordingStartTime(null);
          setRecordingTimeElapsed(0);
          setMediaRecorder(null);
          if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = null;
          }
        }
      };
      
      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        alert('Error during recording: ' + event.error.message);
        setRecording(false);
        setRecordingStartTime(null);
        setRecordingTimeElapsed(0);
        setMediaRecorder(null);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
          recordingIntervalRef.current = null;
        }
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTimeElapsed(prev => prev + 1);
      }, 1000);
      
      let startTime = null;
      const frameDuration = 1000 / 30;
      let lastFrameTime = 0;
      let animationId = null;
      
      const drawAnimationFrame = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        if (recorder.state === 'recording') {
          if (timestamp - lastFrameTime >= frameDuration) {
            lastFrameTime = timestamp;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const sortedElements = getSortedElementsForExport();
            
            sortedElements.forEach((element, index) => {
              const animationProgress = (elapsed / 1000) % recordingDuration;
              drawElementToCanvas(ctx, element, animationProgress, index);
            });
          }
          
          animationId = requestAnimationFrame(drawAnimationFrame);
        }
      };
      
      animationId = requestAnimationFrame(drawAnimationFrame);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error starting recording: ' + error.message);
      setRecording(false);
      setRecordingStartTime(null);
      setRecordingTimeElapsed(0);
      setMediaRecorder(null);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  }, [recording, canvasSize, drawElementToCanvas, recordingDuration, videoQuality, checkRecordingCompatibility, preloadImages, videoFormat, getSortedElementsForExport, setRecording, setRecordingStartTime, setRecordingTimeElapsed, setMediaRecorder, recordingIntervalRef]);

  // Stop recording
  const stopRecording = useCallback(() => {
    console.log('Stop recording called, state:', mediaRecorder?.state);
    
    if (!recording) {
      console.log('Not currently recording');
      return;
    }

    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('Stopping media recorder');
      mediaRecorder.stop();
    } else {
      setRecording(false);
      setRecordingStartTime(null);
      setRecordingTimeElapsed(0);
      setMediaRecorder(null);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  }, [mediaRecorder, recording, setRecording, setRecordingStartTime, setRecordingTimeElapsed, setMediaRecorder, recordingIntervalRef]);

  return {
    mediaRecorder,
    setMediaRecorder,
    recordingStartTime,
    setRecordingStartTime,
    startRecording,
    stopRecording,
    preloadImages: useCallback(() => preloadImages(), [preloadImages]),
    checkRecordingCompatibility
  };
};