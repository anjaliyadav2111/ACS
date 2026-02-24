import { useEffect, useRef, useState, useCallback } from 'react';

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

interface YouTubePlayerOptions {
    videoId: string;
    width?: string | number;
    height?: string | number;
    playerVars?: any;
    events?: any;
}

export const useYouTubePlayer = (containerId: string, options: YouTubePlayerOptions) => {
    const playerRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        // Load YouTube IFrame API if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        const initPlayer = () => {
            if (!containerId || !options.videoId) return;

            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`YouTube Player: Container '${containerId}' not found, retrying...`);
                setTimeout(initPlayer, 100);
                return;
            }

            // Prevent duplicate initialization
            if (playerRef.current) return;

            console.log(`YouTube Player: Initializing for ${options.videoId} in ${containerId}`);

            try {
                playerRef.current = new window.YT.Player(containerId, {
                    width: options.width || '100%',
                    height: options.height || '100%',
                    videoId: options.videoId,
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                        fs: 0,
                        playsinline: 1,
                        origin: window.location.origin, // Safety for API
                        ...options.playerVars
                    },
                    events: {
                        onReady: (event: any) => {
                            console.log("YouTube Player: Ready");
                            setIsReady(true);
                            setDuration(event.target.getDuration());
                            if (options.playerVars?.mute === 1) {
                                event.target.mute();
                                setIsMuted(true);
                            }
                            if (options.events?.onReady) options.events.onReady(event);
                        },
                        onStateChange: (event: any) => {
                            const state = event.data;
                            setIsPlaying(state === 1);

                            if (state === 1) { // Playing
                                startProgressTracking();
                            } else {
                                stopProgressTracking();
                            }

                            if (options.events?.onStateChange) options.events.onStateChange(event);
                        },
                        onError: (event: any) => {
                            console.error("YouTube Player Error:", event.data);
                            if (options.events?.onError) options.events.onError(event);
                        }
                    }
                });
            } catch (err) {
                console.error("YouTube Player: Init failed", err);
            }
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            console.log("YouTube Player: Waiting for API...");
            // If API is loading, wait for it
            const existingOnReady = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (existingOnReady) existingOnReady();
                initPlayer();
            };
        }

        return () => {
            stopProgressTracking();
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [containerId, options.videoId]); // Re-init if wrapper or video ID changes

    const startProgressTracking = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        progressInterval.current = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                setCurrentTime(playerRef.current.getCurrentTime());
            }
        }, 1000);
    };

    const stopProgressTracking = () => {
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
        }
    };

    const playVideo = useCallback(() => {
        playerRef.current?.playVideo();
    }, []);

    const pauseVideo = useCallback(() => {
        playerRef.current?.pauseVideo();
    }, []);

    const mute = useCallback(() => {
        playerRef.current?.mute();
        setIsMuted(true);
    }, []);

    const unMute = useCallback(() => {
        playerRef.current?.unMute();
        setIsMuted(false);
    }, []);

    const seekTo = useCallback((seconds: number) => {
        playerRef.current?.seekTo(seconds, true);
        setCurrentTime(seconds);
    }, []);

    return {
        player: playerRef.current,
        isReady,
        isPlaying,
        isMuted,
        duration,
        currentTime,
        playVideo,
        pauseVideo,
        mute,
        unMute,
        seekTo
    };
};
