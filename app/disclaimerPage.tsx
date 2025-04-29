import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/providers/ThemeProvider'
import { fonts, size } from '@/constants/font'
const disclaimerPage = () => {
  const { theme } = useTheme()
  return (
    <View style={{ flex: 1, backgroundColor: theme.primary2, padding: 12 }}>
      <Text style={[styles.txt, { color: theme.primary6 }]}>
        This app is an aid to help you prepare for an emergency. It is not a
        substitute for regulatory warnings or instructions.
      </Text>
      <Text style={[styles.txt, { color: theme.primary6 }]}>
        Please always listen to official warnings and instructions from local
        authorities and emergency services.
      </Text>
      <Text style={[styles.txt, { color: theme.primary6 }]}>
        And follow the directions from your local congregation.
      </Text>
    </View>
  )
}
export default disclaimerPage
const styles = StyleSheet.create({
  txt: {
    fontFamily: fonts.regular,
    fontSize: size.l,
    marginVertical: 5,
  },
})
