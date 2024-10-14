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

const app = express();
dotenv.config();
app.use(express.json());

// Connect to the main database
connectMainDB();
const port = process.env.PORT || 5000;
app.use("/", tenantMiddleware, authRoutes);
app.use("/", authMiddleware, setUserFields);

app.use("/api", authMiddleware, tenantMiddleware, orgRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.send("CRM backend running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
