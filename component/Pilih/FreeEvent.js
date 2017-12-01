/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Select,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  View,
  BackHandler,
  Modal,
  ActivityIndicator
} from 'react-native';
import * as firebase from 'firebase';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import DatePicker from 'react-native-datepicker';
import RNFetchBlob from 'react-native-fetch-blob';
import { StackNavigator  } from 'react-navigation';
import ImageResizer from 'react-native-image-resizer';
import PhotoView from 'react-native-photo-view';
import { TextField } from 'react-native-material-textfield';

var ImagePicker = require("react-native-image-picker");
var{width,height}=Dimensions.get('window');
const polyfill = RNFetchBlob.polyfill;

window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;

let options = {
  title: 'Select event image',
  quality: 0.2,
};

import { Picker, Container, Item, Input, Content, ListItem, CheckBox, Header, Left, Right, Body, Button, Icon, Title, Subtitle, Thumbnail, CardItem, Card , Fab} from 'native-base';
export default class FreeEvent extends Component {

        constructor(props) {
            super(props);
            console.ignoredYellowBox = ['Setting a timer'];
            this.state = {
                NY:{
                  lat : -8.806789 ,
                  lng:115.178232 ,
                },
                myLatitude: -8.806789, // ambil posisi user dari dashboard
                myLongitude : 115.178232,// ambil posisi user dari dashboard
                adminArea : null,//mengambil nama area
                imagePath :"uri of image", //path gambar untuk ditampilkan pada aplikasi
                imageUploadPath : null, //path gambar untuk diupload ke storage
                resizeImageUploadPath : null,
                title:null,//judul event/news
                description : '', // deskripsi event/news
                placeName : '', //nama tempat yang di cari
                eventAddress : null,
                childKey : null, //menyimpan nama child setelah push
                dateStart : null,
                dateEnd : null,
                url : '',
                username : '',
                imageHeight : 200,
                imageWidth : 200,
                results: {
                    items: []
                },
                modalVisible : false,
                animating : true,
                modalImage : false
            }
        }

backPressed = () => {
  const { navigation } = this.props;
  navigation.goBack();
  navigation.state.params.onSelect({ selected: true });
  return true;
}

componentWillMount(){
  BackHandler.addEventListener('hardwareBackPress', this.backPressed);
}

/***2***header untuk screen tambah event/news******/
        static navigationOptions = {
         header : null
         };
/***2*************END********************/

 /***3***Fungsi untuk mengambil alamat file gambar dari device, alamat untuk lokal dan untuk diupload****/
         GetImagePath=()=>{
          ImagePicker.showImagePicker((response) => {
              if (response.didCancel) {
              }
              else if (response.error) {
                alert("An Error Occurred During Open Library"); // jika terjadi kesalahan saat menggunakan image picker
              }
              else if (response.customButton) {
              }
              else {
                let source = { uri: response.uri };
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                  imageHeight : response.height,
                  imageWidth : response.width,
                  imagePath : source, //simpan alamat gambar untuk ditampilkan pada aplikasi --obj--
                  imageUploadPath : source.uri //simpan alamat gambar untuk di upload ke firebase storage --url--
                });
              }
            });
         }
/***3***************END********************************************************************************************/

resizeImage=()=>{
    ImageResizer.createResizedImage(this.state.imageUploadPath, 300, 200, "JPEG", 100,0, null).then((response) => {
    // response.uri is the URI of the new image that can now be displayed, uploaded... 
    // response.path is the path of the new image 
    // response.name is the name of the new image with the extension 
    // response.size is the size of the new image 
    this.setState({
      resizeImageUploadPath : response.uri
    });
  }).catch((err) => {
    // Oops, something went wrong. Check that the filename is correct and 
    // inspect err to get more details. 
    alert("Error has Occurred");
  });
}

//mencari latitude dan longitude berdasarkan nama lokasi
searchLocation=()=>{
  // Address Geocoding
    Geocoder.geocodeAddress(this.state.placeName).then(res => {
        // res is an Array of geocoding object (see below)
        this.setState({
          myLatitude : res[0].position.lat,
          myLongitude : res[0].position.lng,
          adminArea : res[0].adminArea,
          eventAddress : res[0].formattedAddress
        });
       // alert(res[0].formattedAddress);

    })
    .catch(err => alert("Your Location Undetected"));
}

