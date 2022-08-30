import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { ref, onValue, push, update, remove } from 'firebase/database'
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
    };
    return (
    <View style={styles.todoItem}>
        <BouncyCheckbox
        onValueChange={onCheck}
        value={doneState}
        />
        <Text style={[styles.todoText, {opacity: doneState ? 0.2 : 1}]}>
        {title}
        </Text>
    </View>
    );
};
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 12
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
      marginVertical: 10,
      alignItems: 'center'
    },
    todoText: {
      paddingHorizontal: 5,
      fontSize: 16
    },
  });

/* This will let us import this later on */
export default ToDoItem;