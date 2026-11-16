// Generates the AVIF and WebP delivery variants of the eleven approved Design V2
// photographs.
//
// The approved PNG masters are only read. Variants go to the Git-ignored working
// directory tmp/studio-noir-images/, never to assets/: reviewed variants are copied
// into the production image directories as a separate manual step.
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const OUTPUT_DIR = resolve(root, "tmp/studio-noir-images");

// Display ratio and delivery widths per role. targetKB holds advisory size targets
// per variant (1 KB = 1024 bytes): exceeding one is reported, not fatal,
// because detailed frames may need more bytes to keep their quality.
const TEAM_AND_WORK = {
  ratio: [4, 5],
  variants: [
    { width: 480, targetKB: { avif: 25, webp: 35 } },
    { width: 800, targetKB: { avif: 50, webp: 80 } },
  ],
};
const ROLES = {
  campaign: {
    ratio: [4, 3],
    variants: [
      { width: 720, targetKB: { avif: 20, webp: 30 } },
      { width: 1200, targetKB: { avif: 40, webp: 60 } },
    ],
  },
  team: TEAM_AND_WORK,
  work: TEAM_AND_WORK,
  studio: {
    ratio: [3, 2],
    variants: [
      { width: 720, targetKB: { avif: 25, webp: 40 } },
      { width: 1200, targetKB: { avif: 60, webp: 90 } },
    ],
  },
};

// Output prefixes keep the production image names referenced by the pages.
const IMAGES = [
  { role: "campaign", source: "assets/img/hero/hero.png", name: "hero-editorial" },
  { role: "team", source: "assets/img/stylists/team-01.png", name: "stylist-1" },
  { role: "team", source: "assets/img/stylists/team-02.png", name: "stylist-2" },
  { role: "team", source: "assets/img/stylists/team-03.png", name: "stylist-3" },
  { role: "work", source: "assets/img/gallery/work-01.png", name: "gallery-1" },
  { role: "work", source: "assets/img/gallery/work-02.png", name: "gallery-2" },
  { role: "work", source: "assets/img/gallery/work-03.png", name: "gallery-3" },
  { role: "work", source: "assets/img/gallery/work-04.png", name: "gallery-4" },
  { role: "work", source: "assets/img/gallery/work-05.png", name: "gallery-5" },
  { role: "work", source: "assets/img/gallery/work-06.png", name: "gallery-6" },
  { role: "studio", source: "assets/img/about/about.png", name: "studio-1" },
];

// Chosen on the approved set: hair strands, skin texture and near-black backdrops hold at
// 1× and 2× zoom, while lower qualities visibly smooth skin and curls. AVIF keeps full
// chroma resolution (4:4:4) for copper and blonde strand edges.
const FORMATS = {
  avif: {
    encode: (image) => image.avif({ quality: 55, effort: 6, chromaSubsampling: "4:4:4", bitdepth: 8 }),
    matches: (meta) => meta.format === "heif" && meta.compression === "av1",
  },
  webp: {
    encode: (image) => image.webp({ quality: 80, effort: 6, smartSubsample: true, preset: "photo" }),
    matches: (meta) => meta.format === "webp",
  },
};

// Masters may miss the exact ratio by generator rounding (1122×1402 is 0.04% wider than
// 4:5). Up to this deviation the centred cover crop trims at most 0.5% of one dimension;
// a larger mismatch would recompose the photograph and is rejected instead.
const MAX_RATIO_DEVIATION = 0.005;

const display = (path) => relative(root, path).replaceAll("\\", "/");
const kb = (bytes) => (bytes / 1024).toFixed(1);
const heightFor = (role, width) => (width * ROLES[role].ratio[1]) / ROLES[role].ratio[0];

// Reads and checks every source before anything is written.
async function loadSources() {
  const problems = [];
  const sources = [];
  for (const image of IMAGES) {
    const [ratioWidth, ratioHeight] = ROLES[image.role].ratio;
    const largest = ROLES[image.role].variants.at(-1).width;
    let input;
    let meta;
    try {
      input = await readFile(resolve(root, image.source));
      meta = await sharp(input).metadata();
    } catch (error) {
      problems.push(`${image.source}: ${error.code === "ENOENT" ? "file is missing" : error.message}`);
      continue;
    }

    const size = `${meta.width}×${meta.height}`;
    const deviation = Math.abs((meta.width * ratioHeight) / (meta.height * ratioWidth) - 1);
    const issues = [];
    if (meta.format !== "png") issues.push(`format is ${meta.format}, expected PNG`);
    if (deviation > MAX_RATIO_DEVIATION) {
      issues.push(`${size} deviates ${(deviation * 100).toFixed(2)}% from ${ratioWidth}:${ratioHeight}`);
    }
    if (meta.width < largest || meta.height < heightFor(image.role, largest)) {
      issues.push(`${size} is smaller than the ${largest}×${heightFor(image.role, largest)} variant; upscaling is not allowed`);
    }
    if (meta.hasAlpha && !(await sharp(input).stats()).isOpaque) {
      issues.push("has transparent pixels, but variants carry no alpha channel");
    }
    problems.push(...issues.map((issue) => `${image.source}: ${issue}`));
    sources.push({ ...image, input, size, deviation });
  }
  return { problems, sources };
}

