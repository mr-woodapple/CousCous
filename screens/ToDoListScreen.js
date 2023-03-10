import React, { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Keyboard, TouchableOpacity, SafeAreaView } from 'react-native'
import { ref, onValue, push, remove } from 'firebase/database'
import { db } from '../firebase'
import { Feather } from '@expo/vector-icons'; 
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { getAuth } from 'firebase/auth'
import { Portal } from '@gorhom/portal';


import ToDoItem from '../components/ToDoItem'
import DestructiveRow from '../components/DestructiveRow';


const ToDoListScreen = () => {

    { /* functions the bottom modal sheets */ }
    const sheetRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const snapPoints = ["40%", "80%"]

    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex('0');
        setIsOpen(true);
    }, []);

    const handleClosePress = () => {
        sheetRef.current.close();
        Keyboard.dismiss()
    }

    const renderBackdrop = useCallback(
        props => <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} {...props} />,
        [],
    );


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
            console.log('Current todos are: ', todoItems)
        });
    }, []);

    function addNewTodo() {
        if (presentTodo === "") {
            alert("Etwas leeres hinzufügen macht keinen Sinn, bitte gib etwas ein. :)")
        } else {
            Keyboard.dismiss();
            push(ref(db, databasePath), {
                done: false,
                title: presentTodo,
            });
            setPresentTodo('');
        }
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
                <Text style={styles.headingLarge}>
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
                <Text style={styles.text}>Es steht nichts auf deinem Einkaufszettel.</Text>
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
                        <Feather name="plus" size={32} color="black" />
                    </View> 
                </TouchableOpacity>
                

                
            </KeyboardAvoidingView>

            
            <Portal>
                { /* bottom sheet */ }
                <BottomSheet 
                    backdropComponent={renderBackdrop}
                    index={-1}
                    ref={sheetRef} 
                    snapPoints={snapPoints} 
                    enablePanDownToClose={true}
                    onClose={() => setIsOpen(false)}>

                    <BottomSheetView style={styles.bottomSheetView}>

                    <View style={styles.bottomSheetHeader}>
                        <Text style={styles.headingMedium}>Einkaufsliste</Text>

                        <TouchableOpacity style={styles.bottomSheetCloseButton} onPress={handleClosePress}>
                            <Feather name="x" size={20} color="black" />
                        </TouchableOpacity> 
                    </View>

                        <TouchableOpacity onPress={clearTodos}>
                            <DestructiveRow text={'Liste löschen'}></DestructiveRow>
                        </TouchableOpacity>
                        <Text style={styles.simpleInfoText}>Bitte beachte, dass diese Aktion nicht rückgängig gemacht werden kann!</Text>

                    </BottomSheetView>
                    
                </BottomSheet>
            </Portal>

        </SafeAreaView>

        
    )
}

export default ToDoListScreen 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaeaea'
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

    simpleInfoText: {
        paddingVertical: 10,
    },
    text: {
        fontSize: 16
    },
    

    headerWrapper: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        widht: '100%',
    },
    headerRightButton: {
        
    },

    tasksWrapper: {
        marginTop: 10,
        paddingHorizontal: 20,
        marginBottom: 90
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
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 15,
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