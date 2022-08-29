
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import { db } from '../firebase'
import { ref, onValue, push, update, remove } from 'firebase/database'

import Task from '../components/Task';

export default function App() {

  {/* Creating a state in a functional component, first item = name of the state, second item = function to set the state */}
  const [task, setTask] = useState()
  {/* state array to store values, standard value = empty array */}
  const [taskItems, setTaskItems] = useState([]);


  {/* handles communitcation with the database...? */}
  useEffect(() => {
    return onValue(ref(db, '/taskItems'), querySnapShot => {
      let data = querySnapShot.val() || {};
      let taskItems = {...data};
      setTaskItems(taskItems);
    });
  }, [])


  const handleAddTask = () => {
    Keyboard.dismiss();

    {/* append the task to the array of taskItems */}
    push(ref(db, '/taskItems'), {
      done: false,
      title: taskItems,
    });
    setTaskItems([...taskItems, task])
    
    {/* empty the input */}
    setTask(null);
  }

  const completeTask = (index) => {
    {/* copies all tasks into a new list */}
    let itemsCopy = [...taskItems];
    {/* delete the index item from the list, reassign the list to the setTaskItems */}
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  }


  return (
    <View style={styles.container}>
      
      {/* Todays Tasks */}
      <ScrollView style={styles.tasksWrapper}>

        <View style={styles.items}>
          {/* Iterate over the task items and add a <Task> for every single one */}
          {
            taskItems.map((item, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                  <Task text={item} />
                </TouchableOpacity>
              )
            })
          }

        </View>
      </ScrollView>

      {/* Write task section */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        style={styles.writeTaskWrapper}>
        
        {/* every time the text changes, set the task to this current text */}
        <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)}/>

        {/* onPress calls the function */}
        <TouchableOpacity onPress={() => handleAddTask()}> 
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View> 
        </TouchableOpacity>

      </KeyboardAvoidingView>


    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaed',
  },

  tasksWrapper: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30,
  },


  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: 250,
    
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {},
});