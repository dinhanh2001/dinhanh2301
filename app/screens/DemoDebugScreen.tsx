import React, { FC, useState } from "react"
import * as Application from "expo-application"
import { Linking, Platform, TextStyle, View, ViewStyle, Pressable } from "react-native"
import { Button, ListItem, Screen, Text, ScanQrCode } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { isRTL } from "../i18n"
import { useStores } from "../models"


function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
}

export const DemoDebugScreen: FC<DemoTabScreenProps<"DemoDebug">> = function DemoDebugScreen(
  _props,
) {
  const {
    authenticationStore: { logout,ReFreshToken },
  } = useStores()

   const reFreshtoken = async () =>{
    let Refresh = ReFreshToken()
    const refreshAccess = await Refresh
   }
  // const demoReactotron = React.useMemo(
  //   () => async () => {
  //     console.tron.display({
  //       name: "DISPLAY",
  //       value: {
  //         appId: Application.applicationId,
  //         appName: Application.applicationName,
  //         appVersion: Application.nativeApplicationVersion,
  //         appBuildVersion: Application.nativeBuildVersion,
  //         hermesEnabled: usingHermes,
  //       },
  //       important: true,
  //     })
  //   },
  //   [],
  // )

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text
        style={$reportBugsLink}
        tx="demoDebugScreen.reportBugs"
        onPress={() => openLinkInBrowser("https://github.com/infinitered/ignite/issues")}
      />
      <Text style={$title} preset="heading" tx="demoDebugScreen.title" />
      
      <View style={$buttonContainer}>

        {/* <Text style={$hint} tx={`demoDebugScreen.${Platform.OS}ReactotronHint` as const} /> */}
      
        

      </View>
      <View style={$buttonContainer}>
        <Button style={$button} tx="common.logOut" onPress={reFreshtoken} />
        <Button style={$button} tx="common.logOut" onPress={logout} />
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $title: TextStyle = {
  marginBottom: spacing.huge,
}

const $reportBugsLink: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.large,
  alignSelf: isRTL ? "flex-start" : "flex-end",
}

const $item: ViewStyle = {
  marginBottom: spacing.medium,
}

const $itemsContainer: ViewStyle = {
  marginBottom: spacing.extraLarge,
}

const $button: ViewStyle = {
  marginBottom: spacing.extraSmall,
}

const $buttonContainer: ViewStyle = {
  marginBottom: spacing.medium,
}

const $hint: TextStyle = {
  color: colors.palette.neutral600,
  fontSize: 12,
  lineHeight: 15,
  paddingBottom: spacing.large,
}

// @demo remove-file
