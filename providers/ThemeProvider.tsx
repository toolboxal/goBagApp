import { StyleSheet, Text, View, Appearance } from 'react-native'
import { useContext, createContext, useState, useEffect } from 'react'
import { themes } from '../constants/theme'

// Define the Theme interface to match the structure of theme objects
export interface Theme {
  textDark: string
  primary1: string
  primary2: string
  primary3: string
  primary4: string
  primary5: string
  primary6: string
  primary7: string
  primary8: string
  primary9: string
  primary10: string
  warning: string
  warning2: string
  warning3: string
  yellow: string
  orange: string
  red: string
  // Add other theme properties here as needed
}

export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.light,
  toggleTheme: () => {},
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(
    Appearance.getColorScheme() === 'dark' ? themes.dark : themes.light
  )
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? themes.dark : themes.light)
    })
    return () => subscription.remove()
  }, [])

  const toggleTheme = () => {
    setTheme(theme === themes.light ? themes.dark : themes.light)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
