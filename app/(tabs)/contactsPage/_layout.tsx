import { fonts, size } from '@/constants/font'
import { useTheme } from '@/providers/ThemeProvider'
import { Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

const ContactsLayout = () => {
  const { theme } = useTheme()
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
        }}
      />
    </Stack>
  )
}
export default ContactsLayout
const styles = StyleSheet.create({})
