import express from "express";
import cors from "cors";
import v1 from "./routes/v1";
import { errorHandler } from "./middleware/error.middleware";

export const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", v1);
app.use(errorHandler);
