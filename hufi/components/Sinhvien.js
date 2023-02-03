import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text,TextInput, ScrollView,TouchableOpacity, Button, Modal, Alert } from "react-native";

import { SelectList } from 'react-native-dropdown-select-list'

import DateTimePicker from '@react-native-community/datetimepicker';

import { URL_API } from "../config/config";

import axios from 'axios';

function Register(props) {

  const [startDate, setStartDate] = useState(new Date());

  const [endDate, setEndDate] = useState(new Date());

	const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
	
	const [titleStartTime, setTitleStartTime] = useState('Chọn ngày bắt đầu');
  const [titleEndTime, setTitleEndTime] = useState('Chọn ngày kết thúc');

  const [selected, setSelected] = React.useState("");

  const [dataEvent, setDataEvent] = useState([]);

	const [listEvent, setListEvent] = useState([]);

  useEffect(() => {
		getListEvent()
	},[startDate, endDate])

  const convert = () => {
		let temp = [];
		for ( let i = 0; i < listEvent.length; i++) {
			temp.push({
				key: i+1,
				value: listEvent[i].name
			})
		}
		setDataEvent(temp);
	}

	const getListEvent = async () => {
		if ( titleStartTime=='Chọn ngày bắt đầu' || titleEndTime=='Chọn ngày bắt đầu')
			return;
		let response;
		let code = 222;
		await axios.post(`${URL_API}/events/eventInTime`, {
			startTime: startDate,
			endTime: endDate
		}).then( res => {
				response = res.data;
				code = 200
			})
			.catch(error => {
				console.log(error)
			});
		if (code == 200 ) {
			setListEvent(response.data);
			convert();
		}
		return response;
	}

	const onChangeStart = (event, selectedDate) => {
		const currenDate = selectedDate || startDate;
		setShowStart(Platform.OS === 'ios');
		setStartDate(currenDate);
		let tempDate = new Date(currenDate);
		let fDate =  tempDate.getDate() + '/' + (tempDate.getMonth()+1) + '/' + tempDate.getFullYear();
		setTitleStartTime(fDate)
    getListEvent();
	}

  const onChangeEnd = (event, selectedDate) => {
		const currenDate = selectedDate || endDate;
		setShowEnd(Platform.OS === 'ios');
		setEndDate(currenDate);
		let tempDate = new Date(currenDate);
		let fDate =  tempDate.getDate() + '/' + (tempDate.getMonth()+1) + '/' + tempDate.getFullYear();
		setTitleEndTime(fDate);
    getListEvent();
	}

  const [mssv, setMSSV] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [textAns, setTextAns] = useState('');

  const checkStudent = async () => {
    console.log('mssv', mssv);
    console.log('selected', selected);
    let response;
		let code = 222;
		await axios.post(`${URL_API}/studentEvents/checkStudentEvent`, {
			studentMSSV : mssv,
      eventName : selected ,
		}).then( res => {
				response = res.data;
				code = 200
			})
			.catch(error => {
				console.log(error)
			});
		console.log(code)
    if ( code == 200){
      setTextAns(response.data);
      setModalVisible(true);
    }
		return response;
  }

  return (
      <ScrollView style={[styles.container, props.style]}>
        <View style={styles.group}>
          <Text style={styles.mssv}>Mã số sinh viên</Text>
          <View style={styles.userNameContainer}>
            <TextInput onChangeText={newText => setMSSV(newText)} style={styles.rect2}></TextInput>
          </View>
          <Text style={styles.time}>Thời gian bắt đầu - kết thúc</Text>
          <TouchableOpacity onPress={() => setShowStart(true)} style={styles.btnStartTime} >
            <Text>{titleStartTime}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowEnd(true)} style={styles.btnEndTime} >
            <Text>{titleEndTime}</Text>
          </TouchableOpacity>
            {
              showStart &&
              <DateTimePicker
                testID="dateTimePicker"
                value={startDate}
                mode='date'
                is24Hour={true}
                display='default'
                onChange={onChangeStart}
              />
            }
            {
              showEnd &&
              <DateTimePicker
                testID="dateTimePicker"
                value={endDate}
                mode='date'
                is24Hour={true}
                display='default'
                onChange={onChangeEnd}
              />
            }
          <Text style={styles.eventText}>Tên sự kiện</Text>
          <SelectList 
            setSelected={(val) => setSelected(val)} 
            data={dataEvent} 
            save="value"
            inputStyles = {styles.dropdown}
            boxStyles = { styles.box}
          />
          <TouchableOpacity onPress={checkStudent} style={styles.rect4}>
            <Text style={styles.xacNhanText}>Xác nhận</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{textAns}</Text>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
    </View>
</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#9DE2FF"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  group:{
    marginTop:10,
    alignContent:"center"
  },
  mssv: {
    color: "#626262",
    fontSize: 18,
    marginTop: 22,
    marginLeft: 10,
    
  },
  eventText:{
    color: "#626262",
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10,
  },
  rect2: {
    borderRadius: 10,
    marginStart:5,
    marginEnd:5,
    height:30,
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
    shadowRadius: 5,
  },
  time: {
    color: "#626262",
    fontSize: 18,
    marginTop: 9,
    marginLeft: 10,
   
  },
  rect4: {
    height: 40,
    backgroundColor: "#FF7918",
    borderRadius: 10,
    marginTop: 30,
    marginHorizontal:50
  },
  xacNhanText: {
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    marginVertical: 10,
    textAlign:"center"
    
  },
  icon:{
    fontSize:20,
    color:"#C9C0C3",
    direction:"rtl",
    marginHorizontal:15
  },
  btnStartTime: {
    marginTop: 10,
    width: 200,
    backgroundColor: 'white',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '25%',
  },
  btnEndTime:{
    marginTop: 20,
    width: 200,
    backgroundColor: 'white',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '25%',
  },
  box: {
    marginTop: 10,
    width : '90%',
    marginLeft: '5%',
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF'
  },  
  dropdown: {
    
  },
  button: {
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
});

export default Register;
