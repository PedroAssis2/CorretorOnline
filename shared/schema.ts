import { pgTable, text, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const regions = ["Praia", "Morro", "Centro"] as const;
export type Region = typeof regions[number];

export const brokers = pgTable("brokers", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  photoUrl: text("photo_url"),
  region: text("region").notNull().default("Centro"),
  isOnline: boolean("is_online").notNull().default(false),
});

export const insertBrokerSchema = createInsertSchema(brokers)
  .omit({
    id: true,
    isOnline: true,
  })
  .extend({
    region: z.enum(regions),
  });

export type InsertBroker = z.infer<typeof insertBrokerSchema>;
export type Broker = typeof brokers.$inferSelect;
