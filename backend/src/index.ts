// import dotenv from "dotenv";
// import app from "./app.js";
//
// dotenv.config();
//
// const PORT = process.env.PORT || 3000;
//
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// import leaguesRouter from './routes/leagues';
// import teamsRouter from './routes/teams';
import router from "./routes/teams.js";
// import statsRouter from './routes/stats';
// import predictionsRouter from './routes/predictions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json());

// app.use('/api/leagues', leaguesRouter);
app.use("/api/teams", router);
// app.use('/api/stats', statsRouter);
// app.use('/api/predictions', predictionsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  },
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
