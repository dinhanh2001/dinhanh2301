import { useState, useEffect } from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { Box, Center, HStack, ScrollView, Avatar, Modal, Button } from "native-base"
import AntDesign from "@expo/vector-icons/AntDesign"
import { observer } from "mobx-react-lite"
import { colors } from "../../theme"
import packageJson from "../../../package.json"
import { loadString } from "../../utils/storage"
import i18 from "i18n-js"
const version = packageJson.version
import {
  SkeletonProfileNav,
  Text,
  ItemList,
  SkeletonItemlist,
  ModalLoader,
  ChangeLanguage,
} from "../index"
import { useStores } from "../../models"

export interface SettingsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Settings = observer(function Settings(props: SettingsProps) {
  const { style } = props
  const styles = [$container, style]
  const [skeleton, setSkeleton] = useState(false)
  const [changeLanguage, setChangeLanguage] = useState<boolean>(false)
  const [isViewProfile, showViewProfile] = useState<boolean>(false)
  // const [changePassword, setChangePassword] = useState<boolean>(false)
  const [language, setLanguage] = useState<string>("")

  const {
    authenticationStore: { validationErrors, logout },
    userStore: { getCurrentUser, user },
  } = useStores()

  // Đăng xuất
  function IsLogout() {
    logout()
  }

  // Đóng modal thay đổi ngôn ngữ
  const onClose = (data: boolean) => {
    setChangeLanguage(data)
    // setChangePassword(data)
  }

  // lấy thông tin ngôn ngữ được lưu ở localStorage
  const getLanguage = async () => {
    console.log("Cleanup function")
    const lg = await loadString("language")
    if (lg) {
      setLanguage(lg)
    } else {
      const locale = i18.locale.split("-")[0]
      setLanguage(locale)
    }
  }

  useEffect(() => {
    const curentUser = async () => {
      await getCurrentUser()
    }
    curentUser()
    if (!user.id) {
      setSkeleton(true)
    } else {
      setSkeleton(false)
    }
    getLanguage()
    return () => {
      getLanguage()
      curentUser()
      setSkeleton(null)
      getCurrentUser()
    }
  }, [])

  const roles = {
    user: "Nhân viên",
    leader: "Quản lí địa điểm",
    manager: "Quản lý khu vực",
    admin: "Giám đốc",
  }

  return (
    <View style={styles}>
      <ScrollView>
        {skeleton ? (
          <SkeletonProfileNav />
        ) : (
          <Box marginX="12" marginY="10">
            <Box bgColor={colors.background} paddingBottom="5">
              <Center>
                {/* <PickImage uri={data["avatar"]} update={updateAvatar} /> */}
                <Avatar
                  source={{ uri: "https://picsum.photos/200/300" }} // https://picsum.photos/200/300
                  size="xl"
                  maxW={120}
                  maxH={120}
                >
                  Avatar
                </Avatar>
                <HStack alignItems={"center"}>
                  <Text text={user.name} />
                </HStack>
                <HStack>
                  <Text tx="settingScreen.role" />
                  <Text text={`: ${roles[`${user.role}`]}`} />
                </HStack>
              </Center>
            </Box>
          </Box>
        )}
        <Text
          tx="settingScreen.user"
          // fontWeight="bold"
          colors={colors.textDim}
          // marginX={"5%"}
          // marginTop={4}
        ></Text>
        <Box>
          {skeleton ? (
            // <SkeletonItemlist icons={true} style={{ width: 300 }} />
            <SkeletonItemlist style={{ width: 300 }} />
          ) : (
            <ItemList
              tx="settingScreen.employ"
              fontWeight={"bold"}
              onPressIn={() => {
                showViewProfile(true)
              }}
              arrowRight={true}
              image={true}
              icon={<AntDesign name="user" size={24} colors="black" />}
            />
          )}
        </Box>
        <Text
          tx="settingScreen.settings"
          // fontWeight={"bold"}
          colors={colors.textDim}
          // marginX={"5%"}
          // marginTop={4}
        ></Text>
        <Box>
          <ItemList
            tx="settingScreen.language"
            fontWeight={"bold"}
            arrowRight={true}
            image={true}
            icon={<AntDesign name="earth" size={24} colors="black" />}
            onPressIn={() => {
              setChangeLanguage(true)
            }}
          />
          {/* <ItemList
            tx="settingScreen.changePassword"
            fontWeight={"bold"}
            arrowRight={true}
            image={true}
            icon={<AntDesign name="edit" size={24} colors="black" />}
            // onPressIn={() => {
            //   setChangePassword(true)
            // }}
          /> */}
          <ItemList
            tx="settingScreen.verInfo"
            fontWeight={"bold"}
            arrowRight={false}
            image={true}
            text={version}
            icon={<AntDesign name="infocirlceo" size={24} colors="black" />}
          />
          <ItemList
            tx="settingScreen.logout"
            fontWeight={"bold"}
            onPressIn={IsLogout}
            arrowRight={true}
            image={true}
            icon={<AntDesign name="logout" size={24} colors="black" />}
          />
        </Box>
        {/* <ModalLoader caption={false} loading={skeleton} /> */}
        {changeLanguage ? (
          <ChangeLanguage
            isChange={true}
            languageStorage={language}
            passing={() => {
              onClose(false)
            }}
          />
        ) : null}
        {/* {changePassword ? (
            <ChangePassword
              isChange={true}
              passing={() => {
                onClose(false)
              }}
            />
          ) : null} */}
        {/* <ToastMessage placement="top" text="OK!"/> */}
      </ScrollView>
      <Modal
        isOpen={isViewProfile}
        onClose={() => {
          showViewProfile(false)
        }}
        size={"full"}
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{user.name}</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <HStack>
                <Text tx="settingScreen.username" />
                <Text text={`: ${user.username}`} />
              </HStack>
              <HStack>
                <Text tx="settingScreen.fullName" />
                <Text text={`: ${user.name}`} />
              </HStack>
              <HStack>
                <Text tx="settingScreen.email" />
                <Text text={`: ${user.email}`} />
              </HStack>
              <HStack>
                <Text tx="settingScreen.phoneNumber" />
                <Text text={`: ${user.phone ? user.phone : ""}`} />
              </HStack>
              <HStack>
                <Text tx="settingScreen.gender" />
                <Text text={`: ${user.gender ? user.gender : ""}`} />
              </HStack>
              <HStack>
                <Text tx="settingScreen.orgId" />
                <Text text={`: ${user.org_ids.length > 0 ? user.org_ids[0] : ""}`} />
              </HStack>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                onPress={() => {
                  showViewProfile(false)
                }}
              >
                <Text style={{ color: "white" }} tx="common.ok" />
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
  marginHorizontal: 10,
}
