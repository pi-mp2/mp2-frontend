// TestPlayerPage.tsx
import React, { useState } from "react";
import MoviePlayer from "../../components/video-components/VideoPlayer";

const TestPlayerPage: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");

    const testVideos = [
        {
            name: "Video Demo 1 (MP4)",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        },
        {
            name: "Video Demo 2 (MP4)", 
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        },
        {
            name: "Video Demo 3 (WebM)",
            url: "https://storage.googleapis.com/web-dev-assets/hands-on-js-web-apps/video/sintel-short.webm"
        }
    ];

    const subtitles = [
        {
            label: "Español",
            srcLang: "es",
            src: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.es.vtt"
        },
        {
            label: "English",
            srcLang: "en", 
            src: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt"
        }
    ];

    const handleTestVideo = (url: string) => {
        setVideoUrl(url);
        setCurrentUrl(url);
    };

    const handleCustomUrl = () => {
        if (videoUrl.trim()) {
            setCurrentUrl(videoUrl.trim());
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Reproductor de Pruebas</h1>
            
            {/* Input para URL personalizada */}
            <div className="mb-6 p-4 border rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Probar URL personalizada</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Pega aquí la URL de tu video..."
                        className="flex-1 p-2 border rounded"
                    />
                    <button 
                        onClick={handleCustomUrl}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Cargar
                    </button>
                </div>
            </div>

            {/* Videos de prueba predefinidos */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Videos de prueba</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {testVideos.map((video, index) => (
                        <button
                            key={index}
                            onClick={() => handleTestVideo(video.url)}
                            className="p-3 text-left border rounded hover:bg-gray-50"
                        >
                            <div className="font-medium">{video.name}</div>
                            <div className="text-sm text-gray-600 truncate">{video.url}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Reproductor */}
            {currentUrl && (
                <div className="border rounded-lg overflow-hidden">
                    <MoviePlayer
                        url={currentUrl}
                        title={`Reproduciendo: ${currentUrl.split('/').pop()}`}
                        subtitles={subtitles}
                    />
                </div>
            )}

            {!currentUrl && (
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                    <p className="text-gray-500">Selecciona un video de prueba o ingresa una URL</p>
                </div>
            )}
        </div>
    );
};

export default TestPlayerPage;