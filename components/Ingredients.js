// Ingredients in a to-do list style for the receipes
//
// Created 05.09.2022 by Jasper Holzapfel

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';

const Ingredients = ({ ingredients, id }) => {



    return (
        <View style={styles.container}>
            <Text>Zutat: {ingredients} </Text>
            <Text>Key: {id} </Text>
            {console.log("ingredients.js | Einzelne Zutat: " + id + " + aktueller key: " + ingredients)}
            <TouchableOpacity>
                <Feather name="plus" size={20} color="black" />
            </TouchableOpacity>

        </View>
    )
}

export default Ingredients

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
        paddingVertical: 20,
        margin: 20,
    }
})