import { Slot, Stack, SplashScreen } from 'expo-router'
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
import { useEffect, useState } from 'react'
import db, { sqliteDB } from '@/db/db'
import { migrate } from 'drizzle-orm/expo-sqlite/migrator'
import migrations from '@/drizzle/migrations'
import { ThemeProvider } from '../providers/ThemeProvider'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner-native'
import { useTheme } from '@/providers/ThemeProvider'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false)
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
        setDbReady(true)
      } catch (err) {
        console.error('Database setup failed:', err)
      }
    }
    initializeDatabase()
  }, [])

  useEffect(() => {
    if (dbReady && (loaded || error)) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  try {
    console.log('Initializing Drizzle Studio...')
    useDrizzleStudio(sqliteDB)
    console.log('Drizzle Studio initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Drizzle Studio:', error)
  }
  const { theme } = useTheme()
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
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
        </Stack>
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
