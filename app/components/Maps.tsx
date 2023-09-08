import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Text } from "./Text"
import MapboxGL from "@react-native-mapbox-gl/maps"
import { MapViewProps, MarkerViewProps } from "@react-native-mapbox-gl/maps"
import { Ionicons } from "@expo/vector-icons"
import { PermissionsAndroid } from "react-native"
import { getCurrentPosition } from "../utils/gps"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { IconsApp } from "./IconsApp"
type position = {
  lat: number
  long: number
}
export interface MapsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  MapViewProps?: MapViewProps
  MarkerListUser?: Array<object>
  handleClick?(data: object): void
}

MapboxGL.setAccessToken(
  "sk.eyJ1Ijoic2FuZ2hoIiwiYSI6ImNsaG1ic3ZoeTFhNWMzZnBoeXhoZXdlbjcifQ.Bu3OdsIPS8C3--KCBDJ9vg",
)

/**
 * Describe your component here
 */

export const Maps = observer(function Maps(props: MapsProps) {
  const { style, handleClick, MarkerListUser } = props
  const $styles = [$container, style]
  const [currentPosition, setCurrentPosition] = React.useState<position>({ lat: 0, long: 0 })
  React.useEffect(() => {
    // const userLocation = await watchPosition()
    // console.log(userLocation)
    const load = async () => {
      let newPosition
      const userLocation = await getCurrentPosition().then((position) => {
        newPosition = position["coords"]
        newPosition.latitude &&
          setCurrentPosition({ lat: newPosition.latitude, long: newPosition.longitude })
        // setLocation(newPosition)

        // Bật Modal
      })
    }
    load()
    return () => {
      load()
    }
  }, [])
  // const setDataModal = (data) => {
  //   // handleClick(data)
  // }
  return (
    <View style={$styles}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          {!!MarkerListUser && MarkerListUser.length > 0 ? (
            <MapboxGL.Camera
              centerCoordinate={[MarkerListUser[0]["long"], MarkerListUser[0]["lat"]]}
              zoomLevel={13}
            ></MapboxGL.Camera>
          ) : (
            <MapboxGL.Camera
              centerCoordinate={[currentPosition.long, currentPosition.lat]}
              zoomLevel={13}
            ></MapboxGL.Camera>
          )}
          <>
            {!!MarkerListUser &&
              MarkerListUser.map(function (coordinate, index) {
                return (
                  <MapboxGL.MarkerView
                    id="ok"
                    coordinate={[coordinate["long"], coordinate["lat"]]}
                    key={index}
                  >
                    <View
                      key={0}
                      style={{
                        backgroundColor: "transparent",
                        width: 150,
                        height: 50,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      {coordinate["status"] == "in" ? (
                        <>
                          <IconsApp
                            icon={
                              <MaterialCommunityIcons
                                name="map-marker-check"
                                size={15}
                                color="#0284c7"
                              />
                            }
                          />
                          <Text
                            // onPress={() => setDataModal(coordinate)}
                            style={{ fontSize: 13, color: "#0284c7", fontWeight: "bold" }}
                          >
                            {coordinate["name"]}
                          </Text>
                        </>
                      ) : (
                        <>
                          <IconsApp
                            icon={
                              <MaterialCommunityIcons
                                name="map-marker-alert"
                                size={15}
                                color="#854d0e"
                              />
                            }
                          />
                          <Text
                            // onPress={() => setDataModal(coordinate)}
                            style={{ fontSize: 13, color: "#854d0e", fontWeight: "bold" }}
                          >
                            {coordinate["name"]}
                          </Text>
                        </>
                      )}
                    </View>
                  </MapboxGL.MarkerView>
                )
              })}
          </>
          <MapboxGL.UserLocation
            androidRenderMode={"normal"}
            renderMode={"native"}
            visible={true}
          />
        </MapboxGL.MapView>
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}

const styles = {
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: "tomato",
  },
  map: {
    flex: 1,
    zIndex: -1000,
  },
}
