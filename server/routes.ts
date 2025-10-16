import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertBrokerSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Broadcast to all connected clients
  function broadcast(message: any) {
    const payload = JSON.stringify(message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // GET /api/brokers - Get all brokers
  app.get("/api/brokers", async (req, res) => {
    try {
      const brokers = await storage.getBrokers();
      res.json(brokers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brokers" });
    }
  });

  // GET /api/brokers/:id - Get a broker by ID
  app.get("/api/brokers/:id", async (req, res) => {
    try {
      const broker = await storage.getBroker(req.params.id);
      if (!broker) {
        return res.status(404).json({ error: "Broker not found" });
      }
      res.json(broker);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch broker" });
    }
  });

  // POST /api/brokers - Create a new broker
  app.post("/api/brokers", async (req, res) => {
    try {
      const data = insertBrokerSchema.parse(req.body);
      const broker = await storage.createBroker(data);
      
      // Broadcast the new broker to all clients
      broadcast({ type: "broker_added", broker });
      
      res.status(201).json(broker);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create broker" });
    }
  });

  // PATCH /api/brokers/:id - Update a broker
  app.patch("/api/brokers/:id", async (req, res) => {
    try {
      const data = insertBrokerSchema.parse(req.body);
      const broker = await storage.updateBroker(req.params.id, data);
      
      if (!broker) {
        return res.status(404).json({ error: "Broker not found" });
      }

      // Broadcast the updated broker to all clients
      broadcast({ type: "broker_updated", broker });
      
      res.json(broker);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update broker" });
    }
  });

  // PATCH /api/brokers/:id/status - Update broker status
  app.patch("/api/brokers/:id/status", async (req, res) => {
    try {
      const { isOnline } = req.body;
      
      if (typeof isOnline !== "boolean") {
        return res.status(400).json({ error: "isOnline must be a boolean" });
      }

      const broker = await storage.updateBrokerStatus(req.params.id, isOnline);
      
      if (!broker) {
        return res.status(404).json({ error: "Broker not found" });
      }

      // Broadcast the status change to all clients
      broadcast({ type: "status_changed", broker });
      
      res.json(broker);
    } catch (error) {
      res.status(500).json({ error: "Failed to update broker status" });
    }
  });

  // DELETE /api/brokers/:id - Delete a broker
  app.delete("/api/brokers/:id", async (req, res) => {
    try {
      const success = await storage.deleteBroker(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: "Broker not found" });
      }

      // Broadcast the deletion to all clients
      broadcast({ type: "broker_deleted", id: req.params.id });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete broker" });
    }
  });

  return httpServer;
}
