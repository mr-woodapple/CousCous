import { StyleSheet, Text, ScrollView, StatusBar } from 'react-native'
import React from 'react'

const MoreScreen = () => {
  return (
    <ScrollView 
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic">
        <Text>MoreScreen</Text>
    </ScrollView>
  )
}

export default MoreScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#eaeaea',
    }
})