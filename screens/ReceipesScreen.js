// Receipes Screen
//
// Created 02.09.2022 by Jasper Holzapfel

import React , { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar, Keyboard, KeyboardAvoidingView, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { getAuth } from 'firebase/auth'
import { uuidv4 } from '@firebase/util';
import { ref, push, remove, onValue } from 'firebase/database';
import { db } from '../firebase'
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import { Portal } from '@gorhom/portal';
import {Picker} from '@react-native-picker/picker';


import ReceipeItem from '../components/ReceipeItem';
  
const HomeScreen = () => {

  const navigation = useNavigation();

  { /* functions to handle the receipe data stuff */ }
  const [ receipes, setReceipes ] = useState({});

  const [ presentTitle, setPresentTitle ] = useState('');
  const [ presentIngredients, setPresentIngredients ] = useState([]);
  const [ presentIngredient, setPresentIngredient ] = useState({});
  const [ presentHowTo, setPresentHowTo ] = useState('');
  const [ duration, setDuration ] = useState('');
  const [ difficulty, setDifficulty ] = useState('');
  const [ category, setCategory ] = useState({})
  const [ isFavorite, setFavorite ] = useState(false);

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
    push(ref(db, databasePath), {
      title: presentTitle,
      howTo: presentHowTo,
      ingredients: presentIngredients,
      duration: duration,
      difficulty: difficulty,
      category: category,
      isFavorite: isFavorite,
    });
    handleClosePress();
    setPresentTitle('');
    setPresentIngredients([]);
    setPresentHowTo('');
  }

  // update the ingredients array after each input with ingredient object
  function addIngredient() {
    // create new object with id, title & measurements
    let newIngredient = {
      id: uuidv4(),
      title: presentIngredient,

      // TODO!
      measurement: '200 tonnen',

    }
    // add that created object to the array of existing objects, call setPresentIngredients
    presentIngredients.push(newIngredient)
    setPresentIngredients(presentIngredients)
    // removes keyboard and sets input field to empty
    setPresentIngredient('');
  }

  // remove items by their key
  function removeIngredient(id) {
    setPresentIngredients(presentIngredients => presentIngredients.filter(
      el => el.id !== id
    ));
  }



  { /* functions the bottom modal sheets */ }
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["40%", "90%"]

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  });

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleClosePress = () => {
    sheetRef.current.close();
    Keyboard.dismiss()
  }

  // stuff for the pill nav filter
  const [ activeItem, setActiveItem ] = useState({});

  function changeActiveItem(category) {
    if (category === activeItem) {
      setActiveItem({})
      console.log('reset category to all ', activeItem)
    } else {
      setActiveItem(category);
      console.log('set active to: ', category)
    }
  }

  { /* functions for the categories picker */ }
  // category list (temp, will be dynamic later)
  const [ categories, setCategories ]  = useState([
    {
      id: '014',
      name: 'Hauptspeise'
    },
    {
      id: '013',
      name: 'Vorspeise'
    },
    {
      id: uuidv4(),
      name: 'Salat'
    },
    {
      id: uuidv4(),
      name: 'Nachtisch'
    },
    {
      id: uuidv4(),
      name: 'Süßes'
    },
  ]);

  // helper value to display the selected value in the picker
  const [ displayCategory, setDisplayCategory ] = useState('');

  function handleCategoryChange(category) {
    // filter categories array for the specific id, then add it using setCategory
    const data = categories.filter(x => x.id === category)
    console.log('data = ', data)
    // since filter returns an array but we need to set an object, we need to extract the object from the array
    setCategory(data[0]);

    // set's the value to display the selected value in the picker
    setDisplayCategory(category)
  }

  return (

    <SafeAreaView 
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic">


      { /* header def */ }
      <View style={styles.headerWrapper}>
        <Text style={styles.headerHeading}>Rezepte</Text>

        <View style={styles.headerRightButton}>
          <TouchableOpacity onPress={() => handleSnapPress(1)}>
            <Feather name="plus-circle" size={32} color="black" />
          </TouchableOpacity>
        </View>
      </View>


      {/* pill tab nav filter thing */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillNavWrapper}>

        <TouchableOpacity 
          // using Object.keys to see if the object is empty
          style={ Object.keys(activeItem) == 0 ? styles.activePillNavItem : styles.pillNavItem}
          onPress={() => changeActiveItem({})}>

          <Text style={ Object.keys(activeItem) == 0  ? styles.activePillNavText : styles.pillNavText }>Alle</Text>
        </TouchableOpacity>

        {categories.length > 0 ? (
          categories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={ activeItem === category ? styles.activePillNavItem : styles.pillNavItem}
              onPress={() => changeActiveItem(category)}>
  
              <Text style={ activeItem === category ? styles.activePillNavText : styles.pillNavText}>{category.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.text}>Erstelle deine erste Kategorie.</Text>
        )}
          
      </ScrollView>
      

      { /* main scroll view def */ }
      <ScrollView>
        {receipeKeys.length > 0 ? (
          
          

          receipeKeys.map(key => (

            // check if filter applied, if 0 display all receipes
            Object.keys(activeItem) == 0 ? (
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
            ) : (
              // check if receipes category id = selected category id, if so render the items
              receipes[key].category.id == activeItem.id ? (
                <TouchableOpacity
                  key = {key}
                  onPress={() => navigation.navigate('ReceipeDetailsScreen', key )} >

                  <ReceipeItem
                    key = {key}
                    id = {key}
                    receipe = {receipes[key]}
                  />
                  
                </TouchableOpacity>
              ) : (
                <></>
              ) 
            )
          ))
        ) : (
          <Text style={styles.text}>Keine Rezepte vorhanden.</Text>
        )}
      </ScrollView>


      { /* shadow for bottom sheet */ }
      <View style={ isOpen ? styles.bottomSheetShadowVisible : styles.bottomSheetShadowInvisible } />
      

      { /* Portal allows us to display the bottom sheets over the tab bar -> see PortalProvider at the very root structure of the app */ }
      <Portal>
        { /* bottom sheet add new receipe */ }
        <BottomSheet 
          // index -1 makes sure the bottom view is closed by default
          index={-1}
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
                    presentIngredients.map(el => (
                      <View style={styles.addIngredient} key={el.id}>
                        <Text> {el.title} </Text>

                        <TouchableOpacity onPress={() => removeIngredient(el.id)}>
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

                <TextInput 
                  placeholder="Zubereitungszeit"
                  value={duration}
                  style={styles.input}
                  onChangeText={text => {
                    setDuration(text);
                  }}/>

                <TextInput 
                  placeholder="Schwierigkeit"
                  value={difficulty}
                  style={styles.input}
                  onChangeText={text => {
                    setDifficulty(text);
                  }}/>
                
                { /* deprecated, moved over to the picker below
                <TextInput 
                  placeholder="Kategorie"
                  value={category}
                  style={styles.input}
                  onChangeText={text => {
                    setCategory(text);
                  }}/>*/}

                {categories.length > 0 ? (
                  <Picker
                    selectedValue={displayCategory}
                    style={{ height: 200}} // set proper styles.xxx prop
                    onValueChange={(item, itemIndex) =>
                      handleCategoryChange(item)
                    }>
                      { /* render a picker.item for each category*/}
                      {categories.map((category, index) => (
                        <Picker.Item label={category.name} value={category.id}/>
                      ))}
                  </Picker>    
                ):(
                  <Text>Füge deine erste Kategorie hinzu!</Text>
                )}
                        

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
                <TouchableOpacity style={styles.addButton} onPress={() => addNewReceipe()}> 
                    <Text style={styles.mediumHeading}>Hinzufügen</Text>
                </TouchableOpacity>
                

              </KeyboardAvoidingView>
            
            </ScrollView>
          </BottomSheetView>
          
        </BottomSheet>
      </Portal>

    </SafeAreaView>

  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },

  text: {
    fontSize: 16
  },
  mediumHeading: {
    fontWeight: 'bold',
    fontSize: 24,
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
      // remove at some point?
  },

  // header
  pillNavWrapper: {
    paddingHorizontal: 20,
    maxHeight: 50, // needed to make the categories stay in a fixed spot?
  },
  pillNavItem: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginRight: 10,
  },  
  pillNavText: {
    color: 'black'
  },
  activePillNavItem: {
    backgroundColor: 'black',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginRight: 10,
  },
  activePillNavText: {
    color: 'white'
  },

  // input stuff
  input: {
    marginTop: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
  },
  ingredientsWrapper: {
    paddingVertical: 20,
  },
  addIngredientWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#add8e6',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
  },

  addIngredient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },

  // bottom sheet
  bottomSheet: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    flex: 1,
    paddingBottom: 20,
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