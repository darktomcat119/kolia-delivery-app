interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
}

export function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-semibold font-body text-[#1A1A1A] mb-1">
        {value}
      </div>
      <div className="text-sm text-[#6B6560] font-body">{label}</div>
    </div>
  );
}
