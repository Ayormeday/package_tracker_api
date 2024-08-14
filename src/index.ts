import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import routes from "./routes";
import "./config/setup";
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { registerSocketEvents } from './events';


dotenv.config();
// Configure corsOption to handle cors error to localhost
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

registerSocketEvents(io);


app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
