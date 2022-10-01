import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'

// styles
import { genericStyles } from '../assets/styles/GenericStyles'


const LoginScreen = () => {

    const navigation = useNavigation()

    const [ isSignIn, setIsSignIn ] = useState(true)
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ passwordRepeat, setPasswordRepeat ] = useState('')
    const auth = getAuth()


   

    { /* Runs when the component mounts, switches screen if user = signed in , unsubscribe takes care of abandoning the listener when we switch screens*/ }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("TabScreenNav")
            }
        })

        return unsubscribe
    }, [])


    { /* Function to handle firebase actions (signup / login) */ }
    const handleSignUp = () => {
        if ( password === passwordRepeat ) {
            createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                console.log('Registered with: ', user.email);
            })
            .catch(error => alert(error.message))
        } else {
            alert('Die Passwörter stimmen nicht überein, bitte versuche es erneut!')
        }
        
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                console.log('Logged in with: ', user.email);
            })
            .catch(error => alert(error.message))
    }

    return (
        // main container
        <View style={styles.container}>

            {/* show different view depending on if the user wants to sign in or sign up */}
            { isSignIn ? (
                <SafeAreaView style={styles.loginStyles}>

                    <KeyboardAvoidingView behavior='padding'>

                    <Text style={genericStyles.headingLarge}>Willkommen zurück!</Text>
                    <Text style={[ genericStyles.headingMedium, { marginTop: -30 } ]}>Melde dich mit deinem Konto an.</Text>



                    <View style={styles.inputContainer}>
                        <View style={styles.inputRow}>
                            <Text style={styles.inputHintText}>E-Mail Adresse</Text>
                            <TextInput
                                keyboardType='email-address'
                                autoCapitalize='none'
                                placeholder="E-Mail"
                                value={email}
                                onChangeText={text => setEmail(text)}
                                style={styles.input} />
                        </View>
                        
                        <View style={styles.inputRow}>
                            <Text  style={styles.inputHintText}>Passwort</Text>
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={text => setPassword(text)}
                                style={styles.input} 
                                secureTextEntry />
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => handleLogin()} style={styles.buttonLogin}>
                        <Text style={styles.buttonLoginText}>Einloggen</Text>
                    </TouchableOpacity>

                    {/* switch to register screen */}
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Noch kein Konto?</Text>
                        <TouchableOpacity 
                            onPress={() => setIsSignIn(false)} 
                            style={{ paddingLeft: 10,  }}>
                            <Text style={{ textDecorationLine: 'underline' }}>Registrieren</Text>
                        </TouchableOpacity>
                    </View>

                    </KeyboardAvoidingView>
                </SafeAreaView>
            ):(
                <SafeAreaView style={styles.loginStyles}>

                    <KeyboardAvoidingView behavior="padding">

                    <Text style={genericStyles.headingLarge}>Willkommen!</Text>
                    <Text style={[ genericStyles.headingMedium, { marginTop: -30 } ]}>Registriere dich, um anzufangen.</Text>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputRow}>
                            <Text style={styles.inputHintText}>E-Mail Adresse</Text>
                            <TextInput
                                placeholder="E-Mail"
                                autoCapitalize='none'
                                keyboardType='email-address'
                                value={email}
                                onChangeText={text => setEmail(text)}
                                style={styles.input} />
                        </View>
                        
                        <View style={styles.inputRow}>
                            <Text style={styles.inputHintText}>Passwort</Text>
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={text => setPassword(text)}
                                style={styles.input} 
                                secureTextEntry />
                        </View>
                        <View style={styles.inputRow}>
                            <Text  style={styles.inputHintText}>Passwort wiederholen</Text>
                            <TextInput
                                placeholder="Password wiederholen"
                                value={passwordRepeat}
                                onChangeText={text => setPasswordRepeat(text)}
                                style={styles.input} 
                                secureTextEntry />
                        </View>
                        
                    </View>

                    <TouchableOpacity onPress={() => handleSignUp()} style={styles.buttonLogin}>
                        <Text style={styles.buttonLoginText}>Registrieren</Text>
                    </TouchableOpacity>


                    {/* switch to login screen */}
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Du hast bereits ein Konto?</Text>
                        <TouchableOpacity 
                            onPress={() => setIsSignIn(true)} 
                            style={{ paddingLeft: 10,  }}>
                            <Text style={{ textDecorationLine: 'underline' }}>Anmelden</Text>
                        </TouchableOpacity>
                    </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            )}

        </View>
       
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },


    loginStyles: {
        marginHorizontal: 20,
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'white'
    },
    
    inputContainer: {

    },
    inputRow: {
        backgroundColor: '#add8e620',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        borderColor: '#add8e680',
        borderWidth: 0.5,
    },
    inputHintText:{
        color: 'gray',
        textTransform: 'uppercase',
        fontSize: 10,
        marginBottom: 5,
    },
    input: {
        paddingVertical: 5,
    },
    buttonLogin: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginVertical: 20,
        borderRadius: 10,
        backgroundColor: 'black'
    },
    buttonLoginText: {
        color: 'white'
    },







    buttonContainer:{
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button:{
        backgroundColor: '#0782f9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline:{
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782f9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText:{
        color: '#0782f9',
        fontWeight: '700',
        fontSize: 16,
    },
})