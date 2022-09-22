// External style sheet to make a consistent look easy
//
// Created 22.09.2022 by Jasper Holzapfel

import { StyleSheet } from "react-native";

const genericStyles = StyleSheet.create({
    
    container: {
        backgroundColor: '#eaeaea',
        flex: 1
    },

    // content Wrapper
    contentWrapper: {
        paddingHorizontal: 20,
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

    // COMPONENTS

    // header
    headerMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
      },
      headerMenuRight: {
        flexDirection: 'row',
      },
      headerIcon: {
        paddingHorizontal: 20,
      },
});

export { genericStyles }