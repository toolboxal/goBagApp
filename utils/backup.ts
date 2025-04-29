import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'
import db from '@/db/db'
import { storeItems, scenarios, contacts } from '@/db/schema'
import { format } from 'date-fns'
import * as Sharing from 'expo-sharing'
import { Alert } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'

// Type for the backup data structure
interface BackupData {
  backupType: 'precious-lives-app'
  timestamp: string
  version: string
  data: {
    storeItems: any[]
    contacts: any[]
    scenarios: any[]
  }
}

/**
 * Creates a backup of all app data and returns the path to the backup file
 */
export async function createBackup() {
  console.log('backup pressed')
  try {
    // Get data from all tables
    const storeItemsData = await db.select().from(storeItems)
    const contactsData = await db.select().from(contacts)
    const scenariosData = await db.select().from(scenarios)

    // Create backup object
    const backupData: BackupData = {
      backupType: 'precious-lives-app',
      timestamp: new Date().toISOString(),
      version: '1.0', // Increment this when backup format changes
      data: {
        storeItems: storeItemsData,
        contacts: contactsData,
        scenarios: scenariosData,
      },
    }

    // Create filename with date
    const dateStr = format(new Date(), 'yyyy-MM-dd-HHmmss')
    const backupFileName = `precious-lives-backup-${dateStr}.json`

    // Use the standard FileSystem API which is more reliable for sharing
    const fileUri = `${FileSystem.documentDirectory}${backupFileName}`

    // Write the file
    await FileSystem.writeAsStringAsync(
      fileUri,
      JSON.stringify(backupData, null, 2),
      { encoding: FileSystem.EncodingType.UTF8 }
    )

    console.log(`Backup created at: ${fileUri}`)

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Share Precious Lives Backup',
        UTI: 'public.json',
      })
    } else {
      Alert.alert('Sharing is not available on this device')
    }
  } catch (error) {
    console.error('Backup failed:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    Alert.alert('Backup Failed', errorMessage)
  }
}

export async function restoreFromBackup() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
    })
    if (result.assets === null) {
      throw new Error('Failed to open file')
    }

    const uri = result.assets[0].uri
    const fileContent = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.UTF8,
    })
    const backupData: BackupData = JSON.parse(fileContent)

    // Validate backup format
    if (
      !backupData.version ||
      !backupData.data ||
      backupData.backupType !== 'precious-lives-app'
    ) {
      throw new Error('Invalid backup format')
    }

    // Start a transaction to ensure all-or-nothing restore
    await db.transaction(async (tx) => {
      // Clear existing data (in reverse order of dependencies)

      await tx.delete(storeItems)
      await tx.delete(contacts)
      await tx.delete(scenarios)

      if (backupData.data.storeItems?.length) {
        for (const item of backupData.data.storeItems) {
          await tx.insert(storeItems).values(item)
        }
      }

      if (backupData.data.contacts?.length) {
        for (const item of backupData.data.contacts) {
          await tx.insert(contacts).values(item)
        }
      }
      if (backupData.data.scenarios?.length) {
        for (const item of backupData.data.scenarios) {
          await tx.insert(scenarios).values(item)
        }
      }
    })

    console.log('Backup restored successfully')
    return 'success'
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert('Restore Error', error.message)
    }
  }
}
