import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { useTheme } from '@/providers/ThemeProvider'
import { fonts, size } from '@/constants/font'
import { ContactFormData, contacts, contactsSelect } from '@/db/schema'
import * as DropdownMenu from 'zeego/dropdown-menu'
import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react-native'
import db from '@/db/db'
import { useQueryClient } from '@tanstack/react-query'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import PhoneInput, { ICountry } from 'react-native-international-phone-number'
import { getLocales } from 'expo-localization'
import { AppleMaps } from 'expo-maps'
import * as Location from 'expo-location'
import getCurrentLocation from '@/utils/getCurrentLoc'

const ContactsForm = () => {
  const { regionCode } = getLocales()[0]

  const { theme } = useTheme()
  const [role, setRole] = useState<contactsSelect['role']>('pub')
  const [priority, setPriority] = useState<contactsSelect['priority']>('normal')
  const [selectedCountry, setSelectedCountry] = useState<undefined | ICountry>(
    undefined
  )
  const [contactValue, setContactValue] = useState<string>('')
  const [selectedCountryEmergencyContact, setSelectedCountryEmergencyContact] =
    useState<undefined | ICountry>(undefined)
  const [emergencyContactValue, setEmergencyContactValue] = useState<string>('')
  const [geoCoords, setGeoCoords] = useState({ latitude: 0, longitude: 0 })

  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }

      const { latitude, longitude, getAddress } = await getCurrentLocation()

      setGeoCoords({ latitude, longitude })
    }
    getLocationPermission()
  }, [])

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    // console.log('Validated form data:', data)
    try {
      const fullPhoneNumber = selectedCountry?.callingCode
        ? `${selectedCountry.callingCode}${contactValue}`
        : contactValue
      const fullEmergencyNumber = selectedCountryEmergencyContact?.callingCode
        ? `${selectedCountryEmergencyContact.callingCode}${emergencyContactValue}`
        : emergencyContactValue
      await db.insert(contacts).values({
        name: data.name,
        phoneNumber: fullPhoneNumber,
        email: data.email,
        address: data.address,
        cong: data.cong,
        fsGroup: data.fsGroup,
        emergencyPerson: data.emergencyPerson,
        emergencyPersonNumber: fullEmergencyNumber,
        role,
        priority,
        latitude: geoCoords?.latitude || 0,
        longitude: geoCoords?.longitude || 0,
      })
      reset()
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      router.back()
    } catch (error) {
      console.error('Error inserting contact:', error)
      alert('Failed to save contact. Please try again.')
    }
  }

  const handleNewAddress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    const [address] = getValues(['address'])
    const appendedAddress = `${address}, ${regionCode}`
    console.log(appendedAddress)
    const newGeoCode = await Location.geocodeAsync(appendedAddress)
    const lat = newGeoCode[0].latitude
    const lng = newGeoCode[0].longitude
    setGeoCoords({ latitude: lat, longitude: lng })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={{ flex: 1 }}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={styles.formContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 10,
              }}
            >
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <View
                    style={[
                      styles.roleBox,
                      { backgroundColor: theme.primary1 },
                    ]}
                  >
                    <ChevronDown
                      color={theme.primary5}
                      strokeWidth={1.5}
                      size={20}
                    />
                    <Text style={[styles.roleText, { color: theme.primary7 }]}>
                      {role}
                    </Text>
                  </View>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item key="pub" onSelect={() => setRole('pub')}>
                    <DropdownMenu.ItemTitle>publisher</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    key="inactive"
                    onSelect={() => setRole('inactive')}
                  >
                    <DropdownMenu.ItemTitle>inactive</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item key="bs" onSelect={() => setRole('bs')}>
                    <DropdownMenu.ItemTitle>
                      bible student
                    </DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <View
                    style={[
                      styles.roleBox,
                      { backgroundColor: theme.primary1 },
                    ]}
                  >
                    <ChevronDown
                      color={theme.primary5}
                      strokeWidth={1.5}
                      size={20}
                    />
                    <Text style={[styles.roleText, { color: theme.primary7 }]}>
                      {priority}
                    </Text>
                  </View>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item
                    key="low"
                    onSelect={() => setPriority('normal')}
                  >
                    <DropdownMenu.ItemTitle>
                      priority: normal
                    </DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    key="high"
                    onSelect={() => setPriority('high')}
                  >
                    <DropdownMenu.ItemTitle>
                      priority: high
                    </DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    key="critical"
                    onSelect={() => setPriority('critical')}
                  >
                    <DropdownMenu.ItemTitle>
                      priority: critical
                    </DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </View>
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
                    placeholder="name"
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
            {/* <Controller
              name="phoneNumber"
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
                    placeholder="phone no."
                    placeholderTextColor={theme.primary3}
                  />
                  {errors.phoneNumber && (
                    <Text style={[styles.errorMsg, { color: theme.warning }]}>
                      {errors.phoneNumber.message}
                    </Text>
                  )}
                </View>
              )}
            /> */}
            <PhoneInput
              value={contactValue}
              defaultCountry={(regionCode?.toUpperCase() || 'US') as any}
              placeholder="phone no."
              onChangePhoneNumber={(phoneNumber) =>
                setContactValue(phoneNumber)
              }
              selectedCountry={selectedCountry}
              onChangeSelectedCountry={(selectedCountry) =>
                setSelectedCountry(selectedCountry)
              }
              phoneInputStyles={{
                container: {
                  borderWidth: 0,
                  backgroundColor: theme.primary1,
                  marginBottom: 10,
                  borderRadius: 12,
                },
              }}
            />
            <Controller
              name="email"
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
                    placeholder="email"
                    placeholderTextColor={theme.primary3}
                  />
                </View>
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    overflow: 'hidden',
                    borderRadius: 12,
                    backgroundColor: theme.primary5,
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={[
                      styles.textInputBox,
                      {
                        backgroundColor: theme.primary1,
                        flex: 1,
                        marginBottom: 0,
                        borderRadius: 0,
                      },
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
                          height: 90,
                        },
                      ]}
                      placeholder="address"
                      placeholderTextColor={theme.primary3}
                    />
                    <Pressable
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 8,
                        borderRadius: 30,
                        backgroundColor: theme.primary10,
                      }}
                      onPress={handleNewAddress}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          color: theme.primary1,
                          fontSize: size.m,
                        }}
                      >
                        locate
                      </Text>
                    </Pressable>
                  </View>
                  <AppleMaps.View
                    style={{
                      flex: 1,
                      height: '100%',
                      borderRadius: 12,
                      overflow: 'hidden',
                    }}
                    uiSettings={{
                      compassEnabled: false,
                      myLocationButtonEnabled: false,
                      togglePitchEnabled: false,
                      scaleBarEnabled: false,
                    }}
                    markers={[{ coordinates: geoCoords }]}
                    cameraPosition={{ coordinates: geoCoords, zoom: 18 }}
                  />
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
                  name="cong"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.textInputBox,
                        { backgroundColor: theme.primary1, width: '48%' },
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
                        placeholder="congregation"
                        placeholderTextColor={theme.primary3}
                      />
                      {errors.cong && (
                        <Text
                          style={[styles.errorMsg, { color: theme.warning }]}
                        >
                          {errors.cong.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
                <Controller
                  name="fsGroup"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.textInputBox,
                        { backgroundColor: theme.primary1, width: '48%' },
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
                        placeholder="fs group"
                        placeholderTextColor={theme.primary3}
                      />
                    </View>
                  )}
                />
              </View>
              <Controller
                name="emergencyPerson"
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
                      placeholder="emergency contact person"
                      placeholderTextColor={theme.primary3}
                    />
                  </View>
                )}
              />
              {/* <Controller
                name="emergencyPersonNumber"
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
                      placeholder="emergency contact no."
                      placeholderTextColor={theme.primary3}
                    />
                  </View>
                )}
              /> */}
              <PhoneInput
                value={emergencyContactValue}
                defaultCountry={(regionCode?.toUpperCase() || 'US') as any}
                placeholder="phone no."
                onChangePhoneNumber={(phoneNumber) =>
                  setEmergencyContactValue(phoneNumber)
                }
                selectedCountry={selectedCountryEmergencyContact}
                onChangeSelectedCountry={(selectedCountry) =>
                  setSelectedCountryEmergencyContact(selectedCountry)
                }
                phoneInputStyles={{
                  container: {
                    borderWidth: 0,
                    backgroundColor: theme.primary1,
                    marginBottom: 10,
                    borderRadius: 12,
                  },
                }}
              />

              <Pressable
                style={[styles.submitBtn, { backgroundColor: theme.primary10 }]}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={[styles.submitText, { color: theme.primary1 }]}>
                  Save Contact
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
export default ContactsForm
const styles = StyleSheet.create({
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
  roleBox: {
    minWidth: '48%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 1,
    borderRadius: 12,
    paddingTop: 17,
    paddingBottom: 12,
    position: 'relative',
  },
  roleText: {
    fontFamily: fonts.regular,
    fontSize: size.l,
  },
})
