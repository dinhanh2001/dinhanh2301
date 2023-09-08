import React, { FC, useState, useCallback, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, TouchableOpacity, View, ViewStyle, Image } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Header, Screen, Text, ToastMessage } from "../components"
import { useStores } from "../models"
import { useNetInfo } from "@react-native-community/netinfo"
import moment from "moment"
import { AntDesign, Ionicons } from "@expo/vector-icons"
import { useToast } from "native-base"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Approval: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Approval" component={ApprovalScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const ApprovalScreen: FC<StackScreenProps<AppStackScreenProps, "Approval">> = observer(
  function ApprovalScreen({ navigation, route }) {
    // Pull in one of our MST stores
    const PAGE_LIMIT = 200
    const {
      explainStore: { getExplains },
      authenticationStore: { idUser, role },
    } = useStores()
    const [listExplains, setListExplains] = useState([])
    const [page, setPage] = useState<number>(1)
    const netInfo = useNetInfo()
    const toast = useToast()
    useEffect(() => {
      console.log("oEffect")
      const getData = async () => {
        if (netInfo.isConnected == null || netInfo.isConnected == true) {
          const response = await getExplains(
            parseInt(moment().startOf("month").format("x")),
            parseInt(moment().endOf("month").format("x")),
            page,
            PAGE_LIMIT,
            route?.params?.type === "user" && idUser,
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
      navigation.addListener("focus", () => {
        getData()
      })

      // getData()
      return () => {
        getData()
      }
    }, [navigation])

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
          {role === "leader" ? (
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text>{item["user_name"]}</Text>
              <Text>{item["status"] === "in" ? <Text>Chấm vào</Text> : <Text>Chấm ra</Text>}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      )
    }, [])
    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={$root} preset="fixed">
        <Header
          title="Danh sách đơn giải trình"
          leftIcon="back"
          onLeftPress={() => {
            navigation.goBack()
          }}
        />
        <FlatList
          data={listExplains && listExplains}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ marginHorizontal: 20, paddingBottom: 100 }}
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
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
