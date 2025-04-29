import { useTheme } from '@/providers/ThemeProvider'
import { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Image,
  Pressable,
} from 'react-native'
import { Stack } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useQuery } from '@tanstack/react-query'
import db from '@/db/db'
import { fonts, size } from '@/constants/font'
import { differenceInDays, formatDistanceToNow } from 'date-fns'
import { Salad, Flashlight, Pill, Shirt, Plus } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import InventoryModal from '@/components/InventoryModal'
import { StoreItemSelect } from '@/db/schema'

const InventoryPage = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [searchBarQuery, setSearchBarQuery] = useState<string>('')
  const [openModal, setOpenModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StoreItemSelect | null>(null)
  const { theme } = useTheme()
  const router = useRouter()

  const { data = [], refetch } = useQuery({
    queryKey: ['storeItems'],
    queryFn: async () => {
      const result = await db.query.storeItems.findMany()
      return result || []
    },
  })

  const filteredData = data.filter((item) => {
    return item.name.toLowerCase().includes(searchBarQuery.toLowerCase())
  })

  const categoryIcons = {
    food: <Salad size={20} color={theme.accent6} strokeWidth={2} />,
    medicine: <Pill size={20} color={theme.accent6} strokeWidth={2} />,
    supplies: <Flashlight size={20} color={theme.accent6} strokeWidth={2} />,
    clothing: <Shirt size={20} color={theme.accent6} strokeWidth={2} />,
  }

  // Group data by category
  const groupedData: Record<
    'food' | 'medicine' | 'supplies' | 'clothing',
    typeof data
  > = filteredData.reduce(
    (acc, item) => {
      const category = item.category
      if (category && acc[category]) {
        acc[category].push(item)
      }
      return acc
    },
    {
      food: [] as typeof data,
      medicine: [] as typeof data,
      supplies: [] as typeof data,
      clothing: [] as typeof data,
    }
  )

  // console.log(groupedData)

  const onRefresh = async () => {
    setRefreshing(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    await refetch()
    setRefreshing(false)
  }

  return (
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
    >
      <Stack.Screen
        options={{
          headerTitle: 'Go Bag',
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
      {data.length === 0 ? (
        <View
          style={[
            styles.content,
            {
              backgroundColor: theme.primary2,
              flex: 1,
              // justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Pressable
            onPress={() => router.navigate('/(tabs)')}
            style={{ alignItems: 'center', gap: 3, flexDirection: 'row' }}
          >
            <Text
              style={[
                styles.itemTitle,
                { color: theme.primary5, fontSize: size.xl },
              ]}
            >
              add your first item
            </Text>
            <Plus size={20} color={theme.primary5} strokeWidth={2} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.content}>
          {Object.entries(groupedData).map(([category, items]) => {
            return items.length === 0 ? null : (
              <View key={category} style={styles.categoryContainer}>
                <Text
                  style={[styles.categoryTitle, { color: theme.primary10 }]}
                >
                  {category}
                </Text>
                {items.map((item) => {
                  const diffInDays = differenceInDays(
                    new Date(item.dateExpiry!),
                    new Date()
                  )
                  // console.log(diffInDays)
                  return (
                    <Pressable
                      key={item.id}
                      style={[
                        styles.itemContainer,
                        {
                          backgroundColor:
                            diffInDays <= 0
                              ? theme.warning3
                              : diffInDays < 30
                              ? theme.warning2
                              : theme.primary1,
                        },
                      ]}
                      onPress={() => {
                        setSelectedItem(item)
                        setOpenModal(true)
                      }}
                    >
                      <View>
                        <Text
                          style={[styles.itemTitle, { color: theme.primary10 }]}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            styles.itemText,
                            {
                              color:
                                diffInDays <= 0
                                  ? theme.warning
                                  : theme.primary6,
                            },
                          ]}
                        >
                          {diffInDays <= 0
                            ? `${
                                item.category === 'food'
                                  ? 'EXPIRED'
                                  : 'REPLACE NOW'
                              }`
                            : `${
                                item.category === 'food'
                                  ? 'expires in '
                                  : 'replace in '
                              }${formatDistanceToNow(
                                new Date(item.dateExpiry!)
                              )}`}
                        </Text>
                        <Text
                          style={[
                            styles.itemText,
                            {
                              color: theme.primary6,
                              fontFamily: fonts.light_italic,
                            },
                          ]}
                        >
                          {item.notes && item.notes.length > 20
                            ? item.notes.slice(0, 30) + '...'
                            : item.notes
                            ? item.notes
                            : 'no additional notes'}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end', gap: 3 }}>
                        {item.photoUrl ? (
                          <Image
                            source={{ uri: item.photoUrl }}
                            style={styles.itemImage}
                            onError={(e) =>
                              console.log(
                                'Image load error:',
                                e.nativeEvent.error
                              )
                            }
                          />
                        ) : (
                          <View style={styles.itemImage}>
                            {categoryIcons[item.category!]}
                          </View>
                        )}
                        <Text
                          style={{
                            fontFamily: fonts.regular_italic,
                            fontSize: size.s,
                          }}
                        >{`quantity: ${item.quantity}`}</Text>
                      </View>
                    </Pressable>
                  )
                })}
              </View>
            )
          })}
        </View>
      )}
      <InventoryModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedItem={selectedItem}
      />
    </ScrollView>
  )
}
export default InventoryPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  content: {
    padding: 4,
  },
  categoryContainer: {
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: size.xxl,
    fontFamily: fonts.bold,
    marginBottom: 8,
    paddingLeft: 5,
  },
  itemContainer: {
    marginBottom: 5,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontFamily: fonts.medium,
    fontSize: size.l,
  },
  itemText: {
    fontFamily: fonts.medium,
    fontSize: size.m,
  },
  itemImage: {
    width: 35,
    height: 35,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
})
