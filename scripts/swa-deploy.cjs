const { spawnSync } = require("node:child_process");

const args = process.argv.slice(2);
const nodeOptions = [process.env.NODE_OPTIONS, "--experimental-global-webcrypto"]
  .filter(Boolean)
  .join(" ");

const deploy = spawnSync("swa", ["deploy", ...args], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: nodeOptions,
  },
});

if (deploy.error) {
  throw deploy.error;
}

process.exit(deploy.status ?? 1);
