import React, { useState } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'bottom' }) => {
    const [visible, setVisible] = useState(false);

    const positionClasses: Record<string, string> = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowClasses: Record<string, string> = {
        top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-800',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-800',
        left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-800',
        right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-800',
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div
                    className={`absolute z-[100] whitespace-nowrap px-2.5 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xl pointer-events-none transition-all duration-150 ${positionClasses[position]}`}
                    style={{ animation: 'fadeInScale 0.15s ease-out' }}
                >
                    {content}
                    <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
