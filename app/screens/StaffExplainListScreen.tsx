import React, { FC, useEffect, useState, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, ViewStyle, View, Image, ScrollView, TouchableOpacity } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text, Header, ToastMessage } from "../components"
import { DivisionParamList, BottomTabParamList } from "../navigators/BottomTabNavigator"
import { SafeAreaView } from "react-native-safe-area-context"
import { HStack, useToast } from "native-base"
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { useNetInfo } from "@react-native-community/netinfo"
import moment from "moment"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `StaffExplainList: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="StaffExplainList" component={StaffExplainListScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
//: FC<StackScreenProps<DivisionParamList, "StaffExplainList">>
export const StaffExplainListScreen: FC<StackScreenProps<DivisionParamList, "StaffExplainList">> =
  observer(function StaffExplainListScreen({ navigation, route }) {
    // Pull in one of our MST stores
    const {
      explainStore: { getExplains },
      authenticationStore: { idUser },
    } = useStores()
    const PAGE_LIMIT = 10
    const netInfo = useNetInfo()
    const toast = useToast()
    const [page, setPage] = useState<number>(1)
    const [listExplains, setListExplains] = useState([])
    useEffect(() => {
      const getData = async () => {
        if (netInfo.isConnected == null || netInfo.isConnected == true) {
          const response = await getExplains(
            parseInt(moment().startOf("month").format("x")),
            parseInt(moment().endOf("month").format("x")),
            page,
            PAGE_LIMIT,
            idUser,
          )
          setListExplains(response)
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
    }, [])
    const renderItem = useCallback(({ item }) => {
      return (
        <TouchableOpacity
          key={item.id}
          style={{
            paddingBottom: 10,
            borderBottomColor: "#c3c3c3",
            borderBottomWidth: 1,
            marginBottom: 20,
          }}
          onPress={() => {
            navigation.navigate("ExplainDetailScreen", item.id)
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontWeight: "700" }}>{item["place_name"]}</Text>
            <Text>{moment(item["date_explain"]).format("DD-MM-YYYY")}</Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text>{item["reason_name"]}</Text>
            <Text>
              {item["active"] === true ? (
                <Ionicons name="checkmark-circle" size={20} color="#1bb045" />
              ) : (
                <AntDesign name="exclamationcircle" size={20} color="#ffc42c" />
              )}
            </Text>
          </View>
        </TouchableOpacity>
      )
    }, [])
    return (
      <View>
        <Header
          leftIcon="back"
          title="Danh sách đơn giải trình"
          onLeftPress={() => {
            navigation.goBack()
          }}
        />
        <FlatList
          data={listExplains && listExplains}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ marginHorizontal: 20 }}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../assets/empty.png")}
                  style={{ width: 150, height: 150, marginBottom: 20 }}
                />
                <Text style={{ fontWeight: "800" }}>Hiện chưa có đơn giải trình nào</Text>
              </View>
            )
          }}
        />
      </View>
    )
  })

const $root: ViewStyle = {
  flex: 1,
}
