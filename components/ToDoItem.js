import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { ref, onValue, push, update, remove, set } from 'firebase/database'
import { db } from '../firebase'


const ToDoItem = ({todoItem: {title, done}, id}) => {

    const [doneState, setDone] = useState(done);

    const onCheck = (isChecked) => {
        setDone(isChecked);
        update(ref(db, '/todos'), {
            [id]: {
                title,
                done: !doneState,
            },
        });
        console.log('set done/undone')
    };

    const deleteTask = () => {
        console.log('will delete: ', id);
        remove(ref(db, '/todos/'+id))
    }

    return (
    <View style={styles.todoItem}>
        <BouncyCheckbox
            onPress={onCheck}
            value={doneState}/>

        <Text style={[styles.todoText, {opacity: doneState ? 0.2 : 1}]}>
            {title}
        </Text>

        <Button title={'delete'} onPress={deleteTask}/>
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
      marginVertical: 5,
      alignItems: 'center',
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 15,
      
    },
    todoText: {
      paddingHorizontal: 5,
      fontSize: 16
    },
  });

/* This will let us import this later on */
export default ToDoItem;