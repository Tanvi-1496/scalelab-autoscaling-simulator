
const express = require("express");
const { calculateScaling } = require("./scalingEngine");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Welcome to ScaleLab! Auto-scaling simulator is running.");
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        application: "ScaleLab"
    });
});

app.post("/api/scale", (req, res) => {
    try {
        const {
            load,
            mode,
            instances = 1,
            cpuPerInstance = 1,
            ramPerInstance = 2
        } = req.body;

        const result = calculateScaling({
            load,
            mode,
            instances,
            cpuPerInstance,
            ramPerInstance
        });

        res.json(result);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`ScaleLab server running at http://localhost:${PORT}`);
});
