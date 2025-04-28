import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Tabs, useRouter } from 'expo-router'
import { Plus } from 'lucide-react-native'
import { useTheme } from '@/providers/ThemeProvider'
import { fonts, size } from '@/constants/font'
import * as Haptics from 'expo-haptics'
import { useQuery } from '@tanstack/react-query'
import db from '@/db/db'

const scenarioPage = () => {
  const { theme } = useTheme()
  const router = useRouter()

  const { data: scenarios } = useQuery({
    queryKey: ['scenarios'],
    queryFn: async () => db.query.scenarios.findMany(),
  })

  if (!scenarios)
    return (
      <View style={{ flex: 1, backgroundColor: theme.primary2 }}>
        <View style={{ padding: 12 }}>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: size.l,
              color: theme.primary5,
            }}
          >
            Create your first emergency contingency plan
          </Text>
        </View>
      </View>
    )

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.primary2 }}
      contentContainerStyle={{ padding: 12 }}
    >
      <Tabs.Screen
        options={{
          headerShown: true,
          headerTitle: 'Scenarios',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.primary2,
          },
          headerTitleStyle: {
            fontFamily: fonts.bold,
            fontSize: size.l,
            color: theme.primary10,
          },
          headerRight: () => (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 16,
                gap: 1,
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                router.push('/scenarioFormPage')
              }}
            >
              <Text
                style={{
                  color: theme.primary10,
                  fontFamily: fonts.medium,
                  fontSize: size.xl,
                }}
              >
                Add
              </Text>
              <Plus color={theme.primary10} size={22} strokeWidth={1.5} />
            </Pressable>
          ),
        }}
      />
      {scenarios.map((scenario) => (
        <Pressable
          key={scenario.id}
          style={[styles.card, { backgroundColor: theme.primary1 }]}
          onLongPress={() => {
            router.navigate({ pathname: '/editScenarioPage', params: { id: scenario.id.toString() } })
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
          }}
        >
          <Text
            style={{
              fontFamily: fonts.black,
              fontSize: size.xxxl,
              color: theme.primary10,
              marginBottom: 10,
            }}
          >
            {scenario.eventName}
          </Text>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: size.l,
              color: theme.primary6,
              marginBottom: 10,
            }}
          >
            {scenario.remarks}
          </Text>

          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: size.xs,
              color: theme.primary3,
            }}
          >
            PRESS AND HOLD TO EDIT
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}
export default scenarioPage

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
})
