import express from "express";

const router = express.Router();

router.get("/", async (_, res) => {
    try {
        res.json({
            status: "ok",
            timestamp: Date.now(),
        });
    } catch {
        res.status(500).json({
            status: "error",
        });
    }
});

export default router;
