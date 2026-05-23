import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("README explains how to preview and expand the site", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  assert.match(readme, /python -m http\.server 4173/);
  assert.match(readme, /src\/data\/laws\.js/);
  assert.match(readme, /版权/);
});
