import React, { useEffect } from "react";
import { StyleSheet, View, Image,BackHandler, Text,TouchableOpacity,Linking, SafeAreaView,TextInput } from "react-native";
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import EntypoIcon from "react-native-vector-icons/Entypo";
import Hometab from '../Hometab'
import Icon from "react-native-vector-icons/Entypo";

function HomeWithLogin(props) {
  
  return ( 
      <View style={styles.container}>
        <View style={styles.image}>
          <Image
            source={require("../assets/image.png")}
            resizeMode="contain"
            style={styles.image1}
          ></Image>
        </View>
        <View style={styles.rect}>
         <Hometab/>
        </View>    
      </View>
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

export default HomeWithLogin;
