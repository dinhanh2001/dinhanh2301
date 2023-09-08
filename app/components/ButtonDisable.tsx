import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Text } from "./Text"
import {Pressable,  IPressableProps } from "native-base"
import { TxKeyPath } from "../i18n"
const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontSize: 14,
  color: colors.background,
  textAlign:"center"
}

export interface ButtonDisabledProps extends IPressableProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  tx?:TxKeyPath
  text?:string
}

/**
 * Describe your component here
 */
export const ButtonDisabled = observer(function ButtonDisabled(props: ButtonDisabledProps) {
  const { style,tx,text,...rest } = props
  const content =  <Text tx={tx} text={text} style={TEXT} />
  const styles = Object.assign({}, CONTAINER, style)

  return (
    <Pressable {...rest} style={styles} bgColor="#d8d8d8" borderRadius={10}>
      {content}
    </Pressable>
  )
})
