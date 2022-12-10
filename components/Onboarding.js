import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Image } from 'react-native'

// slider package
import AppIntroSlider from 'react-native-app-intro-slider';
import { genericStyles } from '../assets/styles/GenericStyles';


const Onboarding = ( props ) => {

    const data = [
        {
            title: 'Willkommen zu CousCous, deinem neuen Rezeptbuch!',
            text: 'Speicher & verwalte deine Rezepte so einfach wie nie zuvor. Und mit der integrierten Einkaufsliste ist es noch einfacher organisiert zu sein!',
            image: require('../assets/images/onboarding/welcome.png'),
        },
        {
            title: 'Integrierte Einkaufsliste',
            text: 'Es war nie einfacher, fehlende Zutaten zu deiner Einkaufsliste hinzuzufügen.\n\nWähle dein Rezept aus und drücke auf das Symbole neben der Zutat und schon ist Sie auf deiner Einkaufsliste!',
            image: require('../assets/images/onboarding/shoppinglist.png'),
        },
        {
            title: 'Warum muss ich mich anmelden?',
            text: "Damit wir deine Daten speichern können. Deine Daten liegen in der Cloud, sind also auch nicht verloren sollte dein Handy mal kaputtgehen. Praktisch!\n\nWir speichern deine Daten sicher in unserer Datenbank und geben die Daten auch unter keinen Umständen weiter. Ehrenwort!",
            image: require('../assets/images/onboarding/cloud.png'),
        },
        {
            title: 'Lass uns loslegen!',
            text: 'Bereit? Dann lass uns anfangen! Melde dich mit deinem Account an oder erstelle einen neuen!',
            image: require('../assets/images/onboarding/ready.png'),
        },
      ];

    // provides what we want to display on the current slide
    const renderItem = ({ item }) => {
        return(
            <View style={styles.introSlide}>
                <Image style={styles.image} source={item.image} />
                <View style={styles.textWrapper}>
                    <Text style={genericStyles.headingMedium}>{ item.title }</Text>
                    <Text style={genericStyles.textPrimary}>{ item.text }</Text>
                </View>
            </View>
        )
    }


    const keyExtractor = (item) => item.title;

    // functions for next, prev and done button
    const renderDoneButton = () => {
        return (
            <View style={styles.buttonDone}>
                <Text>Los geht's!</Text>
            </View>
        )
    };
    const renderNextButton = () => {
        return (
            <View>
                <Text>Weiter</Text>
            </View>
        )
    };
    const renderPrevButton = () => {
        return (
            <View>
                <Text>Zurück</Text>
            </View>
        )
    };

    const handleDone = () => {
        props.handleDone();
    }

    // returns the view element
    return (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar translucent backgroundColor="transparent" />
            <AppIntroSlider
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            // selects what buttons we want to have
            renderDoneButton={renderDoneButton}
            renderNextButton={renderNextButton}
            renderPrevButton={renderPrevButton}
            showPrevButton
            // nav bubbles
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.activeDotStyle}
            // select the data and what happens if we click done
            data={data}
            onDone={handleDone}
            />
      </SafeAreaView>
    )
}

export default Onboarding

const styles = StyleSheet.create({

    // container
    introSlide: {
        flex: 1,
        margin: 20,
        justifyContent: 'center',
    },

    // image
    image: {
        alignSelf: 'center',
        width: 300,
        height: 300,
        marginBottom: 50,
    },

    // text container
    textWrapper: {
        alignItems: 'center',
    },

    // nav buttons
    buttonDone: {
        
    },

    // nav bubbles
    dotStyle: {
        backgroundColor: '#add8e6',
    },
    activeDotStyle: {
        backgroundColor: 'black'
    },
    
})