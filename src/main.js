const root = document.querySelector("#app");
const appUrl = new URL("./app.js?v=20260514r", import.meta.url);

const response = await fetch(appUrl, { cache: "no-store" });

if (!response.ok) {
  throw new Error(`Failed to load app module: ${response.status}`);
}

let source = await response.text();

source = source.replaceAll("20260514p", "20260514s");
source = source.replace(
  /from\s+["'](\.\/[^"']+)["']/g,
  (_, specifier) => `from "${new URL(specifier, appUrl).href}"`,
);

const moduleUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));

try {
  const { createApp } = await import(moduleUrl);
  createApp(root);
} finally {
  URL.revokeObjectURL(moduleUrl);
}
