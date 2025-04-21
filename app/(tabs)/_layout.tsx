import { StyleSheet } from 'react-native'
import { Tabs } from 'expo-router'

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="inventoryPage" />
      <Tabs.Screen name="index" />
      <Tabs.Screen name="contactsPage" />
    </Tabs>
  )
}
export default TabsLayout
const styles = StyleSheet.create({})
