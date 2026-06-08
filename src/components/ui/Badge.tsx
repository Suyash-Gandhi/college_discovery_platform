const variants = {
  GOVERNMENT: "bg-green-100 text-green-700",
  PRIVATE: "bg-purple-100 text-purple-700",
  DEEMED: "bg-orange-100 text-orange-700",
  AUTONOMOUS: "bg-blue-100 text-blue-700",
  default: "bg-gray-100 text-gray-600",
};

interface BadgeProps {
  label: string;
  variant?: keyof typeof variants;
}

export default function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${variants[variant] ?? variants.default}`}
    >
      {label}
    </span>
  );
}
