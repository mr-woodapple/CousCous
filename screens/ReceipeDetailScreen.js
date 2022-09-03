import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'

const ReceipeDetailScreen = () => {

    const [receipes, setReceipes] = useState({});
    const [ presentTitle, setPresentTitle] = useState('');
    const [ presentIngredients, setPresentIngredients] = useState('');
    const [ presentHowTo, setPresentHowTo ] = useState('');
    const receipeKeys = Object.keys(receipes)
    

    return (

        <ScrollView>
            <Text>ReceipeDetailScreen</Text>
            <Text>Rezept ID = {navigation.getParam('title')}</Text>

            
        </ScrollView>

    )
}

export default ReceipeDetailScreen

const styles = StyleSheet.create({})