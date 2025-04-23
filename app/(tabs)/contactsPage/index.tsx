import { useTheme } from '@/providers/ThemeProvider'
import { Stack } from 'expo-router'
import { useState } from 'react'
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { useQuery } from '@tanstack/react-query'

const ContactsPage = () => {
  const { theme } = useTheme()
  const [refreshing, setRefreshing] = useState(false)
  const [searchBarQuery, setSearchBarQuery] = useState<string>('')

  const onRefresh = async () => {
    setRefreshing(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    // await refetch()
    setRefreshing(false)
  }
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.container, { backgroundColor: theme.primary2 }]}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.primary5}
          colors={[theme.primary5]}
        />
      }
    >
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            tintColor: theme.primary5,
            textColor: theme.primary1,
            hintTextColor: theme.primary6,
            placeholder: 'search...',
            barTintColor: theme.primary5,
            onChangeText: (event) => {
              const text = event.nativeEvent.text
              setSearchBarQuery(text)
              // console.log(text)
            },
            onCancelButtonPress: () => {
              setSearchBarQuery('')
            },
          },
        }}
      />
    </ScrollView>
  )
}
export default ContactsPage
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
})
