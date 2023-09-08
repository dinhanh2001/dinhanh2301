import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { AutoImage, Icon, IconsApp, Screen, Text, Maps, Button, ToastMessage } from "../components"
import { spacing } from "../theme"
import { Ionicons, Feather } from "@expo/vector-icons"
import { useStores } from "../models"
import { Center, HStack, Modal, Button as BTN, useToast } from "native-base"
import { useNetInfo } from "@react-native-community/netinfo"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Home: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Home" component={HomeScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const HomeScreen: FC<StackScreenProps<AppStackScreenProps, "Home">> = observer(
  function HomeScreen({ navigation, route }) {
    const {
      placeStore: { getAllPlace, listPlaces, numberPlace, countChecked },
      userStore: { getUserByOrg },
      timesheetStore: { setIdUserTimeSheet },
      authenticationStore: { name_user, role, idUser },
    } = useStores()
    console.log(role)
    const [inforPlace, setInforPlace] = useState({})
    const [listUser, setListUser] = useState([])
    const [open, setOpen] = useState(false)
    const [openList, setOpenList] = useState(false)
    const toast = useToast()
    const netInfo = useNetInfo()
    const navigateCalendar = (value) => {
      setIdUserTimeSheet(value["id"])
      navigation.navigate("Attendance", { name: value["name"] })
    }
    // const handleClickMap = (data) => {
    //   setInforPlace(data)
    //   setOpen(true)
    // }
    useEffect(() => {
      const getListPlace = async () => {
        if (netInfo.isConnected == null || netInfo.isConnected == true) {
          let list = await getAllPlace()
          if (role == "leader") {
            // chi co leader moi co quyen xem vien vien cua to chuc
            let listUser = await getUserByOrg()
            setListUser(listUser)
          }
        } else {
          toast.show({
            placement: "top",
            duration: 1000,
            render: () => {
              return <ToastMessage text="Vui lòng kiểm tra lại kết nối ! " type="warning" />
            },
          })
        }
      }
      getListPlace()
      return () => {
        getAllPlace()
        getUserByOrg()
      }
    }, [netInfo.isConnected, countChecked])
    const InforPatrol = () => {
      if (role == "user") {
        setIdUserTimeSheet(idUser)
        navigation.navigate("Attendance", { name: name_user })
      } else {
        setOpenList(true)
      }
    }
    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["end"]}>
        <View style={$header}>
          <Icon icon="menu" size={30} />
          <Text tx="HomeScreen.NameApp" />
          <AutoImage
            source={{
              uri: "https://cdn.pixabay.com/photo/2023/04/06/01/26/heart-7902540_960_720.jpg",
            }}
            // borderRadius={40}
            style={{ width: 40, height: 40, borderRadius: 40 }}
          />
        </View>
        <Center>
          <HStack>
            <Text tx="HomeScreen.labelHello" />
            <Text>{` ${name_user}`}</Text>
          </HStack>
        </Center>

        <View style={{ marginTop: 5 }}>
          <HStack style={{ justifyContent: "space-around" }}>
            <BTN
              style={{ width: "40%" }}
              onPress={InforPatrol}
              leftIcon={<Ionicons name="information-circle" size={24} color="white" />}
            >
              <Text
                tx="HomeScreen.InforPatrol"
                style={{ textAlign: "center", fontWeight: "700", color: "white" }}
              />
            </BTN>
            {role === "leader" ? (
              <BTN
                style={{ width: "40%" }}
                leftIcon={<Feather name="file-text" size={24} color="white" />}
                onPress={() => {
                  navigation.navigate("ApprovalScreen", { type: "leader" })
                }}
              >
                <Text
                  tx="HomeScreen.explaination"
                  style={{ textAlign: "center", fontWeight: "700", color: "white" }}
                />
              </BTN>
            ) : (
              <BTN
                style={{ width: "40%" }}
                leftIcon={<Feather name="file-text" size={24} color="white" />}
                onPress={() => {
                  navigation.navigate("ExplainScreens", { type: "user" })
                }}
              >
                <Text
                  tx="HomeScreen.explaination"
                  style={{ textAlign: "center", fontWeight: "700", color: "white" }}
                />
              </BTN>
            )}
          </HStack>
        </View>
        <View style={page}>
          <View style={containerMap}>
            <Maps style={map} MarkerListUser={listPlaces} />
          </View>
        </View>

        {/* <Modal isOpen={open} safeAreaTop={true} onClose={() => setOpen(false)}>
          <Modal.Content maxWidth="400">
            <Modal.CloseButton />
            <Modal.Header>{inforPlace["name"]}</Modal.Header>
            <Modal.Body>
              <HStack>
                <Text tx="HomeScreen.status" />
                {inforPlace["status"] == "in" ? (
                  <IconsApp icon={<AntDesign name="checkcircle" size={20} color="green" />} />
                ) : (
                  <IconsApp icon={<AntDesign name="checkcircle" size={20} color="red" />} />
                )}
              </HStack>
              <HStack>
                <Text tx="HomeScreen.placeName" />
                <Text>{inforPlace["name"]}</Text>
              </HStack>
            </Modal.Body>
            <Modal.Footer>
              <BTN.Group space={2}>
                <Button
                  onPress={() => {
                    setOpen(false)
                  }}
                >
                  <Text style={{ color: "white" }} tx="common.close" />
                </Button>
              </BTN.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal> */}
        <Modal
          isOpen={openList}
          safeAreaTop={true}
          onClose={() => {
            setOpenList(false)
          }}
        >
          <Modal.Content maxWidth="100%">
            <Modal.CloseButton />
            <Modal.Header>
              <Text tx="HomeScreen.listStaffOrg" />
            </Modal.Header>
            {listUser &&
              listUser.map((value, index) => {
                // danh sach nhan vien trong to chuc getALLStaff
                return (
                  <HStack
                    key={index}
                    display={"flex"}
                    justifyContent={"space-between"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    w={"100%"}
                  >
                    <BTN
                      size="sm"
                      variant="ghost"
                      w={"100%"}
                      style={{ display: "flex", justifyContent: "flex-start" }}
                      onPress={() => {
                        navigateCalendar(value)
                      }}
                    >
                      <Text style={{ fontSize: 13 }} text={`${value["name"]}`} />
                    </BTN>
                  </HStack>
                )
              })}
            {/* <Modal.Footer>
              <BTN.Group space={2}>
                <Button
                  onPress={() => {
                    setOpenList(false)
                  }}
                >
                  <Text style={{color: "white"}} tx="common.close"/>
                </Button>
              </BTN.Group>
            </Modal.Footer> */}
          </Modal.Content>
        </Modal>
        {/* <View>
          <HStack>
            <Text tx="HomeScreen.numberPlace" />
            <Text>{`${numberPlace}`}</Text>
          </HStack>
          <HStack>
            <Text tx="HomeScreen.numberAddToday" />
            <Text>{`${countChecked}`} </Text>
          </HStack>
        </View> */}
      </Screen>
    )
  },
)

const $header: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "stretch",
  paddingBottom: 2,
}
const $container: ViewStyle = {
  paddingTop: spacing.large + spacing.extraLarge,
  paddingHorizontal: spacing.medium,
  backgroundColor: "#FFFFFF",
  flex: 1,
}
const page: TextStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
const containerMap: TextStyle = {
  height: 300,
  width: 300,
  backgroundColor: "tomato",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderWidth: 1,
  borderColor: "#06b6d4",
  borderRadius: 10,
}
const map: ViewStyle = {
  flex: 1,
  width: "100%",
  height: 300,
}

// const styles = {
//   page: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF'
//   },
//   container: {
//     height: 300,
//     width: 300,
//     backgroundColor: 'tomato'
//   },
//   map: {
//     flex: 1
//   }
// };
