const { spawn } = require("child_process");

const port = process.env.PORT || 8080;

const child = spawn(
  process.execPath,
  ["node_modules/@11ty/eleventy/cmd.js", "--serve", `--port=${port}`],
  { stdio: "inherit" }
);

child.on("exit", (code) => process.exit(code ?? 0));
