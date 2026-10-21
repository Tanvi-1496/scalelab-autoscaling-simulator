
const $ = (id) => document.getElementById(id);

const loadSlider = $("load");
const loadValue = $("loadValue");
const modeSelect = $("mode");
const runButton = $("runBtn");
const message = $("message");

const history = [];
const events = [];
let previousResult = null;

const modeInfo = {
    horizontal: {
        symbol: "↔",
        description: "Add or remove application instances as traffic changes."
    },
    vertical: {
        symbol: "↕",
        description: "Upgrade CPU and RAM on existing instances, up to configured limits."
    },
    hybrid: {
        symbol: "⤢",
        description: "Upgrade resources and add instances when extra capacity is needed."
    }
};

function formatNumber(value) {
    return Number(value).toLocaleString();
}

function setMessage(text, type = "") {
    message.textContent = text;
    message.className = `message ${type}`.trim();
}

function updateTrafficLabel() {
    const load = Number(loadSlider.value);

    loadValue.textContent = formatNumber(load);

    const max = Number(loadSlider.max) || 5000;
    const percent = (load / max) * 100;

    loadSlider.style.background =
        `linear-gradient(to right, #74e6c3 0%, #74e6c3 ${percent}%, #2b3950 ${percent}%, #2b3950 100%)`;

    // if (loadSlider) {
    //     const max = Number(loadSlider.max) || 5000;
    //     const value = Number(loadSlider.value) || 0;
    //     const percent = (value / max) * 100;

    //     loadSlider.style.background =
    //         `linear-gradient(to right, #74e6c3 0%, #74e6c3 ${percent}%, #2b3950 ${percent}%, #2b3950 100%)`;
    // }

    const badge = $("trafficBadge");
    if (load >= 4000) {
        badge.textContent = "EXTREME LOAD";
        badge.className = "state-badge danger";
    } else if (load >= 2500) {
        badge.textContent = "HIGH LOAD";
        badge.className = "state-badge warning";
    } else {
        badge.textContent = "NORMAL LOAD";
        badge.className = "state-badge";
    }
}

function updateModeDescription() {
    const info = modeInfo[modeSelect.value];
    $("modeDescription").querySelector(".mode-symbol").textContent = info.symbol;
    $("modeDescription").querySelector("span:last-child").textContent = info.description;
}

function renderMetrics(result) {
    $("instances").textContent = result.instances;
    $("cpu").textContent = `${result.cpuCoresPerInstance} cores`;
    $("ram").textContent = `${result.ramGBPerInstance} GB`;
    $("capacity").textContent = formatNumber(result.totalCapacityRequestsPerSecond);
    $("instanceMeta").textContent = `Maximum configured: ${10} instances`;
    $("fleetCount").textContent = `${result.instances} ${result.instances === 1 ? "instance" : "instances"}`;

    const utilization = result.utilizationPercent;
    $("utilization").innerHTML = `${utilization}<small>%</small>`;
    $("gaugeValue").textContent = `${utilization}%`;

    $("progress").style.width = `${Math.min(100, utilization)}%`;
    $("progress").classList.toggle("overloaded", utilization > 100);

    $("utilizationState").textContent =
        result.unservedRequestsPerSecond > 0
            ? "Capacity exceeded"
            : utilization >= 80
                ? "High utilization"
                : "Within capacity";

    $("utilizationState").className =
        `utilization-state ${
            result.unservedRequestsPerSecond > 0
                ? "danger"
                : utilization >= 80
                    ? "warning"
                    : "healthy"
        }`;

    $("gaugeVisual").classList.toggle(
        "overloaded",
        result.unservedRequestsPerSecond > 0
    );

    const alert = $("overloadAlert");
    alert.hidden = result.unservedRequestsPerSecond <= 0;

    if (!alert.hidden) {
        $("overloadText").textContent =
            `${formatNumber(result.unservedRequestsPerSecond)} requests/sec exceed the available capacity.`;
    }
}

