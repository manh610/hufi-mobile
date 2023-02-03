import React, { useEffect } from "react";
import { StyleSheet} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeWithLogin from "./components/HomeWithLogin";
import Homepage from "./components/Homepage";


const Stack = createStackNavigator();

function App(props) {
 
  return ( 
    <NavigationContainer >
      <Stack.Navigator initialRouteName="HomeWithLogin" >
        <Stack.Screen name="Homepage" component={Homepage} />
        <Stack.Screen name="HomeWithLogin" component={HomeWithLogin} />
      </Stack.Navigator>
    </NavigationContainer>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white"
  },
  image1: {
    width: 215,
    height: 215, 
  },
  image: {
    alignItems:"center",
    marginTop:20,
    backgroundColor:"white"
  },
  rect: {
    backgroundColor: "#9DE2FF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "visible",
    flex:1,
  },
});

export default App;
