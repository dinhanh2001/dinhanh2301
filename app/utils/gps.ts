import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid, Linking } from 'react-native';

async function requestPermissions() {
   if (Platform.OS === 'android') {
     return await PermissionsAndroid.request(
       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
     );
   }
   if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization("whenInUse");
      console.log(auth)
      return auth
   }
 }

export const getDistanceFromLatLon = (lat1: any, lon1: any, lat2: any, lon2: any) => {
   const deg2rad = (deg: any) => {
      return deg * (Math.PI / 180)
   }
   var R = 6371; // Radius of the earth in km
   var dLat = Math.abs(deg2rad(lat2 - lat1));  // deg2rad below
   var dLon = Math.abs(deg2rad(lon2 - lon1));
   var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   var d = R * c; // Distance in km
   // console.log("khoang cach: ", d * 1000)
   return Math.round(d * 1000);//Return Meter
}

export const getCurrentPosition = async () => {
   const Permission = await requestPermissions()
   console.log("Permission", Permission)
   if(Permission == "granted"){
     return new Promise((resolve,reject)=>{
         Geolocation.getCurrentPosition(
            (position) => {
             // console.log("position", position);
            
              resolve(position)
            },
            (error) => {
              // See error code charts below.
              console.log("Get current possition failed: ",{code: error.code, message: error.message});
              reject(error)
            },
            { maximumAge: 3000, timeout: 20000, enableHighAccuracy: true }
        );
      })
      // console.log("current possition",local)
      // return local
   }else {
      await Linking.openSettings()
      // return {
      //    error: true,
      //    type: Permission
      // }
   }
}
export const watchPosition = async () => {
   const Permission = await requestPermissions()
   if(Permission == "granted"){
      const test = new Promise((resolve, reject) => {
         Geolocation.watchPosition(
         (position) => {
            console.log("watchPosition", position)
            resolve(position)
         },
         (error) => {
            // See error code charts below.
            console.log(error);
            reject(error)
          },
          {
            interval: 2000,
            forceLocationManager: true,
            enableHighAccuracy: true,
            distanceFilter: 0,
            useSignificantChanges: false,
          }
      )})
      return test
   }
}

export const clearWatch = async (watchId) => {
   Geolocation.clearWatch(watchId)
}