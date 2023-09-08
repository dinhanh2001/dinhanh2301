import * as React from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Text } from "./Text"
import {
  Actionsheet,
  Box,
  Checkbox,
  HStack,
  Popover,
  PresenceTransition,
  TextArea,
  useDisclose,
  useToast,
} from "native-base"
import { Pressable as PressNTB, VStack, Button } from "native-base"
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons"
import { StackNavigationProp } from "@react-navigation/stack"
import { DivisionParamList } from "../navigators/BottomTabNavigator"
import { useStores } from "../models"
import { dateYMD } from "../utils/common"
import { useNetInfo } from "@react-native-community/netinfo"
import { ToastMessage } from "./ToastMessage"
import { DatePicker } from "./DatePicker"
import moment from "moment"

export interface DivisionProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  navigation?: StackNavigationProp<DivisionParamList>
}

/**
 * Describe your component here
 */
const reasonList = [
  { reason: "Lỗi vị trí" },
  { reason: "Không lấy được địa chỉ MAC" },
  { reason: "Lỗi mạng" },
  { reason: "Không lấy được địa chỉ IP" },
  { reason: "Khác" },
]
const activeList = [
  { name: "Chấm vào", active: "in" },
  { name: "Chấm ra", active: "out" },
]

export const Explain = observer(function Division(props: DivisionProps) {
  const { style, navigation } = props
  const $styles = [$container, style]
  const {
    placeStore: { listPlaces },
    explainStore: { setDateExplain, setDecription, addExplain },
    authenticationStore: { idUser, name_user },
  } = useStores()
  // const [isOpenlistStaff, setIsOpenlistStaff] = React.useState(false)
  // const [member, setMember] = React.useState([])
  const netInfo = useNetInfo()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclose()
  const [openPlace, setOpenPlace] = React.useState<boolean>(false)
  const [reason, setReason] = React.useState("Chưa chọn")
  const [place, setPlace] = React.useState<any>({ id: null, name: "Chưa chọn" })
  const [pickactive, setPickActive] = React.useState<string>("Chưa chọn")
  const [status, setStatus] = React.useState<string>("")
  const [openMenu, setOpenMenu] = React.useState(false)
  const [openActive, setOpenActive] = React.useState(false)
  const [latlong, setLatLong] = React.useState<any>({})
  const closeOpenActive = React.useCallback(() => {
    setOpenActive(false)
  }, [openActive, setOpenActive])
  const closePlace = () => {
    setOpenPlace(false)
  }
  React.useEffect(() => {
    const getData = async () => {
      if (netInfo.isConnected == null || netInfo.isConnected == true) {
        // const response = await getAllStaff()
        // setMember(response)
      } else {
        toast.show({
          placement: "top",
          render: () => {
            return <ToastMessage text="Vui lòng kiểm tra lại kết nối ! " type="warning" />
          },
        })
      }
    }
    getData()
    return () => {
      getData()
    }
  }, [netInfo.isConnected])

  const setData = React.useCallback(
    (data: any) => {
      setDecription(data)
    },
    [setDecription],
  )

  const addExplainUser = React.useCallback(async () => {
    console.log(
      reason,
      idUser,
      name_user,
      place.id,
      place.name,
      moment().format("x"),
      status,
      latlong["lat"],
      latlong["long"],
    )
    const response = await addExplain(
      reason,
      idUser,
      name_user,
      place.id,
      place.name,
      parseInt(moment().format("x")),
      status,
      latlong["lat"],
      latlong["long"],
    )
    if (response === true) {
      toast.show({
        placement: "top",
        render: () => {
          return <ToastMessage text="Tạo đơn giải trình thành công" type="success" />
        },
        duration: 3000,
      })
    } else {
      toast.show({
        placement: "top",
        render: () => {
          return (
            <ToastMessage text="Tạo đơn giải trình thất bại vì giải trình thiếu" type="error" />
          )
        },
        duration: 2000,
      })
    }
  }, [place, reason, setDateExplain, setDecription, latlong, setLatLong, status, setStatus])

  return (
    <View style={$container}>
      <View style={$header}>
        <HStack justifyContent={"space-between"} alignItems={"center"}>
          <AntDesign
            name="back"
            size={24}
            color="black"
            onPress={() => {
              navigation.navigate("HomeScreens")
            }}
          />
          <Text tx="DivisionScreen.headerDivision" style={{ fontWeight: "700" }} />

          <Popover // @ts-ignore
            placement={"bottom right"}
            trigger={(triggerProps) => {
              return (
                <TouchableOpacity
                  {...triggerProps}
                  hitSlop={{ bottom: 10, right: 10, left: 10, top: 10 }}
                  onPress={() => setOpenMenu(true)}
                >
                  <Entypo name="menu" size={30} color="black" />
                </TouchableOpacity>
              )
            }}
            isOpen={openMenu}
            onClose={() => setOpenMenu(!openMenu)}
          >
            <Popover.Content w="56">
              <Popover.Arrow />
              {/* <Popover.CloseButton onPress={() => setOpenMenu(false)} /> */}
              <Popover.Header>Tùy chọn</Popover.Header>
              <Popover.Body>
                <TouchableOpacity
                  style={{
                    borderBottomColor: "#c3c3c3",
                    borderBottomWidth: 1,
                    marginBottom: 4,
                    paddingBottom: 15,
                  }}
                  onPress={() => {
                    navigation.navigate("ApprovalScreen", { type: "user" })
                  }}
                >
                  <HStack>
                    <Feather name="menu" size={24} color="black" style={{ marginRight: 10 }} />
                    <Text style={{ fontWeight: "800" }}>Danh sách đơn</Text>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderBottomColor: "#c3c3c3",
                    borderBottomWidth: 1,
                    marginBottom: 4,
                    paddingBottom: 15,
                  }}
                >
                  <HStack>
                    <SimpleLineIcons
                      style={{ marginRight: 10 }}
                      name="options"
                      size={24}
                      color="black"
                    />
                    <Text style={{ fontWeight: "800" }}>Tùy chọn khác</Text>
                  </HStack>
                </TouchableOpacity>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        </HStack>
      </View>
      {/* <View>
        <HStack alignItems={"center"} mt={2} mb={2}>
          <Text text="Chọn trạng thái chấm công:" style={{ fontWeight: "700" }} />
          <Text text=" *" style={{ color: "red" }} />
        </HStack> */}
      {/* <DatePicker
          defaultValue={dateYMD(new Date().getTime())}
          mode="date"
          onPassing={(e) => setDatePick(moment(e).format("x"))}
        /> */}
      {/* </View> */}
      <TouchableOpacity
        onPress={() => {
          setOpenActive(true)
        }}
      >
        <HStack
          justifyContent={"space-between"}
          mb="2"
          alignItems={"center"}
          marginTop={2}
          style={{ borderRadius: 10 }}
        >
          <HStack alignItems={"center"}>
            <Text text="Chọn trạng thái chấm công:" style={{ fontWeight: "700" }} />
            <Text text=" *" style={{ color: "red" }} />
          </HStack>
          <Text>{pickactive}</Text>
        </HStack>
      </TouchableOpacity>
      <TouchableOpacity onPress={onOpen}>
        <HStack
          justifyContent={"space-between"}
          mb="2"
          alignItems={"center"}
          marginTop={2}
          style={{ borderRadius: 10 }}
        >
          <HStack alignItems={"center"}>
            <Text text="Chọn lí do" style={{ fontWeight: "700" }} />
            <Text text=" *" style={{ color: "red" }} />
          </HStack>
          <Text>{reason}</Text>
        </HStack>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setOpenPlace(true)
        }}
      >
        <HStack
          justifyContent={"space-between"}
          mb="2"
          alignItems={"center"}
          marginTop={2}
          style={{ borderRadius: 10 }}
        >
          <HStack alignItems={"center"}>
            <Text text="Chọn địa điểm" style={{ fontWeight: "700" }} />
            <Text text=" *" style={{ color: "red" }} />
          </HStack>
          <Text>{place.name}</Text>
        </HStack>
      </TouchableOpacity>

      <Text text="Mô tả" style={{ fontWeight: "700" }} />
      <TextArea
        h={20}
        placeholder="Chi tiết lí do làm đơn"
        mt={2}
        autoCompleteType={true}
        onChangeText={(text) => {
          setData(text)
        }}
      />
      <Button
        testID="login-button"
        style={{ marginTop: 20 }}
        onPress={addExplainUser}
        leftIcon={<MaterialIcons name="upload-file" size={24} color="#ffffff" />}
      >
        <Text tx="DivisionScreen.devision" style={{ fontWeight: "700", color: "#ffffff" }} />
      </Button>

      <Actionsheet isOpen={openPlace} onClose={closePlace} disableOverlay>
        <Actionsheet.Content>
          {listPlaces.map((item, id) => {
            return (
              <Actionsheet.Item
                key={id}
                onPress={() => {
                  setLatLong({ lat: item.lat, long: item.long })
                  setPlace({ id: item.id, name: item.name })
                  closePlace()
                }}
              >
                {item.name}
              </Actionsheet.Item>
            )
          })}
        </Actionsheet.Content>
      </Actionsheet>
      <Actionsheet isOpen={isOpen} onClose={onClose} disableOverlay>
        <Actionsheet.Content>
          {reasonList.map((item, id) => {
            return (
              <Actionsheet.Item
                key={id}
                onPress={() => {
                  setReason(item.reason)
                  onClose()
                }}
              >
                {item.reason}
              </Actionsheet.Item>
            )
          })}
        </Actionsheet.Content>
      </Actionsheet>
      <Actionsheet isOpen={openActive} onClose={closeOpenActive} disableOverlay>
        <Actionsheet.Content>
          {activeList.map((item, id) => {
            return (
              <Actionsheet.Item
                key={id}
                onPress={() => {
                  setStatus(item.active)
                  setPickActive(item.name)
                  closeOpenActive()
                }}
              >
                {item.name}
              </Actionsheet.Item>
            )
          })}
          {/* <Actionsheet.Item onPress={()=>{scloseOpenActive(active:"in")}}>Chấm vào</Actionsheet.Item>
          <Actionsheet.Item onPress={()=>{scloseOpenActive(active:"out")}}>Chấm ra</Actionsheet.Item> */}
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  )
})
const $header: ViewStyle = {
  paddingVertical: 10,
}
const $container: ViewStyle = {
  justifyContent: "center",
  paddingHorizontal: 20,
  backgroundColor: "#ffffff",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}
