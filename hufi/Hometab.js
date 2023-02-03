import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import { StatusBar } from 'react-native';
import Admin from "./components/Admin"
import Sinhvien from "./components/Sinhvien"

const Tab = createMaterialTopTabNavigator();

const Hometab = () => {
  return (
    <Tab.Navigator style={{ paddingTop: StatusBar.currentHeight }}>
      <Tab.Screen
        options={{
           tabBarLabel: 'Admin'
        }}
        component={Admin}
        name='Admin'
      />
      <Tab.Screen
        options={{
         tabBarLabel: 'Sinh viên',
        }}
        component={Sinhvien}
        name='Sinhvien'
      />
    </Tab.Navigator>
  );
};

export default Hometab;
