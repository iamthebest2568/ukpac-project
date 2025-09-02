import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { EventSchema, appendEvent, computeStats } from "./services/videoAnalytics";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Video analytics ingestion
  app.post("/api/video-events", async (req, res) => {
    try {
      const parsed = EventSchema.parse(req.body);
      const withTs = { ...parsed, timestamp: parsed.timestamp || new Date().toISOString() };
      await appendEvent(withTs);
      res.status(200).json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e?.message || "invalid payload" });
    }
  });

  // Aggregated stats
  app.get("/api/video-stats", async (_req, res) => {
    try {
      const stats = await computeStats();
      res.status(200).json(stats);
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || "failed to compute stats" });
    }
  });

  return app;
}
