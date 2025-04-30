import { useTheme } from '@/providers/ThemeProvider'
import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  useColorScheme,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Ionicons from '@expo/vector-icons/Ionicons'

type Props = {
  openDateModal: boolean
  setOpenDateModal: React.Dispatch<React.SetStateAction<boolean>>
  expiryDate: Date
  setExpiryDate: React.Dispatch<React.SetStateAction<Date>>
}

const FormDateModal = ({
  openDateModal,
  setOpenDateModal,
  expiryDate,
  setExpiryDate,
}: Props) => {
  const colorScheme = useColorScheme()
  const { theme } = useTheme()
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={openDateModal}
      onRequestClose={() => setOpenDateModal(false)}
    >
      <Pressable style={styles.overlay} onPress={() => setOpenDateModal(false)}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.datePickerBox,
            {
              backgroundColor: theme.accent4,
            },
          ]}
        >
          <Pressable
            onPress={() => setOpenDateModal(false)}
            style={styles.closeBtn}
          >
            <Ionicons name="close-sharp" size={26} color={theme.primary5} />
          </Pressable>
          <DateTimePicker
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
            accentColor={theme.primary10}
            textColor={theme.primary10}
            minimumDate={new Date()}
            value={expiryDate || new Date()}
            onChange={(event, selectedDate) => {
              if (
                Platform.OS === 'android' &&
                (event.type === 'set' || event.type === 'dismissed')
              ) {
                setExpiryDate(selectedDate || new Date())
                setOpenDateModal(false)
              } else {
                setExpiryDate(selectedDate || new Date())
              }
            }}
            style={[
              styles.datePicker,
              {
                backgroundColor: theme.accent4,
              },
            ]}
            themeVariant="light"
          />
        </Pressable>
      </Pressable>
    </Modal>
  )
}
export default FormDateModal
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  datePickerBox: {
    marginBottom: 30,
    // backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    paddingTop: 20,
    position: 'relative',
  },
  datePicker: {
    transform: [{ scale: 0.88 }],
    padding: 0,
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
})
