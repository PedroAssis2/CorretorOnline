import { type Broker, type InsertBroker } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Broker operations
  getBrokers(): Promise<Broker[]>;
  getBroker(id: string): Promise<Broker | undefined>;
  createBroker(broker: InsertBroker): Promise<Broker>;
  updateBroker(id: string, broker: InsertBroker): Promise<Broker | undefined>;
  updateBrokerStatus(id: string, isOnline: boolean): Promise<Broker | undefined>;
  deleteBroker(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private brokers: Map<string, Broker>;

  constructor() {
    this.brokers = new Map();
  }

  async getBrokers(): Promise<Broker[]> {
    return Array.from(this.brokers.values());
  }

  async getBroker(id: string): Promise<Broker | undefined> {
    return this.brokers.get(id);
  }

  async createBroker(insertBroker: InsertBroker): Promise<Broker> {
    const id = randomUUID();
    const broker: Broker = {
      ...insertBroker,
      id,
      isOnline: false,
    };
    this.brokers.set(id, broker);
    return broker;
  }

  async updateBroker(id: string, insertBroker: InsertBroker): Promise<Broker | undefined> {
    const existing = this.brokers.get(id);
    if (!existing) return undefined;

    const updated: Broker = {
      ...existing,
      ...insertBroker,
    };
    this.brokers.set(id, updated);
    return updated;
  }

  async updateBrokerStatus(id: string, isOnline: boolean): Promise<Broker | undefined> {
    const broker = this.brokers.get(id);
    if (!broker) return undefined;

    const updated: Broker = {
      ...broker,
      isOnline,
    };
    this.brokers.set(id, updated);
    return updated;
  }

  async deleteBroker(id: string): Promise<boolean> {
    return this.brokers.delete(id);
  }
}

export const storage = new MemStorage();
