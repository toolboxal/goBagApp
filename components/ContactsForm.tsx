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
import { useState } from 'react'
import { ChevronDown } from 'lucide-react-native'
import db from '@/db/db'
import { useQueryClient } from '@tanstack/react-query'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import PhoneInput, { ICountry } from 'react-native-international-phone-number'
import { getLocales } from 'expo-localization'

const ContactsForm = () => {
  const { regionCode } = getLocales()[0]

  const { theme } = useTheme()
  const [role, setRole] = useState<contactsSelect['role']>('pub')
  const [priority, setPriority] = useState<contactsSelect['priority']>('medium')
  const [selectedCountry, setSelectedCountry] = useState<undefined | ICountry>(
    undefined
  )
  const [contactValue, setContactValue] = useState<string>('')
  const [selectedCountryEmergencyContact, setSelectedCountryEmergencyContact] =
    useState<undefined | ICountry>(undefined)
  const [emergencyContactValue, setEmergencyContactValue] = useState<string>('')

  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    console.log('Validated form data:', data)
    await db.insert(contacts).values({
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
      cong: data.cong,
      fsGroup: data.fsGroup,
      emergencyPerson: data.emergencyPerson,
      emergencyPersonNumber: data.emergencyPersonNumber,
      role,
      priority,
    })
    reset()
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    queryClient.invalidateQueries({ queryKey: ['contacts'] })
    router.back()
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
                    onSelect={() => setPriority('low')}
                  >
                    <DropdownMenu.ItemTitle>
                      priority: low
                    </DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    key="medium"
                    onSelect={() => setPriority('medium')}
                  >
                    <DropdownMenu.ItemTitle>
                      priority: medium
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
                    key="highest"
                    onSelect={() => setPriority('highest')}
                  >
                    <DropdownMenu.ItemTitle>
                      priority: highest
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
                        height: 60,
                      },
                    ]}
                    placeholder="address"
                    placeholderTextColor={theme.primary3}
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
