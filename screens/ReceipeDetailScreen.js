// Receipes Detail Screen V2 to solve problems (I hope)
//
// Created 09.09.2022 by Jasper Holzapfel

import React , { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar, Keyboard, KeyboardAvoidingView, RefreshControlBase, ImageBackground, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { getAuth } from 'firebase/auth'
import { ref, push, remove, onValue } from 'firebase/database';
import { db } from '../firebase'
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'

import Ingredients from '../components/Ingredients';
import DestructiveRow from '../components/DestructiveRow';

import image from '../assets/images/nordwood-themes-wtevVfGYwnM-unsplash.jpg';


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


  { /* background image */ }
  const backgroundImage = {image};


  { /* function to make a user write to their subdirectory in the database */ }
  const auth = getAuth()
  const userUID = auth.currentUser?.uid
  const databasePath = userUID+'/receipes/'+route.params;
  const databasePathIngredients = userUID+'/receipes/'+route.params+'/ingredients';


  { /* updates "receipes" and "presentIngredients", so we can get their keys and use them to iterate over the objects */ }
  useEffect(() => {
    return onValue(ref(db, databasePath), querySnapshot => {
      let data = querySnapshot.val() || {};
      let receipeItems = {...data};
      setReceipes(receipeItems);
    }),

    onValue(ref( db, databasePathIngredients), querySnapshot => {
        let data = querySnapshot.val() || [];
        let ingresItems = {...data};
        setPresentIngredients(ingresItems);
    })
  }, [])

  // add ingredient
  function addIngredient() {
    Keyboard.dismiss();
    setPresentIngredients(presentIngredients => [...presentIngredients, presentIngredient]);
    setPresentIngredient('');
  }

  // delete receipe and navigate back to previous screen
  function deleteReceipe() {
    remove(ref(db, databasePath));
    navigation.navigate('ReceipesScreenNav');
}


  { /* stuff for the bottom modal sheet */ }
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
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        
        <View style={styles.menuBar}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSnapPress(0)} style={styles.headerIcon}>
            <Feather name="more-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.headerHeading}> {receipes.title} </Text>
        </View>
        

      </ImageBackground>
      

      { /* main scroll view def */ }
      <ScrollView>

        <View >
          <Text>{receipes.title}</Text>
        </View>

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
      <View style={ isOpen ? styles.bottomSheetShadowVisible : styles.bottomSheetShadowInvisible } />


      { /* bottom sheet add new receipe */ }
      <BottomSheet 
        ref={sheetRef} 
        snapPoints={snapPoints} 
        enablePanDownToClose={true}
        onClose={() => setIsOpen(false)}>

        <BottomSheetView style={styles.bottomSheet}>

          <View style={styles.bottomSheetHeader}>
            <Text style={styles.mediumHeading}>{receipes.title}</Text>

            <TouchableOpacity style={styles.bottomSheetCloseButton} onPress={handleClosePress}>
              <Feather name="x" size={20} color="black" />
            </TouchableOpacity> 
          </View>

          <TouchableOpacity onPress={deleteReceipe}>
            <DestructiveRow text={"Rezept löschen"} />
          </TouchableOpacity>
          
          
        </BottomSheetView>
        
      </BottomSheet>


    </SafeAreaView>

  )
}

export default HomeScreen

// get the window height
const height = Dimensions.get('window').height;

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

// header
headerWrapper: {
  paddingHorizontal: 20,
  paddingVertical: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  widht: '100%',
},
backgroundImage: {
  height: height * 0.6,
  justifyContent: 'space-between',
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