import { useEffect, useState, useRef } from 'react'
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from '@/providers/ThemeProvider'
import { fonts, size } from '@/constants/font'
import {
  StoreItemFormData,
  storeItems,
  storeItemsInsertSchema,
  StoreItemSelect,
} from '@/db/schema'
import { format, add, formatDistanceToNow } from 'date-fns'
import FormDateModal from './FormDateModal'
import { Salad, Camera, Flashlight, Pill, Shirt, X } from 'lucide-react-native'
import * as DropdownMenu from 'zeego/dropdown-menu'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import * as Haptics from 'expo-haptics'
import * as MediaLibrary from 'expo-media-library'
import db from '@/db/db'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner-native'
import CustomToastMsg from './CustomToastMsg'

const ALBUM_NAME = 'PreciousLives Album'

const categoryArr = [
  { type: 'food', label: 'food & water' },
  { type: 'medicine', label: 'medicine' },
  { type: 'supplies', label: 'supplies' },
  { type: 'clothing', label: 'clothing' },
] as const
type CategoryType = (typeof categoryArr)[number]

type Props = {
  selectedPerson: StoreItemSelect
}

const Form = ({ selectedPerson }: Props) => {
  const today = new Date()
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType['type']
  >(selectedPerson.category || 'food')
  const [openDateModal, setOpenDateModal] = useState(false)
  const [dateExpiry, setDateExpiry] = useState(
    selectedPerson.dateExpiry ? new Date(selectedPerson.dateExpiry) : new Date()
  )
  const [durationCalc, setDurationCalc] = useState(
    formatDistanceToNow(new Date(dateExpiry))
  )
  const [permission, requestPermission] = useCameraPermissions()
  const [showCamera, setShowCamera] = useState(false)
  const [photo, setPhoto] = useState<string | null>(
    selectedPerson.photoUrl || null
  )
  const cameraRef = useRef<CameraView>(null)

  const queryClient = useQueryClient()
  const router = useRouter()

  const { theme } = useTheme()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StoreItemFormData>({
    resolver: zodResolver(storeItemsInsertSchema),
    defaultValues: {
      name: selectedPerson.name,
      quantity: selectedPerson.quantity,
      notes: selectedPerson.notes || '',
    },
  })

  useEffect(() => {
    setDurationCalc(formatDistanceToNow(new Date(dateExpiry)))
  }, [dateExpiry])

  const categoryIcons = {
    food: <Salad size={30} color={theme.accent6} strokeWidth={2} />,
    medicine: <Pill size={30} color={theme.accent6} strokeWidth={2} />,
    supplies: <Flashlight size={30} color={theme.accent6} strokeWidth={2} />,
    clothing: <Shirt size={30} color={theme.accent6} strokeWidth={2} />,
  }

  const onSubmit = async (data: StoreItemFormData) => {
    // console.log('Validated form data:', data)

    await db
      .update(storeItems)
      .set({
        name: data.name,
        quantity: data.quantity,
        dateExpiry: dateExpiry.toISOString(),
        category: selectedCategory,
        notes: data.notes,
        photoUrl: photo,
      })
      .where(eq(storeItems.id, selectedPerson.id))
    reset()
    setPhoto(null)
    setDateExpiry(add(today, { months: 3 }))
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    queryClient.invalidateQueries({ queryKey: ['storeItems'] })
    router.back()
    toast.custom(<CustomToastMsg message="edit saved" />)
  }
  console.log('date expiry', dateExpiry)
  const handleCameraPress = async () => {
    // Always request permission if not already granted
    if (!permission?.granted) {
      const newPermission = await requestPermission()
      if (!newPermission.granted) {
        alert('Camera permission is required to take photos.')
        return
      }
    }
    setShowCamera(true)
  }

  const handlePhotoLibraryPress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled && result.assets.length > 0) {
      // Save photo to media library
      const asset = await MediaLibrary.createAssetAsync(result.assets[0].uri)
      setPhoto(asset.uri)
      // Try to get the album
      let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME)
      if (album == null) {
        // Create album if it doesn't exist
        album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false)
      } else {
        // Add asset to existing album
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
      }
    }
  }

  const takePicture = async () => {
    // Request media library permissions
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status !== 'granted') {
      alert('Permission to access media library is required!')
      return
    }

    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync()
      if (photoData) {
        // Save photo to media library
        const asset = await MediaLibrary.createAssetAsync(photoData.uri)
        setPhoto(asset.uri)
        // Try to get the album
        let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME)
        if (album == null) {
          // Create album if it doesn't exist
          album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false)
        } else {
          // Add asset to existing album
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
        }
        setShowCamera(false)
      }
    }
  }

  console.log('photo uri ---> ', photo)

  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
          onCameraReady={() => console.log('Camera ready')}
        >
          <Pressable
            style={{
              position: 'absolute',
              bottom: 20,
              alignSelf: 'center',
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: theme.primary10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={takePicture}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 2,
                borderColor: theme.primary1,
                backgroundColor: 'transparent',
              }}
            />
          </Pressable>
          <Pressable
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.primary1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setShowCamera(false)}
          >
            <Text style={{ color: theme.primary7, fontSize: 16 }}>X</Text>
          </Pressable>
        </CameraView>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView style={{ flex: 1, backgroundColor: theme.primary2 }}>
          <View style={styles.photoContainer}>
            {photo && (
              <Pressable
                style={styles.photoRemove}
                onPress={() => setPhoto(null)}
              >
                <X size={13} color={theme.primary7} strokeWidth={2} />
              </Pressable>
            )}
            <View
              style={[styles.photoCircle, { backgroundColor: theme.primary1 }]}
            >
              {photo && (
                <Image
                  source={{ uri: photo }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
              )}
              {!photo && categoryIcons[selectedCategory]}
              <View style={{ position: 'absolute', right: -10, bottom: 0 }}>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <View
                      style={[
                        styles.photoCircleBtn,
                        {
                          borderColor: theme.primary2,
                          backgroundColor: theme.primary1,
                        },
                      ]}
                    >
                      <Camera
                        size={20}
                        color={theme.primary7}
                        strokeWidth={2}
                      />
                    </View>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item
                      key="camera"
                      onSelect={handleCameraPress}
                    >
                      <DropdownMenu.ItemTitle>Camera</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      key="library"
                      onSelect={handlePhotoLibraryPress}
                    >
                      <DropdownMenu.ItemTitle>
                        Photo Library
                      </DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </View>
            </View>
          </View>
          <View style={styles.categoryContainer}>
            {categoryArr.map((category, index) => (
              <Pressable
                key={index}
                style={[
                  styles.categoryBox,
                  {
                    backgroundColor:
                      category.type === selectedCategory
                        ? theme.primary10
                        : theme.primary1,
                  },
                ]}
                onPress={() => setSelectedCategory(category.type)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        category.type === selectedCategory
                          ? theme.primary1
                          : theme.primary7,
                    },
                  ]}
                >
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.formContainer}>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.textInputBox,
                    { backgroundColor: theme.primary1 },
                  ]}
                >
                  <TextInput
                    onChangeText={onChange}
                    value={value ?? ''}
                    onBlur={onBlur}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.primary1,
                        color: theme.primary7,
                      },
                    ]}
                    placeholder="Item name"
                    placeholderTextColor={theme.primary3}
                  />
                  {errors.name && (
                    <Text style={[styles.errorMsg, { color: theme.warning }]}>
                      {errors.name.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              name="notes"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.textInputBox,
                    { backgroundColor: theme.primary1 },
                  ]}
                >
                  <TextInput
                    onChangeText={onChange}
                    value={value ?? ''}
                    onBlur={onBlur}
                    multiline
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.primary1,
                        color: theme.primary7,
                        textAlignVertical: 'top',
                        height: 80,
                      },
                    ]}
                    placeholder="Notes"
                    placeholderTextColor={theme.primary3}
                  />
                  {errors.notes && (
                    <Text style={[styles.errorMsg, { color: theme.warning }]}>
                      {errors.notes.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  //   backgroundColor: 'green',
                }}
              >
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.textInputBox,
                        {
                          backgroundColor: theme.primary1,
                          width: '48%',
                          marginBottom: 0,
                        },
                      ]}
                    >
                      <TextInput
                        onChangeText={(text) => {
                          if (text === '') {
                            onChange(0)
                          } else {
                            const numValue = parseInt(text)
                            onChange(numValue)
                          }
                        }}
                        value={value === 0 ? '' : value.toString()}
                        onBlur={onBlur}
                        style={[
                          styles.textInput,
                          {
                            backgroundColor: theme.primary1,
                            color: theme.primary7,
                          },
                        ]}
                        placeholder="Quantity"
                        placeholderTextColor={theme.primary3}
                        keyboardType="numeric"
                      />
                      {errors.quantity && (
                        <Text
                          style={[styles.errorMsg, { color: theme.warning }]}
                        >
                          {errors.quantity.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
                <Pressable
                  style={[styles.dateBox, { backgroundColor: theme.primary1 }]}
                  onPress={() => {
                    setOpenDateModal(true)
                    Keyboard.dismiss()
                  }}
                >
                  <Text style={[styles.dateText, { color: theme.primary7 }]}>
                    {format(dateExpiry, 'dd MMM yyyy')}
                  </Text>
                  <Text style={[styles.dateLabels, { color: theme.primary7 }]}>
                    {selectedCategory === 'food' ? 'Expiry Date' : 'Shelf Life'}
                  </Text>
                </Pressable>
              </View>
              <Text style={[styles.durationText, { color: theme.primary7 }]}>
                {selectedCategory === 'food'
                  ? 'expires in ' + durationCalc
                  : 'replace in ' + durationCalc}
              </Text>
            </View>
            <Pressable
              style={[styles.submitBtn, { backgroundColor: theme.primary10 }]}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={[styles.submitText, { color: theme.primary1 }]}>
                Save Edit
              </Text>
            </Pressable>
          </View>

          <FormDateModal
            openDateModal={openDateModal}
            setOpenDateModal={setOpenDateModal}
            expiryDate={dateExpiry}
            setExpiryDate={setDateExpiry}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
export default Form
const styles = StyleSheet.create({
  photoContainer: {
    position: 'relative',
    marginHorizontal: 'auto',
    marginTop: 30,
    marginBottom: 20,
  },
  photoRemove: {
    width: 25,
    height: 25,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(200,200,200,0.7)',
    top: 0,
    right: -5,
    zIndex: 1,
  },
  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 100,
    borderWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    paddingBottom: 0,
    gap: 10,
  },
  categoryBox: {
    borderRadius: 12,
    width: '22%',
    aspectRatio: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontFamily: fonts.regular,
    fontSize: size.m,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textInputBox: {
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 15,
    marginBottom: 10,
    position: 'relative',
    // flex: 1,
  },
  textInput: {
    fontFamily: fonts.regular,
    fontSize: size.l,
  },
  errorMsg: {
    fontFamily: fonts.regular,
    fontSize: size.s,
    position: 'absolute',
    top: 2,
    left: 15,
  },
  dateBox: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingTop: 17,
    paddingBottom: 12,
    position: 'relative',
  },
  dateLabels: {
    fontFamily: fonts.regular,
    fontSize: size.s,
    textAlign: 'center',
    position: 'absolute',
    bottom: -20,
    right: 5,
  },
  dateText: {
    fontFamily: fonts.regular,
    fontSize: size.l,
  },
  durationText: {
    fontFamily: fonts.regular,
    fontSize: size.l,
    textAlign: 'center',
    marginTop: 50,
  },
  submitBtn: {
    borderRadius: 10,
    padding: 15,
    marginTop: 50,
  },
  submitText: {
    fontFamily: fonts.semiBold,
    fontSize: size.l,
    textAlign: 'center',
  },
})
