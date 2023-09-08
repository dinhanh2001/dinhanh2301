import * as React from "react"
import { StyleProp, View, ViewStyle, } from "react-native"
import { Skeleton, HStack} from "native-base"
import { observer } from "mobx-react-lite"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

export interface SkeletonItemlistProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  icons?: boolean
}

/**
 * Describe your component here
 */
export const SkeletonItemlist = observer(function SkeletonItemlist(props: SkeletonItemlistProps) {
  const { style, icons } = props
  const styles = Object.assign({}, CONTAINER, style)

  return (
    <View style={styles}>
      <HStack space="2" alignItems="center" style={{ marginLeft: "5%", marginTop: "5%"}}>
        {icons && <Skeleton w="10" h="10" rounded="full"/>}
        <Skeleton.Text lines={1} h="10" alignItems="center" px="12" />
      </HStack>
    </View>
  )
})
