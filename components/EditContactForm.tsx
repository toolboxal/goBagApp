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
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from '@/providers/ThemeProvider'
import { fonts, size } from '@/constants/font'
import {
  ContactFormData,
  contacts,
  contactsSelect,
  contactsInsertSchema,
} from '@/db/schema'
import { useState } from 'react'
import db from '@/db/db'
import { useQueryClient } from '@tanstack/react-query'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import PhoneInput, { ICountry } from 'react-native-international-phone-number'
import { getLocales } from 'expo-localization'
import { eq } from 'drizzle-orm'

type props = {
  selectedContact: contactsSelect
}

const EditContactForm = ({ selectedContact }: props) => {
  const { regionCode } = getLocales()[0]

  const { theme } = useTheme()
  const priorityArr: contactsSelect['priority'][] = [
    'normal',
    'high',
    'critical',
  ]
  const [priority, setPriority] = useState<contactsSelect['priority']>(
    selectedContact.priority || 'normal'
  )
  const [selectedCountry, setSelectedCountry] = useState<undefined | ICountry>(
    undefined
  )
  const [contactValue, setContactValue] = useState<string>(
    selectedContact.phoneNumber
      ? selectedContact.phoneNumber.replace(/^\+\d+\s/, '')
      : ''
  )

  useEffect(() => {
    setContactValue(
      selectedContact.phoneNumber
        ? selectedContact.phoneNumber.replace(/^\+\d+\s/, '')
        : ''
    )
  }, [selectedContact.phoneNumber])

  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactsInsertSchema),
    defaultValues: {
      name: selectedContact.name,
      remarks: selectedContact.remarks || '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    // console.log('Validated form data:', data)
    try {
      const fullPhoneNumber = selectedCountry?.callingCode
        ? `${selectedCountry.callingCode} ${contactValue}`
        : contactValue
      await db
        .update(contacts)
        .set({
          name: data.name,
          phoneNumber: fullPhoneNumber,
          remarks: data.remarks,
          priority,
        })
        .where(eq(contacts.id, selectedContact.id))
      reset()
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      router.back()
    } catch (error) {
      console.error('Error inserting contact:', error)
      alert('Failed to save contact. Please try again.')
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{ flex: 1 }}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
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
              name="remarks"
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
                    placeholder="remarks"
                    placeholderTextColor={theme.primary3}
                  />
                  {errors.remarks && (
                    <Text style={[styles.errorMsg, { color: theme.warning }]}>
                      {errors.remarks.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: size.m,
                color: theme.primary7,
              }}
            >
              priority attention:{' '}
            </Text>
            <View style={styles.priorityContainer}>
              {priorityArr.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => setPriority(item)}
                  style={[
                    styles.priorityBtn,
                    item === priority && {
                      backgroundColor: theme.primary10,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      item === priority && {
                        color: theme.primary1,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              style={[styles.submitBtn, { backgroundColor: theme.primary10 }]}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={[styles.submitText, { color: theme.primary1 }]}>
                Submit
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
export default EditContactForm
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
    marginTop: 25,
  },
  submitText: {
    fontFamily: fonts.semiBold,
    fontSize: size.l,
    textAlign: 'center',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 6,
  },
  priorityBtn: {
    padding: 12,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  priorityText: {
    fontFamily: fonts.medium,
    fontSize: size.m,
    color: 'black',
  },
})
