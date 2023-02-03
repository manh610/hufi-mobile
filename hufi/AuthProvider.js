import React, { createContext, useState, useContext } from "react";
import { ToastAndroid, Platform, Alert } from "react-native";
import {auth} from './firebase';
//import messaging from '@react-native-firebase/messaging';
//import firestore,{firebase} from '@react-native-firebase/firestore'; 
import axios from 'axios';  
import {mockdb} from './mockdb';
//import DeviceInfo from "react-native-device-info";
import storage from "@react-native-community/async-storage-backend-legacy"
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
 
  const sendemail = (email,title,body,from_name)=>{
    axios.post("https://linkpos.top/tools/cron.php?run&runinbg",{type:"other",subject:title,body:body,to:email,from_name:from_name?from_name:"App Mobile",action:"send"}).then((res)=>{
       // console.log(res.data);
    });
  }
  const db=(name)=>{
      return name?firebase.firestore().collection(name):firebase.firestore();
  };
  const uploadImage = async (image) => {
    if( image == null ) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = firebase.storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };
  
  const prompt= (title,subtitle,func,type)=>{
    Alert.prompt(title,subtitle,
        [
          {
            text: 'Huỷ',
            onPress: () => {
                func(null);
            },
            style: 'cancel'
          },
          {
            text: 'Đồng ý',
            onPress: (s) =>{ 
               func(s);
            }
          }
        ],type?type:'plain-text');
  }

  const find = (id_user)=>{
    return db('USERS').doc(id_user).get();
  };
  const UserCache = {
     
    save : function(id,k,v){
      id = id?id:auth().currentUser.uid;
      let batch = firestore().batch();
      let cache = db("CACHE").doc(id);
      const data = { 
        userid: id
      };
      data[k] = v;
      batch.set(cache, data);
       
    },
    fetch : async function(id){
      let a = await db("CACHE").where('userid', '==', id).get();
      if(a.exists ) {
        return a.data(); 
      } 
      return null;
    },
    get : async function(id,k,d){
      let a = await db("CACHE").where('userid', '==', id).where(k, '==', k).get();
      if(a.exists ) {
        const v= a.data();
        return v[k];
      }else{
         cache.save(id,k,d);
      }
      return d;
    }, 
    delete : function(){
        
    }
  };

  const UserPage = {
    GotoMainHome: function(){
 
      MainHome();
    },
    login : function(){
       navigation.replace("ALoginScreen");
    },
    signup : function(){
       navigation.replace("ASignupScreen");
    },
    forgot : function(){
       navigation.replace("AForgotScreen");
    },
    logout : function(){
      auth().signOut();
      setUsername(""); 
      navigation.replace("ALoginScreen");
    }
  };

  const Pusher = (function(){
    const domain = "https://chat.ahlupos.com/";
    // const bundle= DeviceInfo.getBundleId();
    const bundle= "com.test";
    return {
      room: function(id){
   
        axios.post(domain+"modules/pusher/api.php?ac=user&bundle="+bundle,{});
      },
      user : function(id,mes){
        if(typeof id=="object" && (id.token_android || id.token_ios)){
           const data = { 
              android:id.android_token,
              ios:id.ios_token,
              title:"",
              body:"",
              payload:[],
             };
           for(var i in mes){
            data[i] = mes[i];
           }
           //
           axios.post(domain+"modules/pusher/api.php?ac=user&id=1",data).then((a)=>{
             debug(a.data);
           });
          return;
        }
        find(typeof id=="object"?id.uid:id).then((documentSnapshot) => { 
          if( documentSnapshot.exists ) { 
            const u =  documentSnapshot.data();
            // console.log(u);
            const data = { 
              android:u.token_android,
              ios:u.token_ios,
              title:"",
              body:"",
              payload:[],
             };
             for(var i in mes){
              data[i] = mes[i];
             }
             //
             axios.post(domain+"modules/pusher/api.php?ac=user&id=1",data).then((a)=>{
               debug(a.data);
             });
          }
        })
      },
      topic : function(id){
         
      },
    }
  })();
 
 const saveTokenToDatabase=(u,token)=>{
   const userId = u.uid;

    let data ={ };
    if(Platform.OS == 'ios'){
      data.token_ios = token;
    }else{
      data.token_android = token;
    }
    

    // Add the token to the users datastore
    db('USERS').doc(userId).update(data);
 };

  return (
    <AuthContext.Provider
      value={{ 
        uploadImage,
        mockdb,
        Pusher,
        UserCache,
        UserPage,
        prompt, 
        storage,
        showAlert: (message) => {
          if (Platform.OS === "android") {
            ToastAndroid.show(message, ToastAndroid.SHORT);
          } else {
            Alert.alert("Message", message, { cancelable: true });
          }
        },
        debug: (a) => {
          alert(typeof a=="object"?JSON.stringify(a):a);
        },
        db,
        find,
        user,
        setUser,
        username,
        setUsername,
        sendemail,
        activity: async (name,data) => {
          return db(name.toUpperCase()).add(data);
        },
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);

            const u = auth().currentUser;
            setUser(u);

            setUsername(u.username?u.username:u.email);


            if(Platform.OS == 'ios') {
              messaging().getAPNSToken().then(token => { return saveTokenToDatabase(u,token); }); 
            }else{
              // Get the device token
              messaging()
              .getToken()
              .then(token => {
                return saveTokenToDatabase(u,token);
              });

            }


           
            return { type: "success", message: "Login Successfully" };
          } catch (error) {
            return { type: "failed", message: error.message };
          }
        },
        email : sendemail,
        forgot: (email) => {
          try {
            sendemail(email,"Recover email",` Your new password is `+Date.now());

            return { type: "success", message: "Password send to your inbox email Successfully" };
          } catch (error) {
            return { type: "failed", message: error.message };
          }
        },
        register: async (username, email, password) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password);

            //Create user info collection & register username
            let batch = firestore().batch();
            let createUser = db("USERS").doc(auth().currentUser.uid);

            batch.set(createUser, {
              avatar:"",
              userid: auth().currentUser.uid,
              username: username.toLowerCase(),
              email: email.toLowerCase(),
              createdAt: firestore.FieldValue.serverTimestamp(),
            });

            let createUsername =  db("USERNAMES")
              .doc(username.toLowerCase());

            batch.set(createUsername, {
              username: username.toLowerCase(),
              createdAt: firestore.FieldValue.serverTimestamp(),
            });

            await batch.commit();
            setUsername(username.toLowerCase());
            return { type: "success", message: "Signup Successfully" };
          } catch (error) {
            return {
              type: "failed",
              message: error.message ? error.message : error,
            };
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
            setUsername("");


            return { type: "success", message: "Logged Out Successfully" };
          } catch (error) {
            return { type: "failed", message: "error" };
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};