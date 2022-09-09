// Ingredients in a to-do list style for the receipes
//
// Created 05.09.2022 by Jasper Holzapfel

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth'
import { db } from '../firebase'
import { ref, push } from 'firebase/database'


const Ingredients = ({ ingredients, id }) => {


    { /* stuff that allows to create a todo item from this list*/ }
    const auth = getAuth()
    const userUID = auth.currentUser?.uid
    const databasePath = userUID+'/todos'

    function addNewTodo() {
        push(ref(db, databasePath), {
            done: false,
            title: ingredients.toString(),
        });
    }


    return (
        <View style={styles.container}>
            
            <Text style={styles.text}>{ingredients} </Text>
            
            <TouchableOpacity onPress={() => addNewTodo()}>
                <Feather name="plus-circle" size={20} color="black" />
            </TouchableOpacity>

        </View>
    )
}

export default Ingredients

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 16,
    }
})