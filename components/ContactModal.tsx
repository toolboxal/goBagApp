import { fonts, size } from '@/constants/font'
import { contacts, contactsSelect } from '@/db/schema'
import { useTheme } from '@/providers/ThemeProvider'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  Pressable,
} from 'react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import db from '@/db/db'
import { eq } from 'drizzle-orm'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import * as Linking from 'expo-linking'
import { toast } from 'sonner-native'
import CustomToastMsg from './CustomToastMsg'

type Props = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  selectedItem: contactsSelect | null
}

const InventoryModal = ({ openModal, setOpenModal, selectedItem }: Props) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { theme } = useTheme()
  //   console.log(selectedItem)

  const priorityArr = [
    { type: 'normal', color: theme.primary5 },
    { type: 'high', color: theme.primary10 },
    { type: 'critical', color: theme.warning },
  ]

  const { mutate: deleteItem } = useMutation({
    mutationFn: async (id: number) => {
      await db.delete(contacts).where(eq(contacts.id, selectedItem?.id!))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })

  const handleDelete = (id: number) => {
    // console.log('delete pressed')
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    deleteItem(id)
    setOpenModal(false)
    toast.custom(<CustomToastMsg message="contact successfully deleted" />)
  }

  const handleEdit = (id: number) => {
    // console.log('edit pressed', id)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    // navigate to editFormPage
    router.navigate({ pathname: '/editContactsFormPage', params: { id } })
    setOpenModal(false)
  }

  const handleCalling = async (phoneNumber: string) => {
    console.log('handle calling pressed')
    if (!phoneNumber) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    try {
      // Format the phone number (remove any non-numeric characters)
      const formattedNumber = phoneNumber.replace(/\D/g, '')
      const callUrl = `tel:${formattedNumber}`

      // Check if the device supports the tel URL scheme
      const supported = await Linking.canOpenURL(callUrl)
      if (supported) {
        await Linking.openURL(callUrl)
      } else {
        Alert.alert('Error', 'Phone calling is not supported on this device')
      }
    } catch (error) {
      console.error('Error making call:', error)
      Alert.alert('Error', 'Unable to make the phone call')
    }
  }

  const openWhatsApp = async (phoneNumber: string) => {
    if (!phoneNumber) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    try {
      // Format the phone number (remove any non-numeric characters)
      const formattedNumber = phoneNumber.replace(/\D/g, '')

      // Try the wa.me URL first as it's more reliable
      const url = `https://wa.me/${formattedNumber}`

      // Check if WhatsApp can handle the URL
      const supported = await Linking.canOpenURL(url)
      if (supported) {
        await Linking.openURL(url)
      } else {
        // Fallback to whatsapp:// scheme
        const fallbackUrl = `whatsapp://send?phone=${formattedNumber}`
        const fallbackSupported = await Linking.canOpenURL(fallbackUrl)
        if (fallbackSupported) {
          await Linking.openURL(fallbackUrl)
        } else {
          Alert.alert('Error', 'WhatsApp is not installed on this device')
        }
      }
    } catch (error) {
      console.log('Error opening WhatsApp:', error)
      Alert.alert('Error', 'Unable to open WhatsApp')
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={openModal}
      onRequestClose={() => setOpenModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setOpenModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Pressable
            style={[styles.card, { backgroundColor: 'white' }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: size.xxxl,
                  color: theme.primary10,
                }}
              >
                {selectedItem?.name}
              </Text>
              <View
                style={{
                  backgroundColor: priorityArr.find(
                    (item) => item.type === selectedItem?.priority
                  )?.color,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  borderRadius: 12,
                  width: 55,
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    color: theme.primary1,
                    fontSize: size.s,
                  }}
                >
                  {selectedItem?.priority}
                </Text>
              </View>
              {selectedItem?.phoneNumber ? (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 5,
                    alignItems: 'center',
                    marginVertical: 6,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.regular_italic,
                      fontSize: size.m,
                      color: theme.primary7,
                    }}
                  >
                    {selectedItem?.phoneNumber}
                  </Text>
                  <Pressable
                    onPress={() => handleCalling(selectedItem?.phoneNumber!)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 4,
                      borderRadius: 30,
                      borderColor: theme.primary10,
                      borderWidth: StyleSheet.hairlineWidth,
                      gap: 4,
                      height: 33,
                      width: 83,
                    }}
                  >
                    <FontAwesome6
                      name="phone"
                      size={18}
                      color={theme.primary10}
                    />
                    <Text
                      style={{
                        color: theme.primary10,
                        fontFamily: fonts.regular_italic,
                        fontSize: size.xs,
                      }}
                    >
                      call
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => openWhatsApp(selectedItem?.phoneNumber!)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 4,
                      borderRadius: 30,
                      borderColor: theme.primary10,
                      borderWidth: StyleSheet.hairlineWidth,
                      gap: 4,
                      height: 33,
                      width: 83,
                    }}
                  >
                    <FontAwesome6 name="whatsapp" size={24} color="green" />
                    <Text
                      style={{
                        color: theme.primary10,
                        fontFamily: fonts.regular_italic,
                        fontSize: size.xs,
                      }}
                    >
                      whatsApp
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Text
                  style={{
                    fontFamily: fonts.regular_italic,
                    fontSize: size.m,
                    color: theme.primary7,
                  }}
                >
                  no phone number
                </Text>
              )}
              <Text
                style={{
                  fontFamily: fonts.regular_italic,
                  fontSize: size.m,
                  color: theme.primary7,
                }}
              >
                {selectedItem?.remarks || 'no remarks'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <Pressable
                style={[styles.btn, { backgroundColor: theme.primary10 }]}
                onPress={() => handleDelete(selectedItem?.id!)}
              >
                <Text style={styles.btnText}>Delete</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, { backgroundColor: theme.primary10 }]}
                onPress={() => handleEdit(selectedItem?.id!)}
              >
                <Text style={styles.btnText}>Edit</Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default InventoryModal

const styles = StyleSheet.create({
  card: {
    marginBottom: 100,
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 30,
    width: '90%',
    flexDirection: 'column',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemImage: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  btn: {
    padding: 12,
    borderRadius: 30,
    flex: 1,
    alignItems: 'center',
  },
  btnText: {
    fontFamily: fonts.medium,
    fontSize: size.l,
    color: 'white',
  },
})
