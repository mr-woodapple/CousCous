// Receipes Preview to be shown in the ReceipesScreen
//
// Created 02.09.2022 by Jasper Holzapfel

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ReceipeItem = ({receipe: {title, howTo, difficulty, duration, category}, id}) => {
  return (
    <View style={styles.receipeItem}>
      <Text style={styles.mainHeading}>{title}</Text>


      {/* add details such as duration and difficulty here */}
      <Text style={styles.subHeading}>Zubereitungszeit: {duration}, Schwierigkeit: {difficulty}</Text>
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