import { fonts, size } from '@/constants/font'
import { storeItems, StoreItemSelect } from '@/db/schema'
import { useTheme } from '@/providers/ThemeProvider'
import { differenceInDays, formatDistanceToNow } from 'date-fns'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  Image,
  Pressable,
} from 'react-native'
import { Salad, Flashlight, Pill, Shirt } from 'lucide-react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import db from '@/db/db'
import { eq } from 'drizzle-orm'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'

type Props = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  selectedItem: StoreItemSelect | null
}

const InventoryModal = ({ openModal, setOpenModal, selectedItem }: Props) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { theme } = useTheme()
  //   console.log(selectedItem)
  const diffInDays = differenceInDays(
    !selectedItem ? new Date() : new Date(selectedItem.dateExpiry!),
    new Date()
  )

  const categoryIcons = {
    food: <Salad size={50} color={theme.primary3} strokeWidth={2} />,
    medicine: <Pill size={50} color={theme.primary3} strokeWidth={2} />,
    supplies: <Flashlight size={50} color={theme.primary3} strokeWidth={2} />,
    clothing: <Shirt size={50} color={theme.primary3} strokeWidth={2} />,
  }

  const { mutate: deleteItem } = useMutation({
    mutationFn: async (id: number) => {
      await db.delete(storeItems).where(eq(storeItems.id, selectedItem?.id!))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeItems'] })
    },
  })

  const handleDelete = (id: number) => {
    // console.log('delete pressed')
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    deleteItem(id)
    setOpenModal(false)
  }

  const handleEdit = (id: number) => {
    // console.log('edit pressed', id)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    // navigate to editFormPage
    router.navigate({ pathname: '/editFormPage', params: { id } })
    setOpenModal(false)
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
            <View
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 3 }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: size.xxxl,
                    color: theme.primary10,
                  }}
                >
                  {selectedItem?.name}
                </Text>
                <Text>{`quantity: ${selectedItem?.quantity}`}</Text>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: size.l,
                    color: diffInDays <= 0 ? theme.warning : theme.primary6,
                  }}
                >
                  {diffInDays <= 0
                    ? `${
                        selectedItem?.category === 'food'
                          ? 'EXPIRED'
                          : 'REPLACE NOW'
                      }`
                    : `${
                        selectedItem?.category === 'food'
                          ? 'expires in '
                          : 'replace in '
                      }${formatDistanceToNow(
                        new Date(selectedItem?.dateExpiry!)
                      )}`}
                </Text>

                <Text
                  style={{
                    fontFamily: fonts.light_italic,
                    fontSize: size.m,
                    color: theme.primary5,
                  }}
                >
                  {selectedItem?.notes || 'no additional notes'}
                </Text>
              </View>
              {selectedItem?.photoUrl ? (
                <Image
                  source={{ uri: selectedItem.photoUrl }}
                  style={[styles.itemImage]}
                  onError={(e) =>
                    console.log('Image load error:', e.nativeEvent.error)
                  }
                />
              ) : (
                <View
                  style={[
                    styles.itemImage,
                    { backgroundColor: theme.primary1 },
                  ]}
                >
                  {categoryIcons[selectedItem?.category!]}
                </View>
              )}
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
    alignItems: 'center',
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
