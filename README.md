Here is a comprehensive `README.md` file that captures the project architecture, the configuration for your load profiles, and every execution command you need to run the tests.

# Load Testing Petstore API with k6

This project implements a modular load testing suite for the Swagger Petstore API using **k6** and **TypeScript**. It features configurable load profiles, environmental variables, and automated HTML reporting.

---

## 🚀 Execution Commands

### 1. Project Initialization

Before running tests, ensure all dependencies are installed and the code is bundled.

```bash
# Install dependencies
pnpm install

# Bundle TypeScript into JavaScript
pnpm run bundle

```

### 2. Running Load Profiles

Use the following commands to execute different testing scenarios. Ensure you are in the **root directory** of the project.

| Profile    | Purpose                                | Command                                                                            |
| ---------- | -------------------------------------- | ---------------------------------------------------------------------------------- |
| **Smoke**  | Verify script integrity (1 VU)         | `k6 run -e PROFILE=smoke -e BASE_URL=https://petstore.swagger.io/v2 dist/main.js`  |
| **Load**   | Performance under normal load          | `k6 run -e PROFILE=load -e BASE_URL=https://petstore.swagger.io/v2 dist/main.js`   |
| **Stress** | Find system breaking point             | `k6 run -e PROFILE=stress -e BASE_URL=https://petstore.swagger.io/v2 dist/main.js` |
| **Soak**   | Check for memory leaks (long duration) | `k6 run -e PROFILE=soak -e BASE_URL=https://petstore.swagger.io/v2 dist/main.js`   |

---

## 📂 Project Structure

- `src/lib/`: Modular API wrappers for **Pet**, **Store**, and **User** endpoints.
- `src/main.ts`: The orchestrator script defining load stages, thresholds, and test logic.
- `dist/`: Contains the bundled `main.js` used by k6.
- `reports/k6/<profile>/`: Automated HTML reports generated after each run.

---

## ⚙️ Configuration Details

### Load Profiles (in `main.ts`)

The script supports four distinct profiles:

1. **Smoke**: 1 Virtual User (VU) for 10 seconds.
2. **Load**: Ramps up to 20 VUs over 4 minutes.
3. **Stress**: Ramps up to 100 VUs to test capacity.
4. **Soak**: Sustained load of 10 VUs for 1 hour.

### Global Thresholds

The test will automatically fail if:

- **Success Rate**: More than 1% of requests fail (`http_req_failed`).
- **Latency**: 95% of requests exceed 500ms (`http_req_duration`).

---

## 📊 Reporting

After every execution, an HTML report is generated using the `benc-uk/k6-reporter`. The report provides:

- **Request Summary**: Total requests, failures, and RPS.
- **Checks/Assertions**: Pass/fail rate for specific API validations.
- **Performance**: Detailed breakdown of Latency, Connecting, and Waiting times.

---

## 🛠 Troubleshooting

**Error: `dist/main.js` not found**

- Ensure you have run `pnpm run bundle` first.
- Check that you are running the `k6` command from the root directory, not inside the `src` folder.

**Error: `Object is possibly null**`

- The script uses Type Assertions (`as any`) when parsing JSON responses to ensure TypeScript ignores potential null values from the API.
