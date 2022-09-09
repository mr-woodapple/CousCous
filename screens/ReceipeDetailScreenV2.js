// Receipes Detail Screen V2 to solve problems (I hope)
//
// Created 09.09.2022 by Jasper Holzapfel

import React , { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar, Keyboard, KeyboardAvoidingView, RefreshControlBase } from 'react-native'
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


const HomeScreen = ({ route }) => {

  const navigation = useNavigation();

  { /* functions to handle the receipe data stuff */ }
  const [ receipes, setReceipes ] = useState({});

  const [ presentTitle, setPresentTitle ] = useState('');
  const [ presentIngredients, setPresentIngredients ] = useState({});
  const [ presentIngredient, setPresentIngredient ] = useState('');
  const [ presentHowTo, setPresentHowTo ] = useState('');
  const receipeKeys = Object.keys(receipes);
  const ingredientsKeys = Object.keys(presentIngredients);


  { /* function to make a user write to their subdirectory in the database */ }
  const auth = getAuth()
  const userUID = auth.currentUser?.uid
  const databasePath = userUID+'/receipes/'+route.params;
  const databasePathIngredients = userUID+'/receipes/'+route.params+'/ingredients';

  useEffect(() => {
    console.log("ReceipeScreen.js | => Entered useEffect")
    return onValue(ref(db, databasePath), querySnapshot => {
      let data = querySnapshot.val() || {};
      let receipeItems = {...data};
      setReceipes(receipeItems);

      console.log('ReceipeDetailsScreenV2 | setReceipes = ', receipeItems)
    }),
    onValue(ref( db, databasePathIngredients), querySnapshot => {
        let data = querySnapshot.val() || [];
        let ingresItems = {...data};
        setPresentIngredients(ingresItems);

        console.log('ReceipeDetailsScreenV2 | setPresentIngredients = ', presentIngredients)
    })
  }, [])

  console.log("ReceipeDetailsScreenV2 | receipe = " + JSON.stringify(receipes))




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
        <Text style={styles.headerHeading}>{receipes.title}</Text>

        <View style={styles.headerRightButton}>
          <TouchableOpacity onPress={() => handleSnapPress(1)}>
            <Feather name="plus-circle" size={32} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      

      { /* main scroll view def */ }
      <ScrollView>
        {console.log("presentIngredient: " + JSON.stringify(presentIngredients))}
        {ingredientsKeys.length > 0 ? (
          ingredientsKeys.map(key => (
            
            <Ingredients
                id={key}
                ingredients={presentIngredients[key]}
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

          <View style={styles.bottomSheetHeader}>
            <Text style={styles.mediumHeading}>Rezept hinzufügen</Text>

            <TouchableOpacity style={styles.bottomSheetCloseButton} onPress={handleClosePress}>
              <Feather name="x" size={20} color="black" />
            </TouchableOpacity> 
          </View>
          
          
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