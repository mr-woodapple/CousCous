// Rewritten receipe details screen, get's an id passed along as route.params
//
// Created 09.09.2022 by Jasper Holzapfel

import React , { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar, Keyboard, KeyboardAvoidingView, RefreshControlBase, Image, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { getAuth } from 'firebase/auth'
import { ref, push, remove, onValue } from 'firebase/database';
import { db } from '../firebase'
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import { Portal } from '@gorhom/portal';

import Ingredients from '../components/Ingredients';
import DestructiveRow from '../components/DestructiveRow';

import image from '../assets/images/nordwood-themes-wtevVfGYwnM-unsplash.jpg';


const HomeScreen = ({ route }) => {

  const navigation = useNavigation();


  { /* functions to handle the receipe data stuff */ }
  const [ receipes, setReceipes ] = useState({});

  const [ presentTitle, setPresentTitle ] = useState('');
  const [ presentIngredients, setPresentIngredients ] = useState([]);
  const [ presentIngredient, setPresentIngredient ] = useState({});
  const [ presentHowTo, setPresentHowTo ] = useState('');

  const receipeKeys = Object.keys(receipes);
  const ingredientKeys = Object.keys(presentIngredients);


  { /* background image to be added at some point, add parallax scrolling effect here */ }
  const backgroundImage = image;


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
        console.log('ingres present: ', ingresItems)
    })
  }, [])

  // add ingredient, DONT FORGET TO UPDATE THIS!
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
  const [isOpen, setIsOpen] = useState(false);
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


  const window = Dimensions.get('window')
  const imageDimensions = {
  height: window.height,
  width: window.width
  }

  return (

    <SafeAreaView style={styles.container}>

      

        { /* back and more button */}
        <View style={styles.headerMenu}>

            <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={32} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSnapPress(0)} style={styles.headerIconMore}>
            <Feather name="more-vertical" size={24} color="black" />
            </TouchableOpacity>

        </View>

        <ScrollView style={styles.contentWrapper}>

            <Text style={styles.headingLarge}>{receipes.title}</Text>

            <Text style={styles.headingMedium}>Zutaten: </Text>

            <View style={styles.ingredientsWrapper}>


            {ingredientKeys.length > 0 ? (
              ingredientKeys.map(key => (

                <Ingredients
                  id={key.id}
                  ingredient={presentIngredients[key]}
                />
                
              ))
            ) : (
                <Text style={styles.text}>Keine Zutaten vorhanden.</Text>
            )}
            </View>

            <Text style={styles.headingMedium}>Zubereitung: </Text>
            <Text style={styles.text}>{receipes.howTo}</Text>

        </ScrollView>


        { /* shadow for bottom sheet */ }
        <View style={ isOpen ? styles.bottomSheetShadowVisible : styles.bottomSheetShadowInvisible } />

    
        <Portal>
            { /* bottom sheet add new receipe */ }
            <BottomSheet 
                index={-1}
                ref={sheetRef} 
                snapPoints={snapPoints} 
                enablePanDownToClose={true}
                onClose={() => setIsOpen(false)}>

                <BottomSheetView style={styles.bottomSheet}>

                <View style={styles.bottomSheetHeader}>
                    <Text style={styles.headingMedium}>{receipes.title}</Text>

                    <TouchableOpacity style={styles.bottomSheetCloseButton} onPress={handleClosePress}>
                    <Feather name="x" size={20} color="black" />
                    </TouchableOpacity> 
                </View>

                <TouchableOpacity onPress={deleteReceipe}>
                    <DestructiveRow text={"Rezept löschen"} />
                </TouchableOpacity>
                <Text style={styles.simpleInfoText}>Bitte beachte, dass diese Aktion nicht rückgängig gemacht werden kann!</Text>
                
                
                </BottomSheetView>
                
            </BottomSheet>
        </Portal>


    </SafeAreaView>

  )
}

export default HomeScreen

// get the window height
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea'
  },

  simpleInfoText: {
    paddingVertical: 10,
  },
  text: {
    fontSize: 16
  },

  // headings
  headingMedium: {
    fontWeight: 'bold',
    fontSize: 24,
    paddingVertical: 20,
  },
  headingLarge: {
    fontWeight: 'bold',
    fontSize: 36,
    paddingVertical: 20,
  },


  headerMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  // main content
  contentWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    paddingBottom: 20,
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