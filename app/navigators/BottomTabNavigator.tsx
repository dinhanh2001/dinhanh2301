import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, getFocusedRouteNameFromRoute } from "@react-navigation/native"
import React, { useEffect, useLayoutEffect } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon, IconsApp } from "../components"
import { translate } from "../i18n"
import { ExplainScreen } from "../screens"
import {
  HomeScreen,
  SettingScreen,
  QrScreen,
  AttendanceScreen,
  StaffExplainListScreen,
  ExplainDetailScreen,
  ApprovalScreen,
} from "../screens"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"

export type DivisionParamList = {
  HomeScreens: undefined
  ExplainScreens: undefined
  Attendance: { name: string }
  StaffExplainList: undefined
  ExplainDetailScreen: { id: string }
  ExplainList: undefined
  ApprovalScreen: { type: "user" | "leader" }
}

export const StacksHome = createNativeStackNavigator<DivisionParamList>()
export type HomeStackScreenProps<T extends keyof DivisionParamList> = StackScreenProps<
  DivisionParamList,
  T
>
// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Qr: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Qr" component={QrScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
const HomeStack: FC<StackScreenProps<BottomTabParamList, "HomeScreen">> = observer(function Home({
  navigation,
  route,
}) {
  const routeName = getFocusedRouteNameFromRoute(route)
  useLayoutEffect(() => {
    if (
      routeName !== "ExplainScreens" &&
      routeName !== "StaffExplainList" &&
      routeName !== "ExplainList" &&
      routeName !== "ExplainDetailScreen" &&
      routeName !== "ApprovalScreen"
    ) {
      navigation.setOptions({ tabBarStyle: "" })
    } else {
      navigation.setOptions({ tabBarStyle: { display: "none" } })
    }
    return () => {}
  }, [navigation, route])
  return (
    <StacksHome.Navigator
      screenOptions={{ headerShown: false }}
      // @demo remove-current-line
    >
      <StacksHome.Screen name="HomeScreens" component={HomeScreen} />
      <StacksHome.Screen name="ExplainScreens" component={ExplainScreen} />
      <StacksHome.Screen name="Attendance" component={AttendanceScreen} />
      <StacksHome.Screen name="StaffExplainList" component={StaffExplainListScreen} />
      <StacksHome.Screen name="ExplainDetailScreen" component={ExplainDetailScreen} />
      <StacksHome.Screen name="ApprovalScreen" component={ApprovalScreen} />
    </StacksHome.Navigator>
  )
})

// const HomeStack = observer(function AppStack({ navigation, route }) {
//   const routeName = getFocusedRouteNameFromRoute(route)
//   useLayoutEffect(() => {
//     if (routeName !== "DivisionScreen") {
//       navigation.setOptions({ tabBarStyle: {} })
//     } else {
//       navigation.setOptions({ tabBarStyle: { display: "none" } })
//     }
//     return () => {}
//   }, [navigation, route])
//   return (
//     <StacksHome.Navigator
//       screenOptions={{ headerShown: false }}
//       // @demo remove-current-line
//     >
//       <StacksHome.Screen name="HomeScreens" component={HomeScreen} />

//       <StacksHome.Screen name="DivisionScreen" component={DivisionScreen} />
//       <StacksHome.Screen name="Attendance" component={AttendanceScreen} />
//     </StacksHome.Navigator>
//   )
// })

export type BottomTabParamList = {
  HomeScreen: undefined
  SettingScreen: undefined
  QrScreen: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DemoTabScreenProps<T extends keyof BottomTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<BottomTabParamList>()

export function BottomTabNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, {}],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeStack}
        options={{
          tabBarLabel: translate("navigator.HomeTab"),
          tabBarIcon: ({ focused }) => (
            <IconsApp
              icon={<Ionicons name="ios-home" size={20} color={focused && colors.mainColor} />}
            />
          ),
        }}
      />

      <Tab.Screen
        name="QrScreen"
        component={QrScreen}
        options={{
          tabBarLabel: translate("navigator.QRTab"),
          tabBarIcon: ({ focused }) => (
            <IconsApp
              icon={
                <MaterialCommunityIcons
                  name="calendar-multiple-check"
                  size={20}
                  color={focused && colors.mainColor}
                />
              }
            />
          ),
        }}
      />

      <Tab.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          tabBarLabel: translate("navigator.Setting"),
          tabBarIcon: ({ focused }) => (
            <IconsApp
              icon={
                <Ionicons
                  name="md-settings-outline"
                  size={20}
                  color={focused && colors.mainColor}
                />
              }
            />
          ),
        }}
      />

      {/* <Tab.Screen
        name="DemoDebug"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: translate("demoNavigator.debugTab"),
          tabBarIcon: ({ focused }) => <Icon icon="debug" color={focused && colors.tint} />,
        }}
      /> */}
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  // paddingTop: spacing.medium,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  flex: 1,
}

// @demo remove-file
