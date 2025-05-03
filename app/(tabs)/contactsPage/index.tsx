import { useTheme } from '@/providers/ThemeProvider'
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { useQuery } from '@tanstack/react-query'
import db from '@/db/db'
import { fonts, size } from '@/constants/font'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { contacts, contactsSelect } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { SafeAreaView } from 'react-native-safe-area-context'
import ContactModal from '@/components/ContactModal'
import { Plus } from 'lucide-react-native'

const ContactsPage = () => {
  const router = useRouter()
  const { theme } = useTheme()
  const [refreshing, setRefreshing] = useState(false)
  const [searchBarQuery, setSearchBarQuery] = useState<string>('')
  const [openModal, setOpenModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<contactsSelect | null>(null)
  const priorityArr = [
    { type: 'normal', color: theme.primary5 },
    { type: 'high', color: theme.primary10 },
    { type: 'critical', color: theme.warning },
  ]

  const { data: contactsList, refetch } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => db.query.contacts.findMany(),
  })

  const filteredData = contactsList?.filter((item) => {
    return item.name.toLowerCase().includes(searchBarQuery.toLowerCase())
  })

  const sortedContacts = filteredData?.sort((a, b) => {
    const nameA = a.priority.toLowerCase()
    const nameB = b.priority.toLowerCase()
    return nameA.localeCompare(nameB)
  })

  const onRefresh = async () => {
    setRefreshing(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    await refetch()
    setRefreshing(false)
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            headerRight: () => (
              <Pressable
                pressRetentionOffset={{
                  bottom: 30,
                  left: 30,
                  right: 30,
                  top: 30,
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // paddingRight: 5,
                  gap: 1,
                }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  router.push('/contactsFormPage')
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
            headerSearchBarOptions: {
              tintColor: theme.primary5,
              textColor: theme.primary1,
              hintTextColor: theme.primary6,
              placeholder: 'search...',
              barTintColor: theme.primary4,
              onChangeText: (event) => {
                const text = event.nativeEvent.text
                setSearchBarQuery(text)
                // console.log(text)
              },
              onCancelButtonPress: () => {
                setSearchBarQuery('')
              },
            },
          }}
        />
      )}

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[styles.container, { backgroundColor: theme.primary2 }]}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary5}
            colors={[theme.primary5]}
          />
        }
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            gap: 1,
            // backgroundColor: 'green',
            padding: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.primary5,
            marginBottom: 10,
          }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            router.push('/contactsFormPage')
          }}
        >
          <Text
            style={{
              color: theme.primary10,
              fontFamily: fonts.medium,
              fontSize: size.l,
            }}
          >
            Add Contact
          </Text>
        </Pressable>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: theme.primary1,
            padding: 12,
            borderRadius: 12,
            marginBottom: 15,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginBottom: 5,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: size.l,
                color: theme.primary10,
              }}
            >
              total contacts
            </Text>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: size.xl,
                color: theme.accent8,
              }}
            >
              {sortedContacts?.length || 0}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: size.l,
                color: theme.primary10,
              }}
            >
              total accounted for
            </Text>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: size.xl,
                color: theme.accent8,
              }}
            >
              {sortedContacts?.filter((contact) => contact.accounted).length ||
                0}
            </Text>
          </View>
        </View>
        {sortedContacts?.map((contact) => (
          <Pressable
            key={contact.id}
            style={[styles.contactBox, { backgroundColor: theme.primary1 }]}
            onPress={() => {
              setOpenModal(true)
              setSelectedItem(contact)
            }}
          >
            <View style={{ flex: 3 }}>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: size.l,
                  color: theme.primary10,
                }}
              >
                {contact.name}
              </Text>
            </View>
            <View
              style={{
                flex: 2,
                // backgroundColor: 'yellow',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                gap: 15,
                paddingRight: 7,
              }}
            >
              <View
                style={{
                  backgroundColor: priorityArr.find(
                    (item) => item.type === contact.priority
                  )?.color,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  borderRadius: 12,
                  width: 55,
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    color: theme.primary1,
                    fontSize: size.s,
                  }}
                >
                  {contact.priority}
                </Text>
              </View>
              <View>
                <BouncyCheckbox
                  size={24}
                  fillColor={theme.primary10}
                  unFillColor="#FFFFFF"
                  disableText={true}
                  iconStyle={{ borderColor: theme.primary10 }}
                  innerIconStyle={{ borderWidth: 1 }}
                  textStyle={{
                    fontFamily: fonts.bold,
                    fontSize: size.s,
                    textDecorationLine: 'none',
                    color: theme.primary10,
                  }}
                  onPress={async (isChecked: boolean) => {
                    // console.log(isChecked)
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
                    await db
                      .update(contacts)
                      .set({ accounted: isChecked })
                      .where(eq(contacts.id, contact.id))
                    refetch()
                  }}
                />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <ContactModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedItem={selectedItem}
      />
    </SafeAreaView>
  )
}
export default ContactsPage
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  contactBox: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
  },
  stickyHeader: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
})
