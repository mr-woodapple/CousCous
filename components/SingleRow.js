// Simple row, takes an icon name and text as arguments
//
// Created 01.09.2022 by Jasper Holzapfel

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Feather } from '@expo/vector-icons'; 


const SingleRow = (props) => {
  return (
    <View style={styles.container}>

      
      <View style={styles.leftPart}>
        <Feather name={props.icon} size={24} color="black" />
        <Text style={styles.text}>{props.text}</Text>
      </View>
      

      {props.navlink ? (
        <View style={styles.iconRight}>
          <Feather name={'chevron-right'} size={24} color="black" />
        </View>
        ):(
        // proper way of doing this?
        <></>
      )}
      

    </View>
  )
}

export default SingleRow

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  leftPart: {
    flexDirection: 'row'
  },

  text: {
    paddingLeft: 20,
    fontSize: 18,
  }
})