import * as React from "react"
import { StyleProp,  ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Box ,IIconProps} from "native-base"


export interface IconsProps  extends IIconProps{
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  icon?:any
}

/**
 * Describe your component here
 */
export const Icons = observer(function Icons(props: IconsProps) {
  const { style,icon,...rest } = props

  return (
    <Box {...rest}>
      {icon}
    </Box>
  )
})
