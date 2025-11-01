import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Mail, Phone, MapPin } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { Broker } from "@shared/schema";

interface BrokerCardProps {
  broker: Broker;
  onToggleStatus: (id: string, isOnline: boolean) => void;
  onEdit: (broker: Broker) => void;
  onDelete: (broker: Broker) => void;
}

export function BrokerCard({ broker, onToggleStatus, onEdit, onDelete }: BrokerCardProps) {
  const initials = broker.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const regionColor = {
    Praia: "bg-blue-100 text-blue-800 border-blue-200",
    Morro: "bg-green-100 text-green-800 border-green-200",
    Centro: "bg-orange-100 text-orange-800 border-orange-200",
  };

  return (
    <Card
      className="p-6 hover-elevate transition-all duration-300 hover:scale-[1.02]"
      data-testid={`card-broker-${broker.id}`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Avatar with status indicator */}
        <div className="relative">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src={broker.photoUrl || undefined} alt={broker.name} />
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card transition-colors duration-300 ${
              broker.isOnline ? "bg-status-online" : "bg-status-offline"
            }`}
            data-testid={`indicator-status-${broker.id}`}
          />
        </div>

        {/* Name */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold tracking-tight" data-testid={`text-name-${broker.id}`}>
            {broker.name}
          </h3>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <StatusBadge isOnline={broker.isOnline} />
            <Badge 
              variant="outline" 
              className={`${regionColor[broker.region as keyof typeof regionColor]} flex items-center gap-1`}
              data-testid={`badge-region-${broker.id}`}
            >
              <MapPin className="h-3 w-3" />
              {broker.region}
            </Badge>
          </div>
        </div>

        {/* Contact info */}
        <div className="w-full space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2" data-testid={`text-email-${broker.id}`}>
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{broker.email}</span>
          </div>
          <div className="flex items-center gap-2" data-testid={`text-phone-${broker.id}`}>
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{broker.phone}</span>
          </div>
        </div>

        {/* Toggle switch */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-sm font-medium">Status:</span>
          <Switch
            checked={broker.isOnline}
            onCheckedChange={(checked) => onToggleStatus(broker.id, checked)}
            className="data-[state=checked]:bg-status-online"
            data-testid={`switch-status-${broker.id}`}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 w-full pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(broker)}
            data-testid={`button-edit-${broker.id}`}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(broker)}
            data-testid={`button-delete-${broker.id}`}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>
    </Card>
  );
}
