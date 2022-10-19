// Manager file to handle iap things
//
// Created 19.10.2022 by Jasper Holzapfel

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as InAppPurchases from 'expo-in-app-purchases';
import { IAPResponseCode } from 'expo-in-app-purchases';

export default class Monetization {

    private static _instance: Monetization;

    static get I() {
        if (!this._instance) this._instance = new Monetization();

        return this._instance;
    }

    // debug only versions
    setToUpgraded() {
        AsyncStorage.setItem('hasUpgraded', JSON.stringify(true))
        alert('value set, youre now on pro mode')
    }
    
    setToNotUpgraded() {
        AsyncStorage.removeItem('hasUpgraded');
        alert('value removed, youre no longer using pro mode')
    }


    // check if the pro version has been bought
    async hasUpgraded(): Promise<boolean> {
        console.log('hasUpgraded called')
        return JSON.parse(
            (await AsyncStorage.getItem('hasUpgraded')) as string
        ) as boolean;
    }


    // restore a previous upgrade
    async restoreUpgrade(): Promise<boolean> {
        // make sure we're not in Expo Go, as IAP will crash the Expo Go app
        if (Constants.appOwnership === "expo") return false;

        try {
            await InAppPurchases.connectAsync();
            const { results } = await InAppPurchases.getPurchaseHistoryAsync();
            for (const result of results || []) {
                if (result.productId === "proversion" && result.acknowledged) {
                    await AsyncStorage.setItem('hasUpgraded', JSON.stringify(true));
                    await InAppPurchases.disconnectAsync();
                    return true;
                }
            }
            await InAppPurchases.disconnectAsync();
            return false;
        } catch (e) {
            InAppPurchases.disconnectAsync();
            alert(e)
        }

        return false;
    }


    // purchase a given item
    private static async buy(
        item: string,
        consumable: boolean,
        onSuccess:() => Promise<void>
    ): Promise<boolean> {
        // make sure we're not in Expo Go, as IAP will crash the Expo Go app
        if (Constants.appOwnership === "expo") return false;

        try {
            await InAppPurchases.getProductsAsync([item]);

            InAppPurchases.purchaseItemAsync(item);

            return await new Promise((resolve, reject) => {
                InAppPurchases.setPurchaseListener(async (result) => {
                    switch (result.responseCode) {

                        case IAPResponseCode.OK:
                        case IAPResponseCode.DEFERRED:
                            await onSuccess();
                            await InAppPurchases.finishTransactionAsync(
                                result.results![0],
                                consumable
                            );
                            await InAppPurchases.disconnectAsync();
                            return resolve(true);

                        case IAPResponseCode.USER_CANCELED:
                            await InAppPurchases.disconnectAsync();
                            return resolve(false);

                        case IAPResponseCode.ERROR:
                            await InAppPurchases.disconnectAsync();
                            return reject(new Error("IAP Error: " + result.errorCode));
                    }
                });
            });
        } catch (e) {
            InAppPurchases.disconnectAsync();
            alert(e);
        }

        return false;
    }

    buyUpgrade = () =>
        Monetization.buy("proversion", false, () => AsyncStorage.setItem('hasUpgraded', JSON.stringify(true)));

        
    
}
