const express = require("express");
const https = require("https");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(express.static(path.join(__dirname, "assets"))); // Serve static files from the "assets" directory

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/statistics", require("./routes/statistics"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/hero", require("./routes/heroSection"));
app.use("/api/event", require("./routes/events"));
app.use("/api/about", require("./routes/about"));
app.use("/api/challenges", require("./routes/challenges"));
app.use("/api/timeline", require("./routes/timeline"));
app.use("/api/prizes", require("./routes/prize"));
app.use("/api/faqs", require("./routes/faq"));
app.use("/api/blogs", require("./routes/blogRoutes"));
// app.use("/api/jobs", require("./routes/jobRoutes")); // Uncomment if needed

// Endpoint to verify user JSON
app.post("/verify-user", (req, res) => {
  const { user_json_url } = req.body;

  if (!user_json_url) {
    return res.status(400).send({ error: "user_json_url is required" });
  }

  https
    .get(user_json_url, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          const {
            user_country_code,
            user_phone_number,
            user_first_name,
            user_last_name,
          } = jsonData;

          console.log("User Details:", {
            user_country_code,
            user_phone_number,
            user_first_name,
            user_last_name,
          });

          res.send({
            user_country_code,
            user_phone_number,
            user_first_name,
            user_last_name,
          });
        } catch (err) {
          res.status(500).send({ error: "Failed to parse JSON data" });
        }
      });
    })
    .on("error", (err) => {
      res.status(500).send({ error: err.message });
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
