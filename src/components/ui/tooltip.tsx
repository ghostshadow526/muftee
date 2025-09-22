import * as React from "react";

// Simple tooltip implementation
interface TooltipProviderProps {
  children: React.ReactNode;
}

interface TooltipProps {
  children: React.ReactNode;
  content?: string;
}

export const TooltipProvider = ({ children }: TooltipProviderProps) => {
  return <>{children}</>;
};

export const Tooltip = ({ children, content }: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white bg-gray-900 rounded whitespace-nowrap z-50">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};