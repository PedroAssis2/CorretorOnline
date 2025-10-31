import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Building2, Users } from "lucide-react";
import { BrokerCard } from "@/components/BrokerCard";
import { AddBrokerDialog } from "@/components/AddBrokerDialog";
import { EditBrokerDialog } from "@/components/EditBrokerDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Broker, InsertBroker } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

type FilterType = "all" | "online" | "offline";

export default function Home() {
  const { toast } = useToast();

  // Connect to WebSocket for real-time updates
  useWebSocket();
  const [filter, setFilter] = useState<FilterType>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);

  // Fetch brokers
  const { data: brokers = [], isLoading } = useQuery<Broker[]>({
    queryKey: ["/api/brokers"],
  });

  // Add broker mutation
  const addMutation = useMutation({
    mutationFn: async (broker: InsertBroker) => {
      return await apiRequest("POST", "/api/brokers", broker);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brokers"] });
      setAddDialogOpen(false);
      toast({
        title: "Corretor adicionado",
        description: "O corretor foi adicionado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o corretor.",
        variant: "destructive",
      });
    },
  });

  // Edit broker mutation
  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertBroker }) => {
      return await apiRequest("PATCH", `/api/brokers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brokers"] });
      setEditDialogOpen(false);
      setSelectedBroker(null);
      toast({
        title: "Corretor atualizado",
        description: "Os dados do corretor foram atualizados com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o corretor.",
        variant: "destructive",
      });
    },
  });

  // Delete broker mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/brokers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brokers"] });
      setDeleteDialogOpen(false);
      setSelectedBroker(null);
      toast({
        title: "Corretor excluído",
        description: "O corretor foi excluído com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o corretor.",
        variant: "destructive",
      });
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isOnline }: { id: string; isOnline: boolean }) => {
      return await apiRequest("PATCH", `/api/brokers/${id}/status`, {
        isOnline,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brokers"] });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do corretor.",
        variant: "destructive",
      });
    },
  });

  // Filter brokers
  const filteredBrokers = brokers.filter((broker) => {
    if (filter === "online") return broker.isOnline;
    if (filter === "offline") return !broker.isOnline;
    return true;
  });

  // Stats
  const onlineCount = brokers.filter((b) => b.isOnline).length;
  const offlineCount = brokers.filter((b) => !b.isOnline).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <img
                  src="../../logol.png"
                  alt="Logo Itamar Imóveis"
                  className="h-20 w-auto object-contain"
                />

                <p className="text-sm text-muted-foreground">
                  Status de Corretores
                </p>
              </div>
            </div>
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="gap-2"
              data-testid="button-add-broker"
            >
              <UserPlus className="h-4 w-4" />
              Adicionar Corretor
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats and filters */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-status-online/10 px-4 py-2 border border-status-online/20">
              <div className="h-3 w-3 rounded-full bg-status-online animate-pulse" />
              <span className="text-sm font-medium">
                <span
                  className="text-lg font-semibold"
                  data-testid="text-online-count"
                >
                  {onlineCount}
                </span>{" "}
                Online
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-status-offline/10 px-4 py-2 border border-status-offline/20">
              <div className="h-3 w-3 rounded-full bg-status-offline" />
              <span className="text-sm font-medium">
                <span
                  className="text-lg font-semibold"
                  data-testid="text-offline-count"
                >
                  {offlineCount}
                </span>{" "}
                Offline
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 border">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">
                <span
                  className="text-lg font-semibold"
                  data-testid="text-total-count"
                >
                  {brokers.length}
                </span>{" "}
                Total
              </span>
            </div>
          </div>

          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as FilterType)}
          >
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all">
                Todos
              </TabsTrigger>
              <TabsTrigger value="online" data-testid="tab-online">
                Online
              </TabsTrigger>
              <TabsTrigger value="offline" data-testid="tab-offline">
                Offline
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Brokers grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 space-y-4 border rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-20" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                  <div className="flex gap-2 w-full">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBrokers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {filter === "all"
                ? "Nenhum corretor cadastrado"
                : filter === "online"
                  ? "Nenhum corretor online"
                  : "Nenhum corretor offline"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {filter === "all"
                ? "Adicione o primeiro corretor para começar a gerenciar o status da equipe."
                : "Não há corretores com este status no momento."}
            </p>
            {filter === "all" && (
              <Button
                onClick={() => setAddDialogOpen(true)}
                data-testid="button-add-first-broker"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Corretor
              </Button>
            )}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-testid="grid-brokers"
          >
            {filteredBrokers.map((broker) => (
              <BrokerCard
                key={broker.id}
                broker={broker}
                onToggleStatus={(id, isOnline) =>
                  toggleStatusMutation.mutate({ id, isOnline })
                }
                onEdit={(broker) => {
                  setSelectedBroker(broker);
                  setEditDialogOpen(true);
                }}
                onDelete={(broker) => {
                  setSelectedBroker(broker);
                  setDeleteDialogOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Dialogs */}
      <AddBrokerDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={(broker) => addMutation.mutate(broker)}
        isPending={addMutation.isPending}
      />

      <EditBrokerDialog
        broker={selectedBroker}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEdit={(id, data) => editMutation.mutate({ id, data })}
        isPending={editMutation.isPending}
      />

      <DeleteConfirmDialog
        broker={selectedBroker}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={(id) => deleteMutation.mutate(id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
