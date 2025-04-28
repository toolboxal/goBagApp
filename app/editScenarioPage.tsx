import EditScenarioForm from '@/components/EditScenarioForm'
import { useTheme } from '@/providers/ThemeProvider'
import { StyleSheet, View, Text } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import db from '@/db/db'
import { scenarios } from '@/db/schema'
import { eq } from 'drizzle-orm'

const editScenarioPage = () => {
  const { id } = useLocalSearchParams()
  const { theme } = useTheme()
  const { data, isLoading } = useQuery({
    queryKey: ['scenarios', id],
    queryFn: async () =>
      await db
        .select()
        .from(scenarios)
        .where(eq(scenarios.id, Number(id))),
  })
  const selectedItem = data?.[0]

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
    <View style={{ flex: 1, backgroundColor: theme.primary2 }}>
      <EditScenarioForm selectedItem={selectedItem} />
    </View>
  )
}
export default editScenarioPage
const styles = StyleSheet.create({})
