// Rewritten receipe details screen, get's an id passed along as route.params
//
// Created 09.09.2022 by Jasper Holzapfel

import React , { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar, Keyboard, KeyboardAvoidingView, RefreshControlBase, Image, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { getAuth } from 'firebase/auth'
import { ref, push, remove, onValue, update } from 'firebase/database';
import { uuidv4 } from '@firebase/util';
import { db } from '../firebase'
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import { Portal } from '@gorhom/portal';
import { Picker } from '@react-native-picker/picker';

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
  const [ duration, setDuration ] = useState(receipes.duration);
  const [ difficulty, setDifficulty ] = useState(receipes.difficulty);
  const [ categoryTitle, setCategoryTitle ] = useState('')
  const [ isFavorite, setFavorite ] = useState(false);

  const receipeKeys = Object.keys(receipes);
  const ingredientKeys = Object.keys(presentIngredients);


  { /* background image to be added at some point, add parallax scrolling effect here */ }
  const backgroundImage = image;


  { /* function to make a user write to their subdirectory in the database */ }
  const auth = getAuth()
  const userUID = auth.currentUser?.uid
  const databasePath = userUID+'/receipes/'+route.params;
  const databasePathIngredients = userUID+'/receipes/'+route.params+'/ingredients';
  const databasePathCategory = userUID+'/receipes/'+route.params+'/category';


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
    }),

    // grab the title of the category to display it properly
    onValue(ref(db, databasePathCategory), querySnapshot => {
      let data = querySnapshot.val() || [];
      let categoriesItems = {...data};
      setCategoryTitle(categoriesItems.name);
    }),

    onValue(ref(db, databasePathCategories), querySnapshot => {
      let data = querySnapshot.val() || {};
      let categoryItems = {...data};
      setCategories(categoryItems);
    })
  }, [presentTitle, presentHowTo, duration, difficulty, category])

  function updateReceipe() {
    update(ref(db, databasePath), {
      title: presentTitle === undefined ? receipes.title : presentTitle,
      howTo: presentHowTo === undefined ? receipes.howTo : presentHowTo,
      duration: duration === undefined ? receipes.duration : duration,
      difficulty: difficulty === undefined ? receipes.difficulty : difficulty,
      category: category.length === undefined ? receipes.category : category,
      // somehow I don't need to update the ingredients here
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

  const renderBackdrop = useCallback(
    // eslint-disable-next-line react/jsx-props-no-spreading
    props => <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} {...props} />,
    [],
  );

  { /* functions for the categories picker */ }
  // category list 
  const [ categories, setCategories ]  = useState([]);
  const [ category, setCategory ] = useState({}); // required??
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
  const [ displayCategory, setDisplayCategory ] = useState(receipes.category);

  // changes the active picker item and sets the correct category so we can add a receipe any time
  function handleCategoryChange(category) {
    setCategory(category);
    // set's the value to display the selected value in the picker
    setDisplayCategory(category)
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
    setPresentIngredient('');
  }

  // remove items by their key
  function removeIngredient(id) {
    const databasePathIngredient = databasePath+'/ingredients/'+id
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

            {/* Pills with duration, difficulty & category */}
            {!isEditing ? (
              <View style={styles.metadataPillsWrapper}>

                <View style={styles.metadataPill}>
                  <Feather name="clock" size={20} color="black" />
                  <Text>   {receipes.duration}</Text>
                </View>
                <View style={styles.metadataPill}>
                  <Feather name="zap" size={24} color="black" />
                  <Text>   {receipes.difficulty}</Text>
                </View>
                <View style={styles.metadataPill}>
                  <Feather name="tag" size={24} color="black" />
                  <Text>   {receipes.category}</Text>
                </View>

              </View>
            ):(     
              <View>
                <TextInput 
                  placeholder='Zubereitungszeit'
                  defaultValue={receipes.duration}
                  style={styles.input}
                  onChangeText={text => {
                    setDuration(text);
                  }}/>
                  <TextInput 
                  placeholder='Schwierigkeit'
                  defaultValue={receipes.difficulty}
                  style={styles.input}
                  onChangeText={text => {
                    setDifficulty(text);
                  }}/>

                  <View style={styles.addIngredientWrapper}>
                    <TextInput 
                      placeholder='Kategorie hinzufügen...'
                      value={presentIngredient}
                      style={styles.text}
                      onChangeText={text => {setPresentCategory(text)}}
                      onSubmitEditing={addCategory} />

                    <TouchableOpacity onPress={() => addCategory()}>
                      <Feather name="plus" size={20} color="black" />
                    </TouchableOpacity>
                  </View>

                  {console.log('debug displayCategory = ', displayCategory)}

                  {categoryKeys.length > 0 ? (
                    <Picker
                      selectedValue={displayCategory}
                      style={{ height: 200}} // set proper styles.xxx prop
                      onValueChange={(item, itemIndex) =>
                        handleCategoryChange(item)
                      }>
                        { /* render a picker.item for each category*/}
                        {categoryKeys.map(key => (
                          <Picker.Item label={categories[key].name} value={categories[key].id}/>
                        ))}
                    </Picker>    
                  ):(
                    <View style={{alignItems: 'center', paddingTop: 20,}}>
                      <Text style={styles.text}>Füge deine erste Kategorie hinzu!</Text>
                    </View>
                    
                  )}

              </View>        
              
            )}
            

            {/* Ingredients */}
            <Text style={styles.headingMedium}>Zutaten: </Text>
              
              {!isEditing ? (
                <View style={styles.ingredientsWrapper}>
                {ingredientKeys.length > 0 ? (
                  ingredientKeys.map(key => (
  
                    <Ingredients
                      key={key}
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


        <Portal>
            { /* bottom sheet receipe detail */ }
            <BottomSheet 
                backdropComponent={renderBackdrop}
                index={-1}
                ref={sheetRef} 
                snapPoints={snapPoints} 
                enablePanDownToClose={true}
                onClose={() => setIsOpen(false)}>

                <BottomSheetView style={styles.bottomSheetView}>

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
  input: {
    marginTop: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
  },

  // metadata pills below the heading
  metadataPillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metadataPill: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginTop: 10,
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
  bottomSheetView: {
    paddingVertical: 20,
    paddingHorizontal: 30,
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