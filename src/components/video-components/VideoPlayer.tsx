import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Play, Pause, Maximize2, Captions } from "lucide-react";


interface SubtitleTrack {
    label: string;
    src: string;
    srcLang: string;
}

interface MoviePlayerProps {
    url: string;
    title?: string;
    subtitles?: SubtitleTrack[];
}

interface ProgressState {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
}

const MoviePlayer: React.FC<MoviePlayerProps> = ({url, title, subtitles = []}) => {
    const playerRef = useRef<ReactPlayer>(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showSubtitles, setShowSubtitles] = useState(false);
    const [activeLang, setActiveLang] = useState<string | null>(null);
    const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
    const [ready, setReady] = useState(false);
    const [error, setError] =useState<string | null>(null);

    console.log("url recibida:", url);
    console.log("Estado ready:", ready);

    const togglePlay = () => {
        if (ready){
            setPlaying(!playing);
        }
    }

    const handleProgress = (state: ProgressState) => {
        console.log("Progreso: ", state);
        setProgress(state.played);

        if (state.loadedSeconds > 0 && duration === 0) {
            setDuration(state.loadedSeconds)
        }
    };

    const handleReady = () => {
        console.log("Video listo")
        setReady(true);
        setError(null);
        if (playerRef.current) {
            const internalPlayer = playerRef.current.getInternalPlayer();
            console.log("Reproductor interno:", internalPlayer); // ← Debug
        }
    }

    const handleError = (error: any, data?: any) => {
        console.error("❌ Error en video:", error, data); // ← Debug
        setError(`Error cargando video: ${error?.message || 'Error desconocido'}`);
        setReady(false);
    };

    const handleStart = () => {
        console.log("🎬 Video iniciado"); // ← Debug
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);
        playerRef.current?.seekTo(newProgress, "fraction");
    };

    const handleFullscreen = () => {
        const elem = document.getElementById("video-container");
        if (elem?.requestFullscreen) elem.requestFullscreen();
    };

    useEffect(() => {
        const video = document.querySelector("#video-container video") as HTMLVideoElement;
        if (!video) return;
        const tracks = video.textTracks;
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].mode =
                showSubtitles && tracks[i].language === activeLang ? "showing" : "hidden";
        }
    }, [showSubtitles, activeLang]);

    return (
        <div className="movie-player">
            {title && <h2 className="movie-title">{title}</h2>}

            {/* Mostrar error si existe */}
            {error && (
                <div className="error-message" style={{
                    background: '#fee', 
                    color: '#c33', 
                    padding: '10px', 
                    borderRadius: '4px',
                    marginBottom: '10px'
                }}>
                    ❌ {error}
                </div>
            )}

            <div id="video-container" className="video-container">
                <ReactPlayer
                    ref={playerRef}
                    url={url}
                    playing={playing && ready}
                    controls={false}
                    width="100%"
                    height="100%"
                    onProgress={handleProgress as any}
                    onReady={handleReady}
                    onStart={handleStart}
                    config={{
                        file: {
                            attributes: {crossOrigin: "anonymous",
                                preload: "metadata"
                            },
                            tracks: subtitles.map((track) => ({
                                kind: "subtitles",
                                src: track.src,
                                srcLang: track.srcLang,
                                label: track.label,
                            })),
                        },
                    } as any}
                />

                {!ready && !error && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '8px'
                    }}>
                        ⏳ Cargando video...
                    </div>
                )}

                {/* Botón central */}
                <button onClick={togglePlay} className="play-btn" disabled={!ready}>
                    {playing ? <Pause size={60}/> : <Play size={60}/>}
                </button>

                {/* Controles */}
                <div className="controls">
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step="any"
                        value={progress}
                        onChange={handleSeek}
                        className="progress-bar"
                    />

                    {subtitles.length > 0 && (
                        <div className="subtitle-container">
                            <button
                                className={`subtitle-btn ${showSubtitles ? "active" : ""}`}
                                onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                                title="Subtítulos"
                            >
                                <Captions size={22}/>
                            </button>

                            {showSubtitleMenu && (
                                <div className="subtitle-menu">
                                    <button
                                        onClick={() => {
                                            setShowSubtitles(false);
                                            setShowSubtitleMenu(false);
                                        }}
                                    >
                                        Sin subtítulos
                                    </button>
                                    {subtitles.map((track) => (
                                        <button
                                            key={track.srcLang}
                                            className={activeLang === track.srcLang ? "active" : ""}
                                            onClick={() => {
                                                setActiveLang(track.srcLang);
                                                setShowSubtitleMenu(true);
                                                setShowSubtitles(true);
                                            }}
                                        >
                                            {track.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <button className="fullscreen-btn" onClick={handleFullscreen}>
                        <Maximize2 size={22}/>
                    </button>
                </div>
            </div>

            <p className="time">
                {Math.floor(progress * duration)}s / {Math.floor(duration)}s
            </p>
        </div>
    )
}

export default MoviePlayer;