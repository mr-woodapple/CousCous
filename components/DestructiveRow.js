import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DestructiveRow = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  )
}

export default DestructiveRow

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
        marginTop: 10,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
})