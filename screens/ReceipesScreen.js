// Receipes Screen
//
// Created 02.09.2022 by Jasper Holzapfel

import React , { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar, Keyboard, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { getAuth } from 'firebase/auth'
import { ref, push, remove, onValue } from 'firebase/database';
import { db } from '../firebase'

import ReceipeItem from '../components/ReceipeItem';
import { TextInput } from 'react-native-gesture-handler';


const HomeScreen = () => {


  { /* functions to handle the receipe data stuff */ }
  const [receipes, setReceipes] = useState({});
  const [ presentTitle, setPresentTitle] = useState('');
  const [ presentIngredients, setPresentIngredients] = useState('');
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

  function addNewReceipe() {
    Keyboard.dismiss();
    console.log(presentTitle, presentHowTo, presentIngredients)
    push(ref(db, databasePath), {
      title: presentTitle,
      howTo: presentHowTo,
      ingredients: presentIngredients,
    });
    setPresentTitle(''); // finished??
    setPresentIngredients('');
    setPresentHowTo('');
  }


  { /* functions the bottom modal sheets */ }
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const snapPoints = ["40%", "80%"]

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);


  return (

    <SafeAreaView 
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic">

      { /* header def */ }
      <View style={styles.headerWrapper}>
        <Text style={styles.headerHeading}>Rezepte</Text>

        <View style={styles.headerRightButton}>
          <TouchableOpacity onPress={() => handleSnapPress(0)}>
            <Feather name="plus-circle" size={32} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      

      { /* main scroll view def */ }
      <ScrollView>

        {receipeKeys.length > 0 ? (
          receipeKeys.map(key => (
            <ReceipeItem
              key = {key}
              id = {key}
              receipe = {receipes[key]}
            />
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

          <KeyboardAvoidingView>
            <Text>AddReceipe</Text>

            <TextInput 
              placeholder="Titel"
              value={presentTitle}
              style={styles.input}
              onChangeText={text => {
                setPresentTitle(text);
              }}/>

            <TextInput 
              placeholder="Zutaten"
              value={presentIngredients}
              style={styles.input}
              onChangeText={text => {
                setPresentIngredients(text);
              }}/>

            <TextInput 
              placeholder="Anleitung"
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
        </BottomSheetView>
        
      </BottomSheet>


    </SafeAreaView>

  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#eaeaea'
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
    backgroundColor: 'yellow',
    paddingHorizontal: 10,
    paddingVertical: 10,
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