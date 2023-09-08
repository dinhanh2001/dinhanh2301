import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { Image, Pressable, TextInput, TextStyle, View, ViewStyle } from "react-native"
import {
  Icon,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
  ChangeLanguage,
} from "../components"
import { loadString } from "../utils/storage"
import i18 from "i18n-js"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { ToastMessage } from "../components"
import { Checkbox, useToast, Button } from "native-base"
import { useNetInfo } from "@react-native-community/netinfo"
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}
// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Home: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Home" component={HomeScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const netInfo = useNetInfo()
  const toast = useToast()
  const [changeLanguage, setChangeLanguage] = useState<boolean>(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [language, setLanguage] = useState<string>("")
  const {
    authenticationStore: {
      authEmail,
      authPassword,
      setAuthEmail,
      setAuthPassword,
      setAuthToken,
      validationErrors,
      setIsLogin,
      LoginQRApp,
    },
    userStore: { getCurrentUser },
  } = useStores()

  const errors: typeof validationErrors = isSubmitted ? validationErrors : ({} as any)

  const login = async () => {
    if (!netInfo.isConnected) {
      toast.show({
        placement: "top",
        render: () => {
          return <ToastMessage text="Vui lòng kiểm tra lại kết nối ! " type="warning" />
        },
      })
    } else if (username == "" || password == "") {
      toast.show({
        placement: "top",
        render: () => {
          return <ToastMessage text="Bạn chưa nhập tài khoản hoặc mật khẩu" type="warning" />
        },
      })
    } else {
      let responLogin = await LoginQRApp(username, password)
      if (responLogin == 400 || responLogin == 401) {
        toast.show({
          placement: "top",
          duration: 500,
          render: () => {
            return <ToastMessage text="Sai tài khoản hoặc mật khẩu !" type="warning" />
          },
        })
      } else if (responLogin == 500) {
        toast.show({
          placement: "top",
          render: () => {
            return <ToastMessage text="Lỗi máy chủ ! " type="warning" />
          },
        })
      } else if (responLogin == 200) {
        setIsLogin(true)
      } else {
        toast.show({
          placement: "top",
          render: () => {
            return <ToastMessage text="Lỗi không xác định ! " type="warning" />
          },
        })
      }
      await getCurrentUser()
    }

    //  await LoginQRApp()

    setIsSubmitted(true)
    // setAttemptsCount(attemptsCount + 1)

    if (Object.values(validationErrors).some((v) => !!v)) return
    setIsSubmitted(false)

    // We'll mock this with a fake token.
    setAuthToken(String(Date.now()))
  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  const onChangeUsername = (value: string) => {
    setUsername(value)
  }
  const onChangePassword = (value: string) => {
    setPassword(value)
  }
  // Đóng modal thay đổi ngôn ngữ
  const onClose = (data: boolean) => {
    setChangeLanguage(data)
    // setChangePassword(data)
  }

  // lấy thông tin ngôn ngữ được lưu ở localStorage
  const getLanguage = async () => {
    const lg = await loadString("language")
    if (lg) {
      setLanguage(lg)
    } else {
      const locale = i18.locale.split("-")[0]
      setLanguage(locale)
    }
  }

  useEffect(() => {
    getLanguage()
    return () => {}
  }, [])

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Pressable
        onPressIn={() => {
          setChangeLanguage(true)
        }}
        style={{ position: "absolute", top: 20, right: 30 }}
      >
        <FontAwesome5 name="language" size={24} color="#FFC42C" />
      </Pressable>
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../../assets/icons/iconapp.png")}
          style={{ width: 200, height: 100 }}
        />
      </View>
      <Pressable
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          top: 0,
        }}
      >
        <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn} />
      </Pressable>
      <TextField
        value={username}
        onChangeText={(value) => {
          onChangeUsername(value)
        }}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={errors?.authEmail}
        status={errors?.authEmail ? "error" : undefined}
        // onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={password}
        onChangeText={(value) => onChangePassword(value)}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen.passwordFieldLabel"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        // helper={errors?.authPassword}
        // status={errors?.authPassword ? "error" : undefined}
        // onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />
      <Checkbox value="orange" defaultIsChecked>
        <Text tx="loginScreen.savePassWord" />
      </Checkbox>
      <Button testID="login-button" style={$tapButton} onPress={login}>
        <Text tx="loginScreen.tapToSignIn" style={{ textAlign: "center", fontWeight: "700" }} />
      </Button>
      {changeLanguage ? (
        <ChangeLanguage
          isChange={true}
          languageStorage={language}
          passing={() => {
            onClose(false)
          }}
        />
      ) : null}
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
  flex: 1,
  position: "relative",
}

const $signIn: TextStyle = {
  marginBottom: spacing.small,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.large,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.medium,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.large,
}

// @demo remove-file
