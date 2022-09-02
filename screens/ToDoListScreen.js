import React, { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Keyboard, StatusBar, TouchableOpacity, SafeAreaView, Button } from 'react-native'
import { ref, onValue, push, remove } from 'firebase/database'
import { db } from '../firebase'
import { Feather } from '@expo/vector-icons'; 
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { getAuth } from 'firebase/auth'


import ToDoItem from '../components/ToDoItem'
import DestructiveRow from '../components/DestructiveRow';


const ToDoListScreen = () => {

    { /* functions the bottom modal sheets */ }
    const sheetRef = useRef(null);
    const [isOpen, setIsOpen] = useState(true);
    const snapPoints = ["40%", "80%"]

    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex('0');
        setIsOpen(true);
    }, []);


    { /* functions to handle database stuff with the todo list */ }
    const [todos, setTodos] = useState({});
    const [presentTodo, setPresentTodo] = useState('');
    const todosKeys = Object.keys(todos);

    { /* function to make a user write to their subdirectory in the database */ }
    const auth = getAuth()
    const userUID = auth.currentUser?.uid
    const databasePath = userUID+'/todos'

    useEffect(() => {
        return onValue(ref(db, databasePath), querySnapShot => {
            let data = querySnapShot.val() || {};
            let todoItems = {...data};
            setTodos(todoItems);
        });
    }, []);

    function addNewTodo() {
        Keyboard.dismiss();
        push(ref(db, databasePath), {
            done: false,
            title: presentTodo,
        });
        setPresentTodo('');
    }

    function clearTodos() {
        remove(ref(db, databasePath));
    }



    return (
        <SafeAreaView
            style={styles.container}
            contentInsetAdjustmentBehavior="automatic">


            { /* header def */ }
            <View style={styles.headerWrapper}>
                <Text style={styles.headerHeading}>
                    Einkaufsliste
                </Text>

                <View style={styles.headerRightButton}>
                    <TouchableOpacity onPress={() => handleSnapPress(0)}>
                        <Feather name="more-vertical" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>


            { /* to do items */ }
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
                <Text>Es steht nichts auf deinem Einkaufszettel. ^^</Text>
                )}
            </ScrollView>


            { /* create new to do */ }         
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

                {/* onPress calls the function */}
                <TouchableOpacity onPress={() => addNewTodo()}> 
                    <View style={styles.addWrapper}>
                        <Feather name="add" size={32} color="black" />
                    </View> 
                </TouchableOpacity>
                

                
            </KeyboardAvoidingView>
             

            { /* shadow for bottom sheet */ }
            <View style={ isOpen ? styles.bottomSheetShadowVisible : styles.bottomSheetShadowInvisible }></View>
            
            { /* bottom sheet */ }
            <BottomSheet 
                ref={sheetRef} 
                snapPoints={snapPoints} 
                enablePanDownToClose={true}
                onClose={() => setIsOpen(false)}>

                <BottomSheetView style={styles.bottomSheet}>
                    <TouchableOpacity onPress={clearTodos}>
                        <DestructiveRow text={'Liste löschen'}></DestructiveRow>
                    </TouchableOpacity>
                    
                    <Text>Datenbankpfad = {databasePath}</Text>

                </BottomSheetView>
                
            </BottomSheet>

        </SafeAreaView>

        
    )
}

export default ToDoListScreen 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#eaeaea'
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
        
    },

    tasksWrapper: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    writeTaskWrapper: {
        bottom: 75,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#eaeaea',
        paddingVertical: 20,
        paddingHorizontal: 20,
        width: 300,
        borderRadius: 15,
        backgroundColor: 'white',
    },
    addWrapper: {
        marginLeft: 10,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
    },


    bottomSheet: {
        paddingVertical: 20,
        paddingHorizontal: 30,
    },
    bottomSheetShadowVisible: {
        ...StyleSheet.absoluteFill,
        backgroundColor: '#00000080'
    },
    bottomSheetShadowInvisible: {
        // nothing to see here
    }
})