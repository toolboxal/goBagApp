import { Slot, SplashScreen } from 'expo-router'
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
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

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false)
  const [loaded, error] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
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
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  )
}
