import * as React from "react"
import { StyleProp, View, ViewStyle,Modal } from "react-native"
import { observer } from "mobx-react-lite"
import { Spinner } from "native-base"
import { Text } from "./Text"
import { TxKeyPath } from "../i18n"

const activityIndicatorWrapper: ViewStyle = {
  backgroundColor: "white",
  height: 100,
  width: 100,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center"
}
 const modalBackground: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center"
 }

export interface ModalLoaderProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  loading?: boolean
  color?: string
  tx?: TxKeyPath
  caption?: boolean
}

/**
 * Describe your component here
 */

export const ModalLoader = observer(function ModalLoader(props: ModalLoaderProps) {
  const { loading, color, tx, caption } = props
  // const styles = Object.assign({}, CONTAINER, style)
  return (
    <View >
      <Modal
        transparent
        animationType={"none"}
        visible={loading}
        onRequestClose={() => null}
      >
        <View
          style={[
            modalBackground,
            { backgroundColor: `rgba(0,0,0,0.2)`}
          ]}
        >
          <View style={activityIndicatorWrapper}>
            <Spinner animating={loading} size="large" color={color}/>
            { caption && <Text tx={tx}/>}
          </View>
          {/* <ActivityIndicator /> */}
        </View>
      </Modal>
    </View>
  )
})
