// Dynamic branding configuration
export const themeConfig = {
  brandName: "SwiftLogistics",
  tagline: "Premium Global Delivery Solutions",
  
  // Color palette - can be easily changed
  colors: {
    primary: "#2563eb",      // Deep blue
    primaryDark: "#1d4ed8",
    secondary: "#7c3aed",    // Violet
    accent: "#0ea5e9",       // Sky blue
    success: "#10b981",      // Emerald
    warning: "#f59e0b",      // Amber
    error: "#ef4444",        // Red
    muted: "#64748b",
    
    // Backgrounds
    background: "#ffffff",
    foreground: "#171717",
    card: "#ffffff",
    cardForeground: "#1e293b",
    border: "#e2e8f0",
  },

  // Typography
  typography: {
    fontFamily: {
      sans: "Inter, system-ui, -apple-system, sans-serif",
      mono: "JetBrains Mono, monospace",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
  },

  // Spacing scale
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },

  // Border radius
  borderRadius: {
    sm: "0.375rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  // Animation durations
  animations: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
};

// Helper function to update theme
export function updateTheme(newConfig: Partial<typeof themeConfig>) {
  Object.assign(themeConfig, newConfig);
  return themeConfig;
}

// CSS variables for dynamic theming
export function getThemeCSSVariables() {
  return `
    :root {
      --primary: ${themeConfig.colors.primary};
      --primary-dark: ${themeConfig.colors.primaryDark};
      --secondary: ${themeConfig.colors.secondary};
      --accent: ${themeConfig.colors.accent};
      --success: ${themeConfig.colors.success};
      --warning: ${themeConfig.colors.warning};
      --error: ${themeConfig.colors.error};
      --muted: ${themeConfig.colors.muted};
      --background: ${themeConfig.colors.background};
      --foreground: ${themeConfig.colors.foreground};
      --card: ${themeConfig.colors.card};
      --card-foreground: ${themeConfig.colors.cardForeground};
      --border: ${themeConfig.colors.border};
      --radius: ${themeConfig.borderRadius.md};
    }
  `;
}