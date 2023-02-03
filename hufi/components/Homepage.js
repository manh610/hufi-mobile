import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, SafeAreaView, Text, TextInput, Button, Platform, TouchableOpacity, Picker, ActivityIndicator, Image} from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';
import { Table, Row, Rows } from 'react-native-table-component';
import { SelectList } from 'react-native-dropdown-select-list'
import { URL_API } from "../config/config";
import DetectServiceAPI from '../config/detect-service';
import axios from 'axios';

import { Camera } from 'expo-camera';
import { Video } from 'expo-av';	
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

function Homepage(props) {


	const [isCam, setIsCam] = useState(false);

    let cameraRef = useRef();
    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
    const [isRecording, setIsRecording] = useState(false);
    const [video, setVideo] = useState();
	const [photo, setPhoto] = useState();
	const [resDetect, setResDetect] = useState(false);
	const [labelFace, setLabelFace] = useState("");
	const header = ['STT', 'Name']
	const [dataVideo, setDataVideo] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [startDate, setStartDate] = useState(new Date());

  	const [endDate, setEndDate] = useState(new Date());

	const [showStart, setShowStart] = useState(false);
  	const [showEnd, setShowEnd] = useState(false);
	
	const [titleStartTime, setTitleStartTime] = useState('Chọn ngày bắt đầu');
  	const [titleEndTime, setTitleEndTime] = useState('Chọn ngày kết thúc');

	const [selected, setSelected] = React.useState("");

	const [dataEvent, setDataEvent] = useState([]);

	const [listEvent, setListEvent] = useState([]);

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
		console.log(startDate);
		console.log(endDate);
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
		console.log(code)
		if (code == 200 ) {
			console.log(response.data)
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

    useEffect(() => {
		if ( isCam ) {
			(async () => {
				const cameraPermission = await Camera.requestCameraPermissionsAsync();
				const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
				const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
	
				setHasCameraPermission(cameraPermission.status === "granted");
				setHasMicrophonePermission(microphonePermission.status === "granted");
				setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
			})();
		}
    }, [isCam]);

    let recordVideo = () => {
		setIsRecording(true);
		let options = {
			quality: "1080p",
			maxDuration: 60,
			mute: false
		};

		cameraRef.current.recordAsync(options).then((recordedVideo) => {
			setVideo(recordedVideo);
			setIsRecording(false);
		});
    };

    let stopRecording = () => {
		setIsRecording(false);
		cameraRef.current.stopRecording();
    };

	let takePhoto = async () => {
		const options = { quality: 0.5, base64: true, skipProcessing: true };
		await cameraRef.current.takePictureAsync().then((photo) => {
			console.log(photo.uri);
			setPhoto(photo);
		})
	}

	const requestDetectImage = async () => {
		setIsLoading(true);
		console.log('request to server to detect image')
		const base64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: 'base64' });
		const data = await DetectServiceAPI.detectImage(base64);
		console.log('data receive:', data)
		setIsLoading(false);
		setResDetect(true);
		setLabelFace(data.id);
		const array = data.id.split(', ');
		if ( array[0].length > 0 ) {
			for( let i = 0; i < array.length; i++) {
				const tmp = [stt, array[i].slice(1, array[i].length-1)];
				tmpData.push(tmp);
				stt++;
				if ( tmp != 'None' && tmp != 'Unknow') {
					let response;
					let code = 222;
					await axios.post(`${URL_API}/studentEvents`, {
						studentMSSV: array[i].slice(1, array[i].length-1),
						eventName: selected
					}).then( res => {
							response = res.data;
							code = 200
						})
						.catch(error => {
							console.log(error)
						});
					console.log('detect image', code)
				}
			}
		}
	}


	const requestDetectVideo = async () => {
		setIsLoading(true);
		console.log('request to server to detect video')
		const base64 = await FileSystem.readAsStringAsync(video.uri, { encoding: 'base64'});
		let data = await DetectServiceAPI.detectVideo(base64);
		console.log('data receive detect video:', data)
		setResDetect(true);
		let stt = 1;
		data = data.slice(1, data.length-1)
		const array = data.split(', ');
		console.log('array: ', array);
		let tmpData = [];
		if ( array[0].length > 0 ) {
			for( let i = 0; i < array.length; i++) {
				const tmp = [stt, array[i].slice(1, array[i].length-1)];
				tmpData.push(tmp);
				stt++;
				if ( tmp != 'None' && tmp != 'Unknow') {
					let response;
					let code = 222;
					await axios.post(`${URL_API}/studentEvents`, {
						studentMSSV: array[i].slice(1, array[i].length-1),
						eventName: selected
					}).then( res => {
							response = res.data;
							code = 200
						})
						.catch(error => {
							console.log(error)
						});
					console.log('detect video', code)
				}
			}
		}
		setIsLoading(false);
		setDataVideo(tmpData);
		console.log('data Video', tmpData)
	}

	const again = () => {
		setPhoto(undefined)
		setVideo(undefined);
		setResDetect(false);
	}

	if ( photo ) {

		let savePhoto = async () => {
			await MediaLibrary.saveToLibraryAsync(photo.uri);
		};

		return (
			<SafeAreaView style={styles.containerTmp}>
				<Image style={{height: '95%', width: '100%'}} source={{uri: photo.uri}} />
				{isLoading && <ActivityIndicator style={{position: 'absolute'}} size={60} color="#FF5A80" />}
				{!resDetect &&<View style={styles.btnAfter}>
					{
						hasMediaLibraryPermission && <TouchableOpacity style={styles.btnSave} onPress={() => savePhoto()}>
							<Text>SAVE</Text>
						</TouchableOpacity>
					}
					<TouchableOpacity style={styles.btnDetect} onPress={() => requestDetectImage()}>
						<Text>DETECT</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.btnDiscard} onPress={() => setPhoto(undefined)}>
						<Text>DISCARD</Text>
					</TouchableOpacity>
				</View>}
				{resDetect && <View style={styles.btnRes}>
					<Text>LABEL: {labelFace}</Text>	
					<TouchableOpacity style={styles.btnDiscard} onPress={again}>
						<Text>AGAIN</Text>
					</TouchableOpacity>
				</View>}
			</SafeAreaView>
		)
	}

    if (video) {

		let saveVideo = async () => {
			await MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
				 setVideo(undefined);
			});
		};

		return (
			<SafeAreaView style={styles.containerTmp}>
				{ !resDetect && <Video
					style={styles.video}
					source={{uri: video.uri}}
					useNativeControls
					resizeMode='contain'
					isLooping
				/> }
				{isLoading && <ActivityIndicator style={{position: 'absolute'}} size={60} color="#FF5A80" />}
				{!resDetect && <View style={styles.btnAfter}>
					{
						hasMediaLibraryPermission && <TouchableOpacity style={styles.btnSave} onPress={() => saveVideo()}>
							<Text>SAVE</Text>
						</TouchableOpacity>
					}
					<TouchableOpacity style={styles.btnDetect} onPress={() => requestDetectVideo()}>
						<Text>DETECT</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.btnDiscard} onPress={() => setVideo(undefined)}>
						<Text>DISCARD</Text>
					</TouchableOpacity>
				</View>}
				{resDetect && <ScrollView nestedScrollEnabled={true} style={{marginTop: '20%'}}>
					<Text style={{fontWeight: '900', color:'red'}}>LIST LABEL ({dataVideo.length} people): </Text>	
					<Table borderStyle={{borderWidth: 1, borderColor: '#FF5A80'}}>
						<Row data={header} />
						{
							dataVideo.map((dataRow, index) => (
								<Row
									key={index}
									data={dataRow}
									style={[styles.row, index%2 && {backgroundColor: '#ffffff'}]}
									textStyle={styles.text}
								/>
							))
						}
					</Table>
					<TouchableOpacity style={styles.btnDiscard} onPress={again}>
						<Text>AGAIN</Text>
					</TouchableOpacity>
				</ScrollView>}
			</SafeAreaView>
		);
    }

	const getCam = () => {
		setIsCam(true)
	}

	const back = () => {
		if(isRecording) {
			stopRecording();
			setVideo(undefined)
		}
		setIsCam(false)
	}

	

		

	const renderCamera = () => {
		return (
			isCam && (<Camera style={styles.container} ref={cameraRef}>
				<View style={styles.btnVideo}>
					<TouchableOpacity onPress={isRecording ? stopRecording : recordVideo} style={styles.btnRecord}>
						<Text>{isRecording ? "Stop Recording" : "Record Video"}</Text>
					</TouchableOpacity>
					{
						!isRecording && (
							<TouchableOpacity onPress={takePhoto} style={styles.btnTakePhoto}>
								<Text>Take photo</Text>
							</TouchableOpacity>
						)
					}
					<TouchableOpacity onPress={() => back()} style={styles.btnBack}>
						<Text>BACK</Text>
					</TouchableOpacity>
				</View>
			</Camera> )
		);
	}
	
	return (
		<SafeAreaView style={styles.container}>
			{!isCam && (
				<>
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
						boxStyles={styles.box}
						dropdownTextStyles = {styles.dropdown}
					/>
					<TouchableOpacity onPress={() => getCam()} style={styles.btnPhoto} >
						<Text style={styles.textBtn}>CAMERA</Text>
					</TouchableOpacity>
					{/* <TouchableOpacity style={styles.bsstnVideo} >
						<Text style={styles.textBtn}>Video</Text>
					</TouchableOpacity> */}
				</>
			)}
		  {renderCamera()}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:"#3b8fd9"
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
		color: "#FFFFFF",
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
		color: "#FFFFFF",
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
	btnPhoto: {
		marginTop: 10,
		width: 140,
		backgroundColor: '#14FF8E',
		height: 50,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: 'center',
		marginLeft: '33%'
	},
	btnVideo: {
		width: 140,
		backgroundColor: '#DAD9CC',
		height: 50,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: 'center',
		marginTop: 20,
		marginLeft: '33%'
	},
	textBtn: {
		fontSize: 20,
		fontWeight: '400',
		lineHeight: 25
	},
	dropdown: {
		color: '#FFFFFF',
		fontSize: 18
	},
	box: {
		marginTop: 10,
		width : '90%',
		marginLeft: '5%',
		borderColor: '#FFFFFF',
		marginBottom: 40
	},
	containerTmp: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
    },
	btnGetCam: {
		backgroundColor: '#FF5A80',
		width: '30%',
		padding: 10,
		alignSelf:'center',
		borderRadius: 10
	},	
    buttonContainer: {
		backgroundColor: "gray",
		alignSelf: "flex-end"
	},
    video: {
		flex: 1,
		alignSelf: "stretch"
    },
	btnVideo: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: '170%',
		justifyContent: 'space-between'
	},
	btnRecord: {
		backgroundColor: '#FF5A80',
		padding: 15,
		borderRadius: 15
	}, 
	btnTakePhoto: {
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: '#FF5A80',
		padding: 15,
		borderRadius: 15
	},
	btnBack: {
		backgroundColor: 'gray',
		padding: 15,
		borderRadius: 15
	},
	btnAfter: {
		display: 'flex',
		flexDirection: 'row',
		width: '90%',
		justifyContent: 'space-around',
		marginBottom: '5%'
	},
	btnRes: {
		marginTop: '2%',
		display: 'flex',
		flexDirection: 'row',
		width: '90%',
		justifyContent: 'space-around',
		marginBottom: '5%'
	},
	btnSave: {
		backgroundColor: '#5db8f0',
		padding: 10,
		borderRadius: 10
	},
	btnDetect: {
		backgroundColor: '#FF5A80',
		padding: 10,
		borderRadius: 10
	},
	btnDiscard: {
		backgroundColor: '#a1abad',
		padding: 10,
		borderRadius: 10
	}
});

export default Homepage;
