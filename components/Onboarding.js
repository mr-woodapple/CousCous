import React from 'react'
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native'

// slider package
import AppIntroSlider from 'react-native-app-intro-slider';


const Onboarding = ( props ) => {

    const data = [
        {
            title: 'Title 1',
            text: 'Description.\nSay something cool',
            //image: require('../assets/images/nordwood-themes-wtevVfGYwnM-unsplash.jpg'),
            bg: '#59b2ab',
        },
        {
            title: 'Title 2',
            text: 'Other cool stuff',
            //image: require('../assets/images/nordwood-themes-wtevVfGYwnM-unsplash.jpg'),
            bg: '#febe29',
        },
        {
            title: 'Rocket guy',
            text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
            //image: require('../assets/images/nordwood-themes-wtevVfGYwnM-unsplash.jpg'),
            bg: '#22bcb5',
        },
      ];

    const renderItem = ({ item }) => {
        return(
            <View>
                <Image source={item.image} />
                <View>
                    <Text>{ item.title }</Text>
                    <Text>{ item.text }</Text>
                </View>
            </View>
        )
    }

    const keyExtractor = (item) => item.title;

    // functions for next, prev and done button
    const renderDoneButton = () => {
        return (
            <View>
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

    return (
        <View style={{flex: 1}}>
            <StatusBar translucent backgroundColor="transparent" />
            <AppIntroSlider
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            renderDoneButton={renderDoneButton}
            renderNextButton={renderNextButton}
            renderPrevButton={renderPrevButton}
            showPrevButton
            data={data}
            onDone={handleDone}
            />
      </View>
    )
}

export default Onboarding

const styles = StyleSheet.create({})