# ScaleLab | Auto-Scaling Simulator

**Understand application scaling through interactive workload simulation.**

ScaleLab is a web-based project that demonstrates how applications can respond to changing workloads using horizontal, vertical, and hybrid scaling strategies. It combines an interactive dashboard, a Node.js REST API, automated tests, Docker containerization, and a GitHub Actions CI pipeline.

**The goal:** Understand how increasing traffic affects application capacity, how resources can be adjusted to handle demand, and how developers can test and automate these behaviors.

**Technology Stack:** Node.js · Express.js · HTML · CSS · JavaScript · Docker · GitHub Actions

---

## 📸 Project Screenshots

Add your screenshots to the `screenshots/` directory and update the image paths below.

### 1. Dashboard Overview

![ScaleLab Dashboard](screenshots/dashboard.png)

*The main dashboard for configuring workloads and observing scaling behavior.*

### 2. Scaling Strategies

![Scaling Strategies](screenshots/scaling-strategies.png)

*Comparison of horizontal, vertical, and hybrid scaling strategies.*

### 3. Workload Simulation and Metrics

![Simulation Results](screenshots/simulation-results.png)

*Simulated resource allocation, capacity, CPU, and workload metrics.*

### 4. REST API Response

![API Response](screenshots/api-response.png)

*Example response from the scaling API.*

### 5. Automated Testing

![Automated Tests](screenshots/tests.png)

*Automated test execution using Node.js's built-in test runner.*

### 6. CI/CD Pipeline

![GitHub Actions Pipeline](screenshots/github-actions.png)

*GitHub Actions workflow for dependency installation, testing, and Docker image building.*

---

## 1. What Exactly Is Scaling?

Imagine an online shopping website during a major sale.

At first, only 20 people visit the website. Everything works smoothly. Pages load quickly, and the server handles requests without difficulty.

Suddenly, 5,000 people arrive at once. Product pages take longer to load, requests begin to pile up, and the server struggles to respond.

**What changed?** The demand on the application increased, but its available resources remained limited.

To handle the additional demand, we need to increase the application's capacity. This process is called **scaling**.

Scaling helps applications handle changing workloads by adjusting the computing resources available to them.

### Why Is Scaling Important?

- **Performance:** Helps applications respond efficiently as demand increases.
- **Availability:** Helps prevent overloaded resources from affecting the user experience.
- **Resource efficiency:** Helps avoid allocating more resources than necessary.
- **Cost management:** Helps balance computing resources against workload requirements.
- **Traffic management:** Helps applications adapt to changes in demand.

This is particularly important for e-commerce platforms, streaming services, banking applications, and other systems that experience fluctuating traffic.

## 2. Understand the Five Important Terms

### 1. Server / Instance

A server or instance is a computing environment that runs an application and processes requests.

In ScaleLab, each instance represents one application server with a modeled CPU capacity and memory allocation.

**Example:** If an application runs across four instances, those instances can share incoming requests, subject to the application's architecture and load distribution.

### 2. Load

Load represents the amount of work arriving at an application.

It may be measured using requests per second, concurrent users, queued jobs, or other workload metrics.

In ScaleLab, the load value represents the workload being simulated.

**Example:** A load of 500 represents 500 simulated workload units. It should not automatically be interpreted as 500 requests per second unless the simulator explicitly defines that unit.

### 3. Replicas

Replicas are multiple running copies of an application. Each replica can process requests, allowing work to be distributed across multiple instances.

Adding replicas can increase the application's total processing capacity, provided the workload can be distributed effectively.

**Example:** Instead of running one application instance, a system might run four replicas to handle a larger volume of incoming requests.

### 4. Horizontal Scaling

Horizontal scaling means adding or removing application instances.

- **Scale out:** Add instances when demand increases.
- **Scale in:** Remove instances when demand decreases.

**Example:** A shopping website adds more application instances during a major sale and reduces the number when traffic returns to normal.

ScaleLab demonstrates horizontal scaling by adjusting the number of simulated instances according to the workload and configured limits.

### 5. CPU Utilization

CPU utilization measures how much of the available processor capacity is being used.

In real-world systems, CPU utilization is one signal an autoscaler can use when deciding whether to add or remove replicas.

**Example:** If CPU utilization remains high for a sustained period, an autoscaler may add instances to distribute the workload.

