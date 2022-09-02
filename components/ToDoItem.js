import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { ref, update, remove} from 'firebase/database'
import { db } from '../firebase'
import { getAuth } from 'firebase/auth'
import { Feather } from '@expo/vector-icons';


const ToDoItem = ({todoItem: {title, done}, id}) => {

    const [doneState, setDone] = useState(done);

    const auth = getAuth()
    const userUID = auth.currentUser?.uid
    const databasePath = userUID+'/todos'

    const onCheck = (isChecked) => {
        setDone(isChecked);
        update(ref(db, databasePath), {
            [id]: {
                title,
                done: !doneState,
            },
        });
    };

    const deleteTask = () => {
        remove(ref(db, databasePath+'/'+id))
    }

    return (
    <View style={styles.todoItem}>

        <View style={styles.todoItemLeft}>
          <BouncyCheckbox
              fillColor='black'
              onPress={onCheck}
              value={doneState}/>

          <Text style={[styles.todoText, {opacity: doneState ? 0.2 : 1}]}>
              {title}
          </Text>
        </View>
        
        <View style={styles.todoItemRight}>
          <TouchableOpacity onPress={deleteTask}>
            <Feather name="trash" size={18} color="black" />
          </TouchableOpacity>
        </View>

    </View>
    );
};
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
    },
    contentContainerStyle: {
      padding: 24
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#afafaf',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 20,
      fontSize: 20,
    },
    todoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
      alignItems: 'center',
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 15,
      
    },
    todoItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    todoItemRight: {

    },
    todoText: {
      paddingHorizontal: 5,
      fontSize: 16,
    },
  });

/* This will let us import this later on */
export default ToDoItem;