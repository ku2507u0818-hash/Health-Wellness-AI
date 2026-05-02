import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Strip any trailing slash from CORS_ORIGIN so exact match always works
// regardless of how the user configured the env var in Railway.
const rawCorsOrigin = (process.env.CORS_ORIGIN || "*").replace(/\/+$/, "");

const corsOptions: cors.CorsOptions = {
  origin: rawCorsOrigin === "*"
    ? "*"
    : (origin, callback) => {
        // Allow requests with no origin (server-to-server, curl, etc.)
        if (!origin || origin === rawCorsOrigin) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin '${origin}' not allowed`));
        }
      },
  credentials: rawCorsOrigin !== "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// Handle preflight OPTIONS for every route first
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