CPU utilization is not the only useful signal. Memory usage, request latency, queue length, and custom metrics can also help guide scaling decisions.

---

## 3. What Are We Building, and Why?

ScaleLab is an educational simulator designed to make application scaling easier to understand.

Instead of requiring a real cloud environment, it lets users experiment with workload values and observe how different scaling strategies respond.

### What We Are Doing

1. **Simulating workload:** Provide different load values to represent changing application demand.
2. **Applying scaling strategies:** Calculate resource configurations using horizontal, vertical, or hybrid scaling.
3. **Displaying results:** Show the calculated instances, CPU and memory allocations, capacity, utilization, and unserved workload.
4. **Exposing an API:** Allow a client to submit a workload and receive the calculated result as JSON.
5. **Testing the logic:** Run automated tests to validate scaling engine behavior.
6. **Containerizing the application:** Package the application with Docker for consistent execution.
7. **Automating checks:** Use GitHub Actions to install dependencies, run tests, and build the Docker image.

### Why Are We Building It?

Understanding scaling from theory alone can be difficult. ScaleLab makes the concepts observable and interactive.

It helps answer questions such as:

- What happens when traffic suddenly increases?
- When should an application add more instances?
- What is the difference between adding instances and increasing CPU or memory?
- How does limited capacity affect unserved workload?
- How can automated tests help prevent errors in scaling logic?
- How do Docker and CI workflows support reliable software delivery?

The project demonstrates both **application-level scaling concepts and practical DevOps engineering workflows**.

> ScaleLab is a simulation, not a production autoscaler. It calculates modeled resource allocations and does not automatically create, resize, or remove real cloud servers.

---

## 4. Scaling Strategies in ScaleLab

### Horizontal Scaling

Adds or removes instances to adjust total application capacity.

**Best concept to understand:** Distributing workload across multiple application instances.

### Vertical Scaling

Increases or decreases the CPU and memory allocated to an individual instance, within the simulator's configured limits.

**Best concept to understand:** Giving an existing instance more computing resources instead of adding more instances.

### Hybrid Scaling

Combines instance count and per-instance resource allocation to meet workload requirements within the simulator's limits.

**Best concept to understand:** Balancing the number of instances with the resources assigned to each one.

The exact results depend on the scaling algorithm and resource constraints implemented in the project.

---

## 5. Key Features

- Interactive dashboard for configuring simulated workloads.
- Horizontal, vertical, and hybrid scaling modes.
- Workload presets and live simulation updates.
- Instance and resource-allocation visualization.
- Capacity, utilization, and unserved-workload metrics.
- REST API for submitting scaling requests.
- Automated tests using Node.js's built-in test runner.
- Docker support for containerized execution.
- GitHub Actions workflow for automated testing and Docker image building.

## 6. Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Server-side JavaScript runtime |
| Express.js | REST API and static file serving |
| HTML5 | Dashboard structure |
| CSS3 | Dashboard styling and layout |
| JavaScript | Frontend interactions and scaling logic |
| Node.js Test Runner | Automated testing |
| Docker | Application containerization |
| Git and GitHub | Version control and repository hosting |
| GitHub Actions | Continuous integration |

## 7. System Architecture

```text
                    User / Browser
                          |
                          v
                Interactive Dashboard
                 HTML + CSS + JavaScript
                          |
                          v
                   Express REST API
                      server.js
                          |
                          v
                    Scaling Engine
                   scalingEngine.js
                          |
              +-----------+-----------+
              |           |           |
              v           v           v
          Horizontal   Vertical     Hybrid
            Scaling     Scaling     Scaling
              |           |           |
              +-----------+-----------+
                          |
                          v
                 Calculated JSON Result
                          |
                          v
                  Dashboard Metrics


       GitHub Repository
               |
               v
        GitHub Actions
               |
       Install Dependencies
               |
        Run Automated Tests
               |
        Build Docker Image
```

## 8. Project Structure

```text
scalelab-autoscaling-simulator/
│
├── .github/
│   └── workflows/
│       └── main.yml
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── .gitignore
├── Dockerfile
├── package.json
├── package-lock.json
├── scalingEngine.js
├── scalingEngine.test.js
├── server.js
├── testScaling.js
└── README.md
```

## 9. Getting Started

### Prerequisites

Install:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) for container execution

