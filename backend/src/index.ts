import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import orgRoutes from "./routes/organizationRoutes";
import leadRoutes from "./routes/leadRoutes";
import connectMainDB from "./config/db";
import { authMiddleware } from "./middleware/authMiddleware";
import { tenantMiddleware } from "./middleware/tenantMiddleware";
import userRoutes from "./api/user-modules/userRoutes";
import { setUserFields } from "./middleware/setUserFields.middleware";
const cors = require("cors");

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(express.json());

// Connect to the main database
connectMainDB();
const port = process.env.PORT || 5000;
app.use("/", tenantMiddleware, authRoutes);

app.use("/api", tenantMiddleware, authMiddleware, setUserFields, userRoutes);

app.get("/", (req, res) => {
  res.send("CRM backend running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
