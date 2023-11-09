import React, { useState, useEffect, useReducer } from 'react'
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'

import { actionCreators, initialState, reducer } from './reducer'
import { api } from './api'
import { data } from './data'
import * as items from './messaging_data'
import Conversations from './Conversations'

function Messaging({ navigation, route }){ 
const url = (api.messaging ?? "messaging/") + (route?.params?.id ?? '')
const [state, dispatch] = useReducer(reducer, initialState)

const { item, history, loading, error } = state

const onPressNewMessage = () => {}
const onPressSearchContacts = () => {}

async function getItem() {
      dispatch(actionCreators.loading())

      try {
        if (url in history){
           dispatch(actionCreators.local(history[url]))
        } else if (url.indexOf('http') > -1){
          const response = await fetch(url)
          const json = await response.json()
          if(json){
            dispatch(actionCreators.success(route.params?.id ? json : json[0], url))
          }   
        } else {
          const json = route.params?.id ? data[route.params?.id] : items.item
          dispatch(actionCreators.success(json, url))
        }
      } catch (e) {
        dispatch(actionCreators.failure())
      }
    }

useEffect(() => {
    getItem();
}, []);
  
if (loading) {
    return (
        <View style={styles.center}>
        <ActivityIndicator animating={true} />
        </View>
    )
}

return(
<ScrollView style={styles.messaging} showsVerticalScrollIndicator={false}>
<Conversations item={'conversations' in item ? item.conversations: item} navigation={navigation}/>
<View style={{flexDirection: 'row'}}>
<TouchableOpacity  onPress={onPressNewMessage}>
    <View style={styles.new_message}>{'New Message'}</View>
</TouchableOpacity>
<TouchableOpacity  onPress={onPressSearchContacts}>
    <View style={styles.search_contacts}>{'Search Contacts'}</View>
</TouchableOpacity>
</View>
</ScrollView>
)}

export default Messaging;

const styles = StyleSheet.create({
  "center": {
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "new_message": {
    "flex": 1,
    "padding": 10,
    "margin": 5,
    "textAlign": "center",
    "backgroundColor": "#d62b2b",
    "color": "white"
  },
  "search_contacts": {
    "flex": 1,
    "padding": 10,
    "margin": 5,
    "textAlign": "center",
    "backgroundColor": "#1ACDA5",
    "color": "white"
  }
});