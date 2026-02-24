import React, { useState } from 'react';

interface FolderProps {
    color?: string;
    size?: number;
    items?: React.ReactNode[];
    className?: string;
    maxVisibleItems?: number;
    isOpen?: boolean;
    onToggle?: () => void;
}

const darkenColor = (hex: string, percent: number): string => {
    let color = hex.startsWith('#') ? hex.slice(1) : hex;
    if (color.length === 3) {
        color = color
            .split('')
            .map(c => c + c)
            .join('');
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const Folder: React.FC<FolderProps> = ({
    color = '#5227FF',
    size = 1,
    items = [],
    className = '',
    maxVisibleItems = 4,
    isOpen: controlledIsOpen,
    onToggle
}) => {
    const papers = items.slice(0, maxVisibleItems);
    while (papers.length < maxVisibleItems) {
        papers.push(null);
    }

    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

    const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
        Array.from({ length: maxVisibleItems }, () => ({ x: 0, y: 0 }))
    );

    const folderBackColor = darkenColor(color, 0.08);
    const paper1 = darkenColor('#ffffff', 0.1);
    const paper2 = darkenColor('#ffffff', 0.05);
    const paper3 = '#ffffff';

    const handleClick = () => {
        if (onToggle) {
            onToggle();
        } else {
            setInternalOpen(prev => !prev);
        }

        // Reset offsets when closing
        if (isOpen) {
            setPaperOffsets(Array.from({ length: maxVisibleItems }, () => ({ x: 0, y: 0 })));
        }
    };

    const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        if (!isOpen) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const offsetX = (e.clientX - centerX) * 0.15;
        const offsetY = (e.clientY - centerY) * 0.15;
        setPaperOffsets(prev => {
            const newOffsets = [...prev];
            newOffsets[index] = { x: offsetX, y: offsetY };
            return newOffsets;
        });
    };

    const handlePaperMouseLeave = (_e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        setPaperOffsets(prev => {
            const newOffsets = [...prev];
            newOffsets[index] = { x: 0, y: 0 };
            return newOffsets;
        });
    };

    const folderStyle: React.CSSProperties = {
        '--folder-color': color,
        '--folder-back-color': folderBackColor,
        '--paper-1': paper1,
        '--paper-2': paper2,
        '--paper-3': paper3
    } as React.CSSProperties;

    const scaleStyle = { transform: `scale(${size})` };

    const getOpenTransform = (index: number) => {
        if (maxVisibleItems === 3) {
            // Layout for 3 items
            if (index === 0) return 'translate(-160%, -50%) rotate(-10deg)';
            if (index === 1) return 'translate(60%, -50%) rotate(10deg)';
            if (index === 2) return 'translate(-50%, -110%) rotate(0deg)';
        } else {
            // Layout for 4 items
            if (index === 0) return 'translate(-220%, -40%) rotate(-15deg)'; // Left Outer
            if (index === 1) return 'translate(-110%, -130%) rotate(-5deg)'; // Left Inner
            if (index === 2) return 'translate(10%, -130%) rotate(5deg)';    // Right Inner
            if (index === 3) return 'translate(120%, -40%) rotate(15deg)';   // Right Outer
        }
        return '';
    };

    return (
        <div style={scaleStyle} className={className}>
            <div
                className={`group relative transition-all duration-200 ease-in cursor-pointer ${!isOpen ? 'hover:-translate-y-2' : ''
                    }`}
                style={{
                    ...folderStyle,
                    transform: isOpen ? 'translateY(-8px)' : undefined,
                    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))'
                }}
                onClick={handleClick}
            >
                <div
                    className="relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
                    style={{ backgroundColor: folderBackColor }}
                >
                    <span
                        className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px] rounded-bl-0 rounded-br-0"
                        style={{ backgroundColor: folderBackColor }}
                    ></span>
                    {papers.map((item, i) => {
                        let sizeClasses = '';
                        if (maxVisibleItems === 3) {
                            if (i === 0) sizeClasses = isOpen ? 'w-[75%] h-[80%]' : 'w-[75%] h-[80%]';
                            if (i === 1) sizeClasses = isOpen ? 'w-[85%] h-[80%]' : 'w-[85%] h-[70%]';
                            if (i === 2) sizeClasses = isOpen ? 'w-[80%] h-[80%]' : 'w-[80%] h-[60%]';
                        } else {
                            if (i === 0) sizeClasses = isOpen ? 'w-[70%] h-[80%]' : 'w-[70%] h-[80%]';
                            if (i === 1) sizeClasses = isOpen ? 'w-[75%] h-[80%]' : 'w-[75%] h-[75%]';
                            if (i === 2) sizeClasses = isOpen ? 'w-[80%] h-[80%]' : 'w-[80%] h-[70%]';
                            if (i === 3) sizeClasses = isOpen ? 'w-[85%] h-[80%]' : 'w-[85%] h-[65%]';
                        }

                        const transformStyle = isOpen
                            ? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
                            : undefined;

                        return (
                            <div
                                key={i}
                                onMouseMove={e => handlePaperMouseMove(e, i)}
                                onMouseLeave={e => handlePaperMouseLeave(e, i)}
                                className={`absolute z-20 bottom-[10%] left-1/2 transition-all duration-300 ease-in-out ${!isOpen ? 'transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0' : 'hover:scale-110'
                                    } ${sizeClasses}`}
                                style={{
                                    ...(!isOpen ? {} : { transform: transformStyle })
                                }}
                            >
                                <div
                                    className={`w-full h-full ${isOpen ? 'animate-float' : ''}`}
                                    style={{
                                        backgroundColor: paper3,
                                        borderRadius: '10px',
                                        animationDelay: `${i * 0.4}s`
                                    }}
                                >
                                    {item}
                                </div>
                            </div>
                        );
                    })}
                    <div
                        className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${!isOpen ? 'group-hover:[transform:skew(15deg)_scaleY(0.6)]' : ''
                            }`}
                        style={{
                            backgroundColor: color,
                            borderRadius: '5px 10px 10px 10px',
                            ...(isOpen && { transform: 'skew(15deg) scaleY(0.6)' })
                        }}
                    ></div>
                    <div
                        className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${!isOpen ? 'group-hover:[transform:skew(-15deg)_scaleY(0.6)]' : ''
                            }`}
                        style={{
                            backgroundColor: color,
                            borderRadius: '5px 10px 10px 10px',
                            ...(isOpen && { transform: 'skew(-15deg) scaleY(0.6)' })
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Folder;
