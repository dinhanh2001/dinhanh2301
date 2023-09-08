import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors } from "../theme"
import { Text } from "./Text"
import { Box, HStack, VStack } from "native-base"
import Entypo from "@expo/vector-icons/Entypo"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { TxKeyPath } from "../i18n"

export interface ToastMessageProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  tx?: TxKeyPath
  text?: string
  subTx?: TxKeyPath
  subText?: string
  type: "success" | "error" | "warning" | "info"
}

/**
 * Describe your component here
 */
export const ToastMessage = observer(function ToastMessage(props: ToastMessageProps) {
  const { type, text, subTx, subText, tx } = props
  const content = (
    <Text
      tx={tx}
      text={text}
      colors={colors.background}
      style={{ fontSize: 12, color: "#ffffff" }}
    />
  )
  const subContent = (
    <Text
      text={subText}
      tx={subTx}
      colors={colors.background}
      style={{ fontSize: 12, color: "#ffffff" }}
    />
  )

  return (
    <Box
      flexDirection={"row"}
      alignItems="center"
      justifyContent="center"
      h={"auto"}
      width={"100%"}
      // maxWidth={400}
    >
      <VStack space={2} flexShrink={1} w="90%" bg={colors[`${type}`]} p={2} rounded="sm">
        <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Box p={2} bg={colors.background} borderRadius={30} marginRight={2}>
              {type == "success" ? (
                <Entypo name="check" size={24} colors={colors[`${type}`]} />
              ) : type == "error" ? (
                <MaterialIcons name="error" size={24} colors={colors[`${type}`]} />
              ) : type == "info" ? (
                <Entypo name="info" size={24} colors={colors[`${type}`]} />
              ) : type == "warning" ? (
                <Entypo name="warning" size={24} colors={colors[`${type}`]} />
              ) : null}
            </Box>
            <VStack>
              {content}
              {subText || subTx ? subContent : null}
            </VStack>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  )
})
