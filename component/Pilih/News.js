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
  Image,
  TouchableOpacity,
  ScrollView,
  View,
  BackHandler,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import * as firebase from 'firebase';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import DatePicker from 'react-native-datepicker';
import RNFetchBlob from 'react-native-fetch-blob';
import { StackNavigator  } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import ImageResizer from 'react-native-image-resizer';
var ImagePicker = require("react-native-image-picker");
import PhotoView from 'react-native-photo-view';
var{width,height}=Dimensions.get('window');
const polyfill = RNFetchBlob.polyfill;

window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;

import { Picker, Container, Item, Input, Content, ListItem, CheckBox, Header, Left, Right, Body, Button, Icon, Title, Subtitle, Thumbnail, CardItem, Card, Fab } from 'native-base';
export default class News extends Component {

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
                subAdminArea : null, // mengambil kabupaten
                subAdminAreaLatitude : null,//mengambil koordinat kabupaten
                subAdminAreaLongitude : null,//mengambil koordinat kabupaten
                imagePath :null, //path gambar untuk ditampilkan pada aplikasi
                imageUploadPath : null, //path gambar untuk diupload ke storage
                resizeImageUploadPath : "uri",
                title:null,//judul event/news
                description : null, // deskripsi event/news
                placeName : '', //nama tempat yang di cari
                eventAddress : null,
                childKey : null, //menyimpan nama child setelah push
                dateStart : null,
                dateEnd : null,
                url : '',
                username : '',
                modalVisible : false,
                animating : true,
                modalImage : false
            }
             this.userId = firebase.auth().currentUser.uid;
        }
backPressed = () => {
  const { navigation } = this.props;
  navigation.goBack();
  navigation.state.params.onSelect({ selectedNews: true });
  return true;
}

componentWillMount(){
  BackHandler.addEventListener('hardwareBackPress', this.backPressed);
}

componentWillUnmount(){
  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
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
                  imagePath : source, //simpan alamat gambar untuk ditampilkan pada aplikasi --obj--
                  imageUploadPath : source.uri //simpan alamat gambar untuk di upload ke firebase storage --url--
                });
              }
            });
         }
/***3***************END********************************************************************************************/

resizeImage=()=>{
    ImageResizer.createResizedImage(this.state.imageUploadPath, 110, 70, "JPEG", 100,0, null).then((response) => {
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
   // alert("Error has Occurred");
    Alert.alert(
      'In Map',
      'Error has occured!',
      [
        {text: 'OK'}],
      { cancelable: false }
    );
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
          eventAddress : res[0].formattedAddress,
          subAdminArea : res[0].subAdminArea
        });
       // alert(res[0].formattedAddress);

    })
    .catch(err => {
    Alert.alert(
      'In Map',
      'Cannot find location!',
      [
        {text: 'OK'}],
      { cancelable: false }
    );
  });
}
//
uploadEvent=()=>{
  if(this.state.title==null || this.state.description==null){
    Alert.alert(
      'In Map',
      'Please fill all field!',
      [
        {text: 'OK'}],
      { cancelable: false }
    );
  }
  else{//
    this.setState({modalVisible : true});
    this.resizeImage();
    let today = new Date();
    let Times = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let sortTime = -1*today.getTime();// mengambil waktu sekarang utuk sorting
    let userId = this.userId;

    var database = firebase.database().ref("showNews/"+this.state.adminArea+"/"+this.state.subAdminArea);
    var slicestring = this.state.description;
    var descriptionSlice = slicestring.slice(0, 20);

    database.push({
      sortTime: sortTime,
      userUid : userId,
      username : this.state.username,
      newsTitle : this.state.title,
      newsDescription : descriptionSlice,
      newsLocation : this.state.eventAddress,
      userProfilPhoto : this.props.navigation.state.params.userPhoto,
      locationLatitude : this.state.myLatitude,
      locatonLongitude : this.state.myLongitude
    }).then((snapshot)=>{
      this.setState({
        childKey: snapshot.key
      });
      let path =this.state.imageUploadPath;
      Blob.build(RNFetchBlob.wrap(path), { type : 'image/jpeg' })
            .then((blob) => firebase.storage()
                    .ref("users/"+userId+"/newsPhotoOriginal").child(snapshot.key)
                    .put(blob, { contentType : 'image/png' })
            )
            .then((snapshot) => { 
                  let storage = firebase.storage().ref("users/"+userId+"/newsPhotoOriginal").child(this.state.childKey);
                  storage.getDownloadURL().then((url)=>{

                      database = firebase.database().ref("news").child(this.state.childKey);
                      database.set({
                      created_at : Times,
                      newsDescription : this.state.description,
                      newsLocation : this.state.eventAddress,
                      newsTitle : this.state.title,
                      newsPhoto : url,
                      locationLatitude : this.state.myLatitude,
                      locationLongitude : this.state.myLongitude

                    }).then(()=>{
                        let resizePath = this.state.resizeImageUploadPath;
                        Blob.build(RNFetchBlob.wrap(resizePath), { type : 'image/jpeg' })
                        .then((blob) => firebase.storage()
                                .ref("users/"+userId+"/newsPhotoResized").child(this.state.childKey)
                                .put(blob, { contentType : 'image/png' })
                        ).then(()=>{
                          var storage = firebase.storage().ref("users/"+userId+"/newsPhotoResized").child(this.state.childKey);
                           storage.getDownloadURL().then((url)=>{
                            this.setState({
                              url : url
                            });
                            database = firebase.database().ref("userNews/"+userId).child(this.state.childKey);
                            database.set({
                              sortTime: sortTime,
                              newsTitle : this.state.title,
                              newsDescription : descriptionSlice,
                              created_at : Times,
                              newsPhoto : url
                            }).then(()=>{
                              database = firebase.database().ref("showNews/"+this.state.adminArea+"/"+this.state.subAdminArea).child(this.state.childKey);
                              database.update({
                                imageResized : this.state.url
                              });
                            });
                           });
                        });
                    }).then(()=>{
                      
                        database = firebase.database().ref("newsSubAdminArea/").child(this.state.subAdminArea);
                
                        Geocoder.geocodeAddress(this.state.subAdminArea).then(res => {
                        // res is an Array of geocoding object (see below)
                        database.set({
                          latitude: res[0].position.lat,
                          longitude: res[0].position.lng
                        });
                         
                      })
                      .catch(err => alert(err));

                    }).then(()=>{
                      const { navigate } = this.props.navigation;
                      this.setState({modalVisible : false});
                      navigate('Dashboard');
                    });
                    
                  });
             });
    });
    //
  }
}
//


