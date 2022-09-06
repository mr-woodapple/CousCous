// Ingredients in a to-do list style for the receipes
//
// Created 05.09.2022 by Jasper Holzapfel

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Ingredients = ({ ingredients }) => {



    return (
        <View>
            <Text>{ingredients}</Text>
        </View>
    )
}

export default Ingredients

const styles = StyleSheet.create({})