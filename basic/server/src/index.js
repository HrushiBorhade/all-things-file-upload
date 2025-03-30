const express = require("express");
const path = require("path");
const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const file_storage_path = "./uploads";
// Create the uploads folder if it doesn't exist
if (!fs.existsSync(file_storage_path)) {
  fs.mkdirSync(file_storage_path);
}

// Function to determine subdirectory based on file type
function getFileTypeDirectory(mimetype) {
  if (mimetype.startsWith("image/")) {
    return "images";
  } else if (mimetype.startsWith("video/")) {
    return "videos";
  } else if (mimetype.startsWith("application/") || mimetype.startsWith("text/")) {
    return "documents";
  } else if (mimetype.startsWith("application/javascript") || mimetype === "text/plain") {
    return "code";
  } else {
    return "others"; // Default for other types
  }
}

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const subdir = getFileTypeDirectory(file.mimetype); // Determine subdirectory
    const dirPath = path.join(file_storage_path, subdir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    cb(null, dirPath); // Store in the respective directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)); // Retain the original file extension
  },
});

// Multer upload instance
const upload = multer({ storage });

const app = express();
app.use(morgan("combined"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sample API route
app.get("/api*", (req, res) => {
  res.json({ message: "Response from server API" });
});

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file, req.body);
  res.json({ message: "File uploaded successfully", file: req.file });
});

// Default route (to serve a static HTML file)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../static/index.html"));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
