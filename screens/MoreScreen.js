import React , { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { getAuth, signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { Portal } from '@gorhom/portal';

import * as Application from 'expo-application';
import * as Device from 'expo-device';

import SingleRow from '../components/SingleRow';

const MoreScreen = () => {

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
}


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


  return (
    <SafeAreaView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic">


      { /* header def */ }
      <View style={styles.headerWrapper}>
        <Text style={styles.headingLarge}>Mehr</Text>

        { /* disabled because there's no use for it right now 
        <View style={styles.headerRightButton}>
          <TouchableOpacity onPress={() => handleSnapPress(0)}>
            <Feather name="more-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>*/}
      </View>


      { /* main scroll view def */ }
      <ScrollView style={styles.mainViewMore}>

        <TouchableOpacity onPress={handleSignOut}>
          <SingleRow text={'Abmelden'} icon={'log-out'} /> 
        </TouchableOpacity>
        
        <View style={styles.appInfoRow}>

          <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 20 }}>
            <Feather name={'info'} size={24} color="black" />

            <Text style={{ fontSize: 18, paddingLeft: 20 }}>Information</Text>

          </View>

          { /* Question mark makes it an "optional value" */ }
          <Text>These are information that you can use to send proper feedback to us. These information won't be saved anywhere, they're just on your phone!{'\n'}</Text>

          <Text>Logged in with: {auth.currentUser?.email}</Text>
          <Text>User ID: {auth.currentUser?.uid}</Text> 
          <Text>App Version: {Application.nativeApplicationVersion}{'\n'}</Text>
          
          <Text>Operating System: {Device.osName}</Text>
          <Text>Device OS: {Device.osVersion}</Text>
          <Text>Device Manufacturer: {Device.manufacturer}</Text>
          <Text>Device Model: {Device.modelName}</Text>
          
        </View>

      </ScrollView>



      { /* shadow for bottom sheet */ }
      <View style={ isOpen ? styles.bottomSheetShadowVisible : styles.bottomSheetShadowInvisible }></View>
      
      <Portal>
        { /* bottom sheet */ }
        <BottomSheet 
          index={-1}
          ref={sheetRef} 
          snapPoints={snapPoints} 
          enablePanDownToClose={true}
          onClose={() => setIsOpen(false)}>

          <BottomSheetView style={styles.bottomSheet}>

            <View style={styles.bottomSheetHeader}>
              <Text style={styles.headingMedium}>Mehr</Text>

              <TouchableOpacity style={styles.bottomSheetCloseButton} onPress={handleClosePress}>
                <Feather name="x" size={20} color="black" />
              </TouchableOpacity> 
            </View>

            <TouchableOpacity>
              <Text>Add content here</Text>
            </TouchableOpacity>
          </BottomSheetView>
          
        </BottomSheet>
      </Portal>

    </SafeAreaView>
  )
}

export default MoreScreen


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


  headerWrapper: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      widht: '100%',
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