// Receipes Detail Screen
//
// Get's called from the ReceipesScreen, passing the id of the current receipe along which is then used on this screen
// to get the firebase data at that location.
//
// Created 02.09.2022 by Jasper Holzapfel

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { ref, push, remove, onValue } from 'firebase/database';
import { db } from '../firebase'
import { getAuth } from 'firebase/auth'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native'


import DestructiveRow from '../components/DestructiveRow';
import Ingredients from '../components/Ingredients';



const ReceipeDetailScreen = ({ route }) => {

    const navigation = useNavigation();

    const [ receipes, setReceipes ] = useState({});

    { /* function to make a user write to their subdirectory in the database */ }
    const auth = getAuth()
    const userUID = auth.currentUser?.uid

    const currentReceipeID = route.params;
    const databasePath = userUID+'/receipes/'+currentReceipeID

    console.log("ReceipeDetailScreen.js | DatabasePath = " + databasePath)
    
    { /* working with the receipes data */}   
    useEffect(() => {
        return onValue(ref(db, databasePath), querySnapshot => {
            let data = querySnapshot.val() || {};
            let receipeData = {...data};
            setReceipes(receipeData);

            console.log('ReceipeDetailScreen.js | setReceipe = ', JSON.stringify(receipeData))
        })
    }, []) 

    console.log("ReceipeDetailScreen.js | receipe = " + JSON.stringify(receipes))

    function deleteReceipe() {
        remove(ref(db, databasePath));
        navigation.navigate('ReceipesScreenNav');
    }


    { /* function for the bottom modal sheets */ }
    const sheetRef = useRef(null);
    const [ isOpen, setIsOpen ] = useState(true);
    const snapPoints = ["40%", "80%"]

    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex('0');
        setIsOpen(true);
    }, []);

    return (

        <SafeAreaView style={styles.container}>

            <ScrollView>

                <View style={styles.headerWrapper}>

                    <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
                        <Feather name="chevron-left" size={32} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleSnapPress(0)} style={styles.headerIcon}>
                        <Feather name="more-vertical" size={24} color="white" />
                    </TouchableOpacity>
                  
                </View>

                { /* Title */ }
                <View style={styles.headerImage}>
                    <Text style={styles.headerHeading}>{receipes.title}</Text>
                    {console.log("ReceipeDetailScreen.js | receipes.title = " + receipes.title)}
                </View>


                <View style={styles.mainReceipeContainer}>

                    <View style={styles.howTo}>
                        <Text style={styles.mediumHeading}>Zutaten:</Text>

                        <Text>DEBUG ONLY: {receipes.ingredients} </Text>
                        
                        

                        { /* adding a to-do list for the ingredients */ }
                        <View style={styles.ingredientsWrapper}>


                            {/* STILL 
                            NEED 
                            TO 
                            FIX 
                            THIS */}
                            {receipes.ingredients.length > 0 ? (
                                receipes.ingredients.map((key, value) => (
                                console.log("Key = " + key + "Value = " + value),
                                <Ingredients
                                    key={key}
                                    ingredients={value}
                                />
                            ))
                            ) : (
                            <Text>Keine Zutaten vorhanden.</Text>
                            )}


                        </View>
                    </View>

                    <View style={styles.howTo}>
                        <Text style={styles.mediumHeading}>Anleitung:</Text>

                        <Text>Anleitung: {receipes.howTo} </Text>
                    </View>
                </View>
                

            </ScrollView>

            { /* shadow for bottom sheet */ }
            <View style={ isOpen ? styles.bottomSheetShadowVisible : styles.bottomSheetShadowInvisible }></View> 
            

            { /* bottom sheet */ }
            <BottomSheet 
                ref={sheetRef} 
                snapPoints={snapPoints} 
                enablePanDownToClose={true}
                onClose={() => setIsOpen(false)}>

                <BottomSheetView style={styles.bottomSheet}>

                <TouchableOpacity onPress={deleteReceipe}>
                    <DestructiveRow text={"Rezept löschen"} />
                </TouchableOpacity>
                </BottomSheetView>
                
            </BottomSheet>

        </SafeAreaView>

    )
}

export default ReceipeDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaeaea'
    },
    mediumHeading: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingVertical: 10,
    },

    // header buttons
    headerWrapper: {
        flexDirection: 'row',
        backgroundColor: '#add8e6',
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerIcon: {
        padding: 20,
    },

    // other header stuff
    headerImage: {
        alignItems: 'center',
        backgroundColor: '#add8e6',
        paddingBottom: 50,
    },
    headerHeading: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
        paddingVertical: 20,
    },

    // main container for receipes
    mainReceipeContainer: {
        backgroundColor: '#eaeaea',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginTop: -30,
    },

    howTo: {
        marginTop: 20,
    },
    ingredientsWrapper: { 
        backgroundColor: 'green',
    },


    // bottom sheet
    bottomSheet: {
        paddingVertical: 20,
        paddingHorizontal: 30,
    },
    bottomSheetShadowVisible: {
        ...StyleSheet.absoluteFill,
        backgroundColor: '#00000080'
    },
    bottomSheetShadowInvisible: {
        // nothing to see here
    }
})