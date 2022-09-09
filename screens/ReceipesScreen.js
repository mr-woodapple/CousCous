// Receipes Screen
//
// Created 02.09.2022 by Jasper Holzapfel

import React , { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar, Keyboard, KeyboardAvoidingView, RefreshControlBase, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { getAuth } from 'firebase/auth'
import { ref, push, remove, onValue } from 'firebase/database';
import { db } from '../firebase'
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'

import ReceipeItem from '../components/ReceipeItem';
import Ingredients from '../components/Ingredients';


const HomeScreen = () => {

  const navigation = useNavigation();

  { /* functions to handle the receipe data stuff */ }
  const [ receipes, setReceipes ] = useState({});

  const [ presentTitle, setPresentTitle ] = useState('');
  const [ presentIngredients, setPresentIngredients ] = useState([]);
  const [ presentIngredient, setPresentIngredient ] = useState('');
  const [ presentHowTo, setPresentHowTo ] = useState('');
  const receipeKeys = Object.keys(receipes)

  { /* function to make a user write to their subdirectory in the database */ }
  const auth = getAuth()
  const userUID = auth.currentUser?.uid
  const databasePath = userUID+'/receipes'

  useEffect(() => {
    return onValue(ref(db, databasePath), querySnapshot => {
      let data = querySnapshot.val() || {};
      let receipeItems = {...data};
      setReceipes(receipeItems);
    })
  }, [])

  // add new receipe
  function addNewReceipe() {
    Keyboard.dismiss();
    console.log(presentTitle, presentHowTo, presentIngredients)
    push(ref(db, databasePath), {
      title: presentTitle,
      howTo: presentHowTo,
      ingredients: presentIngredients,
    });
    handleClosePress();
    setPresentTitle('');
    setPresentIngredients([]);
    setPresentHowTo('');
  }

  // update the ingredients array after each input
  function addIngredient() {
    Keyboard.dismiss();
    setPresentIngredients(presentIngredients => [...presentIngredients, presentIngredient]);
    setPresentIngredient('');

  }


  { /* functions the bottom modal sheets */ }
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const snapPoints = ["40%", "90%"]

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleClosePress = () => {
    sheetRef.current.close();
    Keyboard.dismiss()
  }


  return (

    <SafeAreaView 
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic">

      { /* header def */ }
      <View style={styles.headerWrapper}>
        <Text style={styles.headerHeading}>Receipes</Text>

        <View style={styles.headerRightButton}>
          <TouchableOpacity onPress={() => handleSnapPress(1)}>
            <Feather name="plus-circle" size={32} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      

      { /* main scroll view def */ }
      <ScrollView>
        {receipeKeys.length > 0 ? (
          receipeKeys.map(key => (
            // links to the matching detail screen, passing along the key of the receipe
            <TouchableOpacity
              key = {key}
              onPress={() => navigation.navigate('ReceipeDetailsScreen', key )} >

              <ReceipeItem
                key = {key}
                id = {key}
                receipe = {receipes[key]}
              />
              
            </TouchableOpacity>
          ))
        ) : (
          <Text>Keine Rezepte vorhanden.</Text>
        )}
      </ScrollView>


      { /* shadow for bottom sheet */ }
      <View style={ isOpen ? styles.bottomSheetShadowVisible : styles.bottomSheetShadowInvisible }></View>


      { /* bottom sheet add new receipe */ }
      <BottomSheet 
        ref={sheetRef} 
        snapPoints={snapPoints} 
        enablePanDownToClose={true}
        onClose={() => setIsOpen(false)}>

        <BottomSheetView style={styles.bottomSheet}>

          <View style={styles.bottomSheetHeader}>
            <Text style={styles.mediumHeading}>Rezept hinzufügen</Text>

            <TouchableOpacity style={styles.bottomSheetCloseButton} onPress={handleClosePress}>
              <Feather name="x" size={20} color="black" />
            </TouchableOpacity> 
          </View>
          

          <ScrollView>
            <KeyboardAvoidingView>
              
              <TextInput 
                placeholder="Titel"
                value={presentTitle}
                style={styles.input}
                onChangeText={text => {
                  setPresentTitle(text);
                }}/>

              { /* adding a to-do list for the ingredients */ }
              <View style={styles.ingredientsWrapper}>
                {presentIngredients.length > 0 ? (

                  presentIngredients.map((key, value) => (
                    console.log("DEBUG presentIngredients = " + key + value),
                      <Ingredients
                          key={value}
                          ingredients={key}
                          //todoItem={todos[key]}
                      />
                  ))
                ) : (
                  <Text>Füge deine erste Zutat hinzu.</Text>
                )}

                <TextInput 
                  placeholder='Weitere Zutat?'
                  onChangeText={text => {setPresentIngredient(text)}}>

                </TextInput>
                <TouchableOpacity onPress={() => addIngredient()}>
                  <Feather name="plus" size={20} color="black" />
                </TouchableOpacity>
              </View>
              

              <TextInput 
                placeholder="Anleitung"
                multiline={true}
                numberOfLines={4}
                value={presentHowTo}
                style={styles.input}
                onChangeText={text => {
                  setPresentHowTo(text);
                }}/>

              {/* onPress calls the function */}
              <TouchableOpacity onPress={() => addNewReceipe()}> 
                <View style={styles.addButton}>
                  <Text>Hinzufügen</Text>
                </View> 
              </TouchableOpacity>
              

            </KeyboardAvoidingView>
          </ScrollView>
          
        </BottomSheetView>
        
      </BottomSheet>


    </SafeAreaView>

  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
  mediumHeading: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 10,
},

  headerWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    widht: '100%',
  },
  headerHeading: {
      fontWeight: 'bold',
      fontSize: 36,
  },
  headerRightButton: {
      
  },

  // input stuff
  input: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#add8e6',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
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
  },
  bottomSheetHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSheetCloseButton: {
    backgroundColor: '#eaeaea',
    height: 30,
    width: 30,
    alignItems: 'center',
    borderRadius: 15,
    paddingTop: 5,
  },
})