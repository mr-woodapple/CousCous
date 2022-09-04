// Receipes Preview to be shown in the ReceipesScreen
//
// Created 02.09.2022 by Jasper Holzapfel

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ReceipeItem = ({receipe: {title, howTo, ingredients}, id}) => {
  return (
    <View style={styles.receipeItem}>
      <Text style={styles.mainHeading}>{title}</Text>
      <Text style={styles.subHeading}>{ingredients}</Text>

    </View>
  )
}

export default ReceipeItem

const styles = StyleSheet.create({
  receipeItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  mainHeading: {
    paddingTop: 50,
    fontWeight: 'bold',
    fontSize: 20,
  },
  subHeading: {
    paddingTop: 5,
  },
})