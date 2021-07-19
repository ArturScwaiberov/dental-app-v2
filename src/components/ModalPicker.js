import React, { useState } from 'react'
import { Header, Item, Input, Icon } from 'native-base'
import { StyleSheet, Text, Pressable, View, FlatList, Platform } from 'react-native'
import Modal from 'react-native-modal'

const ModalPicker = ({ items, header, showTitle, onSelect, selected, showSearchBar }, props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [searchValue, setSearchValue] = React.useState('')

  const toggleModal = () => {
    setSearchValue('')
    setModalVisible(!modalVisible)
  }

  const selectHandler = (id) => () => {
    onSelect(id)
    toggleModal()
  }

  const selectedItem = items.find((item) => item.id === selected)

  const onSearch = (e) => {
    setSearchValue(e.nativeEvent.text)
  }

  let parentItem = null
  if (selectedItem && selectedItem.parentId !== null) {
    parentItem = items.find((item) => item.id == selectedItem.parentId)
  }

  let flatData = () => {
    return items
  }
  if (selectedItem?.fullName !== null && showSearchBar) {
    flatData = () => {
      return items
        ? items.filter(
            (item) => item.fullName.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
          )
        : null
    }
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        hideModalContentWhileAnimating={true}
        isVisible={modalVisible}
        onBackdropPress={toggleModal}
        onRequestClose={toggleModal}
        backdropOpacity={0.4}
      >
        <View style={styles.centeredView}>
          <View
            style={{ ...styles.modalView, flex: showSearchBar ? 1 : 0 }}
            showSearchBar={showSearchBar}
          >
            <FlatList
              data={flatData()}
              renderItem={({ item, index }) => {
                return (
                  <Pressable
                    onPress={selectHandler(item.id)}
                    style={{
                      width: '100%',
                      borderBottomWidth: 0.5,
                      borderBottomColor: index == items.length - 1 ? 'rgba(0,0,0,0)' : '#000',
                      paddingVertical: 14,
                      paddingHorizontal: 20,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      elevation: 100,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#007AFF',
                        fontWeight: item.id === selected ? 'bold' : 'normal',
                      }}
                    >
                      {item.name || item.fullName}
                    </Text>
                    {item.id === selected && (
                      <Icon
                        type='Ionicons'
                        name='checkmark'
                        fontSize={20}
                        style={{ color: '#007AFF' }}
                      />
                    )}
                  </Pressable>
                )
              }}
              ListHeaderComponent={
                showSearchBar ? (
                  <View>
                    <Text
                      style={{ textAlign: 'center', fontSize: 16, color: '#333', paddingTop: 16 }}
                    >
                      {header}
                    </Text>

                    <Header
                      searchBar
                      rounded
                      style={{
                        marginTop: Platform.OS === 'android' && 16,
                        backgroundColor: '#fff',
                        height: 50,
                      }}
                    >
                      <Item style={{ height: 36, borderRadius: 10, backgroundColor: '#eee' }}>
                        <Icon name='ios-search' />
                        <Input
                          placeholder='Search...'
                          clearButtonMode='always'
                          value={searchValue}
                          onChange={(text) => onSearch(text)}
                        />
                      </Item>
                    </Header>
                  </View>
                ) : (
                  <Text style={{ textAlign: 'center', fontSize: 16, color: '#333', paddingTop: 8 }}>
                    {header}
                  </Text>
                )
              }
            />
          </View>

          <Pressable style={styles.modalCancelView} onPress={toggleModal}>
            <Text style={{ color: '#007AFF', fontSize: 20, fontWeight: '600' }}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>

      <Pressable
        style={{
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
          flexDirection: 'row',
          width: '99%',
          textAlign: 'center',
          paddingVertical: 14,
          paddingHorizontal: 16,
          justifyContent: 'space-between',
        }}
        onPress={toggleModal}
      >
        {selectedItem ? (
          <Text style={{ color: '#000', fontSize: 16.5 }}>
            {selectedItem.name || selectedItem.fullName}
            {parentItem ? ', ' + parentItem.name : null}
          </Text>
        ) : (
          <Text style={{ color: '#000', fontSize: 16.5 }}>{showTitle}</Text>
        )}
        <View style={{ height: 20 }}>
          <Icon type='MaterialIcons' name='arrow-forward-ios' style={{ fontSize: 22 }} />
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // elevation: 5,
    overflow: 'hidden',
  },
  modalCancelView: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // elevation: 5,
  },
})

export default ModalPicker
