// src/theme.js

// ---- COLOR PALETTE ----
const CloudWhite = "#f5f6fc";        // page background
const SoftBorder = "#d9ddf2";        // borders
const Periwinkle = "#727bd8";        // MAIN BRAND COLOR
const PeriwinkleHover = "#5f67c9";   // hover shade
const PeriwinkleSelected = "#4e56b8";// selected shade
const SkyAccent = "#8f97ff";         // info / accent

// ---- UNIFIED LIGHT THEME ----
export const appTheme = {
  token: {
    // Brand Colors
    colorPrimary: Periwinkle,
    colorInfo: SkyAccent,

    // Backgrounds
    colorBgBase: CloudWhite,
    colorBgContainer: "#ffffff",

    // Text
    colorTextBase: "#1f2430",

    // Borders
    colorBorder: SoftBorder,
    colorBorderSecondary: "#eceeff",


    fontSize: 12,              // base font size
    fontSizeSM: 10,            // small text
    fontSizeLG: 13,            // slightly bigger

    fontSizeHeading1: 16,
    fontSizeHeading2: 14,
    fontSizeHeading3: 13,
    fontSizeHeading4: 12,
    fontSizeHeading5: 11,
  },

  components: {
    // ---- LAYOUT ----
    Layout: {
      // Sidebar
      siderBg: Periwinkle,
      triggerBg: PeriwinkleHover,
      triggerColor: "#ffffff",

      // Header
      headerBg: Periwinkle,
      headerColor: "#ffffff",

      // Page backgrounds
      bodyBg: CloudWhite,
      footerBg: CloudWhite,
    },

    // ---- MENU ----
    Menu: {
      itemBg: Periwinkle,
      itemHoverBg: PeriwinkleHover,
      itemSelectedBg: PeriwinkleSelected,

      itemColor: "#ffffff",
      itemHoverColor: "#ffffff",
      itemSelectedColor: "#ffffff",

      subMenuItemSelectedColor: "#ffffff",
      colorTextMenuSelected: "#ffffff",
    },
  },
};




// // src/theme.js

// // ---- COLOR PALETTE ----
// const CloudWhite = "#fff5f8";        // light pinkish background
// const SoftBorder = "#f2d6df";        // soft pink border

// const PinkPrimary = "#d63384";       // MAIN BRAND COLOR
// const PinkHover = "#c22574";         // hover shade
// const PinkSelected = "#a61e63";      // selected shade

// const PinkAccent = "#ff85a2";        // accent/info color

// // ---- UNIFIED LIGHT THEME ----
// export const appTheme = {
//   token: {
//     // Brand Colors
//     colorPrimary: PinkPrimary,
//     colorInfo: PinkAccent,

//     // Backgrounds
//     colorBgBase: CloudWhite,
//     colorBgContainer: "#ffffff",

//     // Text
//     colorTextBase: "#2b1b22",

//     // Borders
//     colorBorder: SoftBorder,
//     colorBorderSecondary: "#fdecef",

//     // Typography
//     fontSize: 12,
//     fontSizeSM: 10,
//     fontSizeLG: 13,

//     fontSizeHeading1: 16,
//     fontSizeHeading2: 14,
//     fontSizeHeading3: 13,
//     fontSizeHeading4: 12,
//     fontSizeHeading5: 11,
//   },

//   components: {
//     // ---- LAYOUT ----
//     Layout: {
//       // Sidebar
//       siderBg: PinkPrimary,
//       triggerBg: PinkHover,
//       triggerColor: "#ffffff",

//       // Header
//       headerBg: PinkPrimary,
//       headerColor: "#ffffff",

//       // Page backgrounds
//       bodyBg: CloudWhite,
//       footerBg: CloudWhite,
//     },

//     // ---- MENU ----
//     Menu: {
//       itemBg: PinkPrimary,
//       itemHoverBg: PinkHover,
//       itemSelectedBg: PinkSelected,

//       itemColor: "#ffffff",
//       itemHoverColor: "#ffffff",
//       itemSelectedColor: "#ffffff",

//       subMenuItemSelectedColor: "#ffffff",
//       colorTextMenuSelected: "#ffffff",
//     },
//   },
// };



// src/theme.js

// ---- COLOR PALETTE ----
// const BlossomPink = "#f472b6";        // primary (soft pink)
// const BlossomHover = "#ec4899";      // hover
// const BlossomSelected = "#db2777";   // selected

// const PetalBg = "#fff1f5";           // page background (very light pink)
// const CardWhite = "#ffffff";

// const SoftBorder = "#fbcfe8";        // soft pink border
// const BorderLight = "#fde7f3";

// const AccentPink = "#f9a8d4";        // accent/info

