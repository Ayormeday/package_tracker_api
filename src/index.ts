import express from "express";
import cors from "cors";
import routes from "./routes";
import "./config/setup";
import http from "http";
import { Server } from "socket.io";
import { registerSocketEvents } from "./events";

const corsOptions = {
  origin: ["http://localhost:3000", process.env.API_URL],
  credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

registerSocketEvents(io);

app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "default_secret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

app.use(routes);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
