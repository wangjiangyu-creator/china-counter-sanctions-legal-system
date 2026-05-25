const root = document.querySelector("#app");
const appUrl = new URL("./app.js?v=20260525a", import.meta.url);

const response = await fetch(appUrl, { cache: "no-store" });

if (!response.ok) {
  throw new Error(`Failed to load app module: ${response.status}`);
}

let source = await response.text();

source = source.replaceAll("20260514p", "20260523d");
source = source.replaceAll("20260514r", "20260523d");
source = source.replaceAll("20260514s", "20260523d");
source = source.replaceAll("20260523a", "20260523d");
source = source.replaceAll("20260523b", "20260523d");
source = source.replaceAll("20260523c", "20260523d");
source = source.replaceAll("20260523d", "20260525a");
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
