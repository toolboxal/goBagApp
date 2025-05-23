import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_300Light_Italic,
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useEffect, useState } from 'react'
import db, { sqliteDB } from '@/db/db'
import { migrate } from 'drizzle-orm/expo-sqlite/migrator'
import migrations from '@/drizzle/migrations'
import { ThemeProvider } from '../providers/ThemeProvider'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner-native'
import { useTheme } from '@/providers/ThemeProvider'
import { Pressable, Text, TextInput } from 'react-native'
import { fonts, size } from '@/constants/font'
import { storage } from '@/storage/storage'
import { contacts, scenarios, storeItems } from '@/db/schema'
import { storeItemsSeed, scenarioSeed, contactsSeed } from '@/db/seeds'
import { PostHogProvider } from 'posthog-react-native'

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
  duration: 3000,
  fade: true,
})

const postHogApiKey = process.env.EXPO_PUBLIC_PRECIOUSLIVES_POSTHOG_API_KEY

const queryClient = new QueryClient()

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false)
  const [isFirstLaunch, setIsFirstLaunch] = useState(false)
  const router = useRouter()
  const [loaded, error] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_300Light_Italic,
    Inter_400Regular,
    Inter_400Regular_Italic,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  })

  useEffect(() => {
    async function initializeDatabase() {
      try {
        await migrate(db, migrations)

        if ((Text as any).defaultProps == null) (Text as any).defaultProps = {}
        ;(Text as any).defaultProps.allowFontScaling = false

        if ((TextInput as any).defaultProps == null)
          (TextInput as any).defaultProps = {}
        ;(TextInput as any).defaultProps.allowFontScaling = false
      } catch (err) {
        console.error('Database setup failed:', err)
      } finally {
        setDbReady(true)
      }
    }
    initializeDatabase()
  }, [])

  useEffect(() => {
    const checkFirstLaunch = () => {
      try {
        const hasLaunched = storage.getBoolean('hasFirstLaunched')
        if (hasLaunched === undefined || hasLaunched === false) {
          setIsFirstLaunch(true)
          storage.set('hasFirstLaunched', true)
        } else {
          setIsFirstLaunch(false)
        }
      } catch (error) {
        console.error('Error checking first launch:', error)
      }
    }
    checkFirstLaunch()
  }, [dbReady])

  useEffect(() => {
    if (isFirstLaunch) {
      const seedData = async () => {
        await db.insert(storeItems).values([...storeItemsSeed])
        await db.insert(contacts).values([...contactsSeed])
        await db.insert(scenarios).values([...scenarioSeed])
        console.log('Data seeded for first launch')
      }
      seedData()
    }
  }, [isFirstLaunch, dbReady])

  useEffect(() => {
    if (dbReady && (loaded || error)) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error, dbReady])

  try {
    console.log('Initializing Drizzle Studio...')
    useDrizzleStudio(sqliteDB)
    console.log('Drizzle Studio initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Drizzle Studio:', error)
  }
  const { theme } = useTheme()
  return (
    <PostHogProvider apiKey={postHogApiKey} autocapture={true}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <Stack
              initialRouteName="(tabs)"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="editFormPage"
                options={{
                  headerShown: true,
                  headerTitle: 'Edit Item',
                  headerStyle: { backgroundColor: theme.primary2 },
                  headerBackTitle: 'Back',
                  headerTintColor: theme.primary10,
                }}
              />
              <Stack.Screen
                name="contactsFormPage"
                options={{
                  headerShown: true,
                  headerTitle: 'Add Contact',
                  headerStyle: { backgroundColor: theme.primary2 },
                  headerBackTitle: 'Back',
                  headerTintColor: theme.primary10,
                  // presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="editContactsFormPage"
                options={{
                  headerShown: true,
                  headerTitle: 'Edit Contact',
                  headerStyle: { backgroundColor: theme.primary2 },
                  headerBackTitle: 'Back',
                  headerTintColor: theme.primary10,
                  presentation: 'modal',
                  headerRight: () => (
                    <Pressable
                      onPress={() => {
                        router.dismiss()
                      }}
                    >
                      <Text
                        style={{
                          color: theme.primary10,
                          fontFamily: fonts.regular,
                          fontSize: size.l,
                        }}
                      >
                        close
                      </Text>
                    </Pressable>
                  ),
                }}
              />
              <Stack.Screen
                name="scenarioFormPage"
                options={{
                  headerShown: true,
                  headerTitle: 'Add Scenario',
                  headerStyle: { backgroundColor: theme.primary2 },
                  headerBackTitle: 'Back',
                  headerTintColor: theme.primary10,
                  // presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="editScenarioPage"
                options={{
                  headerShown: true,
                  headerTitle: 'Edit Scenario',
                  headerStyle: { backgroundColor: theme.primary2 },
                  headerBackTitle: 'Back',
                  headerTintColor: theme.primary10,
                  presentation: 'modal',
                  headerRight: () => (
                    <Pressable
                      onPress={() => {
                        router.dismiss()
                      }}
                    >
                      <Text
                        style={{
                          color: theme.primary10,
                          fontFamily: fonts.regular,
                          fontSize: size.l,
                        }}
                      >
                        close
                      </Text>
                    </Pressable>
                  ),
                }}
              />
              <Stack.Screen
                name="settingsPage"
                options={{
                  headerShown: true,
                  headerTitle: 'Settings',
                  headerStyle: { backgroundColor: theme.primary2 },
                  headerBackTitle: 'Back',
                  headerTintColor: theme.primary10,
                }}
              />
              <Stack.Screen
                name="disclaimerPage"
                options={{
                  headerShown: true,
                  headerTitle: 'Disclaimer',
                  headerStyle: { backgroundColor: theme.primary2 },
                  headerBackTitle: 'Back',
                  headerTintColor: theme.primary10,
                }}
              />
            </Stack>
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </PostHogProvider>
  )
}
