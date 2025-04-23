import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import { useTheme } from '@/providers/ThemeProvider'
import { fonts, size } from '@/constants/font'
const InventoryPageLayout = () => {
  const { theme } = useTheme()
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Inventory',
          presentation: 'card',
          headerLargeTitle: true,
          headerSearchBarOptions: {
            placeholder: 'Search history',
            barTintColor: 'white',
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
export default InventoryPageLayout
const styles = StyleSheet.create({})
