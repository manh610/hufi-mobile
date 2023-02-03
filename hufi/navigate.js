import React, {Component} from 'react';

import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack"; 

import {MenuProvider} from 'react-native-popup-menu';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

//import screens


import Sinhvien from "./components/Sinhvien"
const pages = {
  // HomeTab:HomeTab,

  Sinhvien:Sinhvien
}
////////
const Stack = createStackNavigator();

//main call app
export default  AppNavigator = () => {
 
  return (
    <MenuProvider>
      <ActionSheetProvider>
      <Stack.Navigator  initialRouteName="Sinhvien">
      
      
       {/* dung xoa */}
       {Object.entries({ 
          ...pages
        }).map(([name, component]) => (
          <Stack.Screen name={name} options={{
            headerShown: false,
          }} key={name} component={component} />
        ))}
        {/* dung xoa */}  

      </Stack.Navigator>
      </ActionSheetProvider>
    </MenuProvider>
  );
};


