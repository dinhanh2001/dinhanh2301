import NetInfo from "@react-native-community/netinfo"
import { dateDMY, dateHHMM, timeUnix, dateString } from "./common"
import { getDistanceFromLatLon } from "./gps"
import moment from "moment"

export const allowCheckin = (place: object) => {
  const currentTime = new Date().getTime()
  console.log("place in allowCheckin function in ultil: ", place)

  interface timeCheckin {
    pass?: boolean
    timeStart?: string
    timeEnd?: string
    dateAllow?: string
    err?: boolean
  }
  let result: timeCheckin = {}

  if (place == null) {
    result = { pass: false, err: true }
  } else {
    if (place["time_start"] != "" && place["time_end"] != "") {
      if (
        dateHHMM(currentTime) < timeUnix(place["time_start"]) ||
        dateHHMM(currentTime) > timeUnix(place["time_end"]) ||
        dateString(currentTime) != dateString(place["date"])
      ) {
        result = {
          pass: false,
          timeStart: timeUnix(place["time_start"]),
          timeEnd: timeUnix(place["time_end"]),
          dateAllow: dateString(place["date"]),
        }
      }
      // else if(dateString(currentTime) != dateString(place["date"])) {
      //     result = {
      //         pass: false,
      //     }
      // }
      else {
        result = { pass: true }
      }
    } else {
      result = { pass: true }
    }
  }
  console.log(result)

  return result
}

export const distance = (place: object) => {
  interface result {
    pass?: boolean
    distance?: number
    r?: number
    unit?: string
  }

  let caculate: result = {}
  if (place["lat"] && place["long"] && place["r"]) {
    let distance = getDistanceFromLatLon(
      place["latitude"],
      place["longitude"],
      place["lat"],
      place["long"],
    )
    // console.log("distance", distance);
    if (distance <= place["r"]) {
      caculate = { pass: true, distance, r: place["r"], unit: "m" }
    } else {
      caculate = { pass: false, distance, r: place["r"], unit: "m" }
      if (distance >= 1000) {
        distance = Math.round(distance / 100) / 10
        caculate = { pass: false, distance, r: place["r"], unit: "km" }
      }
    }
  } else {
    caculate = { pass: true, r: place["r"], unit: "m" }
  }
  return caculate
}

export const network = (place: object) => {
  // console.log("place tại hàm network: ", place);

  interface netinfoInterface {
    details?: object
    isConnected?: boolean
    isInternetReachable?: boolean
    isWifiEnabled?: boolean
    type?: string
  }
  let netinfo: netinfoInterface = {}
  NetInfo.addEventListener(async (state) => {
    netinfo = state
  })
  console.log("netinfo.details", netinfo.details)
  interface networkResult {
    pass?: boolean
    type?: string
    ipAllow?: string
    nameAllow?: string
    address?: string
    macAddress?: string
    name?: string
  }
  let result: networkResult = {}
  if (!place["wifi"] || !place["wifi"] || (!place["ip_address"] && !place["mac_address"])) {
    result = {
      pass: true,
      address: netinfo.details["ipAddress"],
      macAddress: netinfo.details["bssid"].toUpperCase(),
      name: netinfo.details["ssid"],
    }
  } else if (place["wifi"] == true && !!place["ip_address"]) {
    const ipAddr = netinfo.details["ipAddress"]
    const macAddr = netinfo.details["bssid"].toUpperCase()
    const name = netinfo.details["ssid"]
    let compareNetwork: boolean
    if (
      !place["ip_address"] == false &&
      place["ip_address"] == ipAddr &&
      place["wifi_name"] == name
    ) {
      compareNetwork = true
    } else {
      compareNetwork = false
    }
    // console.log("compareNetwork", compareNetwork)
    if (compareNetwork) {
      result = { pass: true, address: ipAddr, macAddress: macAddr, name: name }
    } else {
      result = {
        pass: false,
        type: "IP",
        ipAllow: place["ip_address"],
        nameAllow: place["wifi_name"],
        address: ipAddr,
        macAddress: macAddr,
        name: name,
      }
    }
  } else if (place["mac"] == true && !!place["mac_address"]) {
    const ipAddr = netinfo.details["ssid"]
    const macAddr = netinfo.details["bssid"].toUpperCase()
    const name = netinfo.details["ssid"]
    // const compareNetwork = place['networkAllow'].map((key, item: object) => {
    //     console.log(item['value'])
    let compareNetwork: boolean
    if (place["mac_address"].toUpperCase() == macAddr && place["label"] == name) {
      compareNetwork = true
    } else {
      compareNetwork = false
    }
    // })
    if (compareNetwork) {
      result = { pass: true, macAddress: macAddr, address: ipAddr, name: name }
    } else {
      result = {
        pass: false,
        type: "MAC",
        ipAllow: place["mac_address"],
        nameAllow: place["wifi_name"],
        address: ipAddr,
        macAddress: macAddr,
        name: name,
      }
    }
  }

  // console.log(result);

  return result
}

export const dataPost = (place: object) => {
  const lat = place["latitude"]
  const long = place["longitude"]
  const accuracy = place["accuracy"]
  const date = place["timestamp"]
  const dataPost = {
    lat,
    long,
    target: place["id"],
    accuracy,
    name: `Chấm công ${moment.unix(new Date().getTime())}`,
    status: place["status"],
    datetime: new Date(),
    address: place["address"],
    // schedule: object,
    // verify: string
  }
  return dataPost
}
