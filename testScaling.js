
const { calculateScaling } = require("./scalingEngine");

const scenarios = [
    { load: 500, mode: "horizontal" },
    { load: 1500, mode: "horizontal" },
    { load: 1500, mode: "vertical" },
    { load: 3000, mode: "hybrid" }
];

for (const scenario of scenarios) {
    const result = calculateScaling(scenario);

    console.log(`\n--- ${scenario.mode.toUpperCase()} SCALING ---`);
    console.log(JSON.stringify(result, null, 2));
}
