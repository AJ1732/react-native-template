import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const ICON_DIR = __dirname;
const BASE = "icon.tsx";
const DEFAULT_COLOR = "#1E0010";

function glyphFiles() {
  return readdirSync(ICON_DIR).filter(
    (file) =>
      file.endsWith(".tsx") && file !== BASE && !file.endsWith(".test.tsx"),
  );
}

function read(file: string) {
  return readFileSync(path.join(ICON_DIR, file), "utf8");
}

describe("icon theming", () => {
  it("has at least the known glyphs", () => {
    expect(glyphFiles().length).toBeGreaterThanOrEqual(2);
  });

  it("base owns the frame and the theme default", () => {
    const base = read(BASE);
    expect(base).toContain("<Svg");
    expect(base).toContain("useThemeColors");
    expect(base).toContain("colors.icon");
    expect(base).not.toContain(DEFAULT_COLOR);
  });

  describe.each(glyphFiles())("%s", (file) => {
    const source = read(file);

    it("renders through the <Icon> base", () => {
      expect(source).toContain('from "./icon"');
      expect(source).toContain("<Icon");
    });

    it("does not re-declare a raw <Svg> frame", () => {
      expect(source).not.toContain("<Svg");
    });

    it("does not hardcode the default color", () => {
      expect(source).not.toContain(DEFAULT_COLOR);
    });
  });
});
