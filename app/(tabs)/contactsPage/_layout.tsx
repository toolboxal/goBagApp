import { fonts, size } from '@/constants/font'
import { useTheme } from '@/providers/ThemeProvider'
import { Stack } from 'expo-router'
import { Pressable, StyleSheet, Text, Platform } from 'react-native'
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
        }}
      />
    </Stack>
  )
}
export default ContactsLayout
const styles = StyleSheet.create({})
