import { StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import db from '@/db/db'
import { storeItems } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { useTheme } from '@/providers/ThemeProvider'
import EditForm from '@/components/EditForm'

const editFormPage = () => {
  const { id } = useLocalSearchParams()
  const { theme } = useTheme()

  const { data, isLoading } = useQuery({
    queryKey: ['storeItems', id],
    queryFn: async () =>
      await db
        .select()
        .from(storeItems)
        .where(eq(storeItems.id, Number(id))),
  })
  const selectedItem = data?.[0]

  //   console.log('id', id)
  //   console.log(selectedItem)

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.primary2 }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (!selectedItem) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.primary2 }}>
        <Text>Item not found</Text>
      </View>
    )
  }
  return (
    <View style={{ flex: 1 }}>
      <EditForm selectedPerson={selectedItem} />
    </View>
  )
}
export default editFormPage
const styles = StyleSheet.create({})
