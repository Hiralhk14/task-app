export default function Loader({ size = 'md', color = 'primary', fullScreen = false, className = '' }) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-b-2',
    lg: 'h-16 w-16 border-b-3',
    xl: 'h-20 w-20 border-b-4'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    blue: 'border-blue-600',
    red: 'border-red-600',
    green: 'border-green-600',
    white: 'border-white'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center py-12 ${className}`}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}></div>
    </div>
  );
}