import React, { useEffect } from "react";
import { StyleSheet, View, Image,BackHandler, Text,TouchableOpacity,Linking, SafeAreaView,TextInput } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";

import Icon from "react-native-vector-icons/Entypo";

function Personal(props) {
 
  return (
      <View style={styles.container}>
      <View style={styles.image}>
        <Image
          source={require("../assets/imageMan.png")}
          resizeMode="contain"
          style={styles.image1}
        ></Image>
        <Text style={styles.text1}>Trịnh Công Sỉ</Text>
        <Text style={styles.text2}>Quản lí điểm danh sinh viên</Text>
      </View>
        <View style={styles.icon}>
          <Icon name="log-out" style={styles.iconOut}></Icon>
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
    width: 150,
    height: 150,
    marginTop:20
  },
  image: {
    height:"40%",
    alignItems:"center",
    backgroundColor:"#317AF5"
  },
  text1:{
    fontFamily:"arimo-700",
    color:"white",
    marginVertical:15,
    fontSize:22
  },
  text2:{
    fontFamily:"arimo-700italic",
    color:"white",
    marginVertical:15,
    fontSize:20
  },
  icon:{
    flex:1,
    justifyContent:"flex-end",
  },
  iconOut:{
    fontSize:30,
    direction:"rtl",
  }


});

export default Personal;
