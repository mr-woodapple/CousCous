import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import Task from './components/Task';

export default function App() {

  {/* Creating a state in a functional component, first item = name of the state, second item = function to set the state */}
  const [task, setTask] = useState();
  {/* state array to store values, standard value = empty array */}
  const [taskItems, setTaskItems] = useState([]);


  const handleAddTask = () => {
    Keyboard.dismiss();
    {/* append the task to the array of taskItems */}
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
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Welcome</Text>

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
      </View>

      {/* Write task section */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
    paddingTop: 80,
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