uploadEvent=()=>{
  if(this.state.dateStart == null||this.state.dateEnd==null || this.state.title==null || this.state.description==null){
    alert(this.state.dateStart+"-"+this.state.dateEnd+"/"+this.state.title+"/"+this.state.description);
  }
  else{
    this.setState({modalVisible : true});
    this.resizeImage();
    let today = new Date();
    let Times = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let sortTime = -1*today.getTime();// mengambil waktu sekarang utuk sorting
    let userId = firebase.auth().currentUser.uid;

    var database = firebase.database().ref("showEvent/"+this.state.adminArea+"/FreeEvent");
    var slicestring = this.state.description;
    var descriptionSliced = slicestring.slice(0, 20);
    var descriptionSlice = descriptionSliced+"...";

    database.push({
      sortTime: sortTime,
      userUid : userId,
      username : this.state.username,
      eventTitle : this.state.title,
      eventDescription : descriptionSlice,
      eventLocation : this.state.eventAddress,
      eventDateStart : this.state.dateStart,
      eventDateEnd : this.state.dateEnd,
      userProfilPhoto : this.props.navigation.state.params.userPhoto,
      locationLatitude : this.state.myLatitude,
      locatonLongitude : this.state.myLongitude
    }).then((snapshot)=>{
      //simpan key untuk dibawa ke folder event di database
      this.setState({
        childKey: snapshot.key
      });
        let path =this.state.imageUploadPath;
        //alert(path);
        Blob.build(RNFetchBlob.wrap(path), { type : 'image/jpeg' })
            .then((blob) => firebase.storage()
                    .ref("users/"+userId+"/freeEventPhotoOriginal").child(snapshot.key)
                    .put(blob, { contentType : 'image/png' })
            )
            .then((snapshot) => {
                  var storage = firebase.storage().ref("users/"+userId+"/freeEventPhotoOriginal").child(this.state.childKey);
                  storage.getDownloadURL().then((url)=>{

                      database = firebase.database().ref("freeEvent").child(this.state.childKey);
                      database.set({
                      created_at : Times,
                      eventDateStart : this.state.dateStart,
                      eventDateEnd : this.state.dateEnd,
                      eventDescription : this.state.description,
                      eventLocation : this.state.eventAddress,
                      eventTitle : this.state.title,
                      eventPhoto : url,
                      locationLatitude : this.state.myLatitude,
                      locationLongitude : this.state.myLongitude

                    }).then(()=>{
                        
                        let resizePath = this.state.resizeImageUploadPath;
                        Blob.build(RNFetchBlob.wrap(resizePath), { type : 'image/jpeg' })
                        .then((blob) => firebase.storage()
                                .ref("users/"+userId+"/freeEventPhotoResized").child(this.state.childKey)
                                .put(blob, { contentType : 'image/png' })
                        )
                        .then(() => {
                           var storage = firebase.storage().ref("users/"+userId+"/freeEventPhotoResized").child(this.state.childKey);
                            storage.getDownloadURL().then((url)=>{
                            this.setState({
                              url : url
                            });
                            database = firebase.database().ref("userEvent/"+userId+"/freeEvent").child(this.state.childKey);
                            database.set({
                            sortTime: sortTime,
                            eventTitle : this.state.title,
                            eventDescription : descriptionSlice,
                            created_at : Times,
                            eventPhoto : url

                          }).then(()=>{
                            database = firebase.database().ref("showEvent/"+this.state.adminArea+"/FreeEvent").child(this.state.childKey);
                            database.update({
                              imageResized : this.state.url
                            });
                          }).then(()=>{
                            const { navigate } = this.props.navigation;
                            this.setState({modalVisible : false});
                            navigate('Dashboard');
                          });

                        });

                        });
                    });

                  });
             });
    });
    }
}

//mncari nama jalan berdasarkan koordinat
getAdminAreaBasedLocation=()=>{
  var area = {
    lat : this.state.myLatitude,
    lng : this.state.myLongitude
  };
  Geocoder.geocodePosition(area).then(res => {
        // res is an Array of geocoding object (see below)
        this.setState({
          adminArea : res[0].adminArea,
          eventAddress : res[0].formattedAddress
        });
        //alert(res[0].formattedAddress);

    })
    .catch(err => alert("Your Location Undetected"));
}

focusToMarker=()=>{
  this.setState({
    myLatitude : this.state.myLatitude,
    myLongitude : this.state.myLongitude
  });
}


// komponen yang akan dipanggil ketika pertama kali file tambah.js dipanggil
componentDidMount(){
   let userId = firebase.auth().currentUser.uid;
   var database =  firebase.database().ref("users/"+userId);
    database.on("value",(dataSnapshot)=>{
     this.setState({
      username : dataSnapshot.val().username
     });
    });

  this.setState({
    myLatitude : this.props.navigation.state.params.myLatitude,
    myLongitude : this.props.navigation.state.params.myLongitude,
  });

  this.getAdminAreaBasedLocation();

 }

