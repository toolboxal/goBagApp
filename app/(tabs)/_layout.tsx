import { Platform, Pressable, StyleSheet, View, Text } from 'react-native'
import { Tabs } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { LayoutDashboard, Plus } from 'lucide-react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { fonts, size } from '@/constants/font'
import { useTheme } from '@/providers/ThemeProvider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Entypo from '@expo/vector-icons/Entypo'
import { useRouter } from 'expo-router'

const TabsLayout = () => {
  const { theme } = useTheme()
  const { bottom } = useSafeAreaInsets()
  const router = useRouter()
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: fonts.regular,
          fontSize: size.xs,
          paddingTop: 6,
        },
        tabBarStyle: {
          backgroundColor: theme.primary2,
          height: Platform.OS === 'ios' ? bottom + 65 : 75,
          paddingTop: 5,
          borderTopColor: theme.primary2,
        },
        tabBarActiveTintColor: theme.accent8,
        tabBarInactiveTintColor: theme.primary10,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        },
      }}
    >
      <Tabs.Screen
        name="dashboardPage"
        options={{
          title: 'home',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              size={30}
              color={focused ? theme.accent8 : theme.primary10}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inventoryPage"
        options={{
          title: 'go bag',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="bag-suitcase"
              size={31}
              color={focused ? theme.accent8 : theme.primary10}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'form',
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 50,
                aspectRatio: 1,
                borderRadius: 100,
                backgroundColor: theme.primary10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Entypo name="plus" size={24} color="white" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="contactsPage"
        options={{
          title: 'contacts',
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="users"
              size={23}
              color={focused ? theme.accent8 : theme.primary10}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scenarioPage"
        options={{
          title: 'scenarios',
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name="house-fire"
              size={23}
              color={focused ? theme.accent8 : theme.primary10}
            />
          ),
        }}
      />
    </Tabs>
  )
}
export default TabsLayout
const styles = StyleSheet.create({})
