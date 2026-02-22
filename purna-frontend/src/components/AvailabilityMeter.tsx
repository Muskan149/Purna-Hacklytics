import { Progress } from "@/components/ui/progress";

interface AvailabilityMeterProps {
  have: number;
  total: number;
}

const AvailabilityMeter = ({ have, total }: AvailabilityMeterProps) => {
  const pct = total > 0 ? Math.round((have / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{have} / {total} ingredients</span>
        <span className="font-semibold text-foreground">{pct}%</span>
      </div>
      <Progress value={pct} className="h-2 rounded-full" />
    </div>
  );
};

export default AvailabilityMeter;
