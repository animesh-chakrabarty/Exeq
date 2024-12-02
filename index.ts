import express from "express";
import router from "./src/routes.js";

const port = process.env.PORT || 8000;
const app = express();

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
