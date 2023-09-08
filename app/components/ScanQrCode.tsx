import * as React from "react"
import { StyleProp, TextStyle, ViewStyle,TouchableOpacity, Dimensions, View } from "react-native"
import { observer } from "mobx-react-lite"
// import { colors, typography } from "../theme"
// import { Text } from "./Text"
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "blue";

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "blue";
const overlayColor = "rgba(0,0,0,0.2)";
export interface ScanQrCodeProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  onPassing? (data):void
}

/**
 * Describe your component here
 */
export const ScanQrCode = observer(function ScanQrCode(props: ScanQrCodeProps) {
  const { style ,onPassing } = props
  const $styles = [$container, style]

  const onSuccess = e => {
    onPassing(e)
    // console.log("Thông tin quét được là: ",e);
    
  };


    return (
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.off}
       customMarker={
              <View style={$rectangleContainer}>
                <View style={$topOverlay}>
                </View>
    
                <View style={{ flexDirection: "row" }}>
                  <View style={$leftAndRightOverlay} />
    
                  <View style={$rectangle}>
                    {/* <IconsApp
                    icon={<AntDesign name="qrcode" size={24} color="black" />}
                    /> */}
                   
                  </View>
    
                  <View style={$leftAndRightOverlay} />
                </View>
    
                <View style={$bottomOverlay} />
              </View>
            }
    
            reactivate={true}
            reactivateTimeout={3000}
            showMarker={true}
            // bottomContent={
            //   <TouchableOpacity style={styles.buttonTouchable}>
            //     <Text style={styles.buttonText}>Try again</Text>
            //   </TouchableOpacity>
            // }
            cameraType={"back"} // cam truoc hay sau default la sau
            markerStyle = {{
              borderColor:"#2498c9",
              //borderRadius:10,
              borderStartColor:"blue",
            }}
            cameraContainerStyle = {{
            // ben trong
            backgroundColor:"red"
              
            }}
            cameraStyle = {{
              height:SCREEN_HEIGHT ,
            }}
            containerStyle = {{
              backgroundColor:"gray",// ben ngoai
            
            }}
      />
    );
})

const $root: ViewStyle = {
  flex: 1,
  padding: 20,
  backgroundColor: "#2498c9",
}
const $container: ViewStyle = {
  // display: "flex",
  // alignItems: "center",
  // justifyContent: "center",
}
const $centerText:ViewStyle ={
  padding: 32,
}
const  $textBold:TextStyle= {
  fontWeight: "500",
  color: "#000",
}
const  $buttonText:TextStyle= {
  fontSize: 30,
  color: "rgb(0,122,255)",
}
const $rectangleContainer:ViewStyle= {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: overlayColor
}
const $rectangle: ViewStyle={
  height: rectDimensions,
  width: rectDimensions,
  borderWidth: rectBorderWidth,
  borderColor: rectBorderColor,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgb(0,0,0,0.2)",
  borderRadius:10
}
const $topOverlay: ViewStyle={
  flex: 1,
  height: SCREEN_WIDTH,
  width: SCREEN_WIDTH,
  backgroundColor: overlayColor,
  justifyContent: "center",
  alignItems: "center",
// paddingTop: SCREEN_WIDTH * 0.5
}
const $bottomOverlay:ViewStyle= {
  flex: 1,
  height: SCREEN_WIDTH,
  width: SCREEN_WIDTH,
  backgroundColor: overlayColor,
 // paddingBottom: SCREEN_WIDTH * 0.25
}
const $leftAndRightOverlay:ViewStyle= {
  height: SCREEN_WIDTH * 0.65,
  width: SCREEN_WIDTH,
  backgroundColor: overlayColor
}
const $scanBar:ViewStyle= {
  width: scanBarWidth,
  height: scanBarHeight,
  backgroundColor: scanBarColor,
  
}

