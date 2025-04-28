import ScenarioForm from '@/components/ScenarioForm'
import { useTheme } from '@/providers/ThemeProvider'
import { StyleSheet, View } from 'react-native'

const scenarioFormPage = () => {
  const { theme } = useTheme()
  return (
    <View style={{ flex: 1, backgroundColor: theme.primary2 }}>
      <ScenarioForm />
    </View>
  )
}
export default scenarioFormPage
const styles = StyleSheet.create({})
