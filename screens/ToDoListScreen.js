import React, { useState, useEffect  } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native'
import { ref, onValue, push, update, remove } from 'firebase/database'
import { db } from '../firebase'

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
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainerStyle}>

            <View>
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
            </View>

            <TextInput
                placeholder="New todo"
                value={presentTodo}
                style={styles.textInput}
                onChangeText={text => {
                    setPresentTodo(text);
                }}
                onSubmitEditing={addNewTodo}
            />

            <View>
                <View style={{marginTop: 20}}>
                <Button
                    title="Add new todo"
                    onPress={addNewTodo}
                    color="green"
                    disabled={presentTodo == ''}
                    />
                </View>

                <View style={{marginTop: 20}}>
                <Button
                    title="Clear the todo list"
                    onPress={clearTodos}
                    color="red"
                    style={{marginTop: 20}}
                />
                </View>
            </View>
        </ScrollView>
    )
}

export default ToDoListScreen

const styles = StyleSheet.create({

})