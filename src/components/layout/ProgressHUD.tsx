import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

interface SectionMeta {
    id: string;
    label: string;
}

interface ProgressHUDProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    sections: SectionMeta[];
}

const ProgressHUD = ({ containerRef, sections }: ProgressHUDProps) => {
    const [progress, setProgress] = useState(0);
    const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '');

    const percentage = useMemo(() => Math.round(progress * 100), [progress]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const maxScroll = container.scrollWidth - container.clientWidth;
            const ratio = maxScroll === 0 ? 0 : container.scrollLeft / maxScroll;
            setProgress(ratio);

            const sectionWidth = container.clientWidth || window.innerWidth || 1;
            const index = Math.min(
                sections.length - 1,
                Math.round(container.scrollLeft / sectionWidth)
            );
            setActiveSection(sections[index]?.id ?? sections[0]?.id ?? '');
        };

        handleScroll();
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [containerRef, sections]);

    const handleJump = (sectionId: string) => {
        const container = containerRef.current;
        const target = document.getElementById(sectionId);
        if (!container || !target) return;

        const offset = target.offsetLeft;
        container.scrollTo({
            left: offset,
            behavior: 'smooth',
        });
    };

    const handleCta = () => {
        const contactSection = sections.find((section) => section.label.toLowerCase().includes('connect'))?.id ?? 'contact';
        handleJump(contactSection);
    };

    return (
        <div className="fixed top-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3 px-4">
            <div className="flex items-center gap-6 rounded-full border border-white/10 bg-surface/80 px-6 py-3 backdrop-blur-lg">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted/80">
                        Aarkit
                    </p>
                    <p className="text-sm font-medium text-text/90">Immersive Studio</p>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted/80">Experience</p>
                    <p className="text-lg font-semibold text-text">{percentage}%</p>
                </div>
                <button
                    onClick={handleCta}
                    className="rounded-full border border-accent/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent transition hover:border-accent hover:bg-accent hover:text-black"
                >
                    Book a Call
                </button>
            </div>

            <div className="h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
                <div
                    className="h-full bg-gradient-to-r from-accent to-emerald-400 transition-[width] duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-surface/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted backdrop-blur">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        className={clsx(
                            "rounded-full px-3 py-1 transition-colors",
                            activeSection === section.id
                                ? "bg-accent/20 text-accent"
                                : "text-muted hover:text-text"
                        )}
                        onClick={() => handleJump(section.id)}
                    >
                        {section.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProgressHUD;

