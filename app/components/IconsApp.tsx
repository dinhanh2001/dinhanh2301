import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Text } from "./Text"
import {IIconProps} from "native-base"

export interface IconsAppProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  icon : any
}

/**
 * Describe your component here
 */
export const IconsApp = observer(function IconsApp(props: IconsAppProps) {
  const { style,icon,...rest } = props
  const $styles = [$container, style]

  return (
    <View style={$styles}>
        {icon}
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

