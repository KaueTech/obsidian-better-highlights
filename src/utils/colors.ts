export interface HighlightStyle {
  color?: string;      // cor resolvida (hex ou rgba)
  colorName?: string;  // o que estava dentro das chaves { }
  title?: string;
  text: string;        // texto destacado
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

export function parseHighlightContent(content: string): HighlightStyle {
  try {
    // aceita =={cor}texto==, =={}texto== ou ==texto==
    const match = content.match(/^==(?:\{([^}]*)\})?([\s\S]+?)==$/);
    if (!match) {
      return { text: content.trim() };
    }

    const [, colorKey = "", textRaw = ""] = match;
    const colorKeyTrimmed = colorKey.trim();
    const text = textRaw.trim();
    const colorList = getHighlightColorList();

    // Se não tiver nada dentro das chaves → cor indefinida
    if (!colorKeyTrimmed) {
      return { color: undefined, colorName: undefined, text };
    }

    // tenta cor predefinida
    const predefined = colorList.find((c) => c.tag === colorKeyTrimmed);
    if (predefined) {
      return {
        color: predefined.color,
        colorName: colorKeyTrimmed,
        text,
      };
    }

    // tenta RGBA
    const rgbaMatch = colorKeyTrimmed.match(
      /^(\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)$/
    );
    if (rgbaMatch) {
      const [_, r, g, b, a] = rgbaMatch;
      return {
        color: `rgba(${r},${g},${b},${a})`,
        colorName: colorKeyTrimmed,
        text,
      };
    }

    // se não reconheceu a cor, ainda retorna o nome cru
    return {
      color: undefined,
      colorName: colorKeyTrimmed,
      text,
    };
  } catch (err) {
    console.error("parseHighlightContent error:", err);
    return { text: content.trim() };
  }
}
