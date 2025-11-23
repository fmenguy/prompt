// frontend/src/components/TagButton.jsx
export default function TagButton({ label, value, isSelected, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-all
        ${isSelected 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }
      `}
    >
      {label}
    </button>
  );
}
