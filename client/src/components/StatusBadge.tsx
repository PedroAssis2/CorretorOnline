import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  isOnline: boolean;
  className?: string;
}

export function StatusBadge({ isOnline, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`
        flex items-center gap-1.5 rounded-full border-2 px-3 py-1 font-semibold text-xs
        transition-all duration-300 animate-in fade-in zoom-in-95
        ${
          isOnline
            ? "bg-status-online text-status-online-foreground border-status-online"
            : "bg-status-offline text-status-offline-foreground border-status-offline"
        }
        ${className || ""}
      `}
      data-testid={`badge-status-${isOnline ? "online" : "offline"}`}
    >
      {isOnline ? (
        <>
          <CheckCircle className="h-3.5 w-3.5" />
          <span>Online</span>
        </>
      ) : (
        <>
          <XCircle className="h-3.5 w-3.5" />
          <span>Offline</span>
        </>
      )}
    </Badge>
  );
}