### Step 1: Clone the Repository

```bash
git clone https://github.com/Tanvi-1496/scalelab-autoscaling-simulator.git
cd scalelab-autoscaling-simulator
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Application

```bash
npm start
```

Open `http://localhost:3000` in your browser.

### Step 4: Run Automated Tests

```bash
npm test
```

### Step 5: Run Scenario Tests

```bash
node testScaling.js
```

---

## 10. REST API

ScaleLab exposes endpoints for checking server health and simulating scaling decisions.

### Health Check

**Method:** `GET`

**Endpoint:** `/health`

Example:

```bash
curl http://localhost:3000/health
```

### Run a Scaling Simulation

**Method:** `POST`

**Endpoint:** `/api/scale`

**Content-Type:** `application/json`

Example request:

```json
{
  "load": 1500,
  "mode": "horizontal"
}
```

Example using cURL:

```bash
curl -X POST http://localhost:3000/api/scale \
  -H "Content-Type: application/json" \
  -d "{\"load\":1500,\"mode\":\"horizontal\"}"
```

Supported modes:

- `horizontal`
- `vertical`
- `hybrid`

The response contains the calculated scaling configuration and associated metrics. The exact response fields are defined by the current API implementation.

---

## 11. Docker Containerization

Docker packages the application and its runtime dependencies into a container image, making the application easier to run consistently across environments.

### Build the Docker Image

```bash
docker build -t scalelab-autoscaling-simulator:latest .
```

### Run the Container

```bash
docker run -d --name scalelab \
  -p 3000:3000 \
  scalelab-autoscaling-simulator:latest
```

Open `http://localhost:3000`.

### Stop the Container

```bash
docker stop scalelab
```

### Remove the Container

```bash
docker rm scalelab
```

---

## 12. CI/CD with GitHub Actions

ScaleLab includes a GitHub Actions workflow defined in `.github/workflows/main.yml`.

The workflow runs when changes are pushed to `main` or a pull request targets `main`.

### Pipeline Stages

1. **Checkout:** Retrieves the repository source code.
2. **Setup Node.js:** Configures the Node.js environment.
3. **Install dependencies:** Uses `npm ci` for a reproducible dependency installation.
4. **Run tests:** Executes the automated test suite using `npm test`.
5. **Build Docker image:** Builds the image to validate the container configuration.

This workflow demonstrates continuous integration by automatically checking the application and validating the Docker build.

**Current scope:** The workflow builds the Docker image but does not publish it to Docker Hub or deploy the application to a cloud platform.

---

## 13. Testing

The automated test suite is located in `scalingEngine.test.js`.

Run the tests using:

```bash
npm test
```

The tests help verify the scaling engine's behavior across supported strategies and workload scenarios.

The `testScaling.js` script provides an additional way to execute predefined scenarios and inspect their results.

---

## 14. Engineering Practices

- Modular separation of frontend, API, and scaling logic.
- Dependency management with `package.json` and `package-lock.json`.
- `.gitignore` rules to exclude local dependencies and environment files.
- Automated regression testing.
- Docker-based containerization.
- GitHub Actions continuous integration.
- Incremental Git commits with descriptive messages.

## 15. Future Enhancements

Potential improvements include:

- Real-time charts and historical workload metrics.
- Configurable scaling thresholds and resource limits.
- More detailed resource-cost comparisons.
- Additional input-validation and API error-handling tests.
- Docker image publishing to a container registry.
- Cloud deployment and infrastructure integration.
- Monitoring, logging, and performance benchmarking.

## 16. Learning Outcomes

Through ScaleLab, developers can explore:

- The fundamentals of application scaling and autoscaling.
- The difference between horizontal and vertical scaling.
- REST API development using Express.js.
- Resource-allocation algorithms and automated testing.
- Frontend development with HTML, CSS, and JavaScript.
- Containerization with Docker.
- Continuous integration using GitHub Actions.
- Version control and collaborative development practices.

## Author

**Tanvi Jaware**

GitHub: [@Tanvi-1496](https://github.com/Tanvi-1496)

Project Repository: [ScaleLab Auto-Scaling Simulator](https://github.com/Tanvi-1496/scalelab-autoscaling-simulator)

---

*ScaleLab: Simulate workloads, explore scaling strategies, and understand resource allocation.*