// // ---- THEME ----
// export const appTheme = {
//   token: {
//     // Brand
//     colorPrimary: BlossomPink,
//     colorInfo: AccentPink,

//     // Backgrounds
//     colorBgBase: PetalBg,
//     colorBgContainer: CardWhite,

//     // Text
//     colorTextBase: "#3b1f2b",

//     // Borders
//     colorBorder: SoftBorder,
//     colorBorderSecondary: BorderLight,

//     // Radius (adds soft UI feel 🌸)
//     borderRadius: 10,

//     // Typography
//     fontSize: 12,
//     fontSizeSM: 10,
//     fontSizeLG: 13,

//     fontSizeHeading1: 16,
//     fontSizeHeading2: 14,
//     fontSizeHeading3: 13,
//     fontSizeHeading4: 12,
//     fontSizeHeading5: 11,
//   },

//   components: {
//     Layout: {
//       siderBg: BlossomPink,
//       triggerBg: BlossomHover,
//       triggerColor: "#ffffff",

//       headerBg: BlossomPink,
//       headerColor: "#ffffff",

//       bodyBg: PetalBg,
//       footerBg: PetalBg,
//     },

//     Menu: {
//       itemBg: BlossomPink,
//       itemHoverBg: BlossomHover,
//       itemSelectedBg: BlossomSelected,

//       itemColor: "#ffffff",
//       itemHoverColor: "#ffffff",
//       itemSelectedColor: "#ffffff",

//       subMenuItemSelectedColor: "#ffffff",
//       colorTextMenuSelected: "#ffffff",
//     },

//     Button: {
//       borderRadius: 8,
//     },

//     Card: {
//       borderRadius: 12,
//     },
//   },
// };





// src/theme.js

// ---- COLOR PALETTE ----
// const BlossomPink = "#f472b6";        // primary soft pink
// const BlossomHover = "#ec4899";      // hover
// const BlossomActive = "#db2777";     // active/selected

// const PetalLight = "#fff1f5";        // page background
// const PetalSoft = "#ffe4e6";         // gradient mix

// const White = "#ffffff";

// const SoftBorder = "#fbcfe8";
// const BorderLight = "#fde7f3";

// const AccentPink = "#f9a8d4";

// // ---- THEME CONFIG ----
// export const appTheme = {
//   token: {
//     // 🌸 Brand
//     colorPrimary: BlossomPink,
//     colorInfo: AccentPink,

//     // 🌸 Backgrounds
//     colorBgBase: PetalLight,
//     colorBgContainer: White,

//     // 🌸 Text
//     colorTextBase: "#3b1f2b",

//     // 🌸 Borders
//     colorBorder: SoftBorder,
//     colorBorderSecondary: BorderLight,

//     // 🌸 Shape (important for soft UI)
//     borderRadius: 10,

//     // 🌸 Typography
//     fontSize: 12,
//     fontSizeSM: 10,
//     fontSizeLG: 13,

//     fontSizeHeading1: 16,
//     fontSizeHeading2: 14,
//     fontSizeHeading3: 13,
//     fontSizeHeading4: 12,
//     fontSizeHeading5: 11,
//   },

//   components: {
//     // 🌸 Layout (Sidebar + Header)
//     Layout: {
//       // Gradient sidebar
//       siderBg: BlossomPink, // base fallback

//       // Header gradient feel
//       headerBg: BlossomPink,
//       headerColor: "#ffffff",

//       bodyBg: PetalLight,
//       footerBg: PetalLight,
//     },

//     // 🌸 Menu (Sidebar items)
//     Menu: {
//       itemBg: BlossomPink,
//       itemHoverBg: BlossomHover,
//       itemSelectedBg: BlossomActive,

//       itemColor: "#ffffff",
//       itemHoverColor: "#ffffff",
//       itemSelectedColor: "#ffffff",

//       subMenuItemSelectedColor: "#ffffff",
//       colorTextMenuSelected: "#ffffff",
//     },

//     // 🌸 Buttons
//     Button: {
//       borderRadius: 8,
//       colorPrimary: BlossomPink,
//       colorPrimaryHover: BlossomHover,
//       colorPrimaryActive: BlossomActive,
//     },

//     // 🌸 Cards (Dashboard / Product UI)
//     Card: {
//       borderRadius: 14,
//     },

//     // 🌸 Table
//     Table: {
//       borderRadius: 10,
//     },

//     // 🌸 Input fields
//     Input: {
//       borderRadius: 8,
//     },

//     // 🌸 Modal
//     Modal: {
//       borderRadius: 12,
//     },

//     // 🌸 Tag
//     Tag: {
//       borderRadius: 6,
//     },
//   },
// };