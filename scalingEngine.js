
const REQUESTS_PER_CORE = 250;

function calculateScaling({
    load,
    mode,
    instances = 1,
    cpuPerInstance = 1,
    ramPerInstance = 2
}) {
    if (!Number.isFinite(load) || load < 0) {
        throw new Error("Load must be a non-negative number.");
    }

    if (!["horizontal", "vertical", "hybrid"].includes(mode)) {
        throw new Error(
            "Mode must be horizontal, vertical, or hybrid."
        );
    }

    const MAX_INSTANCES = 10;
    const MAX_CPU = 4;
    const MAX_RAM = 8;

    const baseInstances = Math.max(
        1,
        Math.min(MAX_INSTANCES, Math.floor(instances) || 1)
    );

    const baseCpu = Math.max(
        1,
        Math.min(MAX_CPU, Math.floor(cpuPerInstance) || 1)
    );

    const baseRam = Math.max(
        2,
        Math.min(MAX_RAM, Math.floor(ramPerInstance) || 2)
    );

    let currentInstances = baseInstances;
    let cpu = baseCpu;
    let ram = baseRam;

    if (mode === "horizontal") {
        cpu = baseCpu;
        ram = baseRam;

        currentInstances = Math.max(
            1,
            Math.min(
                MAX_INSTANCES,
                Math.ceil(load / (cpu * REQUESTS_PER_CORE))
            )
        );
    }

    if (mode === "vertical") {
        currentInstances = baseInstances;

        const requiredCores = Math.max(
            1,
            Math.ceil(load / (currentInstances * REQUESTS_PER_CORE))
        );

        cpu = Math.max(
            baseCpu,
            Math.min(MAX_CPU, requiredCores)
        );

        ram = Math.max(
            baseRam,
            Math.min(MAX_RAM, cpu * 2)
        );
    }

    if (mode === "hybrid") {
        // Find the smallest resource configuration that can
        // handle the requested load within the configured limits.
        let best = null;

        for (let candidateCpu = baseCpu;
             candidateCpu <= MAX_CPU;
             candidateCpu++) {

            const candidateRam = Math.max(
                baseRam,
                Math.min(MAX_RAM, candidateCpu * 2)
            );

            const requiredInstances = Math.max(
                1,
                Math.ceil(load / (candidateCpu * REQUESTS_PER_CORE))
            );

            const candidateInstances = Math.max(
                baseInstances,
                requiredInstances
            );

            if (candidateInstances > MAX_INSTANCES) {
                continue;
            }

            const totalCapacity =
                candidateInstances * candidateCpu * REQUESTS_PER_CORE;

            const resourceCost =
                candidateInstances * (candidateCpu + candidateRam / 2);

            if (
                !best ||
                resourceCost < best.resourceCost
            ) {
                best = {
                    instances: candidateInstances,
                    cpu: candidateCpu,
                    ram: candidateRam,
                    resourceCost
                };
            }
        }

        if (best) {
            currentInstances = best.instances;
            cpu = best.cpu;
            ram = best.ram;
        } else {
            // Maximum supported configuration when demand exceeds
            // the simulator's total capacity.
            currentInstances = MAX_INSTANCES;
            cpu = MAX_CPU;
            ram = MAX_RAM;
        }
    }

    const totalCapacity =
        currentInstances * cpu * REQUESTS_PER_CORE;

    const utilization = totalCapacity === 0
        ? 0
        : (load / totalCapacity) * 100;

    const unservedRequests = Math.max(
        0,
        load - totalCapacity
    );

    return {
        mode,
        incomingRequestsPerSecond: load,
        instances: currentInstances,
        cpuCoresPerInstance: cpu,
        ramGBPerInstance: ram,
        totalCapacityRequestsPerSecond: totalCapacity,
        utilizationPercent: Number(utilization.toFixed(1)),
        unservedRequestsPerSecond: unservedRequests,
        note: unservedRequests > 0
            ? `Overloaded! ${unservedRequests} requests/sec exceed available capacity.`
            : "Simulated capacity is sufficient for the incoming load."
    };
}

module.exports = { calculateScaling };
