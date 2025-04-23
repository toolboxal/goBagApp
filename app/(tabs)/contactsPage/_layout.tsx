import { fonts, size } from '@/constants/font'
import { useTheme } from '@/providers/ThemeProvider'
import { Stack } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Plus } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'

const ContactsLayout = () => {
  const { theme } = useTheme()
  const router = useRouter()
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Contacts',
          presentation: 'card',
          headerLargeTitle: true,
          headerSearchBarOptions: {
            placeholder: 'search...',
            barTintColor: theme.primary5,
            tintColor: theme.primary2,
          },
          headerStyle: {
            backgroundColor: theme.primary2,
          },
          headerTitleStyle: {
            fontFamily: fonts.bold,
            fontSize: size.l,
            color: theme.primary10,
          },
          headerLargeTitleStyle: {
            fontFamily: fonts.bold,
            fontSize: size.xxxl,
            color: theme.primary10,
          },
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 5,
                gap: 1,
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                router.push('/contactsFormPage')
              }}
            >
              <Text
                style={{
                  color: theme.primary10,
                  fontFamily: fonts.medium,
                  fontSize: size.xl,
                }}
              >
                Add
              </Text>
              <Plus color={theme.primary10} size={22} strokeWidth={1.5} />
            </Pressable>
          ),
        }}
      />
    </Stack>
  )
}
export default ContactsLayout
const styles = StyleSheet.create({})
