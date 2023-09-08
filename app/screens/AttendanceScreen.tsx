import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Button, ModalLoader, Screen, Text, ToastMessage } from "../components"
import { useStores } from "../models"
import { Calendar, CalendarProvider } from "react-native-calendars"
import { formatHHMM, dateDMYStr, dateYMD } from "../utils/common"
import { HStack, ScrollView, useToast } from "native-base"
import { spacing } from "../theme"
import { AntDesign, Entypo } from "@expo/vector-icons"
import moment from "moment"
import { useNetInfo } from "@react-native-community/netinfo"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Attendance: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Attendance" component={AttendanceScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const AttendanceScreen: FC<StackScreenProps<AppStackScreenProps, "Attendance">> = observer(
  function AttendanceScreen({ navigation, route }) {
    // Pull in one of our MST stores
    const {
      timesheetStore: { getAllTimeSheet, inforDay },
      authenticationStore: { idUser },
    } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    const [dataCalendar, setDataCalendar] = useState<any>(undefined)
    const [daySelected, setDaySelected] = useState<string>(dateYMD(new Date().getTime()))
    const [timeStart, setTimeStart] = useState(moment().startOf("month").format("x"))
    const [timeEnd, setTimeEnd] = useState(moment().endOf("month").format("x"))
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const toast = useToast()
    const netInfo = useNetInfo()
    async function getData(timeStart, timeEnd) {
      setIsLoading(true)
      let data = await getAllTimeSheet(idUser, timeStart, timeEnd)
      setDataCalendar(data)
      setIsLoading(false)
    }
    useEffect(() => {
      if (netInfo.isConnected == null || netInfo.isConnected == true) {
        getData(timeStart, timeEnd)
      } else {
        toast.show({
          placement: "top",
          render: () => {
            return <ToastMessage text="Vui lòng kiểm tra lại kết nối ! " type="warning" />
          },
        })
      }
      return () => {}
    }, [netInfo.isConnected])
    const onDayPress = async (date) => {
      setDaySelected(dateYMD(date["timestamp"]))
      // setTimeStart(new Date(date["timestamp"]).setHours(0, 0, 0, 0))
      //setTimeEnd(new Date(date["timestamp"]).setHours(23, 59, 59, 999))
      await getData(
        new Date(date["timestamp"]).setUTCHours(0, 0, 0, 0),
        new Date(date["timestamp"]).setUTCHours(23, 59, 59, 999),
      )
      // setDataDay(dataCalendar[dateYMD(date["timestamp"])])
    }
    return (
      <Screen
        style={$root}
        contentContainerStyle={$container}
        preset="fixed"
        safeAreaEdges={["end"]}
      >
        <ModalLoader caption={false} loading={isLoading} />
        <View style={$header}>
          <HStack justifyContent={"space-between"} alignItems={"center"}>
            <AntDesign
              name="back"
              size={24}
              color="black"
              onPress={() => {
                navigation.goBack()
              }}
            />
            <Text tx="AttendanceScreen.headerAttendance" />
            <Entypo name="menu" size={24} color="black" />
          </HStack>
        </View>
        <ScrollView>
          <View>
            <View>
              <Text
                text={`${route["params"]["name"]}`}
                style={{ textAlign: "center", paddingVertical: 5 }}
              />

              <CalendarProvider
                date={`${daySelected}`}
                style={{ borderWidth: 2, borderColor: "blue", borderRadius: 5 }}
              >
                <Calendar
                  // onDayPress={onDayPress}
                  markedDates={{
                    ...dataCalendar,
                    [daySelected]: {
                      selected: true,
                      disableTouchEvent: true,
                      selectedColor: "#3288f2",
                    },
                  }}
                />
              </CalendarProvider>
            </View>
          </View>
          <Text>{`${dateDMYStr(daySelected)}`}</Text>
          <View style={{ marginBottom: 20 }}>
            {inforDay &&
              inforDay.map(function (el, index) {
                return (
                  <View key={index} style={{ paddingVertical: 5 }}>
                    <HStack>
                      <Text style={{ fontSize: 12 }} tx="AttendanceScreen.namePlace" />
                      <Text style={{ fontSize: 12 }}>{`${el.name}`}</Text>
                    </HStack>
                    <HStack>
                      <Text tx="AttendanceScreen.time" style={{ fontSize: 12 }} />
                      <Text style={{ fontSize: 12 }}>{`${formatHHMM(el.datetime)}`}</Text>
                    </HStack>
                  </View>
                )
              })}
          </View>
        </ScrollView>
        {/* {dataDay ? (
          <View style={$boxinfor}>
            <HStack>
              <Text>Ngày :</Text>
              <Text>{`${dateDMYStr(daySelected)}`}</Text>
            </HStack>
            <HStack>
              <Text>Tên địa điểm :</Text>
              {dataDay["name"] ? <Text>{`${dataDay["name"]}`}</Text> : <Text> </Text>}
            </HStack>
            <HStack>
              <Text>Trạng thái :</Text>
              {dataDay["status"] ? (
                dataDay["status"] == "in" ? (
                  <Text>Đã chấm vào</Text>
                ) : (
                  <Text>Đã chấm ra</Text>
                )
              ) : (
                <Text />
              )}
            </HStack>
          </View>
        ) : (
          <View style={$boxinfor}>
            <HStack>
              <Text>Ngày :</Text>
              <Text>{`${dateDMYStr(daySelected)}`}</Text>
            </HStack>
            <Text>Không có thông tin </Text>
          </View>
        )} */}
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
const $boxinfor: ViewStyle = {
  marginTop: 5,
}
const $container: ViewStyle = {
  paddingTop: spacing.extraLarge,
  paddingHorizontal: spacing.medium,
  backgroundColor: "#ffffff",
}
const $header: ViewStyle = {
  //paddingVertical: 10,
}
