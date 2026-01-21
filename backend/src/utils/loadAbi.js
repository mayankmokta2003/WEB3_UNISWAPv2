import fs from "fs";
import path from "path";

export function loadAbi(relativePath) {
  const abiPath = path.resolve(relativePath);
  const file = fs.readFileSync(abiPath, "utf-8");
  return JSON.parse(file);
}