function renderInstances(result) {
    const grid = $("instanceGrid");
    grid.replaceChildren();

    for (let i = 0; i < result.instances; i++) {
        const card = document.createElement("article");
        card.className = "instance-card";

        const capacityPerInstance =
            result.cpuCoresPerInstance * 250;

        const instanceLoad = Math.min(
            100,
            result.incomingRequestsPerSecond /
                Math.max(1, result.instances) /
                capacityPerInstance * 100
        );

        const status = result.unservedRequestsPerSecond > 0
            ? "Limited"
            : instanceLoad >= 80
                ? "High load"
                : "Healthy";

        const statusClass = result.unservedRequestsPerSecond > 0
            ? "danger"
            : instanceLoad >= 80
                ? "warning"
                : "healthy";

        const heading = document.createElement("div");
        heading.className = "instance-card-heading";

        const serverIcon = document.createElement("span");
        serverIcon.className = "server-icon";
        serverIcon.textContent = "▤";

        const name = document.createElement("strong");
        name.textContent = `Instance ${String(i + 1).padStart(2, "0")}`;

        const dot = document.createElement("span");
        dot.className = `instance-status-dot ${statusClass}`;

        heading.append(serverIcon, name, dot);

        const statusText = document.createElement("p");
        statusText.className = `instance-status-text ${statusClass}`;
        statusText.textContent = status;

        const cpuRow = document.createElement("div");
        cpuRow.className = "resource-row";
        cpuRow.innerHTML =
            `<span>CPU</span><strong>${result.cpuCoresPerInstance} cores</strong>`;

        const cpuTrack = document.createElement("div");
        cpuTrack.className = "resource-track";

        const cpuFill = document.createElement("div");
        cpuFill.className = "resource-fill cpu-fill";
        cpuFill.style.width = `${Math.min(100, instanceLoad)}%`;
        cpuTrack.append(cpuFill);

        const ramRow = document.createElement("div");
        ramRow.className = "resource-row";
        ramRow.innerHTML =
            `<span>RAM</span><strong>${result.ramGBPerInstance} GB</strong>`;

        const ramTrack = document.createElement("div");
        ramTrack.className = "resource-track";

        const ramFill = document.createElement("div");
        ramFill.className = "resource-fill ram-fill";
        ramFill.style.width =
            `${Math.min(100, result.ramGBPerInstance / 8 * 100)}%`;
        ramTrack.append(ramFill);

        const footer = document.createElement("div");
        footer.className = "instance-footer";
        footer.textContent =
            `${formatNumber(capacityPerInstance)} req/s theoretical capacity`;

        card.append(
            heading,
            statusText,
            cpuRow,
            cpuTrack,
            ramRow,
            ramTrack,
            footer
        );

        grid.append(card);
    }

    $("fleetFooterText").textContent =
        `${result.instances} simulated instance${result.instances === 1 ? "" : "s"} · ${formatNumber(result.totalCapacityRequestsPerSecond)} req/s total capacity`;
}

function renderChart() {
    const svg = $("trafficChart");
    const width = 640;
    const height = 230;
    const left = 44;
    const right = 14;
    const top = 18;
    const bottom = 30;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;

    if (history.length === 0) return;

    const maxValue = Math.max(
        100,
        ...history.map((item) => Math.max(item.load, item.capacity))
    ) * 1.15;

    const x = (i) => left + (history.length === 1
        ? plotWidth / 2
        : i / (history.length - 1) * plotWidth);

    const y = (value) => top + plotHeight - value / maxValue * plotHeight;

    const makePoints = (key) =>
        history.map((item, i) => `${x(i)},${y(item[key])}`).join(" ");

    const parts = [];

    for (let i = 0; i <= 4; i++) {
        const yy = top + i * plotHeight / 4;
        const value = maxValue * (1 - i / 4);

        parts.push(
            `<line x1="${left}" y1="${yy}" x2="${width - right}" y2="${yy}" class="chart-grid-line"/>`,
            `<text x="${left - 8}" y="${yy + 4}" text-anchor="end" class="chart-axis-label">${Math.round(value)}</text>`
        );
    }

    parts.push(
        `<polyline points="${makePoints("capacity")}" class="chart-capacity"/>`,
        `<polyline points="${makePoints("load")}" class="chart-traffic"/>`
    );

    history.forEach((item, i) => {
        parts.push(
            `<circle cx="${x(i)}" cy="${y(item.load)}" r="3.5" class="chart-traffic-point"><title>Traffic: ${item.load} req/s</title></circle>`,
            `<circle cx="${x(i)}" cy="${y(item.capacity)}" r="3" class="chart-capacity-point"><title>Capacity: ${item.capacity} req/s</title></circle>`
        );
    });

    parts.push(
        `<text x="${left}" y="${height - 7}" class="chart-axis-label">Run 1</text>`,
        `<text x="${width - right}" y="${height - 7}" text-anchor="end" class="chart-axis-label">Run ${history.length}</text>`
    );

    svg.innerHTML = parts.join("");
}

