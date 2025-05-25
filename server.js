import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let packages = [
  { id: 1, name: "100 UC", price: 1.99 },
  { id: 2, name: "300 UC", price: 4.99 },
  { id: 3, name: "600 UC", price: 8.99 },
  { id: 4, name: "1200 UC", price: 16.99 },
  { id: 5, name: "2500 UC", price: 34.99 },
];

app.get("/api/packages", (req, res) => {
  res.json(packages);
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});