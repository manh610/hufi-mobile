import React, { useEffect } from "react";
import { StyleSheet, View, Image,BackHandler, Text,TouchableOpacity,Linking, SafeAreaView,TextInput } from "react-native";

import Icon from "react-native-vector-icons/Entypo";

function Manager(props) {
 
  return (
      <View style={[styles.container, props.style]}>
        <View style={styles.group}>
          <Text style={styles.time}>Thời gian bắt đầu - kết thúc</Text>
          <View >
            <View style={styles.passwordContainer}>
                <Icon name="calendar" style={styles.icon}></Icon>
            </View>
            <View style={styles.passwordContainer}>
              <Icon name="calendar" style={styles.icon}></Icon>
            </View>
          </View>
          <Text style={styles.eventText}>Sự kiện</Text>
          <View style={styles.userNameContainer}></View>
          <View style={styles.group2}>
            <View style={styles.rect}>
              <Text style={styles.detectText}>Chụp ảnh</Text>
            </View>
            <View style={styles.rect2}>
              <Text style={styles.detectText}>Video</Text>
            </View>
            <View style={styles.rect3}>
              <Text style={styles.detectText}>Camera</Text>
            </View>
            <TouchableOpacity onPress={()=>{
              }} style={styles.rect4}>  
              <Text style={styles.xacNhanText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#317AF5"
  },

  group:{
    marginTop:30,
    marginHorizontal:15,
    alignContent:"center"
  },
  group2:{
    marginVertical:10,
    justifyContent:"space-between"
  },
  eventText:{
    //  fontFamily: "Arimo-regular",
    color: "#626262",
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10,
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
  time: {
    // fontFamily: "Arimo-regular",
    color: "#626262",
    fontSize: 18,
    marginTop: 9,
    marginLeft: 10,
   
  },
  rect: {
    height: 40,
    backgroundColor: "#14FF8E",
    borderRadius: 10,
    marginTop: 30,
    marginHorizontal:50
  },
  rect2: {
    height: 40,
    backgroundColor: "#DAD9CC",
    borderRadius: 10,
    marginTop: 30,
    marginHorizontal:50
  },
  rect3: {
    height: 40,
    backgroundColor: "#FF99E9",
    borderRadius: 10,
    marginTop: 30,
    marginHorizontal:50
  },
  rect4: {
    height: 60,
    backgroundColor: "#FF7918",
    borderRadius: 10,
    marginTop: 30,
    marginHorizontal:50
  },
  detectText: {
    // fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    marginVertical: 10,
    textAlign:"center"
    
  },
  xacNhanText: {
    // fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    marginVertical: 20,
    textAlign:"center"
    
  },
  icon:{
    fontSize:20,
    color:"#C9C0C3",
    direction:"rtl",
    marginHorizontal:15
  }
});


export default Manager;
