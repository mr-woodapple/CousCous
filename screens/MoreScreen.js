import React, { useState, useEffect, useRef, useCallback  } from 'react'
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { getAuth, signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { Portal } from '@gorhom/portal';
import { expo } from '../app.json';

import * as Device from 'expo-device';

// components
import SingleRow from '../components/SingleRow';

// core tech
import Monetization from '../components/core/Monetization';

// screens
import SectionHeading from '../components/generic/SectionHeading';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MoreScreen = () => {

  { /* functions the bottom modal sheets */ }
  const sheetRef = useRef(null);
  const [ isOpen, setIsOpen ] = useState(false);
  const snapPoints = ["60%", "80%"]

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);

  const handleClosePress = () => {
    sheetRef.current.close();
  }

  const renderBackdrop = useCallback(
    // eslint-disable-next-line react/jsx-props-no-spreading
    props => <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} {...props} />,
    [],
  );


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

  { /* messing around with activity state */ }
  const [ isLoading, setIsLoading ] = useState(false)

  return (
    <SafeAreaView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic">


      { /* header def */ }
      <View style={styles.headerWrapper}>
        <Text style={styles.headingLarge}>Mehr</Text>

        
        <View style={styles.headerRightButton}>
          <TouchableOpacity onPress={() => handleSnapPress(0)}>
            <Feather name="more-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>


      { /* main scroll view def */ }
      <ScrollView style={styles.mainViewMore}>

        <SectionHeading heading={'Verwalten'}/>

        <TouchableOpacity onPress={() => navigation.navigate('EditCategoriesScreen')}>
          <SingleRow text={'Kategorien verwalten'} icon={'edit'} navlink={true} /> 
        </TouchableOpacity>

        <SectionHeading heading={'Mehr'}/>

        <TouchableOpacity onPress={handleSignOut}>
          <SingleRow text={'Abmelden'} icon={'log-out'} /> 
        </TouchableOpacity>


        
        <SectionHeading heading={'Pro Version'}/>

        <TouchableOpacity onPress={() => Monetization.I.restoreUpgrade() }>
          <SingleRow text={'restore purchases'} icon={'gift'} navLink={false} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Monetization.I.buyUpgrade() }>
          <SingleRow text={'buy upgrade'} icon={'gift'} navLink={false} />
        </TouchableOpacity>


        {/* these are just for debug, REMOVE IN APP VERSION */}
        <SectionHeading heading={'Debug'}/>
        { Monetization.I.hasUpgraded() ? (
            <Text>Ist aktiv</Text>
          ):(
            <Text>Ist nicht aktiv</Text>
          ) 
        }

        {/*
          AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (error, stores) => {
              stores.map((result, i, store) => {
                console.log({ [store[i][0]]: store[i][1] });
                return true;
              });
            });
          })
        */}

        <TouchableOpacity onPress={() => Monetization.I.setToUpgraded() }>
          <SingleRow text={'add "hasUpgraded" to Async'} icon={'code'} navLink={false} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Monetization.I.setToNotUpgraded() }>
          <SingleRow text={'remove "hasUpgraded" from Async'} icon={'code'} navLink={false} />
        </TouchableOpacity>

      </ScrollView>

      
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
              <Text style={styles.headingMedium}>Mehr</Text>

              <TouchableOpacity style={styles.bottomSheetCloseButton} onPress={handleClosePress}>
                <Feather name="x" size={20} color="black" />
              </TouchableOpacity> 
            </View>

            <View style={styles.appInfoRow}>

              <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 20 }}>
                <Feather name={'info'} size={24} color="black" />

                <Text style={{ fontSize: 18, paddingLeft: 20 }}>Information</Text>

              </View>
              { /* Question mark makes it an "optional value" */ }
              <Text>Diese Informationen können für Feedback nützlich sein. Sie werden nur lokal auf Ihrem Gerät gespeichert und niemals an unsere Server übertragen.{'\n'}</Text>

              <Text>Logged in with: {auth.currentUser?.email}</Text>
              <Text>User ID: {auth.currentUser?.uid}</Text> 
              <Text>App Version: { expo.version }{'\n'}</Text>
              
              <Text>Operating System: {Device.osName}</Text>
              <Text>Device OS: {Device.osVersion}</Text>
              <Text>Device Manufacturer: {Device.manufacturer}</Text>
              <Text>Device Model: {Device.modelName}</Text>
            </View>

            {/* activity indicator experiments, is successfull ^^ */}
            {isLoading ? (
              <View style={styles.preloader}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            ):(
              <TouchableOpacity onPress={() => setIsLoading(true)}>
                <Text>Don't click me!</Text>
              </TouchableOpacity>
            )}
            
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