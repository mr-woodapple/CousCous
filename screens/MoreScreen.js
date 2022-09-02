import React , { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { getAuth, signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'

import SingleRow from '../components/SingleRow';

const MoreScreen = () => {

  { /* functions the bottom modal sheets */ }
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const snapPoints = ["40%", "80%"]

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex('0');
    setIsOpen(true);
  }, []);


  { /* functions for the logout */ }
  const navigation = useNavigation()
  const auth = getAuth()

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  { /* get app version from app.json */ }
  const pkg = require('../package.json');
  const appVersion = pkg.version;


  return (
    <SafeAreaView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic">


      { /* header def */ }
      <View style={styles.headerWrapper}>
        <Text style={styles.headerHeading}>
          Mehr
        </Text>

        <View style={styles.headerRightButton}>
          <TouchableOpacity onPress={() => handleSnapPress(0)}>
            <Feather name="more-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>


      { /* main scroll view def */ }
      <ScrollView style={styles.mainViewMore}>

        <TouchableOpacity onPress={handleSignOut}>
          <SingleRow text={'Abmelden'} icon={'log-out'} /> 
        </TouchableOpacity>
        
        <View style={styles.appInfoRow}>
          { /* Question mark makes it an "optional value" */ }
          <Text>Logged in with: {auth.currentUser?.email}</Text>
          <Text>User ID: {auth.currentUser?.uid}</Text> 
          <Text>App Version: {appVersion}</Text>
          
        </View>

      </ScrollView>



      { /* shadow for bottom sheet */ }
      <View style={ isOpen ? styles.bottomSheetShadowVisible : styles.bottomSheetShadowInvisible }></View>
      

      { /* bottom sheet */ }
      <BottomSheet 
        ref={sheetRef} 
        snapPoints={snapPoints} 
        enablePanDownToClose={true}
        onClose={() => setIsOpen(false)}>

        <BottomSheetView style={styles.bottomSheet}>

          <TouchableOpacity>
            <Text>Test</Text>
          </TouchableOpacity>
        </BottomSheetView>
        
      </BottomSheet>

    </SafeAreaView>
  )
}

export default MoreScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
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

//main view more
mainViewMore: {
  paddingHorizontal: 20,
},
appInfoRow: {
  marginTop: 10,
  paddingHorizontal: 20,
  paddingVertical: 20,
  backgroundColor: '#add8e6',
  borderRadius: 15,
},

// bottom sheet
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