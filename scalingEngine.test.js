
const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateScaling } = require("./scalingEngine");

test("horizontal scaling adds instances to handle load", () => {
    const result = calculateScaling({
        load: 1500,
        mode: "horizontal"
    });

    assert.equal(result.instances, 6);
    assert.equal(result.totalCapacityRequestsPerSecond, 1500);
    assert.equal(result.unservedRequestsPerSecond, 0);
});

test("vertical scaling increases CPU and RAM", () => {
    const result = calculateScaling({
        load: 500,
        mode: "vertical"
    });

    assert.equal(result.instances, 1);
    assert.equal(result.cpuCoresPerInstance, 2);
    assert.equal(result.ramGBPerInstance, 4);
    assert.equal(result.unservedRequestsPerSecond, 0);
});

test("hybrid scaling handles 3000 requests per second", () => {
    const result = calculateScaling({
        load: 3000,
        mode: "hybrid"
    });

    assert.equal(result.totalCapacityRequestsPerSecond, 3000);
    assert.equal(result.unservedRequestsPerSecond, 0);
});

test("horizontal scaling reports overload beyond maximum capacity", () => {
    const result = calculateScaling({
        load: 3000,
        mode: "horizontal"
    });

    assert.equal(result.instances, 10);
    assert.equal(result.totalCapacityRequestsPerSecond, 2500);
    assert.equal(result.unservedRequestsPerSecond, 500);
});

test("invalid scaling mode is rejected", () => {
    assert.throws(
        () => calculateScaling({ load: 500, mode: "invalid" }),
        /Mode must be horizontal, vertical, or hybrid/
    );
});

test("negative load is rejected", () => {
    assert.throws(
        () => calculateScaling({ load: -100, mode: "horizontal" }),
        /Load must be a non-negative number/
    );
});
