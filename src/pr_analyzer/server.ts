import express from "express";
import { handlePRWebhook } from "./handler";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.post("/webhook", async (req, res) => {
  const payload = req.body;
  const pr = payload.pull_request;
  if (!pr) {
    return res.status(400).send("No pull request data found.");
  }
  if (pr.state !== "open") {
    return res.status(200).send("PR is closed, no action taken.");
  }
  if (pr.state === "open") {
    res.status(201).send("PR Recieved successfully.");
  }

  handlePRWebhook(pr, res).catch((error: any) => {
    console.error("Error handling PR Webhook:", error);
    res.status(500).send("Internal server error.");
  });

});

app.listen(PORT, () => {
  console.log(`Alethea PRA Server is running on port ${PORT}`);
});
