import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { app } from './firebase';
import { Feather } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import { PortalProvider } from '@gorhom/portal';


import LoginScreen from './screens/LoginScreen';
import ReceipesScreen from './screens/ReceipesScreen';
import MoreScreen from './screens/MoreScreen';
import ToDoListScreen from './screens/ToDoListScreen';
import ReceipeDetailScreen from './screens/ReceipeDetailScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


{ /* Might be super dirty, but this calls the firebase.js and initializes the app with it */ }
app


{ /* Defining a tab navigation for the main screen, get's called in the App function */ }
function TabScreenNavigation() {
  return(
    <Tab.Navigator screenOptions={{
      tabBarStyle: { position: 'absolute', backgroundColor: '#fff', borderTopWidth: 0, elevation: 0, style: styles.tabBar },
    }}>
      <Tab.Screen name="Rezepte" component={ReceipesScreenNavigation} options={{ headerShown: false, tabBarIcon: () => (<Feather name="book-open" size={24} color="black" />) }} />
      <Tab.Screen name="Einkaufsliste" component={ToDoListNavigation} options={{ headerShown: false, tabBarIcon: () => (<Feather name="list" size={24} color="black" />) }} />
      <Tab.Screen name="Mehr" component={MoreScreenNavigation} options={{ headerShown: false, tabBarIcon: () => (<Feather name="more-horizontal" size={24} color="black" />) }} />
    </Tab.Navigator>
  )
}


{ /* Nested stack navigators for more, todolist & receipes */ }
function ReceipesScreenNavigation() {
  return(
    <Stack.Navigator>
      <Stack.Screen name="ReceipesScreenNav" component={ReceipesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ReceipeDetailsScreen" component={ReceipeDetailScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function ToDoListNavigation() {
  return(
    <Stack.Navigator>
      <Stack.Screen  name="ToDoListNav" component={ToDoListScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  )
}

function MoreScreenNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="More" component={MoreScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

{ /* main navigator stack*/ }
export default function App() {
  return (
    <PortalProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}} />
          <Stack.Screen name="TabScreenNav" component={TabScreenNavigation} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PortalProvider>
    

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8eaed',
  },
  tabBar: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  }
});
