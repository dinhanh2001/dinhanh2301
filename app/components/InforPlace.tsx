import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Text } from "./Text"
import { useState } from "react"
import { Button, Modal } from "native-base"
import { IconsApp } from "./IconsApp"
import { AntDesign } from "@expo/vector-icons"

export interface InforPlaceProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  data?:object
  openModal?:boolean
}

/**
 * Describe your component here
 */
export const InforPlace = observer(function InforPlace(props: InforPlaceProps) {
  const { style ,data ,openModal} = props
  const $styles = [$container, style]
  const [open, setOpen] = useState(openModal);
 
  return (
    <View style={$styles}>
     <Modal isOpen={open} onClose={() => setOpen(false)} safeAreaTop={true}>
        <Modal.Content maxWidth="350" >
          {/* <Modal.CloseButton /> */}
          <Modal.Header>{data['name']}</Modal.Header>
          <Modal.Body>
          { data['status'] == "out" ? <IconsApp icon={<AntDesign name="checkcircle" size={24} color="green" />} /> :  <IconsApp icon={<AntDesign name="checkcircle" size={24} color="red" />} />}
          
              <Text>{data['name']}</Text>
             
              <Text>Email</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setOpen(false);
            }}>
                <Text tx="common.cancel"/>
              </Button>
              <Button onPress={() => {
                setOpen(false);
              }}>
              <Text style={{color: "white"}} tx="common.ok"/>
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
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
