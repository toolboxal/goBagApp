import { fonts, size } from '@/constants/font'
import { useTheme } from '@/providers/ThemeProvider'
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { scenarioInsertSchema, scenarios, scenarioType } from '@/db/schema'
import db from '@/db/db'
import { toast } from 'sonner-native'
import CustomToastMsg from './CustomToastMsg'

const ScenarioForm = () => {
  const { theme } = useTheme()
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<scenarioType>({
    resolver: zodResolver(scenarioInsertSchema),
  })

  const onSubmit = async (data: scenarioType) => {
    await db.insert(scenarios).values({
      eventName: data.eventName,
      remarks: data.remarks,
    })
    reset()
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    queryClient.invalidateQueries({ queryKey: ['scenarios'] })
    router.back()
    toast.custom(
      <CustomToastMsg message={`scenario ${data.eventName} created`} />
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: theme.primary2 }}>
        <View style={styles.formContainer}>
          <Text style={[styles.label, { color: theme.primary5 }]}>
            anticipate what might happen
          </Text>
          <Controller
            name="eventName"
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
                  placeholder="event"
                  placeholderTextColor={theme.primary3}
                />
                {errors.eventName && (
                  <Text style={[styles.errorMsg, { color: theme.warning }]}>
                    {errors.eventName.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Text style={[styles.label, { color: theme.primary5 }]}>
            what steps should you take?
          </Text>
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
                      height: 200,
                    },
                  ]}
                  placeholder="steps to take..."
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
          <Pressable
            style={[styles.submitBtn, { backgroundColor: theme.primary10 }]}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={[styles.submitText, { color: theme.primary1 }]}>
              Submit
            </Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
export default ScenarioForm
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
  label: {
    fontFamily: fonts.regular_italic,
    fontSize: size.xl,
    marginVertical: 10,
  },
})
