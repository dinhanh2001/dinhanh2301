import * as React from "react"
import { StyleProp, TextStyle, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Text } from "./Text"
import { Pressable as PressableNTB } from "native-base"
import { IPressableProps } from "native-base"
import { TxKeyPath } from "../i18n"
import { LinearGradient } from 'expo-linear-gradient';

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
//   fontFamily: typography.primary,
  fontSize: 16,
  color: colors.background,
  paddingVertical:15,
  textAlign:"center"
}

export interface PressableProps extends IPressableProps{
  /**
   * An optional style override useful for padding & margin.
   */
  tx?:TxKeyPath
  text?:string
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */

export const Pressable = observer(function Pressable(props: PressableProps) {
  const { style,children,tx,text,...rest } = props
  const content = children || <Text tx={tx} text={text} style={TEXT} />
  const styles = Object.assign({}, CONTAINER, style)

  return (
    <LinearGradient  colors={[colors.buttstart, colors.buttend]} start={{ y: 0.0, x: 0.0 }} end={{ y: 0.0, x: 1.0 }} 
    style={{borderRadius:10}}>
    <PressableNTB {...rest} style={styles}>
     {content}
    </PressableNTB>
    </LinearGradient>
  )
})
