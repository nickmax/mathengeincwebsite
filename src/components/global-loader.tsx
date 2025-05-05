import React from 'react';

const GlobalLoader: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      aria-label="Loading page"
      role="status"
    >
      <svg 
        width="60" 
        height="60" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg" 
        className="text-primary"
        aria-hidden="true"
      >
        <style>{`
          .bracket {
            animation: pulse 1.5s ease-in-out infinite;
          }
          .bracket:nth-child(2) {
            animation-delay: 0.3s;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}</style>
        <path 
          className="bracket" 
          fill="currentColor" 
          d="M8 3H6v2h2v14H6v2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
        />
        <path 
          className="bracket" 
          fill="currentColor" 
          d="M16 3h-2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2v-2h-2V5h2Z"
        />
      </svg>
    </div>
  );
};

export default GlobalLoader;
