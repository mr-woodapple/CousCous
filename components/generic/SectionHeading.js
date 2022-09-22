// Basic title row to add between sections
//
// Created 22.09.2022 by Jasper Holzapfel 


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SectionHeading = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.heading}</Text>
    </View>
  )
}

export default SectionHeading

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    
    text: {
      fontWeight: 'bold'
    }
})