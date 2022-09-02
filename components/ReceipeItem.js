// Receipes Preview to be shown in the ReceipesScreen
//
// Created 02.09.2022 by Jasper Holzapfel

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ReceipeItem = ({receipe: {title, howTo, ingredients}, id}) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
      <Text>{howTo}</Text>
      <Text>{ingredients}</Text>
      <Text>{id}</Text>
    </View>
  )
}

export default ReceipeItem

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
  },
})