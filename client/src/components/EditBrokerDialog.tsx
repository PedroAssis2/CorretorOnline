import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBrokerSchema, type InsertBroker, type Broker } from "@shared/schema";
import { Pencil } from "lucide-react";
import { useEffect } from "react";

interface EditBrokerDialogProps {
  broker: Broker | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (id: string, broker: InsertBroker) => void;
  isPending: boolean;
}

export function EditBrokerDialog({ broker, open, onOpenChange, onEdit, isPending }: EditBrokerDialogProps) {
  const form = useForm<InsertBroker>({
    resolver: zodResolver(insertBrokerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      photoUrl: "",
    },
  });

  useEffect(() => {
    if (broker) {
      form.reset({
        name: broker.name,
        email: broker.email,
        phone: broker.phone,
        photoUrl: broker.photoUrl || "",
      });
    }
  }, [broker, form]);

  const handleSubmit = (data: InsertBroker) => {
    if (broker) {
      onEdit(broker.id, data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-edit-broker">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Pencil className="h-5 w-5" />
            Editar Corretor
          </DialogTitle>
          <DialogDescription>
            Atualize os dados do corretor. Todos os campos são obrigatórios exceto a foto.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="João Silva"
                      data-testid="input-edit-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="joao.silva@itamarimoveis.com.br"
                      data-testid="input-edit-email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      data-testid="input-edit-phone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Foto (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://exemplo.com/foto.jpg"
                      data-testid="input-edit-photo-url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                data-testid="button-edit-cancel"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1"
                data-testid="button-edit-submit"
              >
                {isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
