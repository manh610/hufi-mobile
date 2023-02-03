import { useState } from "react";
import { StyleSheet, View, Image, Text,TouchableOpacity,Linking, SafeAreaView,TextInput, ScrollView } from "react-native";

import axios from 'axios';

import { URL_API } from "../config/config";

function Admin({navigation}) {

  const [username, setUsername] = useState('username default');
  const [password, setPass] = useState('');

  const checkLogin = async () => {
    console.log(username);
    console.log(password);
    let response;
    let code = 222;
    await axios.post(`${URL_API}/teachers/login`, {
      username: username,
      password: password
    }).
      then( res => {
        response = res.data;
        code = 200
      })
      .catch(error => {
        console.log(error)
      });
    console.log(code);
    if (code == 200 ) {
        const user = response.data;
        navigation.navigate('Homepage')
    }
    return response;
  }

  return (
    <ScrollView style={[styles.container]}>
      <View style={styles.group}>
    
        <Text style={styles.tenDangNhap}>Tên đăng nhập</Text>
        <View style={styles.userNameContainer}>
          <TextInput onChangeText={newText => setUsername(newText) } style={styles.rect2}></TextInput>
        </View>
        <Text style={styles.matKhau}>Mật khẩu</Text>
        <View style={styles.passwordContainer}>
        <TextInput
          secureTextEntry={true}  
          style={styles.rectMatkhau} 
          onChangeText={(newText) => setPass(newText)}>
          
        </TextInput>
        </View>
        <TouchableOpacity onPress={checkLogin} style={styles.rect4}>
          
          <Text style={styles.dangNhap1}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>
    </View>
  </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#9DE2FF"
  },

  group:{
    marginTop:10,
    alignContent:"center"
  },

  tenDangNhap: {
    color: "#626262",
    fontSize: 18,
    marginTop: 22,
    marginLeft: 10,
    
  },
  rect2: {
    borderRadius: 10,
    marginStart:5,
    marginEnd:5,
    height:30,
    // opacity:"80%"
    
  },
  userNameContainer: {
    backgroundColor:"white",
    borderRadius: 10,
    height: 35,
    justifyContent: 'center',
    marginHorizontal:10,
    marginVertical:10,
    shadowOffset: {
      width:0,
      height: 2,
    },
    elevation: 12,
    // shadowOpacity: 0.45,
    shadowRadius: 5,
    
    
  },
  passwordContainer:{
    backgroundColor:"white",
    borderRadius: 10,
    height: 35,
    justifyContent: 'center',
    marginHorizontal:10,
    marginVertical:10,
    shadowOffset: {
      width:0,
      height: 2,
    },
    elevation: 12,
    // shadowOpacity: 0.45,
    shadowRadius: 5,
  },
  matKhau: {
    // fontFamily: "Arimo-regular",
    color: "#626262",
    fontSize: 18,
    marginTop: 9,
    marginLeft: 10,
   
  },
  rectMatkhau: {
    height:30,
    borderRadius: 10,
    borderColor: "#000000",
    marginStart:5,
    marginEnd:5,
    
  },
  rect4: {
    height: 56,
    backgroundColor: "#FF7918",
    borderRadius: 10,
    marginTop: 30,
    marginHorizontal:10
  },
  dangNhap1: {
    // fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    marginVertical: 18,
    textAlign:"center"
    
  },
});

export default Admin;
