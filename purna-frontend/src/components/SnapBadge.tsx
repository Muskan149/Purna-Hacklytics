import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SnapBadgeProps {
  className?: string;
}

const SnapBadge = ({ className = "" }: SnapBadgeProps) => (
  <Badge className={`bg-accent text-accent-foreground gap-1 rounded-lg font-semibold ${className}`}>
    <ShieldCheck size={14} />
    SNAP Accepted
  </Badge>
);

export default SnapBadge;
