import { lawsPart1 } from "./laws.part1.js";
import { lawsPart2 } from "./laws.part2.js";
import { lawsPart3 } from "./laws.part3.js";
import { lawsPart4 } from "./laws.part4.js";
import { lawsPart5 } from "./laws.part5.js";
import { lawsPart6 } from "./laws.part6.js";
import { lawsPart7 } from "./laws.part7.js";
import { lawsPart8 } from "./laws.part8.js";
import { lawSourceSupplements } from "./lawSourceSupplements.js?v=20260710b";

const baseLaws = [
  ...lawsPart1,
  ...lawsPart2,
  ...lawsPart3,
  ...lawsPart4,
  ...lawsPart5,
  ...lawsPart6,
  ...lawsPart7,
  ...lawsPart8,
];

const lawSourceSupplementsById = new Map(lawSourceSupplements.map((record) => [record.id, record.sources]));

function getSourceKey(source) {
  return `${source.label}\u0000${source.url}`;
}

export const laws = baseLaws.map((law) => {
  const supplementalSources = lawSourceSupplementsById.get(law.id) ?? [];

  if (!supplementalSources.length) {
    return law;
  }

  const sourceKeys = new Set(law.sources.map(getSourceKey));
  const sources = [...law.sources];

  supplementalSources.forEach((source) => {
    const key = getSourceKey(source);

    if (!sourceKeys.has(key)) {
      sources.push(source);
      sourceKeys.add(key);
    }
  });

  return { ...law, sources };
});
