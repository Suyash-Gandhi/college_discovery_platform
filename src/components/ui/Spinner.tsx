export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${className}`}
      style={{ width: 24, height: 24 }}
      role="status"
      aria-label="Loading"
    />
  );
}
