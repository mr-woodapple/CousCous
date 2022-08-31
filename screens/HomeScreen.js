import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'


const HomeScreen = () => {

  const navigation = useNavigation()
  const auth = getAuth()

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  return (
    <View style={styles.container}>

      { /* Question mark makes it an "optional value" */ }
      <Text>E-Mail: {auth.currentUser?.email}</Text> 

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea'
  },
  button:{
    backgroundColor: '#0782f9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
},
buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
},
})