import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { app } from './firebase';
import { Feather } from '@expo/vector-icons';
import { PortalProvider } from '@gorhom/portal';

// screen
import LoginScreen from './screens/LoginScreen';
import ReceipesScreen from './screens/ReceipesScreen';
import MoreScreen from './screens/MoreScreen';
import ToDoListScreen from './screens/ToDoListScreen';
import ReceipeDetailScreen from './screens/ReceipeDetailScreen';
import EditCategories from './screens/more-screens/EditCategories';


// nagivator definitions
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


{ /* Might be super dirty, but this calls the firebase.js and initializes the app with it */ }
app


{ /* Defining a tab navigation for the main screen, get's called in the App function */ }
function TabScreenNavigation() {
  return(
    <Tab.Navigator screenOptions={{
      tabBarStyle: { position: 'absolute', backgroundColor: '#eaeaea', borderTopWidth: 0, elevation: 0 },
    }}>
      <Tab.Screen name="Rezepte" component={ReceipesScreenNavigation} options={{ headerShown: false, tabBarIcon: ({ color }) => (<Feather name="book-open" size={24} color={color} />) }} />
      <Tab.Screen name="Einkaufsliste" component={ToDoListNavigation} options={{ headerShown: false, tabBarIcon: ({ color }) => (<Feather name="list" size={24} color={color} />) }} />
      <Tab.Screen name="Mehr" component={MoreScreenNavigation} options={{ headerShown: false, tabBarIcon: ({ color }) => (<Feather name="more-horizontal" size={24} color={color} />) }} />
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
      <Stack.Screen name="More" component={MoreScreen} options={{ headerShown: false, title: 'Mehr' }} />
      <Stack.Screen name="EditCategoriesScreen" component={EditCategories} options={{ headerShown: false, title: 'Kategorien' }} />
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
  }
});
