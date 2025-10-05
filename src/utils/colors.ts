interface HighlightColor {
  color?: string;
  text: string;
}

export function getHighlightColorList() {
  return [
    { tag: "red", name: "Red", color: "#fb464c", showInMenu: true },
    { tag: "orange", name: "Orange", color: "#e9973f", showInMenu: true },
    { tag: "yellow", name: "Yellow", color: "#e0de71", showInMenu: true },
    { tag: "green", name: "Green", color: "#44cf6e", showInMenu: true },
    { tag: "cyan", name: "Cyan", color: "#53dfdd", showInMenu: true },
    { tag: "blue", name: "Blue", color: "#027aff", showInMenu: true },
    { tag: "purple", name: "Purple", color: "#a882ff", showInMenu: true },
    { tag: "pink", name: "Pink", color: "#fa99cd", showInMenu: true },
  ];
}

export function parseHighlightContent(content: string): HighlightColor {
  try {
    // Aceita =={cor}texto==, =={}texto== ou ==texto==
    const match = content.match(/^==(?:\{([^}]*)\})?([\s\S]+?)==$/);
    if (!match) return {
      text: content,
    };

    const [, colorKey = "", textRaw = ""] = match;
    const colorList = getHighlightColorList();

    const colorKeyTrimmed = colorKey.trim();
    const text = textRaw.trim();

    if (!colorKeyTrimmed) {
      // sem cor especificada → null
      return { color: undefined, text };
    }

    // tenta cor predefinida
    const predefined = colorList.find((c) => c.tag === colorKeyTrimmed);
    if (predefined) {
      return { color: predefined.color, text };
    }

    // tenta RGBA direta
    const rgbaMatch = colorKeyTrimmed.match(
      /^(\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)$/
    );
    if (rgbaMatch) {
      const [_, r, g, b, a] = rgbaMatch;
      return { color: `rgba(${r},${g},${b},${a})`, text };
    }

    // se nada deu match, cor nula
    return { color: undefined, text };
  } catch (err) {
    console.error("parseHighlightContent error:", err);
    return {
      text: content,
    };
  }
}