import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import clsx from 'clsx';
import Folder from '../ui/Folder';

interface ServicesProps {
    id?: string;
    className?: string;
}

const Services = ({ id = "services", className }: ServicesProps) => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.3 });

    const [centerOpen, setCenterOpen] = useState(false);
    const [leftOpen, setLeftOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);

    useEffect(() => {
        if (!isInView) return;

        // Open center folder immediately when in view
        const centerTimer = setTimeout(() => {
            setCenterOpen(true);
        }, 500);

        // Open left and right folders after a delay
        const sideTimer = setTimeout(() => {
            setLeftOpen(true);
            setRightOpen(true);
        }, 800);

        return () => {
            clearTimeout(centerTimer);
            clearTimeout(sideTimer);
        };
    }, [isInView]);

    return (
        <section
            ref={containerRef}
            id={id}
            className={clsx(
                "h-[100dvh] w-full flex items-center justify-center bg-background flex-shrink-0 relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-10",
                className
            )}
        >
            <div className="max-w-7xl px-8 w-full flex items-center justify-center h-full">
                <div style={{ height: '600px', position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Left Folder */}
                    <div style={{ position: 'absolute', left: '20%', top: '60%', transform: 'translate(-50%, -50%)', zIndex: 30 }}>
                        <Folder
                            size={1.6}
                            color="#5227FF"
                            className="custom-folder"
                            maxVisibleItems={3}
                            isOpen={leftOpen}
                            onToggle={() => setLeftOpen(prev => !prev)}
                            items={[
                                <div className="w-full h-full flex items-center justify-center p-2 text-center font-display font-bold text-black text-[10px] leading-tight">Product<br />Packshot</div>,
                                <div className="w-full h-full flex items-center justify-center p-2 text-center font-display font-bold text-black text-[10px] leading-tight">Digital &<br />Corporate Films</div>,
                                <div className="w-full h-full flex items-center justify-center p-2 text-center font-display font-bold text-black text-[10px] leading-tight">Editing</div>,
                            ]}
                        />
                    </div>

                    {/* Center Folder */}
                    <div style={{ zIndex: 20, position: 'relative' }}>
                        <Folder
                            size={2}
                            color="#5227FF"
                            className="custom-folder"
                            maxVisibleItems={4}
                            isOpen={centerOpen}
                            onToggle={() => setCenterOpen(prev => !prev)}
                            items={[
                                <div className="w-full h-full flex items-center justify-center p-2 text-center font-display font-bold text-black text-[10px] leading-tight">VFX</div>,
                                <div className="w-full h-full flex items-center justify-center p-2 text-center font-display font-bold text-black text-[10px] leading-tight">Animation<br />(2D & 3D)</div>,
                                <div className="w-full h-full flex items-center justify-center p-2 text-center font-display font-bold text-black text-[10px] leading-tight">3D Modelling</div>,
                                <div className="w-full h-full flex items-center justify-center p-2 text-center font-display font-bold text-black text-[10px] leading-tight">Architectural<br />Walkthrough</div>
                            ]}
                        />
                    </div>

                    {/* Right Folder */}
                    <div style={{ position: 'absolute', right: '20%', top: '60%', transform: 'translate(50%, -50%)', zIndex: 30 }}>
                        <Folder
                            size={1.6}
                            color="#5227FF"
                            className="custom-folder"
                            maxVisibleItems={3}
                            isOpen={rightOpen}
                            onToggle={() => setRightOpen(prev => !prev)}
                            items={[
                                <div className="w-full h-full flex items-center justify-center p-2 text-center font-display font-bold text-black text-[10px] leading-tight">Pre-<br />Visualisation</div>,
                                <div className="w-full h-full flex items-center justify-center p-2 text-center font-display font-bold text-black text-[10px] leading-tight">Layout<br />Animation</div>,
                                <div className="w-full h-full flex items-center justify-center p-2 text-center font-display font-bold text-black text-[10px] leading-tight">Story Boarding<br />& Concept Art</div>,
                            ]}
                        />
                    </div>

                    <div className="absolute bottom-[-2%] left-1/2 -translate-x-1/2 text-center z-30 pointer-events-none w-full">
                        <h2 className="text-[4rem] md:text-[10rem] font-display font-bold text-text uppercase tracking-widest drop-shadow-sm leading-none opacity-90">Our Services</h2>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
