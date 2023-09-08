import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { useState } from "react"
import { Modal, Button, Radio} from "native-base"
import { observer } from "mobx-react-lite"
// import { color, typography } from "../../../theme"
import { Text } from "./Text"
import { saveString } from "../utils/storage"
import { language } from "../i18n"
import RNRestart from 'react-native-restart';

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

export interface ChangeLanguageProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  isChange?: boolean
  passing?(e): void
  languageStorage: string
}

/**
 * Describe your component here
 */
export const ChangeLanguage = observer(function ChangeLanguage(props: ChangeLanguageProps) {
  const { style, isChange, passing, languageStorage } = props
  const styles = Object.assign({}, CONTAINER, style)
  const [value, setValue] = useState<string>(languageStorage);
  // console.log("i18Language",i18Language)
  const changeHandle = async (value) => {
    await saveString("language", value);
    await language()
    RNRestart.Restart();
  }
  return (
    <View style={styles}>
      <Modal closeOnOverlayClick={false} isOpen={isChange} onClose={() => passing(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Language / Ngôn ngữ</Modal.Header>
          <Modal.Body>
          <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={value} onChange={nextValue => {
            setValue(nextValue);
            console.log(value)
          }}>
              <Radio shadow={2} value="vi" my="2" width={"100%"}>
                <Text text="Tiếng Việt" width={"100%"}/>
              </Radio>
              <Radio shadow={2} value="en" my="2" width={"100%"}>
                <Text text="English" width={"100%"}/>
              </Radio>
            </Radio.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              passing(false);
            }}>
                <Text style={{color: "white"}} tx="settingScreen.cancel"/>
              </Button>
              <Button onPress={() => {
              passing(false)
              changeHandle(value)
            }}>
                <Text style={{color: "white"}} tx="settingScreen.save" />
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  )
})
