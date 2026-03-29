import { X, CheckCircle, AlertCircle } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast.show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`rounded-lg shadow-2xl p-4 flex items-center gap-3 min-w-[300px] ${
        toast.type === 'success' 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        <div className="flex-shrink-0">
          {toast.type === 'success' ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
        </div>
        <p className="font-semibold flex-1">{toast.message}</p>
        <button 
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-80"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
