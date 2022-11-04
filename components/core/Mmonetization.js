// Manager file to handle iap things, but from the cloud instead of AsyncStorage
//
// Created 04.11.2022 by Jasper Holzapfel

import { db } from '../../firebase'
import { get, update, ref, onValue } from 'firebase/database'; 
import { getAuth } from 'firebase/auth'

// IAP stuff
import Constants from 'expo-constants';
import * as InAppPurchases from 'expo-in-app-purchases';
import { IAPResponseCode } from 'expo-in-app-purchases';


// Checks if the "hasUpgraded" value has been set / is true
export function hasUpgraded() {
    // TODO: Add implementation
    
    // get user info & set path to store value
    const auth = getAuth()
    const userUID = auth.currentUser?.uid
    const databasePath = userUID+'/settings/hasUpgraded'  

    let hasUpgraded;

    onValue(ref(db, databasePath), (snapshot) => {
        const data = snapshot.val();
        hasUpgraded = data;
    })

    console.log('hasUpgraded = ', hasUpgraded)

    if (hasUpgraded === true ) {
        return (true)
        console.log('returned true')
    } else if ( hasUpgraded === false) {
        return (false)
        console.log('returned false')
    }

   
}

export function restoreUpgrade() {
    // TODO: Add implementation for restoring data -> unecessary because of cloud storage??
}

export function buyUpgrade() {
    // TODO: Implement, call buy function
    setHasUpgraded(true);
}





// HELPER FUNCTIONS


function setHasUpgraded(upgraded) {

    // get user info & set path to store value
    const auth = getAuth()
    const userUID = auth.currentUser?.uid
    const databasePath = userUID+'/settings'  

    // store value
    update(ref(db, databasePath), {
        hasUpgraded: upgraded 
    })
}

// PRIVATE FUNCTIONS


function buy() {
    alert('nix wie los gehts')
}



