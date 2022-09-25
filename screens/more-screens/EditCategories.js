import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { ref, push, remove, onValue } from 'firebase/database';
import { db } from '../../firebase'
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

import { genericStyles } from '../../assets/styles/GenericStyles'
import SectionHeading from '../../components/generic/SectionHeading';


const EditCategories = () => {

  const navigation = useNavigation();

  { /* function to make a user write to their subdirectory in the database */ }
  const auth = getAuth()
  const userUID = auth.currentUser?.uid  

  useEffect(() => {
    onValue(ref(db, databasePathCategories), querySnapshot => {
      let data = querySnapshot.val() || {};
      let categoryItems = {...data};
      setCategories(categoryItems);
    })
  }, [])

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

  function deleteCategory(key) {
    remove(ref(db, databasePathCategories+'/'+key))
  }


  return (
    <SafeAreaView style={genericStyles.container}>

      { /* back and more button */}
      <View style={genericStyles.headerMenu}>

        <TouchableOpacity style={genericStyles.headerIcon} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={32} color="black" />
        </TouchableOpacity>

        <View style={genericStyles.headerMenuRight}>
          
        </View>
        

      </View>

      { /* general content */}
      <ScrollView style={genericStyles.contentWrapper} contentContainerStyle={{ paddingBottom: 50 }}>

        <Text style={genericStyles.headingLarge}>Kategorien</Text>

        <SectionHeading heading='Kategorie erstellen'/>
        <View style={[ styles.categoryRow, styles.categoryRowWrapper]}>
          <TextInput
            placeholder='Name der Kategorie eingeben'
            value={presentCategory}
            onChangeText={text => setPresentCategory(text)}
            onSubmitEditing={addCategory}
          />

          <TouchableOpacity onPress={() => addCategory()}>
            <Feather name="plus" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <SectionHeading heading='Vorhandene Kategorien'/>

        <View style={styles.categoryRowWrapper}>
          {categoryKeys.length > 0 ? (
            categoryKeys.map(key => (
              console.log('category name: ', categories[key].name),
              <View 
                style={styles.categoryRow}
                key={key}>
                <Text>{categories[key].name}</Text>

                <View style={styles.categoryRowRight}>
                  <TouchableOpacity onPress={()=> deleteCategory(key)}>
                    <Feather name="trash" size={18} color="black" />
                  </TouchableOpacity>
                </View>
                
              </View>
            ))
          ) : (
            <Text> Keine Kategorien vorhanden. Du kannst neue über das "+" Symbol oben rechts erstellen. </Text>
          )}
        </View>

        

      </ScrollView>


    </SafeAreaView>
  )
}

export default EditCategories

const styles = StyleSheet.create({
  test: {
    backgroundColor: 'red'
  },

  categoryRowWrapper: {
    marginTop: 10,
  },
  categoryRow: {
    marginVertical: 5,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  categoryRowRight: {

  },
})