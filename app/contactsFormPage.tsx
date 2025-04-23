import { StyleSheet, View } from 'react-native'
import { useTheme } from '@/providers/ThemeProvider'
import ContactsForm from '@/components/ContactsForm'

const contactsFormPage = () => {
  const { theme } = useTheme()
  return (
    <View style={{ flex: 1, backgroundColor: theme.primary2 }}>
      <ContactsForm />
    </View>
  )
}

export default contactsFormPage

const styles = StyleSheet.create({})
