import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  accent?: "green" | "amber" | "blue";
}

const accentStyles = {
  green: "border-l-primary",
  amber: "border-l-warning",
  blue: "border-l-info",
};

const SectionCard = ({ title, icon, children, accent = "green" }: SectionCardProps) => {
  return (
    <div className={`bg-card rounded-lg border border-border border-l-2 ${accentStyles[accent]} p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-primary">{icon}</div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default SectionCard;
