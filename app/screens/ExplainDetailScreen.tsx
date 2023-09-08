import React, { FC, useEffect, useState, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Header, Screen, Text, ToastMessage } from "../components"
import { useStores } from "../models"
import { Button, HStack, useToast } from "native-base"
import moment from "moment"
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `ExplainDetail: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="ExplainDetail" component={ExplainDetailScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const ExplainDetailScreen: FC<StackScreenProps<AppStackScreenProps, "ExplainDetail">> =
  observer(function ExplainDetailScreen({ navigation, route }) {
    // Pull in one of our MST stores
    const {
      explainStore: { getExplainDetail, upDateExplain },
      timesheetStore: { createTimesheet },
      authenticationStore: { role, name_user },
    } = useStores()
    const [place, setPlace] = useState({})
    const toast = useToast()
    const [load, setLoad] = useState(false)
    const getData = useCallback(async () => {
      try {
        setPlace(await getExplainDetail(route?.params))
      } catch (e) {
        console.log(e)
      }
    }, [place, setPlace])
    useEffect(() => {
      getData()
    }, [])
    const approvalExplain = useCallback(async () => {
      setLoad(true)
      const dataPost = {
        name: `Bắt đầu chấm công tại ${place["place_name"]}`,
        lat: place["lat"], //
        long: place["long"], //
        target: place["id_place"],
        status: "in",
        datetime: moment(place["date_explain"]).format("x"),
        address: place["place_name"],
      }
      const result = await createTimesheet(dataPost)
      if (result["kind"] === "ok") {
        toast.show({
          placement: "top",
          render: () => {
            return <ToastMessage text="Duyệt đơn thành công ! " type="success" />
          },
        })
        await upDateExplain(place["id"], name_user)
        await getData()
        setLoad(false)
      }
    }, [place, setPlace, load, setLoad])
    return (
      <Screen style={$root} preset="scroll">
        <Header
          leftIcon="back"
          title="Chi tiết đơn"
          onLeftPress={() => {
            navigation.goBack()
          }}
        />
        <View style={{ margin: 15 }}>
          <View style={{ marginBottom: 10 }}>
            <HStack style={{ justifyContent: "space-between", paddingBottom: 10 }}>
              <HStack>
                <Ionicons name="person-circle" size={24} color="black" />
                <Text style={{ fontWeight: "700", marginLeft: 5 }}>Người làm đơn :</Text>
              </HStack>
              <Text>{place["user_name"]}</Text>
            </HStack>
          </View>
          <View style={{ marginBottom: 10 }}>
            <HStack style={{ justifyContent: "space-between", paddingBottom: 10 }}>
              <HStack>
                <Entypo name="calendar" size={24} color="black" />
                <Text style={{ fontWeight: "700", marginLeft: 5 }}>Ngày làm đơn :</Text>
              </HStack>
              <Text>{moment(place["date_explain"]).format("DD-MM-YYYY")}</Text>
            </HStack>
          </View>
          <View style={{ marginBottom: 10 }}>
            <HStack style={{ justifyContent: "space-between", paddingBottom: 10 }}>
              <HStack>
                <Entypo name="location" size={20} color="black" />
                <Text style={{ fontWeight: "700", marginLeft: 5 }}>Địa điểm :</Text>
              </HStack>
              <Text>{place["place_name"]}</Text>
            </HStack>
          </View>
          <View style={{ marginBottom: 10 }}>
            <HStack style={{ justifyContent: "space-between", paddingBottom: 10 }}>
              <HStack>
                <MaterialCommunityIcons name="pencil-circle" size={24} color="black" />
                <Text style={{ fontWeight: "700", marginLeft: 5 }}>Lí do làm đơn :</Text>
              </HStack>
              <Text style={{ width: 160, textAlign: "right" }}>{place["reason_name"]}</Text>
            </HStack>
          </View>
          <View style={{ marginBottom: 10 }}>
            <HStack style={{ justifyContent: "space-between", paddingBottom: 10 }}>
              <HStack>
                <AntDesign name="caretright" size={24} color="black" />
                <Text style={{ fontWeight: "700", marginLeft: 5 }}>Chi tiết :</Text>
              </HStack>
              <Text style={{ width: 160, textAlign: "right" }}>{place["decription"]}</Text>
            </HStack>
          </View>
          <View style={{ marginBottom: 10 }}>
            <HStack style={{ justifyContent: "space-between", paddingBottom: 10 }}>
              <HStack>
                <MaterialIcons name="radio-button-checked" size={24} color="black" />
                <Text style={{ fontWeight: "700", marginLeft: 5 }}>Trạng thái đơn :</Text>
              </HStack>
              <Text>{place["active"] === true ? "Đã duyệt" : "Chưa duyệt"}</Text>
            </HStack>
            <HStack style={{ justifyContent: "space-between", paddingBottom: 10 }}>
              <HStack>
                <Ionicons name="person-circle" size={24} color="black" />
                <Text style={{ fontWeight: "700", marginLeft: 5 }}>Người duyệt :</Text>
              </HStack>
              <Text>
                {place["approval_name"] === "" ? "Chưa có người duyệt" : place["approval_name"]}
              </Text>
            </HStack>
          </View>
          {role === "leader" ? (
            <Button
              disabled={place["active"]}
              style={place["active"] === true ? { opacity: 0.5 } : null}
              onPress={approvalExplain}
            >
              <Text style={{ fontWeight: "700", color: "#fffff" }}>Duyệt đơn</Text>
            </Button>
          ) : null}
        </View>
      </Screen>
    )
  })

const $root: ViewStyle = {
  flex: 1,
}
