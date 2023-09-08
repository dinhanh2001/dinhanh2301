// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  primary100: "#F4E0D9",
  primary200: "#E8C1B4",
  primary300: "#DDA28E",
  primary400: "#D28468",
  primary500: "#C76542",
  primary600: "#A54F31",

  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",

  // custom
  black: "#1d1d1d",
  white: "#ffffff",
  offWhite: "#e6e6e6",
  orange: "#FBA928",
  orangeDarker: "#EB9918",
  lightGrey: "#939AA4",
  lighterGrey: "#CDD4DA",
  angry: "#dd3333",
  deepPurple: "#5D2555",
  pressStart: "#7AF176",
  pressEnd: "#35B1B7",
  bgView: "#F5F6F8",
  focusOut: "#838383",
  primaryst: "#308AF3",
  primaryend: "#4B65DF",
  success: "#2FD686",
  warning: "#FFB931",
  danger: "#F53558",
  info: "#FED7AA",
  mainColor: "#0891b2",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
  palette,
  primary: palette.orange,
  primaryDarker: palette.orangeDarker,
  line: palette.offWhite,
  text: palette.black,
  dim: palette.lightGrey,
  // error: palette.angry,
  storybookDarkBg: palette.black,
  storybookTextColor: palette.black,
  buttstart: palette.pressStart,
  buttend: palette.pressEnd,
  backGroundView: palette.bgView,
  bottomTabFocus: palette.focusOut,
  primaryStart: palette.primaryst,
  primaryend: palette.primaryend,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,
  mainColor: palette.mainColor,
}

export const color = {
  // danger:palette.danger
}
