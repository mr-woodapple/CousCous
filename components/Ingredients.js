// Ingredients in a to-do list style for the receipes
//
// Created 05.09.2022 by Jasper Holzapfel

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth'
import { db } from '../firebase'
import { ref, push } from 'firebase/database'


const Ingredients = ({ id, ingredient: {title, measurement} }) => {


    { /* stuff that allows to create a todo item from this list*/ }
    const auth = getAuth()
    const userUID = auth.currentUser?.uid
    const databasePath = userUID+'/todos'

    function addNewTodo() {
        push(ref(db, databasePath), {
            done: false,
            title: title.toString(),
        });
    }


    return (
        <View style={styles.container}>
            
            <Text style={styles.text}>{title} </Text>
            
            <TouchableOpacity onPress={() => addNewTodo()}>
                <Entypo name="add-to-list" size={20} color="black" />
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