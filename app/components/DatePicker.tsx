import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Text } from "./Text"
import { Box, Input,Icon } from "native-base"
import { dateSetHoursMinutesString,dateString } from "../utils/common"
import { AntDesign } from "@expo/vector-icons"
import DateTimePickerModal from "react-native-modal-datetime-picker";
export interface DatePickerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  defaultValue?: string
  mode?:"date"| "time" 
  onPassing?(e): void
}

/**
 * Describe your component here
 */
export const DatePicker = observer(function DatePicker(props: DatePickerProps) {
  const { style,defaultValue,mode,onPassing,...rest } = props
  const $styles = [$container, style]
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [date, setDate] = React.useState<string>(defaultValue)
  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    setDate(date.toJSON())
    setDatePickerVisibility(false)
    onPassing(date)
  }
  return (
    <View style={$styles}>
      <Box>
      <Input
          defaultValue={date ? (mode=="time"?dateSetHoursMinutesString(date):dateString(date) ) : ""}
          placeholder="Birth day"
          showSoftInputOnFocus={false}
          onFocus={()=> {showDatePicker()}}
          isDisabled={isDatePickerVisible}
          onChange={(e)=>console.log(e)}
          InputRightElement={<Icon m="1" size="6" color="black" as={<AntDesign onPress={showDatePicker} name="calendar" size={24} color="black"/>}/>}
          {...rest}
          
        />
      </Box>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        // locale={"vi"}
        date={ date ? new Date(date) : new Date() }
      />
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