// Encodes in memory, verifies the result, then replaces only this exact output file.
async function writeVariant(resized, format, target, width, height) {
  const temporary = `${target}.partial`;
  try {
    const data = await FORMATS[format].encode(resized.clone()).toBuffer();
    const meta = await sharp(data).metadata();
    const issues = [
      [FORMATS[format].matches(meta), `encoded as ${meta.format}, not ${format.toUpperCase()}`],
      [meta.width === width && meta.height === height, `${meta.width}×${meta.height}, expected ${width}×${height}`],
      [meta.space === "srgb" && meta.depth === "uchar" && meta.channels === 3, "not 8-bit sRGB without alpha"],
      [!meta.icc && !meta.exif && !meta.xmp, "contains embedded metadata"],
    ].filter(([valid]) => !valid);
    if (issues.length > 0) throw new Error(issues.map(([, issue]) => issue).join("; "));

    await writeFile(temporary, data);
    await rename(temporary, target);
    return data.length;
  } catch (error) {
    // A file left by an earlier run must not pass for this run's output; the original
    // error is reported even if this cleanup fails.
    await Promise.allSettled([rm(temporary, { force: true }), rm(target, { force: true })]);
    throw error;
  }
}

async function main() {
  const { problems, sources } = await loadSources();
  if (problems.length > 0) {
    console.error(`Source validation failed; nothing was written:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    return 1;
  }

  console.log("Sources (read-only):");
  for (const { source, size, role, deviation } of sources) {
    const [w, h] = ROLES[role].ratio;
    console.log(`  ${source.padEnd(34)} ${size.padEnd(10)} ${w}:${h}, deviation ${(deviation * 100).toFixed(2)}%`);
  }

  const expected = new Set();
  const failures = [];
  const aboveTarget = [];
  const totals = { avif: { count: 0, bytes: 0 }, webp: { count: 0, bytes: 0 } };

  console.log(`\nVariants (${display(OUTPUT_DIR)}/):`);
  for (const { role, name, input } of sources) {
    await mkdir(join(OUTPUT_DIR, role), { recursive: true });
    for (const { width, targetKB } of ROLES[role].variants) {
      const height = heightFor(role, width);
      const resized = sharp(input)
        .resize(width, height, { fit: "cover", position: "centre", kernel: "lanczos3" })
        .removeAlpha()
        .toColourspace("srgb");

      for (const format of Object.keys(FORMATS)) {
        const file = `${role}/${name}-${width}.${format}`;
        expected.add(file);
        const label = `  ${file.padEnd(34)} ${`${width}×${height}`.padEnd(10)} ${format.toUpperCase().padEnd(5)}`;
        try {
          const bytes = await writeVariant(resized, format, join(OUTPUT_DIR, file), width, height);
          totals[format].count += 1;
          totals[format].bytes += bytes;
          const over = bytes > targetKB[format] * 1024;
          if (over) aboveTarget.push(`${file}: ${kb(bytes)} KB > ${targetKB[format]} KB`);
          console.log(`${label} ${kb(bytes).padStart(6)} KB  target ≤ ${targetKB[format]} KB${over ? "  ABOVE TARGET" : ""}`);
        } catch (error) {
          failures.push(`${file}: ${error.message}`);
          console.log(`${label} FAILED`);
        }
      }
    }
  }

  const unexpected = (await readdir(OUTPUT_DIR, { recursive: true }))
    .map((path) => path.replaceAll("\\", "/"))
    .filter((path) => !Object.hasOwn(ROLES, path) && !expected.has(path));

  const written = totals.avif.count + totals.webp.count;
  const bytes = totals.avif.bytes + totals.webp.bytes;
  console.log(
    `\nWrote ${written} of ${expected.size} variants (${totals.avif.count} AVIF, ${totals.webp.count} WebP), ` +
      `${kb(bytes)} KB in total (AVIF ${kb(totals.avif.bytes)} KB, WebP ${kb(totals.webp.bytes)} KB).`
  );
  if (aboveTarget.length > 0) {
    console.log(`\nAbove the advisory size targets (review, not errors):\n${aboveTarget.map((line) => `  - ${line}`).join("\n")}`);
  }
  if (unexpected.length > 0) {
    console.log(`\nOther files in ${display(OUTPUT_DIR)}/ were left untouched:\n${unexpected.map((path) => `  - ${path}`).join("\n")}`);
  }
  if (failures.length > 0) {
    console.error(`\n${failures.length} variant(s) failed and were not written:\n${failures.map((f) => `  - ${f}`).join("\n")}`);
    return 1;
  }
  return 0;
}

try {
  process.exitCode = await main();
} catch (error) {
  console.error(`Image generation failed: ${error.message}`);
  process.exitCode = 1;
}
