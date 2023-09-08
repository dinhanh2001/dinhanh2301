import { ImageStyle, StyleProp, ViewStyle } from "react-native"
//import { IconTypes } from "./icons"
import { IIconProps } from "native-base"
export interface IconProps extends IIconProps{
  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */

  containerStyle?: StyleProp<ViewStyle>

  /**
   * The name of the icon
   */

  icon?: any
}