componentWillUnmount(){
  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
}

        render() {
           const { navigate } = this.props.navigation;
           const {goBack} = this.props.navigation;

            return (
                <View style={{height : height, width : width}}>
                  <Modal
                      animationType = {"fade"}
                      transparent   = {true}
                      visible       = {this.state.modalVisible} onRequestClose ={()=>{console.log('closed')}}
                  >
                    <View style={{height : height, width : null,  backgroundColor: 'rgba(0, 0, 0, 0.56)'}}>

                      <View style={{
                          backgroundColor : 'white',
                          borderRadius: 5,
                          marginLeft: '25%',
                          height: 100,
                          width: '50%',
                          alignItems: 'center',
                          marginTop: '70%'
                      }} >
                          <ActivityIndicator
                              animating={this.state.animating}
                              color="#bc2b78"
                              size = 'large'
                              style={{marginTop:30}}
                          />
                      </View>
                    </View>
                  </Modal>
                 
                   {/*menampilkan modal untuk melihat gambar lebih jelas*/}
                   <Modal
                      animationType = {"fade"}
                      transparent   = {false}
                      visible       = {this.state.modalImage} onRequestClose ={()=>{this.setState({modalImage : false});}}
                  >
                    <View style={{flex : 1, backgroundColor : "black", alignSelf:"center"}}>

                      <PhotoView
                      source={this.state.imagePath}
                      minimumZoomScale={0.5}
                      maximumZoomScale={3}
                      androidScaleType="center"
                      onLoad={() => console.log("Image loaded!")}
                      style={{width: width, height: height}} />

            
                    </View>
                  </Modal>
                  {/*modal end*/}
                  
                  <View style={{width : width,height : 70, backgroundColor : 'white', borderBottomWidth : 0.3, flexDirection : 'row', paddingTop : 30}}>
                      <TouchableOpacity onPress={()=>this.backPressed()}>
                          <Icon name="arrow-back" style={{color : 'black', marginLeft : 5}}/>
                      </TouchableOpacity>
                      <Text style={{color : "black", fontSize : 20, marginLeft : width/3.5}}>Your Event</Text>
                  </View>
                  <View style={{width : width, backgroundColor : 'white', height : height}}> 
                     <Content>
                      {/* image yang dipilih dan tombol tambah untuk menambahkan gambar dari device*/}
                                <TouchableOpacity onPress={()=>this.setState({modalImage : true})}>
                                  <Image style={{height:200,width:width, resizeMode:"cover",alignSelf:'center', marginTop : 10}} source={this.state.imagePath} />
                                </TouchableOpacity>
                                <Button onPress={()=>this.GetImagePath()}
                                
                                 style={{alignSelf:'center', backgroundColor:'#f39c12', marginTop: '10%', width : width-50}}>
                                  <Icon name="camera" style={{color : 'white', marginLeft : width/2.8}}/>
                                </Button>

                              {/* MEMBUAT DATEPICKER */}
                              <View style={{width : width, paddingLeft : 15}}>
                                <Text style={{marginTop: '2%'}}>Event Date</Text>
                                <DatePicker
                                  style={{width: 200, marginTop:"2%"}}
                                  date={this.state.dateStart}
                                  mode="date"
                                  placeholder="Start Date"
                                  format="D/M/YYYY"
                                  confirmBtnText="Confirm"
                                  cancelBtnText="Cancel"
                                  customStyles={{
                                    dateIcon: {
                                      position: 'absolute',
                                      left: 0,
                                      top: 4,
                                      marginLeft: 0
                                    },
                                    dateInput: {
                                      marginLeft: 36
                                    }
                                    // ... You can check the source to find the other keys.
                                  }}
                                  onDateChange={(date) => {this.setState({dateStart: date})}}
                                />

                                 <DatePicker
                                  style={{width: 200, marginTop:"2%"}}
                                  date={this.state.dateEnd}
                                  mode="date"
                                  placeholder="End Date"
                                  format="D/M/YYYY"
                                  confirmBtnText="Confirm"
                                  minDate={this.state.dateStart}
                                  cancelBtnText="Cancel"
                                  customStyles={{
                                    dateIcon: {
                                      position: 'absolute',
                                      left: 0,
                                      top: 4,
                                      marginLeft: 0
                                    },
                                    dateInput: {
                                      marginLeft: 36
                                    }
                                    // ... You can check the source to find the other keys.
                                  }}
                                  onDateChange={(date) => {this.setState({dateEnd: date})}}
                                />
                                </View>
                               
                                <Input  placeholder='Write a Title ... ' style={{fontSize:14, borderColor : 'black', borderWidth : 1, marginTop : "2%", width : width-30, alignSelf : 'center'}} onChangeText={(title)=>this.setState({title})}/>
                             
                                <TextInput  onChangeText={(description)=>
                                    this.setState({description})} underlineColorAndroid="transparent" style={{fontSize:14, height: 200, width : width-30, borderColor : 'black', borderWidth : 1, alignSelf : 'center', marginTop : "2%"}} placeholder='Write a Description ... ' 
                                     multiline = {true} numberOfLines={ 100}
                                     blurOnSubmit={false}
                                />
                            
                          <View style={{width : width, height : 450, marginTop : 5}}>
                          
                            <View style={{backgroundColor : "white"}}>

                            <View style={styles.mapView}>
                               <Item rounded style={{alignSelf:"center",height:40,width:"95%", marginTop: '2%', backgroundColor : "rgba(44,28,1,0.1)",borderWidth:0.01, borderColor : "white"}}>
                                    <Input placeholder='Search or drag the marker' style={{fontSize:18}} onChangeText={(placeName)=>this.setState({placeName})}/>
                                    <TouchableOpacity onPress={()=>this.searchLocation()}>
                                      <Icon style={{color:'orange'}} name="ios-search" />
                                    </TouchableOpacity>
                              </Item>
                            </View>

                             {/** MapView START **/}
                            <MapView style={{height: 300, width:width}}
                              initialRegion={{
                                latitude : this.state.myLatitude,
                                longitude: this.state.myLongitude,
                                latitudeDelta: 0.015,
                                longitudeDelta: 0.0121,
                              }}
                              region={{
                                latitude : this.state.myLatitude,
                                longitude: this.state.myLongitude,
                                latitudeDelta: 0.015,
                                longitudeDelta: 0.0121,
                              }}

                            >
                              {/** membuat koordinat user START  **/}
                              <MapView.Marker draggable
                              onDragEnd={(e)=>{
                                this.setState({myLatitude:e.nativeEvent.coordinate.latitude,
                                myLongitude : e.nativeEvent.coordinate.longitude,});
                                this.getAdminAreaBasedLocation();
                                }
                              }
                                coordinate ={{
                                  latitude: this.state.myLatitude,
                                  longitude: this.state.myLongitude,
                                }}
                                title = "Your event location"
                                description = "long press to drag the marker"
                              >
                               <View style={styles.marker2}>
                                <View style={styles.marker1}>
                                  <View style={styles.marker0}>
                                   <Text style={styles.content}>E</Text>
                                  </View>
                                </View>
                               </View>
                              </MapView.Marker>
                              {/** membuat koordinat END **/}

                            </MapView>

                            <Fab onPress={()=>this.focusToMarker()} style={{width : 30, height : 30, backgroundColor : "transparent"}}>
                              <Image  source={require('./../../image/btn-backtolocation.png')}
                                 style={{width: 30, height:30}}
                              />
                            </Fab>

                            </View>
                            <Button style={{marginTop: '2%',alignSelf:'center', backgroundColor:'#f39c12', width : width-50}} onPress={()=>{this.uploadEvent();}}>
                                  <Text style={{fontSize:18, color: '#fff', marginLeft : width/3.5}} >Let's Share</Text>
                            </Button>

                            {/** MapView END **/}
                          </View>
                        </Content>
                      </View>    
              </View>
            );
        }
}
const styles = StyleSheet.create({
  fitImageWithSize: {
    height: 200,
    width: 200,
  },
  mapView : {
    height : 50,
    width : width-20,
    alignSelf : "center",
    position : "absolute",
    zIndex : 1
  },
  content : {
    color: 'white',
    fontWeight: "bold",
    transform: [{ rotate: '45deg'}],
    left : 4,
    top : 3
  },
  marker0:{
    height : 20,
    width : 20,
    backgroundColor:"#d6081d",
    borderRadius : 10,
    left : 3,
    top : 5
  },
   marker1:{
    width : 30,
    height : 30,
    backgroundColor:"black",
    borderWidth: 1,
    borderColor: 'black',
    transform: [{ rotate: '-45deg'}],
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius : 50
  },
  marker2:{
    width : 40,
    height : 37,
    paddingLeft : 3,
    paddingRight : 3,
  }
});