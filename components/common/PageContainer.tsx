import React from 'react';
import { CloseIcon } from './icons';

interface PageContainerProps {
    onClose: () => void;
    children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ onClose, children }) => {
    return (
        <div className="relative w-full max-w-6xl mx-auto h-full flex flex-col bg-black/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden animate-fade-in-scale">
            <button
                onClick={onClose}
                className="absolute top-1 right-1 p-1.5 rounded-md hover:bg-starmade-danger/20 transition-colors z-10"
                aria-label="Close"
            >
                <CloseIcon className="w-5 h-5 text-gray-400 hover:text-starmade-danger-light" />
            </button>
            <div className="flex-grow p-6 flex flex-col min-h-0">
                {children}
            </div>
        </div>
    );
};

export default PageContainer;
