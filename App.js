// This is the entry point if you run `yarn expo:start`
// If you run `yarn ios` or `yarn android`, it'll use ./index.js instead.
import App from "./app/app.tsx"
import React from "react"
import { registerRootComponent } from "expo"
import * as SplashScreen from "expo-splash-screen"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {NativeBaseProvider} from "native-base"
SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NativeBaseProvider>
        <App hideSplashScreen={SplashScreen.hideAsync} />
    </NativeBaseProvider>
  </GestureHandlerRootView>
  )
}

registerRootComponent(IgniteApp)
export default IgniteApp
