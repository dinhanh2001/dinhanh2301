import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Settings, Text } from "../components"
import { useStores } from "../models"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Setting: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Setting" component={SettingScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const SettingScreen: FC<StackScreenProps<AppStackScreenProps, "Setting">> = observer(function SettingScreen() {
  // Pull in one of our MST stores
  const { authenticationStore: {
      validationErrors,
      logout
    }} = useStores()
function IsLogout() {
  logout()
}
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      {/* <Text text="setting"  onPress={IsLogout} style={{fontSize:40}}/> */}
      <Settings/>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  paddingTop:20
}
