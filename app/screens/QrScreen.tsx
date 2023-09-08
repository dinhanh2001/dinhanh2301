import React, { FC, useCallback, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { useNetInfo } from "@react-native-community/netinfo"
// import moment from "moment"
import { dateTimeStamp } from "../utils/common"
import { View, TextStyle, FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import {
  Screen,
  Text,
  Maps,
  Pressable,
  ButtonDisabled,
  ToastMessage,
  ModalLoader,
} from "../components"
import { useStores } from "../models"
import { Modal, Button, VStack, useToast, HStack, Box } from "native-base"
import { getCurrentPosition } from "../utils/gps"
import { allowCheckin, distance, network } from "../utils/checkin"
import { Entypo } from "@expo/vector-icons"
// import { Pressable } from "../components/pressable"

const TextError: TextStyle = {
  color: "red",
  fontWeight: "bold",
}
// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Qr: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Qr" component={QrScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const QrScreen: FC<StackScreenProps<AppStackScreenProps, "Qr">> = observer(
  function QrScreen() {
    const [isShowModal, setShowModal] = React.useState<boolean>(false)
    const [isChange, setChange] = React.useState<boolean>(false)
    const [location, setLocation] = React.useState<object>(null)
    // const [disctance, setDistance] = React.useState<number>(null)
    const [timeCheck, setTime] = React.useState<object>({})
    const [address, setAddress] = React.useState<object>({})
    const [networkInfo, setNetworkInfo] = React.useState<object>({})
    const [isLoading, setLoading] = React.useState<boolean>(false)
    const {
      placeStore: {
        getAnPlace,
        updatePlace,
        place,
        getAllPlace,
        listPlaces,
        countChecked,
        numberPlace,
      },
      timesheetStore: { createTimesheet },
      userStore: { user },
    } = useStores()
    const [active, setIsActive] = React.useState(1)
    const toast = useToast()
    const netInfo = useNetInfo()
    // Hiển thị thông báo
    const showToast = (result: object, message: string, errMessage: string) => {
      if (result["kind"] == "ok") {
        toast.show({
          placement: "top",
          render: () => {
            return <ToastMessage tx="common.success" type={"success"} subText={message} />
          },
        })
      } else {
        toast.show({
          placement: "top",
          render: () => {
            return <ToastMessage tx="common.error" type={"error"} subText={errMessage} />
          },
        })
      }
    }

    // Lắng nghe khi thay đổi state
    React.useEffect(() => {
      // console.log("show hàng!")
      // console.log("QR Screen UseEffect isShowModal: ", isShowModal)
    }, [isShowModal])

    // Khi quét QR thành công!
    const onSuccess = async (placeID: string) => {
      console.log(netInfo.isConnected)
      // console.log("Thông tin quét được là: ", e.data)
      // const placeID: string = e.data
      // Lấy thông tin địa điểm dựa vào place id
      const place = await getAnPlace(placeID)
      // console.log("place in QRScreen: -----------------", placeID)

      // Lấy thông tin địa điểm và tính khoảng cách giữa 2 điểm
      let newPosition
      const getLocation = async () => {
        await getCurrentPosition()
          .then((position) => {
            newPosition = position["coords"]
            setLocation(newPosition)
            // console.log("QR Screen: Lấy vị trí thành công!")
            const newPlace = Object.assign(newPosition, place["result"])

            // Kiểm tra thời gian có được phép chấm công hay không
            const timeCheck = allowCheckin(newPlace)

            setTime(timeCheck)

            // Lưu thông tin kiểm tra khoảng cách
            const distanceTemp = distance(newPlace)
            setAddress(distanceTemp)

            // Lưu thông tin kiểm tra mạng
            const networkTemp = network(newPlace)
            setNetworkInfo(networkTemp)

            // Bật Modal
          })
          .catch((err) => {
            console.log("QR Screen err: ", err)
          })

        setShowModal(true)
      }

      getLocation()
    }

    // Khi xác nhận quét cham cong
    const onCheckin = async () => {
      setLoading(true)
      const dataPost = {
        name: `Bắt đầu chấm công tại ${place.name}`,
        lat: location["latitude"],
        long: location["longitude"],
        target: place["id"],
        status: "in",
        datetime: dateTimeStamp(new Date().toJSON()),
        address: place["address"],
      }
      const result = await createTimesheet(dataPost)
      setLoading(false)
      setShowModal(false)
      showToast(result, `Bắt đầu tuần tại ${place.name}`, "")
      await getAllPlace()
    }
    // Khi xác nhận quét kết thúc Cham cong
    const onCheckout = async () => {
      setLoading(true)
      const dataPost = {
        name: `Kết thúc tuần tại ${place.name}`,
        lat: location["latitude"],
        long: location["longitude"],
        target: place["id"],
        status: "out",
        datetime: dateTimeStamp(new Date().toJSON()),
        address: place["address"],
      }
      const result = await createTimesheet(dataPost)
      setLoading(false)
      setShowModal(false)
      showToast(
        result,
        `Kết thúc tuần tại ${place.name}`,
        "Vui lòng kiểm tra các điều kiện trước khi thực hiện!",
      )
      await getAllPlace()
    }

    // Cập nhật địa điểm
    const onUpdatePlace = async () => {
      setLoading(true)
      const placeBody = {
        wifi_name: networkInfo["name"],
        ip_address: networkInfo["address"],
        mac_address: networkInfo["macAddress"],
        lat: location["latitude"],
        long: location["longitude"],
      }
      const result = await updatePlace(place.id, placeBody)
      console.log("result update place in QR Screen: " + JSON.stringify(result))

      setLoading(false)
      setChange(false)
      showToast(result, `Cập nhật thành công!`, `Cập nhật thất bại!`)
    }

    const renderItem = useCallback(
      ({ item }: any) => {
        switch (active) {
          case 1:
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  onSuccess(item.id)
                }}
                style={{
                  marginVertical: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#CCCCCC",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Entypo name="location" size={20} color="black" />
                  <View style={{ marginLeft: 4 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700" }}>{item.name}</Text>
                    <Text style={{ fontSize: 12 }}>{item.address}</Text>
                  </View>
                </View>
                {item.status == "out" ? (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: "#854d0e",
                      borderRadius: 20,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: "#0284c7",
                      borderRadius: 20,
                    }}
                  />
                )}
              </TouchableOpacity>
            )
          case 2:
            return item["status"] === "out" ? (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  onSuccess(item.id)
                }}
                style={{
                  marginVertical: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#CCCCCC",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Entypo name="location" size={20} color="black" />
                  <View style={{ marginLeft: 4 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700" }}>{item.name}</Text>
                    <Text style={{ fontSize: 12 }}>{item.address}</Text>
                  </View>
                </View>
                {item.status == "out" ? (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: "#854d0e",
                      borderRadius: 20,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: "#0284c7",
                      borderRadius: 20,
                    }}
                  />
                )}
              </TouchableOpacity>
            ) : null
          case 3:
            return item["status"] === "in" ? (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  onSuccess(item.id)
                }}
                style={{
                  marginVertical: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#CCCCCC",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Entypo name="location" size={20} color="black" />
                  <View style={{ marginLeft: 4 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700" }}>{item.name}</Text>
                    <Text style={{ fontSize: 12 }}>{item.address}</Text>
                  </View>
                </View>
                {item.status == "out" ? (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: "#854d0e",
                      borderRadius: 20,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: "#0284c7",
                      borderRadius: 20,
                    }}
                  />
                )}
              </TouchableOpacity>
            ) : null
          default:
            return null
        }
      },
      [active],
    )
    return (
      <Screen preset="fixed" style={{ marginTop: 50 }}>
        <SafeAreaView />
        <View style={{ marginHorizontal: 20 }}>
          <Text
            style={{ fontSize: 20, textAlign: "center", marginBottom: 10 }}
            tx="QRScreen.currentListPlaces"
          />
          <ModalLoader caption={false} loading={isLoading} />
          <View style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => {
                setIsActive(1)
              }}
              style={1 === active ? styles.tabActiveOn : styles.tabActiveOff}
            >
              <Text tx="QRScreen.allPlacesCheck" />
              <Text style={1 === active ? styles.numberActiveOn : styles.numberActiveOff}>
                {numberPlace}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsActive(2)
              }}
              style={2 === active ? styles.tabActiveOn : styles.tabActiveOff}
            >
              <Text tx="QRScreen.placesUncheck" />
              <Text style={2 === active ? styles.numberActiveOn : styles.numberActiveOff}>
                {numberPlace - countChecked}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsActive(3)
              }}
              style={3 === active ? styles.tabActiveOn : styles.tabActiveOff}
            >
              <Text tx="QRScreen.placesChecked" />
              <Text style={3 === active ? styles.numberActiveOn : styles.numberActiveOff}>
                {countChecked}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList data={[...listPlaces]} renderItem={renderItem} />
          {isShowModal && place.lat && (
            <>
              <Modal
                isOpen={isShowModal}
                onClose={() => {
                  setShowModal(false)
                }}
                size={"full"}
                // height={"100%"}
              >
                <Modal.Content>
                  <Modal.CloseButton />
                  <Modal.Header>{place.name}</Modal.Header>
                  <Modal.Body>
                    <Maps
                      MarkerListUser={[place]}
                      handleClick={(place) => {
                        console.log(place)
                      }}
                    />
                    {!timeCheck["pass"] && (
                      <>
                        <Text tx="QRScreen.errTime1" style={TextError} />
                        <Text text={`${timeCheck["timeStart"]}`} style={TextError} />
                        <Text tx="QRScreen.errTime2" style={TextError} />
                        <Text text={`${timeCheck["timeEnd"]}`} style={TextError} />
                        <Text tx="QRScreen.errTime3" style={TextError} />
                        <Text text={`${timeCheck["dateAllow"]}`} style={TextError} />
                      </>
                    )}
                    {address["pass"] == true ? (
                      <Text tx="QRScreen.allowPossitin" />
                    ) : (
                      <>
                        <Text tx="QRScreen.errDistance1" style={TextError} />
                        <Text text={`${address["distance"]}${address["unit"]}`} style={TextError} />
                        <Text tx="QRScreen.errDistance2" style={TextError} />
                        <Text text={`${address["r"]}m`} style={TextError} />
                      </>
                    )}
                    {networkInfo["pass"] == false ? (
                      <VStack style={{ marginTop: 10 }}>
                        <HStack>
                          <Text tx="QRScreen.wrongAddress" style={TextError} />
                          <Text text={`${networkInfo["type"]}`} style={TextError} />
                        </HStack>
                        <HStack>
                          <Text tx="QRScreen.allowedNetwork" style={TextError} />
                          <Text text={`${networkInfo["ipAllow"]}`} style={TextError} />
                        </HStack>
                        <HStack>
                          <Text tx="QRScreen.yourAddress" style={TextError} />
                          <Text text={`${networkInfo["address"]}`} style={TextError} />
                        </HStack>
                        <HStack>
                          <Text tx="QRScreen.allowedNetworkName" style={TextError} />
                          <Text text={`${networkInfo["nameAllow"]}`} style={TextError} />
                        </HStack>
                        <HStack>
                          <Text tx="QRScreen.yourNetworkName" style={TextError} />
                          <Text text={`${networkInfo["name"]}`} style={TextError} />
                        </HStack>
                      </VStack>
                    ) : null}
                    {user.role !== "user" && (
                      <Button
                        backgroundColor={"transparent"}
                        onPressIn={() => {
                          setChange(true)
                        }}
                      >
                        <Text
                          tx="QRScreen.changePlace"
                          style={{ color: "blue", textDecorationLine: "underline" }}
                        />
                      </Button>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button.Group space={2}>
                      <Button
                        variant="ghost"
                        colorScheme="blueGray"
                        onPress={() => {
                          setShowModal(false)
                        }}
                      >
                        <Text tx="common.cancel" />
                      </Button>
                      {place.status === "in" ? (
                        // <Pressable w={[48, 48, 72]} text="Kết thúc chấm công" />
                        <>
                          {timeCheck["pass"] && networkInfo["pass"] && address["pass"] ? (
                            <Button
                              onPress={async () => {
                                await onCheckout()
                              }}
                              w={[48, 48, 72]}
                              // text="Kết thúc chấm công!"
                            >
                              <Text tx="QRScreen.endPatrol" />
                            </Button>
                          ) : (
                            <Button
                              isDisabled
                              w={[48, 48, 72]}
                              // text="Kết thúc chấm công!"
                            >
                              <Text tx="QRScreen.endPatrol" />
                            </Button>
                          )}
                        </>
                      ) : (
                        // <Pressable w={[48, 48, 72]} text="Bắt đầu chấm công" />
                        <>
                          {timeCheck["pass"] && networkInfo["pass"] && address["pass"] ? (
                            <Button
                              onPress={async () => {
                                await onCheckin()
                              }}
                              w={[48, 48, 72]}
                              // text="Bắt đầu chấm công!"
                            >
                              <Text tx="QRScreen.startPatrol" />
                            </Button>
                          ) : (
                            <Button
                              isDisabled={true}
                              w={[48, 48, 72]}
                              // text="Bắt đầu chấm công!"
                            >
                              <Text tx="QRScreen.startPatrol" />
                            </Button>
                          )}
                        </>
                      )}
                    </Button.Group>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>
            </>
          )}

          {/* Giao diện QR code  */}
          {/* {!isShowModal && <ScanQrCode onPassing={onSuccess} />} */}

          {/* Mô đan thay đổi thông tin địa điểm :D */}
          {isChange && (
            <Modal
              isOpen={isChange}
              onClose={() => {
                setChange(false)
              }}
              size={"full"}
            >
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Return Policy</Modal.Header>
                <Modal.Body>
                  <VStack>
                    <Text tx="QRScreen.placeInfo" />
                    <HStack>
                      <Text tx="QRScreen.yourAddress" />
                      <Text text={`${networkInfo["address"]}`} />
                    </HStack>
                    <HStack>
                      <Text tx="QRScreen.yourNetworkName" />
                      <Text text={`${networkInfo["name"]}`} />
                    </HStack>
                    <HStack>
                      <Text tx="common.long" />
                      <Text text={`: ${location["longitude"]}`} />
                    </HStack>
                    <HStack>
                      <Text tx="common.lat" />
                      <Text text={`: ${location["latitude"]}`} />
                    </HStack>
                    <HStack>
                      <Text tx="QRScreen.yourMacAddress" />
                      <Text text={`: ${networkInfo["macAddress"]}`} />
                    </HStack>
                  </VStack>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setChange(false)
                      }}
                    >
                      <Text tx="common.cancel" />
                    </Button>
                    <Button
                      onPressIn={() => {
                        onUpdatePlace()
                      }}
                    >
                      <Text style={{ color: "white" }} tx="common.update" />
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          )}
        </View>
      </Screen>
    )
  },
)
const styles = StyleSheet.create({
  tabActiveOn: {
    backgroundColor: "#06b6d4",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
    marginRight: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  tabActiveOff: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
    marginRight: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  numberActiveOn: {
    backgroundColor: "#164e63",
    paddingHorizontal: 8,
    color: "#ffffff",
    fontSize: 12,
    marginLeft: 2,
    borderRadius: 100,
    fontWeight: "700",
  },
  numberActiveOff: {
    fontSize: 16,
    marginLeft: 1,
  },
})
