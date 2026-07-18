import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: #000;
  border-radius: 12px;
  overflow: hidden;
`;

const VideoElement = styled.video`
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  background-color: #000;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${PlayerContainer}:hover & {
    opacity: 1;
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
`;

const Progress = styled.div`
  height: 100%;
  background-color: var(--primary);
  border-radius: 2px;
  width: ${({ progress }) => progress}%;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

const TimeDisplay = styled.span`
  color: white;
  font-size: 0.8rem;
  font-family: monospace;
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
  }
`;

const FullscreenButton = styled(ControlButton)`
  margin-left: auto;
`;

const VideoPlayer = ({ src, poster, onEnded }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / duration) * 100);
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('durationchange', () => setDuration(video.duration));
    video.addEventListener('ended', onEnded);
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('durationchange', () => setDuration(video.duration));
      video.removeEventListener('ended', onEnded);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [duration, onEnded]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    if (!video) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
    setProgress(pos * 100);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <PlayerContainer 
      onClick={() => setShowControls(!showControls)}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <VideoElement
        ref={videoRef}
        src={src}
        poster={poster}
        controls={false}
        playsInline
        onClick={togglePlay}
      />
      
      <Controls style={{ opacity: showControls ? 1 : 0 }}>
        <ControlButton onClick={togglePlay}>
          {isPlaying ? '❚❚' : '▶'}
        </ControlButton>
        <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
        <ProgressBar onClick={handleProgressClick}>
          <Progress progress={progress} />
        </ProgressBar>
        <TimeDisplay>{formatTime(duration)}</TimeDisplay>
        <VolumeControl>
          <ControlButton onClick={toggleMute}>
            {isMuted || volume === 0 ? '🔇' : volume > 0.5 ? '🔊' : '🔈'}
          </ControlButton>
          <VolumeSlider
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
          />
        </VolumeControl>
        <FullscreenButton onClick={toggleFullscreen}>⛶</FullscreenButton>
      </Controls>
      
      {!isPlaying && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '3rem',
          color: 'white',
          opacity: 0.8,
          cursor: 'pointer'
        }} onClick={togglePlay}>
          ▶
        </div>
      )}
    </PlayerContainer>
  );
};

export default VideoPlayer;
