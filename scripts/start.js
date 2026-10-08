import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const port = process.env.PORT || "4173";

const server = spawn(
  npmCommand,
  ["run", "preview", "--", "--host", "0.0.0.0", "--port", port],
  {
    cwd: "bloglist-frontend",
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  },
);

server.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 1);
  }
});
