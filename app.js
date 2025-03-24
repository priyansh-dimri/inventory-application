require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const itemRoutes = require("./routes/items");
const scientistRoutes = require("./routes/scientists");

app.use("/items", itemRoutes);
app.use("/scientists", scientistRoutes);

app.get("/", (req, res) => {
  res.render("index", { title: "Mad Scientist Inventory" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
