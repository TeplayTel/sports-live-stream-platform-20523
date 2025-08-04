import React from 'react';

// PUBLIC_INTERFACE
const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  /**
   * Premium loading spinner component with multiple variants
   * @param {string} size - Size variant: 'sm', 'md', 'lg', 'xl'
   * @param {string} color - Color variant: 'primary', 'accent', 'blue', 'green'
   * @param {string} className - Additional CSS classes
   */

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-accent-red',
    accent: 'border-accent-blue',
    blue: 'border-blue-500',
    green: 'border-accent-green'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer Ring */}
      <div className={`absolute inset-0 rounded-full border-2 border-transparent ${colorClasses[color]} border-t-current animate-spin`}></div>
      
      {/* Inner Ring */}
      <div className={`absolute inset-1 rounded-full border-2 border-transparent ${colorClasses[color]} border-r-current animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      
      {/* Center Dot */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 ${colorClasses[color].replace('border-', 'bg-')} rounded-full animate-pulse`}></div>
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-full ${colorClasses[color].replace('border-', 'bg-')} opacity-20 blur-sm animate-pulse`}></div>
    </div>
  );
};

export default LoadingSpinner;
