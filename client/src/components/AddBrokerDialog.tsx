import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBrokerSchema, type InsertBroker, regions } from "@shared/schema";
import { UserPlus } from "lucide-react";

interface AddBrokerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (broker: InsertBroker) => void;
  isPending: boolean;
}

export function AddBrokerDialog({
  open,
  onOpenChange,
  onAdd,
  isPending,
}: AddBrokerDialogProps) {
  const form = useForm<InsertBroker>({
    resolver: zodResolver(insertBrokerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      photoUrl: "",
      region: "Centro",
    },
  });

  const handleSubmit = (data: InsertBroker) => {
    onAdd(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md bg-[#111] text-white border border-gray-700 shadow-xl"
        data-testid="dialog-add-broker"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            <UserPlus className="h-5 w-5" />
            Adicionar Corretor
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha os dados do novo corretor. Todos os campos são obrigatórios
            exceto a foto.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="João Silva"
                      data-testid="input-name"
                      {...field}
                      className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
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
                      data-testid="input-email"
                      {...field}
                      className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Telefone */}
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
                      data-testid="input-phone"
                      {...field}
                      className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL da Foto */}
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
                      data-testid="input-photo-url"
                      {...field}
                      value={field.value || ""}
                      className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Região estilizada */}
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Região</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="bg-black text-white border border-gray-700 shadow-md rounded-md focus:ring-2 focus:ring-gray-500 transition"
                        data-testid="select-region"
                      >
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black text-white border border-gray-700 shadow-lg">
                      {regions.map((region) => (
                        <SelectItem
                          key={region}
                          value={region}
                          data-testid={`option-region-${region}`}
                          className="hover:bg-gray-800"
                        >
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                className="flex-1 border-gray-600 text-gray-200 hover:bg-gray-800"
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-white text-black hover:bg-gray-200 font-semibold"
                data-testid="button-submit"
              >
                {isPending ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
