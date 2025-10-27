import React, { useRef, useState, useInsertionEffect, useEffect } from "react";
import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { Play, Pause, Maximize, VolumeX, Volume2, Settings, SkipBack, SkipForward, Subtitles } from "lucide-react";

const cld = new Cloudinary({
    cloud: {
        cloudName: 'dkpvfxjfj'
    }
});

interface SubtitleTrack {
    id: string;
    label: string;
    src: string;
    srcLang: string;
}

interface CloudinaryMoviePlayerProps {
    title: string;
    videoUrl: string;
    duration?: number;
    subtitles?: SubtitleTrack[];
    quality?: '480' | '720' | '1080' | 'auto';
}

const extractPublicIdFromUrl = (url: string): string => {
    try {
        // Ejemplo: https://res.cloudinary.com/tu-cloud/video/upload/v1234567/users/user_123/movies/avengers-endgame.mp4
        // Resultado: users/user_123/movies/avengers-endgame
        
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        
        // Encontrar el índice después de "upload"
        const uploadIndex = pathParts.indexOf('upload');
        if (uploadIndex === -1) return url; // Fallback
        
        // Tomar todo después de "upload" y antes de la extensión
        const relevantParts = pathParts.slice(uploadIndex + 1);
        const fullPath = relevantParts.join('/');
        
        // Remover la extensión del archivo
        return fullPath.replace(/\.(mp4|webm|mov|avi)$/i, '');
    } catch (error) {
        console.warn('Error extracting Cloudinary publicId, using original URL:', error);
        return url; // Fallback a URL original
    }
};


const CloudinaryMoviePlayer: React.FC<CloudinaryMoviePlayerProps> = ({
    title,
    videoUrl,
    duration = 120,
    subtitles = [],
    quality = 'auto'
}) => {
    const publicId = extractPublicIdFromUrl(videoUrl);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [videoDuration, setVideoDuration] = useState(duration);

    const [showSubtitles, setShowSubtitles] = useState(false);
    const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
    const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);

    const cloudinaryVideo = cld.video(publicId)
        .quality(quality)
        .format('auto')
        .addFlag('streaming_attachment');

    useEffect(() =>{
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const handleTimeUpDate = () => {
            setCurrentTime(videoElement.currentTime);
        }

        const handleLoadedMetadata = () => {
            setVideoDuration(videoElement.duration);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        videoElement.addEventListener('timeupdate', handleTimeUpDate);
        videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.addEventListener('play', handlePlay);
        videoElement.addEventListener('pause', handlePause);

        return () => {
            videoElement.removeEventListener('timeupdate', handleTimeUpDate);
            videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoElement.removeEventListener('play', handlePlay);
            videoElement.removeEventListener('paste', handlePause);
        };
    }, []);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;

        const existingTracks = video.querySelectorAll('track');
        existingTracks.forEach(track => track.remove());

        subtitles.forEach((subtitle) => {
            const track = document.createElement('track');
            track.kind = 'subtitles';
            track.label = subtitle.label;
            track.srclang = subtitle.srcLang;
            track.src = subtitle.src;
            track.default = subtitle.id === activeSubtitle;

            video.appendChild(track);
        });

        if (video.textTracks) {
            for (let i = 0; i < video.textTracks.length; i++) {
                const track = video.textTracks[i];
                if(showSubtitles && track.label === activeSubtitle) {
                    track.mode = 'showing';
                } else {
                    track.mode = 'hidden';
                }
            }
        }
    }, [subtitles, activeSubtitle, showSubtitles]);


    const togglePlay = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };


    const toggleMute = () => {
        setIsMuted(!isMuted);
        if(videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };


    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };


    const toggleSubtitles = () => {
        if (subtitles.length === 0) return;

        if (!showSubtitles && subtitles.length > 0) {
            setActiveSubtitle(subtitles[0].id);
            setShowSubtitles(true);
        } else {
            setShowSubtitles(false);
            setActiveSubtitle(null);
        }
        setShowSubtitleMenu(false);
    };


    const selectSubtitle = (subtitleId: string) => {
        setActiveSubtitle(subtitleId);
        setShowSubtitles(true);
        setShowSubtitleMenu(false);
    };


    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs <10 ? '0' : ''}${secs}`;
    };


    const skip = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
        }
    };
    

    return (
    <div 
      ref={containerRef}
      className="movie-player bg-black rounded-lg overflow-hidden relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video de Cloudinary con AdvancedVideo */}
      <AdvancedVideo
        cldVid={cloudinaryVideo}
        ref={videoRef}
        controls={false} // Usamos nuestros controles personalizados
        className="w-full h-full"
        autoPlay={false}
        crossOrigin="anonymous"
      />

      {/* Overlay de controles (IGUAL que antes) */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        
        {/* Título superior */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <h1 className="text-white text-xl font-semibold">{title}</h1>
        </div>

        {/* Botones centrales */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => skip(-10)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <SkipBack size={32} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-all"
            >
              {isPlaying ? <Pause size={40} /> : <Play size={40} />}
            </button>
            
            <button 
              onClick={() => skip(10)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <SkipForward size={32} />
            </button>
          </div>
        </div>

        {/* Controles inferiores */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Barra de progreso */}
          <div className="flex items-center gap-3">
            <span className="text-white text-sm min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            
            <input
              type="range"
              min="0"
              max={videoDuration}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            
            <span className="text-white text-sm min-w-[40px]">
              {formatTime(videoDuration)}
            </span>
          </div>

          {/* Controles secundarios */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button 
                onClick={togglePlay}
                className="text-white hover:text-white/80 transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              {/* Volumen */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleMute}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>

              {/* Tiempo */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(videoDuration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Subtítulos */}
              {subtitles.length > 0 && (
                <div className="relative">
                  <button 
                    onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                    className={`text-white hover:text-white/80 transition-colors ${
                      showSubtitles ? 'text-blue-400' : ''
                    }`}
                  >
                    <Subtitles size={20} />
                  </button>

                  {/* Menú de subtítulos */}
                  {showSubtitleMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg py-2 min-w-[150px]">
                      <button
                        onClick={() => {
                          setShowSubtitles(false);
                          setActiveSubtitle(null);
                          setShowSubtitleMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                          !showSubtitles ? 'text-blue-400' : 'text-white'
                        }`}
                      >
                        Sin subtítulos
                      </button>
                      {subtitles.map((subtitle) => (
                        <button
                          key={subtitle.id}
                          onClick={() => selectSubtitle(subtitle.id)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                            activeSubtitle === subtitle.id ? 'text-blue-400' : 'text-white'
                          }`}
                        >
                          {subtitle.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pantalla completa */}
              <button 
                onClick={toggleFullscreen}
                className="text-white hover:text-white/80 transition-colors"
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Play overlay cuando está pausado */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 rounded-full p-6 transition-all backdrop-blur-sm"
          >
            <Play size={60} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}


export default CloudinaryMoviePlayer;