function addEvent(result) {
    const previous = previousResult;
    let title = "Scaling simulation completed";
    let description = `${formatNumber(result.incomingRequestsPerSecond)} req/s incoming traffic`;

    if (result.unservedRequestsPerSecond > 0) {
        title = "Capacity limit reached";
        description = `${formatNumber(result.unservedRequestsPerSecond)} req/s unserved`;
    } else if (previous && result.instances > previous.instances) {
        title = "Horizontal scale-out";
        description = `Instances increased from ${previous.instances} to ${result.instances}`;
    } else if (previous && result.instances < previous.instances) {
        title = "Horizontal scale-in";
        description = `Instances decreased from ${previous.instances} to ${result.instances}`;
    } else if (previous && result.cpuCoresPerInstance > previous.cpuCoresPerInstance) {
        title = "Vertical scale-up";
        description = `CPU upgraded to ${result.cpuCoresPerInstance} cores per instance`;
    } else if (previous && result.ramGBPerInstance > previous.ramGBPerInstance) {
        title = "Memory upgrade";
        description = `RAM upgraded to ${result.ramGBPerInstance} GB per instance`;
    }

    events.unshift({
        title,
        description,
        mode: result.mode,
        time: new Date().toLocaleTimeString()
    });

    if (events.length > 8) events.pop();

    renderEvents();
}

function renderEvents() {
    const log = $("eventLog");
    log.replaceChildren();
    $("eventCount").textContent = `${events.length} EVENT${events.length === 1 ? "" : "S"}`;

    if (!events.length) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "Your scaling decisions will appear here.";
        log.append(empty);
        return;
    }

    for (const event of events) {
        const row = document.createElement("div");
        row.className = "event-item";

        const icon = document.createElement("span");
        icon.className = "event-symbol";
        icon.textContent = event.title.includes("Capacity") ? "!" : "↗";

        const content = document.createElement("div");
        content.className = "event-content";

        const title = document.createElement("strong");
        title.textContent = event.title;

        const description = document.createElement("p");
        description.textContent = event.description;

        const meta = document.createElement("small");
        meta.textContent = `${event.mode} · ${event.time}`;

        content.append(title, description, meta);
        row.append(icon, content);
        log.append(row);
    }
}

async function runSimulation() {
    runButton.disabled = true;
    $("runBtnText").textContent = "Simulating...";
    $("systemStatus").textContent = "PROCESSING WORKLOAD";
    setMessage("Calculating the new simulated infrastructure configuration...");

    try {
        const response = await fetch("/api/scale", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                load: Number(loadSlider.value),
                mode: modeSelect.value
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "The scaling request failed.");
        }

        renderMetrics(result);
        renderInstances(result);

        history.push({
            load: result.incomingRequestsPerSecond,
            capacity: result.totalCapacityRequestsPerSecond
        });

        if (history.length > 12) history.shift();

        renderChart();
        addEvent(result);

        previousResult = result;

        $("systemStatus").textContent =
            result.unservedRequestsPerSecond > 0
                ? "CAPACITY LIMIT REACHED"
                : "SYSTEM OPERATING";

        setMessage(
            result.unservedRequestsPerSecond > 0
                ? result.note
                : "Simulation complete. Infrastructure metrics updated.",
            result.unservedRequestsPerSecond > 0 ? "danger" : "success"
        );
    } catch (error) {
        $("systemStatus").textContent = "SIMULATION ERROR";
        setMessage(`Could not run simulation: ${error.message}`, "danger");
    } finally {
        runButton.disabled = false;
        $("runBtnText").textContent = "Run simulation";
    }
}

$("load").addEventListener("input", updateTrafficLabel);
$("mode").addEventListener("change", updateModeDescription);
runButton.addEventListener("click", runSimulation);

document.querySelectorAll(".preset-btn").forEach((button) => {
    button.addEventListener("click", () => {
        loadSlider.value = button.dataset.load;
        updateTrafficLabel();

        document.querySelectorAll(".preset-btn").forEach((item) => {
            item.classList.toggle("active", item === button);
        });
    });
});

const clearEventsButton = $("clearEvents");

if (clearEventsButton) {
    clearEventsButton.addEventListener("click", () => {
        events.length = 0;
        renderEvents();
    });
}

updateTrafficLabel();
updateModeDescription();
renderEvents();
runSimulation();
