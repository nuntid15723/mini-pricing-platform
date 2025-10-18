const express = require("express");
const apiRoutes = require("./routes/api.routes");

const app = express();
app.use(express.json());


//ใช้รวมทุก endpoint จาก api.routes
app.use("/", apiRoutes);

//Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Pricing API running on http://localhost:${PORT}`);
});