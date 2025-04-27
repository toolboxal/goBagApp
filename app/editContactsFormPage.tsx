import { StyleSheet, View, Text } from 'react-native'
import { useTheme } from '@/providers/ThemeProvider'
import EditContactForm from '@/components/EditContactForm'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import db from '@/db/db'
import { contacts } from '@/db/schema'
import { eq } from 'drizzle-orm'

const contactsFormPage = () => {
  const { theme } = useTheme()
  const { id } = useLocalSearchParams()

  const { data, isLoading } = useQuery({
    queryKey: ['contacts', id],
    queryFn: async () =>
      await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, Number(id))),
  })

  const selectedContact = data?.[0]

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.primary2 }}>
        <Text>Loading...</Text>
      </View>
    )
  }
  if (!selectedContact) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.primary2 }}>
        <Text>Item not found</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.primary2 }}>
      <EditContactForm selectedContact={selectedContact} />
    </View>
  )
}

export default contactsFormPage

const styles = StyleSheet.create({})
