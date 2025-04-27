import { useTheme } from '@/providers/ThemeProvider'
import { Stack } from 'expo-router'
import { useState, useEffect } from 'react'
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
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

const ContactsPage = () => {
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

  const sortedContacts = contactsList?.sort((a, b) => {
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
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            tintColor: theme.primary5,
            textColor: theme.primary1,
            hintTextColor: theme.primary6,
            placeholder: 'search...',
            barTintColor: theme.primary5,
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
        stickyHeaderIndices={[0]}
      >
        <View
          style={[
            {
              backgroundColor: theme.primary5,
              padding: 12,
              borderRadius: 12,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: size.l,
                color: theme.primary1,
              }}
            >
              total contacts
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: size.l,
                color: theme.primary1,
              }}
            >
              {sortedContacts?.length}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: size.l,
                color: theme.primary1,
              }}
            >
              accounted for
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: size.l,
                color: theme.primary1,
              }}
            >
              {sortedContacts?.filter((contact) => contact.accounted).length}
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
                  fontFamily: fonts.medium,
                  fontSize: size.xl,
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
})
