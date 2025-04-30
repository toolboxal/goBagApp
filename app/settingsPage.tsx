import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native'
import { useTheme } from '@/providers/ThemeProvider'
import { fonts, size } from '@/constants/font'
import { HardDriveUpload, HardDriveDownload } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { createBackup, restoreFromBackup } from '@/utils/backup'
import { useQueryClient } from '@tanstack/react-query'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import db from '@/db/db'
import { contacts, scenarios, storeItems } from '@/db/schema'
import Feather from '@expo/vector-icons/Feather'
import { toast } from 'sonner-native'
import CustomToastMsg from '@/components/CustomToastMsg'

const settingsPage = () => {
  const { theme } = useTheme()
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleBackUp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    await createBackup()
    router.dismiss()
  }

  const handleDeleteGoBag = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    Alert.alert('Clear Go Bag', 'This will clear all items in your go bag.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: async () => {
          await db.delete(storeItems)
          router.dismiss()
          queryClient.invalidateQueries({
            queryKey: ['storeItems'],
          })
          toast.custom(<CustomToastMsg message="go bag cleared completely" />)
        },
        style: 'destructive',
      },
    ])
  }

  const handleResetAllData = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    Alert.alert('Reset All Data', 'This will permanently delete everything.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: async () => {
          await db.delete(storeItems)
          await db.delete(contacts)
          await db.delete(scenarios)
          router.dismiss()
          queryClient.invalidateQueries({
            queryKey: ['storeItems'],
          })
          queryClient.invalidateQueries({
            queryKey: ['contacts'],
          })
          queryClient.invalidateQueries({
            queryKey: ['scenarios'],
          })
          toast.custom(<CustomToastMsg message="all data completely deleted" />)
        },
        style: 'destructive',
      },
    ])
  }

  const handleRestore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    const result = await restoreFromBackup()
    if (result === 'success') {
      queryClient.invalidateQueries({ queryKey: ['storeItems'] })
      queryClient.invalidateQueries({
        queryKey: ['contacts'],
      })
      queryClient.invalidateQueries({
        queryKey: ['scenarios'],
      })
      router.dismiss()
      toast.custom(<CustomToastMsg message="data restored successfully" />)
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.primary2 }}
      contentContainerStyle={{ padding: 12 }}
    >
      <Pressable
        style={[styles.card, { backgroundColor: theme.primary1 }]}
        onPress={() => router.push('/disclaimerPage')}
      >
        <Text style={[styles.cardText, { color: theme.primary10 }]}>
          disclaimer
        </Text>
        <Feather
          name="info"
          color={theme.primary10}
          size={24}
          strokeWidth={1}
        />
      </Pressable>
      <Pressable
        style={[styles.card, { backgroundColor: theme.primary1 }]}
        onPress={handleBackUp}
      >
        <Text style={[styles.cardText, { color: theme.primary10 }]}>
          create backup
        </Text>
        <HardDriveUpload color={theme.primary10} size={24} strokeWidth={1.5} />
      </Pressable>
      <Pressable
        style={[styles.card, { backgroundColor: theme.primary1 }]}
        onPress={handleRestore}
      >
        <Text style={[styles.cardText, { color: theme.primary10 }]}>
          restore backup
        </Text>
        <HardDriveDownload
          color={theme.primary10}
          size={24}
          strokeWidth={1.5}
        />
      </Pressable>
      <Text
        style={{
          color: theme.warning,
          fontSize: size.m,
          fontFamily: fonts.regular_italic,
          marginVertical: 5,
        }}
      >
        Caution: This will clear all your data
      </Text>
      <Pressable
        style={[styles.card, { backgroundColor: theme.warning3 }]}
        onPress={handleDeleteGoBag}
      >
        <Text style={[styles.cardText, { color: theme.primary10 }]}>
          clear go bag
        </Text>
        <MaterialCommunityIcons
          name="bag-suitcase-outline"
          size={24}
          color={theme.primary10}
        />
      </Pressable>
      <Pressable
        style={[styles.card, { backgroundColor: theme.warning3 }]}
        onPress={handleResetAllData}
      >
        <Text style={[styles.cardText, { color: theme.primary10 }]}>
          reset all data
        </Text>
        <Ionicons name="warning-outline" size={24} color={theme.primary10} />
      </Pressable>
    </ScrollView>
  )
}
export default settingsPage
const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    fontFamily: fonts.regular_italic,
    fontSize: size.m,
  },
})
