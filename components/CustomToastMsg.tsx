import { useTheme } from '@/providers/ThemeProvider'
import { fonts, size } from '@/constants/font'
import { StyleSheet, Text, View } from 'react-native'

const CustomToastMsg = ({ message }: { message: string }) => {
  const { theme } = useTheme()
  return (
    <View style={[styles.toastBody, { backgroundColor: theme.primary10 }]}>
      <Text style={[styles.toastText, { color: theme.accent3 }]}>
        {message}
      </Text>
    </View>
  )
}
export default CustomToastMsg
const styles = StyleSheet.create({
  toastBody: {
    padding: 10,
    paddingLeft: 25,
    borderRadius: 30,
    width: '70%',
    marginHorizontal: 'auto',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  toastText: {
    fontFamily: fonts.regular,
    fontSize: size.m,
  },
})
