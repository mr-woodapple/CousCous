// Receipes Detail Screen
//
// Get's called from the ReceipesScreen, passing the id of the current receipe along which is then used on this screen
// to get the firebase data at that location.
//
// Created 02.09.2022 by Jasper Holzapfel

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { ref, push, remove, onValue } from 'firebase/database';
import { db } from '../firebase'
import { getAuth } from 'firebase/auth'

const ReceipeDetailScreen = ({ route }) => {

    const currentReceipeID = route.params;
    
    { /* functions to handle the receipe data stuff */ }
    const [ receipe, setReceipe ] = useState({});


    { /* function to make a user write to their subdirectory in the database */ }
    const auth = getAuth()
    const userUID = auth.currentUser?.uid
    const databasePath = userUID+'/receipes/'+currentReceipeID

    
    { /* some experiments */}    
    useEffect(() => {
        return onValue(ref(db, databasePath), querySnapshot => {
            let data = querySnapshot.val() || {};
            let receipeData = {...data};
            setReceipe(receipeData);

            console.log("Rezept = ", receipe)
        })
    }, [])


    return (

        <ScrollView>
            <Text>ReceipeDetailScreen</Text>


            <Text>Rezepttitel: {receipe.title} </Text>
            <Text>Zutaten: {receipe.ingredients} </Text>
            <Text>Anleitung: {receipe.howTo} </Text>

            
            
        </ScrollView>

    )
}

export default ReceipeDetailScreen

const styles = StyleSheet.create({})