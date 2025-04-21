import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/providers/ThemeProvider'
import Form from '@/components/Form'

const IndexPage = () => {
  const { theme } = useTheme()

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.primary2, flex: 1 }}
      edges={['top']}
    >
      <Form />
    </SafeAreaView>
  )
}
export default IndexPage
const styles = StyleSheet.create({})
