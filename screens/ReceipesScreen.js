// Receipes Screen
//
// Created 02.09.2022 by Jasper Holzapfel

import React , { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar, Keyboard, KeyboardAvoidingView, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetTextInput, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { getAuth } from 'firebase/auth'
import { uuidv4 } from '@firebase/util';
import { ref, push, remove, onValue } from 'firebase/database';
import { db } from '../firebase'
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import { Portal } from '@gorhom/portal';
import { Picker } from '@react-native-picker/picker';
import { TimePicker } from 'react-native-simple-time-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


// items
import ReceipeItem from '../components/ReceipeItem';

// data
import difficultyData from '../assets/data/difficultyData';
  
const HomeScreen = () => {

  const navigation = useNavigation();

  { /* functions to handle the receipe data stuff */ }
  const [ receipes, setReceipes ] = useState({});

  const [ presentTitle, setPresentTitle ] = useState('');
  const [ presentIngredients, setPresentIngredients ] = useState([]);
  const [ presentIngredient, setPresentIngredient ] = useState({});
  const [ presentHowTo, setPresentHowTo ] = useState('');
  const [ duration, setDuration ] = useState({});
  const [ difficulty, setDifficulty ] = useState('');
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
    }),

    onValue(ref(db, databasePathCategories), querySnapshot => {
      let data = querySnapshot.val() || {};
      let categoryItems = {...data};
      setCategories(categoryItems);

    })

    // works, but need to make sure that we don't erase the data in the local storage
    // getReceipeData(),
  }, [])

  // code for storing data locally to AsyncStorage for offline use => necessary? Might switch to Firestore anyway
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            saveReceipeData();
        }
    })

    return unsubscribe
  }, [])

  const saveReceipeData = async () => {
    try {
      //console.log('saveReceipeData called')
      const jsonValue = JSON.stringify(receipes)
      AsyncStorage.setItem('receipeData', jsonValue)
      //console.log('saved receipeData: ', jsonValue)
    } catch (error) {
      console.log(error)
    }
  }

  const getReceipeData = async() => {
    try {
      const jsonValue = await AsyncStorage.getItem('receipeData')
      //return jsonValue != null ? JSON.parse(jsonValue) : null;
      const data = JSON.parse(jsonValue);
      setReceipes(data);
      //console.log('loaded data from Async: ', data)
    } catch (error) {
      console.log(error)
    }
  }

  {/* pseudo code for offline functionality

    if user online == true {
      get firebase data
      compare firebase data to async data
    } else {
      await data from asnyc storage
    }

  */}

  // end of code section using Async for offline access






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
    addReceipeCloseSheet();
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
  // refs
  const addReceipeSheetRef = useRef(null);
  const setDurationSheetRef = useRef(null);
  const setCategorySheetRef = useRef(null);
  const setDifficultySheetRef = useRef(null);


  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["40%", "80%"]

  // open sheets
  const handleSnapPress = useCallback((index) => {
    addReceipeSheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  });
  const handleOpenDurationSheet = useCallback((index) => {
    setDurationSheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  });
  const handleOpenCategorySheet = useCallback((index) => {
    setCategorySheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  });
  const handleOpenDifficultySheet = useCallback((index) => {
    setDifficultySheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  });



  // close sheets
  const addReceipeCloseSheet = () => {
    addReceipeSheetRef.current.close();
    Keyboard.dismiss();
    // TODO: clear all values
  }
  const setDurationCloseSheet = () => {
    setDurationSheetRef.current.close();
    Keyboard.dismiss();
  }
  const setCategoryCloseSheet = () => {
    setCategorySheetRef.current.close();
    Keyboard.dismiss();
  }
  const setDifficultyCloseSheet = () => {
    setDifficultySheetRef.current.close();
    Keyboard.dismiss();
  }

  const renderBackdrop = useCallback(
    props => <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} {...props} />,
    [],
  );

  // stuff for the pill nav filter
  const [ activeItem, setActiveItem ] = useState({});

  function changeActiveItem(category) {
    if (category === activeItem) {
      setActiveItem({})
    } else {
      setActiveItem(category);
    }
  }

  { /* functions for the categories picker */ }
  // category list 
  const [ categories, setCategories ]  = useState([]);
  const [ category, setCategory ] = useState({});
  const [ presentCategory, setPresentCategory ] = useState('')
  const databasePathCategories = userUID+'/categories'

  const categoryKeys = Object.keys(categories);

  function addCategory() {

    // TODO: check if category already existent

    push(ref(db, databasePathCategories), {
      id: presentCategory,
      name: presentCategory
    })
    setPresentCategory('');
  }

  // helper value to display the selected value in the picker
  const [ displayCategory, setDisplayCategory ] = useState('');

  // changes the active picker item and sets the correct category so we can add a receipe any time
  function handleCategoryChange(category) {
    setCategory(category);
    // set's the value to display the selected value in the picker
    setDisplayCategory(category)
  }

  { /* functions for the difficulty picker */ }
  const [ displayDifficulty, setDisplayDifficulty ] = useState('')

  function handleDifficultyChange(difficulty, index) {
    setDifficulty(difficultyData[index]);
    setDisplayDifficulty(difficulty);
  }

  {/* functions for the time picker */}
  const [ hours, setHours ] = useState(0);
  const [ minutes, setMinutes ] = useState(0);

  function timePickerHandleChange( value ) {
    setHours(value.hours)
    setMinutes(value.minutes)
    setDuration(value)
  }

  return (

    <SafeAreaView 
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic">

      {/* for android only */}
      <StatusBar backgroundColor="#eaeaea" />

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
      <View style={styles.pillNavWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillNavScrollView} contentContainerStyle={{ paddingRight: 30 }}>

          <TouchableOpacity 
            // using Object.keys to see if the object is empty
            style={ Object.keys(activeItem) == 0 ? styles.activePillNavItem : styles.pillNavItem}
            onPress={() => changeActiveItem({})}>

            <Text style={ Object.keys(activeItem) == 0  ? styles.activePillNavText : styles.pillNavText }>Alle</Text>
          </TouchableOpacity>

          {categoryKeys.length > 0 ? (
            categoryKeys.map(key => (
              <TouchableOpacity 
                key={key} 
                style={ activeItem === categories[key] ? styles.activePillNavItem : styles.pillNavItem}
                onPress={() => changeActiveItem(categories[key])}>
    
                <Text style={ activeItem === categories[key] ? styles.activePillNavText : styles.pillNavText}>{categories[key].name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.text}>Erstelle deine erste Kategorie.</Text>
          )}
            
        </ScrollView>
      </View>
      

      { /* main scroll view def */ }
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
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
              receipes[key].category == activeItem.id ? (
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
                // TODO: Update this to show "no receipe in this category"
                <Text key = {key}></Text> // proper way to do this??
              ) 
            )
          ))
        ) : (
          <Text style={styles.text}>Keine Rezepte vorhanden.</Text>
        )}
      </ScrollView>
      

      { /* Portal allows us to display the bottom sheets over the tab bar -> see PortalProvider at the very root structure of the app */ }
      <Portal>

        { /* bottom sheet add new receipe */ }
        <BottomSheet 
          backdropComponent={renderBackdrop}
          index={-1} // index -1 makes sure the bottom view is closed by default
          ref={addReceipeSheetRef} 
          snapPoints={snapPoints} 
          enablePanDownToClose={true}
          onClose={() => setIsOpen(false)}>

          <BottomSheetView style={styles.bottomSheetView}>

            <View style={styles.bottomSheetHeader}>
              <Text style={styles.mediumHeading}>Rezept hinzufügen</Text>

              <TouchableOpacity style={styles.bottomSheetCloseButton} onPress={addReceipeCloseSheet}>
                <Feather name="x" size={20} color="black" />
              </TouchableOpacity> 
            </View>

            <ScrollView>     
              {/* pill shaped buttons to trigger the matching bottom sheet */}
              <View style={styles.metadataPillsWrapper}>

                <TouchableOpacity 
                  style={styles.metadataPill} 
                  onPress={() => handleOpenDurationSheet(0)}>
                    
                  <Feather name="clock" size={20} color="black" />
                  <Text style={styles.metadataPillTitle}>Dauer: { duration.hours } Stunden, { duration.minutes } Minuten</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.metadataPill} 
                  onPress={() => handleOpenCategorySheet(0)}>
                    
                  <Feather name="zap" size={20} color="black" />
                  <Text style={styles.metadataPillTitle}>Kategorie: {displayCategory}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.metadataPill} 
                  onPress={() => handleOpenDifficultySheet(0)}>
                    
                  <Feather name="tag" size={20} color="black" />
                  <Text style={styles.metadataPillTitle}>Schwierigkeit: {displayDifficulty}</Text>
                </TouchableOpacity>

              </View>

              {/* */}
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

                <BottomSheetTextInput
                  placeholder="Anleitung"
                  multiline={true}
                  numberOfLines={4}
                  value={presentHowTo}
                  style={styles.input}
                  onChangeText={text => {
                    setPresentHowTo(text);
                  }} />

                {/* onPress calls the function */}
                <TouchableOpacity style={styles.addButton} onPress={() => addNewReceipe()}> 
                    <Text style={styles.mediumHeading}>Hinzufügen</Text>
                </TouchableOpacity>
                

              </KeyboardAvoidingView>
            
            </ScrollView>
          </BottomSheetView>
          
        </BottomSheet>

        { /* bottom sheet for changing the duration */}
        <BottomSheet
          style={styles.detachedBottomSheetWrapper}
          backdropComponent={renderBackdrop}
          index={-1} // index -1 makes sure the bottom view is closed by default
          ref={setDurationSheetRef} 
          snapPoints={snapPoints} 
          enablePanDownToClose={true}
          onClose={() => setIsOpen(false)}>

          <BottomSheetView style={styles.bottomSheetView}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.mediumHeading}>Zubereitungszeit wählen</Text>

              <TouchableOpacity style={styles.bottomSheetCloseButton} onPress={setDurationCloseSheet}>
                <Feather name="save" size={20} color="black" />
              </TouchableOpacity> 
            </View>

            <TimePicker 
              value={{ hours, minutes }} 
              hoursUnit="Std"
              minutesUnit="Min"
              onChange={timePickerHandleChange}
              />

          </BottomSheetView>
        </BottomSheet>


        { /* bottom sheet for changing the category */}
        <BottomSheet
          style={styles.detachedBottomSheetWrapper}
          backdropComponent={renderBackdrop}
          index={-1} // index -1 makes sure the bottom view is closed by default
          ref={setCategorySheetRef} 
          snapPoints={snapPoints} 
          enablePanDownToClose={true}
          onClose={() => setIsOpen(false)}>
          
          <BottomSheetView style={styles.bottomSheetView}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.mediumHeading}>Kategorie wählen</Text>

              <TouchableOpacity style={styles.bottomSheetCloseButton} onPress={setCategoryCloseSheet}>
                <Feather name="save" size={20} color="black" />
              </TouchableOpacity> 
            </View>

            <View>
              <View style={styles.addIngredientWrapper}>
                <TextInput 
                  placeholder='Kategorie hinzufügen...'
                  value={presentCategory}
                  style={styles.text}
                  onChangeText={text => {setPresentCategory(text)}}
                  onSubmitEditing={addCategory} />

                <TouchableOpacity onPress={() => addCategory()}>
                  <Feather name="plus" size={20} color="black" />
                </TouchableOpacity>
              </View>

              {categoryKeys.length > 0 ? (
                <Picker
                  selectedValue={displayCategory}
                  style={{ height: 200}} // set proper styles.xxx prop
                  onValueChange={(item, itemIndex) =>
                    handleCategoryChange(item)
                  }>
                    { /* render a picker.item for each category*/}
                    {categoryKeys.map(key => (
                      <Picker.Item label={categories[key].name} value={categories[key].id} key={key}/>
                    ))}
                </Picker>    
              ):(
                <View style={{alignItems: 'center', paddingTop: 20,}}>
                  <Text style={styles.text}>Füge deine erste Kategorie hinzu!</Text>
                </View>
               )}
            </View>
          </BottomSheetView>
        </BottomSheet>


        { /* bottom sheet for changing the difficulty */}
        <BottomSheet
          backdropComponent={renderBackdrop}
          index={-1} // index -1 makes sure the bottom view is closed by default
          ref={setDifficultySheetRef} 
          snapPoints={snapPoints} 
          enablePanDownToClose={true}
          onClose={() => setIsOpen(false)}>

          <BottomSheetView style={styles.bottomSheetView}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.mediumHeading}>Schwierigkeit wählen</Text>

              <TouchableOpacity style={styles.bottomSheetCloseButton} onPress={setDifficultyCloseSheet}>
                <Feather name="save" size={20} color="black" />
              </TouchableOpacity> 
            </View>

            <Picker
              selectedValue={displayDifficulty}
              style={{ height: 200}} // set proper styles.xxx prop
              onValueChange={(item, itemIndex) =>
                handleDifficultyChange(item, itemIndex)
              }>
                { /* render a picker.item for each category*/}
                {difficultyData.map(key => (
                  <Picker.Item label={key.name} value={key.name} key={key}/>
                  //console.log('key: ', key)
                ))}
            </Picker>    
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
    fontSize: 16,
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
    paddingVertical: 10,
  },
  pillNavScrollView: {
    paddingLeft: 20,
  },
  pillNavItem: {
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    marginRight: 10,
  },  
  pillNavText: {
    color: 'black',
    paddingHorizontal: 20,
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
  bottomSheetView: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    flex: 1,
    paddingBottom: 20,
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

  // metadata pills for adding receipes
  metadataPillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metadataPill: {
    backgroundColor: '#add8e6',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginTop: 10,
  },
  metadataPillTitle: {
    marginLeft: 10,
  },
})