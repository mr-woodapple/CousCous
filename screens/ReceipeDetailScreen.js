// Rewritten receipe details screen, get's an id passed along as route.params
//
// Created 09.09.2022 by Jasper Holzapfel

import React , { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar, Keyboard, KeyboardAvoidingView, RefreshControlBase, Image, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { getAuth } from 'firebase/auth'
import { ref, push, remove, onValue, update } from 'firebase/database';
import { uuidv4 } from '@firebase/util';
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

  const [ presentTitle, setPresentTitle ] = useState(receipes.title);
  const [ presentIngredients, setPresentIngredients ] = useState([]);
  const [ presentIngredient, setPresentIngredient ] = useState({});
  const [ presentHowTo, setPresentHowTo ] = useState(receipes.howTo);

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
    })

  }, [presentTitle, presentHowTo])

  function updateReceipe() {
    update(ref(db, databasePath), {
      title: presentTitle === undefined ? receipes.title : presentTitle,
      howTo: presentHowTo === undefined ? receipes.howTo : presentHowTo
    })
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

  const handleClosePress = () => {
    sheetRef.current.close();
    Keyboard.dismiss()
  }

  { /* stuff for switching between edit and view mode */ }
  const [isEditing, setIsEditing] = useState(false);

  function handleIsEditingChanges() {
    if (isEditing) {
      updateReceipe();
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }

  // update the ingredients array after each input with ingredient object
  function addIngredient() {
    // create new object with id, title & measurements    
    const path = databasePath+'/ingredients'
    push(ref (db, path), {
      id: uuidv4(),
      title: presentIngredient,

      // TODO!
      measurement: '200 tonnen',

    })

    // removes keyboard and sets input field to empty
    Keyboard.dismiss();
    setPresentIngredient('');
  }

  // remove items by their key
  function removeIngredient(id) {
    const databasePathIngredient = databasePath+'/ingredients/'+id
    console.log(id, databasePathIngredient)
    remove(ref(db, databasePathIngredient))
  }
  

  { /* random stuff */ }
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

          <View style={styles.headerMenuRight}>

            <TouchableOpacity onPress={() => handleIsEditingChanges()}>
              {isEditing === true ? (
                <Feather name="save" size={24} color="black" />
                ):(
                <Feather name="edit" size={24} color="black" />
              )}
              
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIcon} onPress={() => handleSnapPress(0)}>
              <Feather name="more-vertical" size={24} color="black" />
            </TouchableOpacity>
          </View>
          

        </View>

        <ScrollView style={styles.contentWrapper}>

            {/* Title */}
            {!isEditing ? (
              <Text style={styles.headingLarge}>{receipes.title}</Text>
            ):(
              <TextInput 
                  placeholder='Titel'
                  autoFocus={true}
                  defaultValue={receipes.title}
                  style={styles.headingLarge}
                  onChangeText={text => {
                    setPresentTitle(text);
                    console.log('title text = ', text)
                  }}/>
            )}
            

            {/* Ingredients */}
            <Text style={styles.headingMedium}>Zutaten: </Text>
              
              {!isEditing ? (
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
              ):(
                <View style={styles.ingredientsWrapper}>

                  {ingredientKeys.length > 0 ? (
                    ingredientKeys.map(key => (

                      <View style={styles.addIngredient} key={presentIngredients[key].id}>
                        <Text> {presentIngredients[key].title} </Text>

                        <TouchableOpacity onPress={() => removeIngredient(key)}>
                          <Feather name="x" size={24} color="black" /> 
                        </TouchableOpacity>
                    </View>

                    ))
                  ) : (
                    <Text style={styles.text}>Keine Zutaten, füge deine erste Zutat hinzu.</Text>
                  )}
                  
                  <View style={styles.addIngredientWrapper}>
                    <TextInput 
                      placeholder='Zutat hinzufügen...'
                      value={presentIngredient}
                      style={styles.text}
                      onChangeText={text => {setPresentIngredient(text)}}
                      onSubmitEditing={addIngredient} />

                    <TouchableOpacity onPress={() => addIngredient()}>
                      <Feather name="plus" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                  
                </View>
              )}
              

            {/* How To */}
            <Text style={styles.headingMedium}>Zubereitung: </Text>
            
            {!isEditing ? (
              <Text style={styles.text}>{receipes.howTo}</Text>
            ):(
              <TextInput 
                placeholder='Anleitung'
                multiline={true}
                defaultValue={receipes.howTo}
                style={styles.text}
                onChangeText={text => {
                  setPresentHowTo(text);
                }}/>
            )}
            

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
    paddingVertical: 20,
  },
  headerMenuRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    paddingHorizontal: 20,
  },

  // main content
  contentWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  // add ingredients
  addIngredient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  addIngredientWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
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