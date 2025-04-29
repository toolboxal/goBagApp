import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from '@/providers/ThemeProvider'
import { fonts, size } from '@/constants/font'
import db from '@/db/db'
import { Salad, Flashlight, Pill, Shirt, Plus } from 'lucide-react-native'
import { Tabs, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { Settings } from 'lucide-react-native'

const categoryArr = [
  { type: 'food', label: 'food &\nwater' },
  { type: 'medicine', label: 'medicine' },
  { type: 'supplies', label: 'supplies' },
  { type: 'clothing', label: 'clothing' },
] as const

const dashboardPage = () => {
  const { theme } = useTheme()
  const router = useRouter()
  const categoryIcons = {
    food: <Salad size={30} color={theme.accent6} strokeWidth={2} />,
    medicine: <Pill size={30} color={theme.accent6} strokeWidth={2} />,
    supplies: <Flashlight size={30} color={theme.accent6} strokeWidth={2} />,
    clothing: <Shirt size={30} color={theme.accent6} strokeWidth={2} />,
  }

  const { data = [], refetch } = useQuery({
    queryKey: ['storeItems'],
    queryFn: async () => {
      const result = await db.query.storeItems.findMany()
      return result || []
    },
  })

  const { data: contacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const result = await db.query.contacts.findMany()
      return result || []
    },
  })

  const { data: scenarios } = useQuery({
    queryKey: ['scenarios'],
    queryFn: async () => {
      const result = await db.query.scenarios.findMany()
      return result || []
    },
  })

  const expiringSoon = data.filter((item) => {
    if (item.dateExpiry && item.category === 'food') {
      const expiryDate = new Date(item.dateExpiry)
      const now = new Date()
      // Consider items expiring within 30 days but not yet expired
      const thirtyDaysFromNow = new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000
      )
      return (
        !isNaN(expiryDate.getTime()) &&
        expiryDate > now &&
        expiryDate <= thirtyDaysFromNow
      )
    }
    return false
  })

  const expired = data.filter((item) => {
    if (item.dateExpiry && item.category === 'food') {
      const expiryDate = new Date(item.dateExpiry)
      const now = new Date()
      return expiryDate <= now
    }
    return false
  })

  const toReplaceSoon = data.filter((item) => {
    if (item.dateExpiry && item.category !== 'food') {
      const expiryDate = new Date(item.dateExpiry)
      const now = new Date()
      // Consider items expiring within 30 days but not yet expired
      const thirtyDaysFromNow = new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000
      )
      return !isNaN(expiryDate.getTime()) && expiryDate <= thirtyDaysFromNow
    }
    return false
  })

  return (
    <ScrollView
      contentContainerStyle={{ padding: 12 }}
      style={{ flex: 1, backgroundColor: theme.primary2 }}
    >
      <Tabs.Screen
        options={{
          headerShown: true,
          headerTitle: 'Dashboard',
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
                router.push('/settingsPage')
              }}
            >
              <Text
                style={{
                  color: theme.primary10,
                  fontFamily: fonts.regular,
                  fontSize: size.xl,
                }}
              >
                settings
              </Text>
              {/* <Settings color={theme.primary10} size={26} strokeWidth={1} /> */}
            </Pressable>
          ),
        }}
      />
      <Text style={[styles.mainTitle, { color: theme.primary10 }]}>Go Bag</Text>
      <View style={[styles.card, { backgroundColor: theme.primary1 }]}>
        {/* <Text style={styles.subTitle}>total items</Text> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          {categoryArr.map((category) => (
            <View
              key={category.type}
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {categoryIcons[category.type]}
              <Text
                style={{
                  fontFamily: fonts.light,
                  fontSize: size.s,
                  color: theme.primary7,
                }}
              >
                {category.type}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: size.xxl,
                  color: theme.primary7,
                }}
              >
                {data.filter((item) => item.category === category.type).length}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.primary1,
              flex: 1,
              flexDirection: 'column',
              gap: 5,
              height: 100,
              justifyContent: 'space-between',
            },
          ]}
        >
          <Text
            style={{
              fontFamily: fonts.light,
              fontSize: size.s,
              color: theme.primary7,
            }}
          >
            food expiring soon
          </Text>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: size.xxxl,
              color: expiringSoon.length > 0 ? theme.warning : theme.primary7,
            }}
          >
            {expiringSoon.length}
          </Text>
        </View>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.primary1,
              flex: 1,
              flexDirection: 'column',
              gap: 5,
              height: 100,
              justifyContent: 'space-between',
            },
          ]}
        >
          <Text
            style={{
              fontFamily: fonts.light,
              fontSize: size.s,
              color: theme.primary7,
            }}
          >
            food already expired
          </Text>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: size.xxxl,
              color: expired.length > 0 ? theme.warning : theme.primary7,
            }}
          >
            {expired.length}
          </Text>
        </View>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.primary1,
              flex: 1,
              flexDirection: 'column',
              gap: 5,
              height: 100,
              justifyContent: 'space-between',
            },
          ]}
        >
          <Text
            style={{
              fontFamily: fonts.light,
              fontSize: size.s,
              color: theme.primary7,
            }}
          >
            non-food to replace soon
          </Text>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: size.xxxl,
              color: toReplaceSoon.length > 0 ? theme.warning : theme.primary7,
            }}
          >
            {toReplaceSoon.length}
          </Text>
        </View>
      </View>
      <Text style={[styles.mainTitle, { color: theme.primary10 }]}>
        Contacts
      </Text>
      <View style={[styles.card, { backgroundColor: theme.primary1 }]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.light,
              fontSize: size.m,
              color: theme.primary7,
            }}
          >
            priority attention
          </Text>
          <Text
            style={{
              fontFamily: fonts.light,
              fontSize: size.m,
              color: theme.primary7,
            }}
          >
            accounted for
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <View>
            <Text style={styles.contactlabel}>{`critical: ${
              contacts?.filter((item) => item.priority === 'critical').length ||
              0
            }`}</Text>
            <Text style={styles.contactlabel}>{`high: ${
              contacts?.filter((item) => item.priority === 'high').length || 0
            }`}</Text>
            <Text style={styles.contactlabel}>{`normal: ${
              contacts?.filter((item) => item.priority === 'normal').length || 0
            }`}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.accent7,
              borderRadius: 12,
              width: 55,
              aspectRatio: 1,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: size.xxxxl,
                color: theme.primary1,
              }}
            >
              {contacts?.filter((contact) => contact.accounted).length || 0}
            </Text>
          </View>
        </View>
      </View>
      <Text style={[styles.mainTitle, { color: theme.primary10 }]}>
        Scenarios
      </Text>
      {scenarios?.map((scenario) => (
        <View
          key={scenario.id}
          style={[styles.card, { backgroundColor: theme.primary1 }]}
        >
          <Text
            style={{
              fontFamily: fonts.black,
              fontSize: size.xxl,
              color: theme.primary10,
              marginBottom: 5,
            }}
          >
            {scenario.eventName}
          </Text>
          <Text
            style={{
              fontFamily: fonts.light_italic,
              fontSize: size.m,
              color: theme.primary7,
            }}
          >
            {scenario.remarks.length > 50
              ? scenario.remarks.slice(0, 45) + '....'
              : scenario.remarks}
          </Text>
        </View>
      ))}
    </ScrollView>
  )
}
export default dashboardPage

const styles = StyleSheet.create({
  mainTitle: {
    fontFamily: fonts.black,
    fontSize: size.xxxl,
    marginVertical: 10,
    paddingLeft: 5,
  },
  card: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  contactlabel: {
    fontFamily: fonts.regular_italic,
    fontSize: size.m,
    marginVertical: 1,
  },
})
