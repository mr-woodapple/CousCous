import React, { useState, useEffect  } from 'react'
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Keyboard, StatusBar, TouchableOpacity } from 'react-native'
import { ref, onValue, push, remove } from 'firebase/database'
import { db } from '../firebase'
import { Feather } from '@expo/vector-icons'; 

import ToDoItem from '../components/ToDoItem'


const ToDoListScreen = () => {

    const [todos, setTodos] = useState({});
    const [presentTodo, setPresentTodo] = useState('');
    const todosKeys = Object.keys(todos);

    useEffect(() => {
        return onValue(ref(db, '/todos'), querySnapShot => {
            let data = querySnapShot.val() || {};
            let todoItems = {...data};
            setTodos(todoItems);
        });
    }, []);

    function addNewTodo() {
        Keyboard.dismiss();
        push(ref(db, '/todos'), {
            done: false,
            title: presentTodo,
        });
        setPresentTodo('');
    }

    function clearTodos() {
        remove(ref(db, '/todos'));
    }



    return (
        <View
            style={styles.container}
            contentInsetAdjustmentBehavior="automatic">

            <View style={styles.headerWrapper}>
                <Text style={styles.headerHeading}>
                    Einkaufsliste
                </Text>

                <View style={styles.headerRightButton}>
                    <TouchableOpacity>
                        <Feather name="more-vertical" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView 
                style={styles.tasksWrapper}
                contentInsetAdjustmentBehavior="automatic">

                {todosKeys.length > 0 ? (
                todosKeys.map(key => (
                    <ToDoItem
                        key={key}
                        id={key}
                        todoItem={todos[key]}
                    />
                ))
                ) : (
                <Text>No todo item</Text>
                )}
            </ScrollView>


            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={10}
                style={styles.writeTaskWrapper}>

                <TextInput
                    placeholder="Neuen Eintrag hinzufügen"
                    value={presentTodo}
                    style={styles.input}
                    onChangeText={text => {
                        setPresentTodo(text);
                    }}
                    onSubmitEditing={addNewTodo}
                />

                 {/* onPress calls the function 
                <TouchableOpacity onPress={() => addNewTodo()}> 
                    <View style={styles.addWrapper}>
                        <Text style={styles.addText}>+</Text>
                    </View> 
                </TouchableOpacity>
                */}

                
            </KeyboardAvoidingView>
        </View>

        
    )
}

export default ToDoListScreen 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },

    headerWrapper: {
        paddingTop: 60,
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
        
    },

    tasksWrapper: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    writeTaskWrapper: {
        bottom: 100,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#eaeaea',
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: 250,
        borderRadius: 20,
        backgroundColor: 'white',

    }
})