//mncari nama jalan berdasarkan koordinat
getAdminAreaBasedLocation=()=>{
  var area = {
    lat : this.state.myLatitude,
    lng : this.state.myLongitude
  };
  Geocoder.geocodePosition(area).then(res => {
        // res is an Array of geocoding object (see below)
        if(res[0].subAdminArea == null || res[0].subAdminArea === null ){
            alert("Your Regency Not Found!");
        }
        else{
          // this.setState({
          // adminArea : res[0].adminArea,
          // eventAddress : res[0].formattedAddress,
          // subAdminArea : res[0].subAdminArea
          // }); 

          //get subadminarea lat long
          Geocoder.geocodeAddress(res[0].subAdminArea).then(res => {
          // res is an Array of geocoding object (see below)
          this.setState({
            subAdminAreaLatitude : res[0].position.lat,
            subAdminAreaLongitude : res[0].position.lng,
            adminArea : res[0].adminArea,
            eventAddress : res[0].formattedAddress,
            subAdminArea : res[0].subAdminArea
          });
          //end of get subadminarea lat long
       // alert(res[0].formattedAddress);

    })
    .catch(err => alert("Your Location Undetected"));
          //alert(res[0].subAdminArea);
        }
    })
    .catch(err => {alert("Your Location Undetected");
      this.setState({
        eventAddress : null
      });
  });
}

backPressed = () => {
  const { navigation } = this.props;
  navigation.goBack();
  return true;
}

// komponen yang akan dipanggil ketika pertama kali file tambah.js dipanggil
componentDidMount(){
  BackHandler.addEventListener('hardwareBackPress', this.backPressed);
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

 focusToMarker=()=>{
  this.setState({
    myLatitude : this.state.myLatitude,
    myLongitude : this.state.myLongitude
  });
}


        render() {
           const { navigate } = this.props.navigation;
           const  backAction  = NavigationActions.back({
            key : 1
           });
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
                      <Text style={{color : "black", fontSize : 20, marginLeft : width/3.3}}>Your News</Text>
                  </View>
                  <View style={{width : width, backgroundColor : 'white', height : height}}> 
                     <Content>

                      {/* image yang dipilih dan tombol tambah untuk menambahkan gambar dari device*/}
                              <TouchableOpacity onPress={()=>this.setState({modalImage : true})}>
                                <Image style={{height:200,width:200, resizeMode:"cover",alignSelf:'center', marginTop : 10}} source={this.state.imagePath} /> 
                              </TouchableOpacity>
                                <Button onPress={()=>this.GetImagePath()}
                                style={{alignSelf:'center', backgroundColor:'#f39c12', marginTop: '10%', width : width-50}}>
                                <Icon name="camera" style={{color : 'white', marginLeft : width/2.8}}/>
                                </Button>

                               
                                <Input maxLength={100} placeholder='News Title ... ' style={{fontSize:14, borderColor : 'black', borderWidth : 1, marginTop : "2%", width : width-50, alignSelf : 'center'}}  onChangeText={(title)=>this.setState({title})}/>
                               
                                
                                <TextInput maxLength={1000} onChangeText={(description)=>
                                    this.setState({description})} underlineColorAndroid="transparent" style={{fontSize:14, height: 200, width : width-50, borderColor : 'black', borderWidth : 1, alignSelf : 'center', marginTop : "2%"}} placeholder='News Description ... '  multiline = {true} numberOfLines = {4}/>
                                
                             
                           <View style={{width : width, height : 450, marginTop : 5}}>

                            <View>

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
                                title = "Your news location"
                                description = "long press to drag the marker"
                              >
                              <View style={styles.marker2}>
                              <View style={styles.marker1}>
                                <View style={styles.markerNews}>
                                 <Text style={styles.content}>N</Text>
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
                            
                            <Button  style={{marginTop: '2%',alignSelf:'center', backgroundColor:'#f39c12', width : width-50}} onPress={()=>{

                              if(this.state.title == null || this.state.description == null || this.state.eventAddress == null || this.state.imageUploadPath == null){
                                alert("Please fill all filed");
                              }
                              else{
                                this.uploadEvent();
                              }

                             }}>
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
  mapView : {
    height : 50,
    width : width-20,
    alignSelf : "center",
    position : "absolute",
    zIndex : 1
  },
  marker0:{
    height : 20,
    width : 20,
    backgroundColor:"#d6081d",
    borderRadius : 10,
    left : 4,
    top : 4
  },
   markerNews:{
    height : 20,
    width : 20,
    backgroundColor:"#f9d507",
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
  },
   content : {
    color: 'white',
    fontWeight: "bold",
    transform: [{ rotate: '45deg'}],
    left : 4,
    top : 3
  }
});
