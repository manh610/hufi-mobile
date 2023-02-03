//import DeviceInfo from 'react-native-device-info'; 
//import RNFS from 'react-native-fs';
import * as FileSystem from 'expo-file-system';


export const mockdb = (function(){

  function read(file4){
    return FileSystem.readAsStringAsync(file4);
        //  RNFS.readFile(file4, 'utf8').then(function(s) {
        //    console.log(file4,"-->load");
        //    pages = JSON.parse(s);
        //  }).catch((err) => {
            
        //  }); 
  }

  function path(){
    // const document_ = (Platform.OS === 'android'?RNFS.MainBundlePath:RNFS.DocumentDirectoryPath)+"/";
    const document_ =FileSystem.bundleDirectory+"/";
    return document_;
  }
 
  // const document_ = (Platform.OS === 'android'?RNFS.MainBundlePath:RNFS.DocumentDirectoryPath)+"/";
  const document_ = path();
   var pages ={};
  //  var id_user = DeviceInfo.getBundleId();
   const id_user= "com.test";
   var domain ="https://chat.ahlupos.com/modules/mockdb/api.php";
  
   var mockdb = {
      get : function(k){
        return pages[k]?pages[k]:null;
      },
      try : function(k,func){
        var callback=null;
        if(func){
           func(function(data){
             //save
             pages[k] = data;


              // console.log(data,"--> new data");

             mockdb.save();
             callback(data);
           }); 
        } 
        return new Promise((a,b)=>{
          callback= a;
            if(pages[k]){
               callback(pages[k]);
            }
        });
      },
      save : function(){

        const file1 = document_+'jsoncache/'+id_user+'.json';
        // console.log(file1);
        RNFS.writeFile(file1,JSON.stringify(pages), 'utf8').then(function() {
          // console.log(file1,"-->saved");
          
        }).catch((err) => {
          
        });
        //save to json
        // axios.post(domain+"?ac=update",{k:k,v:data}).then((res)=>{

        // }); 
      }, 
      reset : function(k){
        // axios.post(domain+"?ac=clear",{k:k,v:data}).then((res)=>{

        // }); 
        pages={}; 
      },
      remove : function(k){
        // axios.post(domain+"?ac=delete",{ac:"delete",k:k}).then((res)=>{
            
        // },true); 
      },
      init : function(){
         const file4 = document_+'jsoncache/'+id_user+'.json';
         read(file4, 'utf8').then(function(s) {
           console.log(file4,"-->load");
           pages = JSON.parse(s);
         }).catch((err) => {
            
         }); 
          
        // axios.post(domain+"?ac=load",{}).then((res)=>{
        //   for(var slug in res){
        //       if(typeof post.filter=="function"){
        //         var s = post.filter(slug,res[slug]);
        //         if(s){
        //           pages[slug] = res[slug];
        //         }
        //       }else{
        //         pages[slug] = res[slug];
        //       }
        //   }
        // },true);
      }
    };
 
   mockdb.init();
   return mockdb;
})();
