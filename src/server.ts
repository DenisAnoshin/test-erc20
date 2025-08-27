import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger"; 
import apiRouter from "./routes/index";

const app = express();
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));
app.use("/api", apiRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/docs`);
});


