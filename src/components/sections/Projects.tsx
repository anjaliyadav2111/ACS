import clsx from 'clsx';
import { type WheelEvent, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface Video {
    id: number;
    youtube_url?: string;
    link?: string;
    url?: string;
    video_link?: string;
    video_url?: string;
    Title?: string;
    [key: string]: unknown;
}

const PORTFOLIO_SLOTS = 6;
const EMBED_PARAMS = 'rel=0&modestbranding=1&playsinline=1';

const portfolioStyles = `
.portfolio-section {
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior-y: contain;
  --portfolio-gap-x: clamp(1.35rem, 1.7vw, 1.9rem);
  --portfolio-gap-y: clamp(2rem, 3.2vh, 3rem);
  --portfolio-grid-max: 56rem;
}

.portfolio-layout {
  width: min(100%, 88rem);
  margin-inline: auto;
  padding-inline: clamp(1rem, 2.1vw, 2.5rem);
  padding-top: clamp(6.5rem, 11vh, 8.25rem);
  padding-bottom: clamp(2.5rem, 7vh, 4.5rem);
  min-height: calc(100vh + clamp(10rem, 17vh, 14rem));
  display: flex;
  flex-direction: column;
  align-items: center;
  --frame-white: rgba(255, 255, 255, 0.9);
  --frame-white-soft: rgba(255, 255, 255, 0.66);
  --frame-highlight: rgba(255, 255, 255, 0.22);
  --divider-white-edge: rgba(255, 255, 255, 0.08);
  --divider-white-mid: rgba(255, 255, 255, 0.9);
  --divider-white-strong: rgba(255, 255, 255, 1);
  --card-radius: clamp(0.75rem, 1vw, 1.15rem);
}

.portfolio-title {
  margin: 0;
  white-space: nowrap;
  font-family: 'Retroica', system-ui, sans-serif !important;
  font-size: clamp(2.1rem, 3.1vw, 2.85rem);
  line-height: 1.04;
  font-weight: 700;
  letter-spacing: 0.01em;  
  color: #FEFEFA !important;
  text-transform: lowercase;
  text-shadow:
    0 0.125rem 0 #FFA500,
    0 0.375rem 0.75rem rgba(255, 165, 0, 0.62),
    0 0 1.125rem rgba(255, 165, 0, 0.48) !important;
  filter:
    drop-shadow(0 0.125rem 0.3125rem rgba(0, 0, 0, 0.2))
    drop-shadow(0 0.3125rem 0.5rem rgba(255, 165, 0, 0.42));
}

.portfolio-divider {
  width: clamp(19rem, 36vw, 34rem);
  height: 2px;
  margin-top: clamp(0.4rem, 0.85vh, 0.65rem);
  margin-bottom: clamp(1.5rem, 3.2vh, 2.3rem);
  border-radius: 9999px;
  background: linear-gradient(90deg,
      var(--divider-white-edge) 0%,
      var(--divider-white-mid) 10%,
      var(--divider-white-strong) 50%,
      var(--divider-white-mid) 90%,
      var(--divider-white-edge) 100%);
  box-shadow: 0 0 0.45rem rgba(255, 255, 255, 0.28);
}

.portfolio-grid {
  width: min(100%, var(--portfolio-grid-max));
  margin-inline: auto;
  box-sizing: border-box;
  padding-inline: var(--portfolio-gap-x);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--portfolio-gap-x);
  row-gap: var(--portfolio-gap-y);
  align-content: start;
}

.portfolio-card {
  position: relative;
  aspect-ratio: 4 / 3;
  width: 100%;
  border: 0.125rem solid var(--frame-white);
  border-radius: var(--card-radius);
  box-shadow:
    0 0.375rem 0.9rem rgba(0, 0, 0, 0.14),
    0 0 0.35rem var(--frame-highlight),
    0 0 1rem rgba(255, 255, 255, 0.18);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  isolation: isolate;
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background-color 220ms ease;
}

.portfolio-card:hover {
  transform: translateY(-0.1rem);
  border-color: var(--divider-white-strong);
  box-shadow:
    0 0.5rem 1.05rem rgba(0, 0, 0, 0.18),
    0 0 0.45rem rgba(255, 255, 255, 0.3),
    0 0 1.25rem rgba(255, 255, 255, 0.24);
}

.portfolio-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 2;
  border: 0.09rem solid var(--frame-white-soft);
  box-shadow:
    inset 0 0 0.18rem rgba(255, 255, 255, 0.48),
    inset 0 0 1rem rgba(255, 255, 255, 0.14),
    0 0 1.05rem rgba(255, 255, 255, 0.24);
}

.portfolio-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 2;
  background:
    linear-gradient(150deg,
      rgba(255, 255, 255, 0.26) 0%,
      rgba(255, 255, 255, 0.12) 18%,
      rgba(255, 255, 255, 0.02) 36%,
      rgba(255, 255, 255, 0) 58%),
    radial-gradient(120% 85% at 50% -18%,
      rgba(255, 255, 255, 0.24) 0%,
      rgba(255, 255, 255, 0) 62%),
    radial-gradient(110% 92% at 50% 118%,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0) 68%);
  opacity: 0.82;
}

.portfolio-card iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  z-index: 1;
}

.portfolio-card-placeholder {
  width: 100%;
  height: 100%;
}

@media (max-width: 63.9375rem) {
  .portfolio-section {
    --portfolio-gap-x: clamp(1.1rem, 2.1vw, 1.45rem);
    --portfolio-gap-y: clamp(1.7rem, 3.4vh, 2.4rem);
    --portfolio-grid-max: 42rem;
  }

  .portfolio-layout {
    width: min(100%, 74rem);
    padding-top: clamp(6.25rem, 12vh, 7.75rem);
    min-height: calc(100vh + clamp(8rem, 15vh, 12rem));
  }

  .portfolio-title {
    font-size: clamp(2rem, 5.8vw, 2.6rem);
  }

  .portfolio-divider {
    width: clamp(17rem, 58vw, 28rem);
  }

  .portfolio-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 47.9375rem) {
  .portfolio-section {
    --portfolio-gap-x: clamp(0.85rem, 3.4vw, 1.15rem);
    --portfolio-gap-y: clamp(1.35rem, 3.2vh, 1.95rem);
    --portfolio-grid-max: 19.5rem;
  }

  .portfolio-layout {
    width: min(100%, 36rem);
    padding-inline: clamp(0.75rem, 4vw, 1rem);
    padding-top: clamp(6rem, 13vh, 7.25rem);
    padding-bottom: clamp(4.75rem, 11vh, 6rem);
    min-height: auto;
  }

  .portfolio-title {
    font-size: clamp(2rem, 10vw, 2.55rem);
  }

  .portfolio-divider {
    width: clamp(15rem, 80vw, 24rem);
  }

  .portfolio-grid {
    grid-template-columns: 1fr;
  }
}

/* iPad Pro portrait layout (1204x1366 class) */
@media (min-width: 73rem) and (max-width: 80rem) and (min-height: 80rem) {
  .portfolio-section {
    --portfolio-gap-x: clamp(1rem, 1.8vw, 1.35rem);
    --portfolio-gap-y: clamp(1.65rem, 2.5vh, 2.2rem);
    --portfolio-grid-max: 50rem;
  }

  .portfolio-layout {
    width: min(100%, 76rem);
    justify-content: center;
    min-height: 100%;
    padding-top: clamp(5.25rem, 7.5vh, 6.5rem);
    padding-bottom: clamp(2rem, 4.5vh, 3rem);
  }

  .portfolio-title {
    font-size: clamp(2.3rem, 3.8vw, 2.9rem);
  }

  .portfolio-divider {
    width: clamp(20rem, 44vw, 31rem);
    margin-bottom: clamp(1.25rem, 2.3vh, 1.85rem);
  }

  .portfolio-grid {
    flex: 0 0 auto;
  }
}

/* Small laptop target: 1280x720 */
@media (max-height: 46rem) and (min-width: 80rem) {
  .portfolio-section {
    --portfolio-gap-x: clamp(0.95rem, 1.05vw, 1.2rem);
    --portfolio-gap-y: clamp(1.65rem, 2.8vh, 2.35rem);
    --portfolio-grid-max: 49rem;
  }

  .portfolio-layout {
    padding-top: clamp(5.75rem, 12vh, 6.75rem);
    min-height: calc(100vh + clamp(7rem, 12vh, 10rem));
  }

}

/* Ultrawide target: 2560x1080 */
@media (min-width: 160rem) and (max-width: 239.9375rem) {
  .portfolio-section {
    --portfolio-gap-x: clamp(1.35rem, 0.95vw, 1.8rem);
    --portfolio-gap-y: clamp(2.3rem, 3vh, 3.2rem);
    --portfolio-grid-max: 78rem;
  }

  .portfolio-layout {
    width: min(100%, 120rem);
    padding-top: clamp(6.5rem, 9vh, 9rem);
    min-height: calc(100vh + clamp(9rem, 11vh, 13rem));
  }

  .portfolio-title {
    font-size: clamp(2.6rem, 2.1vw, 3.3rem);
  }

  .portfolio-divider {
    width: clamp(24rem, 25vw, 40rem);
  }

}

/* 4K target: 3840x2160 */
@media (min-width: 240rem) {
  .portfolio-section {
    --portfolio-gap-x: clamp(1.5rem, 0.9vw, 2rem);
    --portfolio-gap-y: clamp(2.7rem, 3vh, 3.9rem);
    --portfolio-grid-max: 94rem;
  }

  .portfolio-layout {
    width: min(100%, 150rem);
    padding-top: clamp(7rem, 8vh, 10rem);
    min-height: calc(100vh + clamp(10rem, 10vh, 16rem));
  }

  .portfolio-title {
    font-size: clamp(3rem, 1.9vw, 4rem);
  }

  .portfolio-divider {
    width: clamp(28rem, 22vw, 50rem);
  }

}
`;

const DUMMY_PORTFOLIO: Video[] = [
    { id: 1, youtube_url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ' },
    { id: 2, youtube_url: 'https://www.youtube.com/watch?v=ysz5S6P_z-U' },
    { id: 3, youtube_url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' },
    { id: 4, youtube_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4' },
    { id: 5, youtube_url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' },
    { id: 6, youtube_url: 'https://www.youtube.com/watch?v=tgbNymZ7vqY' },
];

function Portfolio({ id = 'portfolio', className }: { id?: string; className?: string }) {
    const [videos, setVideos] = useState<Video[]>([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const { data, error } = await supabase.from('portfolio').select('*').limit(PORTFOLIO_SLOTS);

            if (error || !data || data.length === 0) {
                setVideos(DUMMY_PORTFOLIO);
                return;
            }

            setVideos(data);
        };

        fetchVideos();
    }, []);

    const getYoutubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const slots = useMemo(() => {
        return Array.from({ length: PORTFOLIO_SLOTS }, (_, index) => videos[index] ?? null);
    }, [videos]);

    const handleSectionWheelCapture = (event: WheelEvent<HTMLElement>) => {
        const section = event.currentTarget;
        const hasVerticalOverflow = section.scrollHeight > section.clientHeight;
        if (!hasVerticalOverflow) return;

        const atTop = section.scrollTop <= 0;
        const atBottom = Math.ceil(section.scrollTop + section.clientHeight) >= section.scrollHeight;
        const scrollingUp = event.deltaY < 0;
        const scrollingDown = event.deltaY > 0;
        const handoffToHorizontal = (atTop && scrollingUp) || (atBottom && scrollingDown);

        if (!handoffToHorizontal) {
            event.stopPropagation();
        }
    };

    return (
        <section
            id={id}
            className={clsx('portfolio-section h-screen w-screen bg-background flex-shrink-0 relative', className)}
            onWheelCapture={handleSectionWheelCapture}
        >
            <style>{portfolioStyles}</style>

            <div className="portfolio-layout">
                <h2 className="portfolio-title">our portfolio.</h2>
                <div className="portfolio-divider" aria-hidden="true" />

                <div className="portfolio-grid">
                    {slots.map((video, index) => {
                        const source = String(
                            video?.youtube_url ??
                                video?.link ??
                                video?.url ??
                                video?.video_link ??
                                video?.video_url ??
                                ''
                        );
                        const videoId = getYoutubeId(source);

                        return (
                            <div className="portfolio-card" key={video?.id ?? `portfolio-slot-${index}`}>
                                {videoId ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${videoId}?${EMBED_PARAMS}`}
                                        title={video?.Title || `Portfolio Video ${index + 1}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="portfolio-card-placeholder" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Portfolio;
