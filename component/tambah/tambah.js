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
  ScrollView,
  View
} from 'react-native';
import * as firebase from 'firebase';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import DatePicker from 'react-native-datepicker';
import { StackNavigator  } from 'react-navigation';
var ImagePicker = require("react-native-image-picker");
var{width,height}=Dimensions.get('window');
import { Picker, Label, Container, Form, Item, Input, Content, ListItem, CheckBox, Header, Left, Right, Body, Button, Icon, Title, Subtitle, Thumbnail, CardItem, Card } from 'native-base';
export default class Tambah extends Component {

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
                imagePath :null, //path gambar untuk ditampilkan pada aplikasi
                imageUploadPath : null, //path gambar untuk diupload ke storage
                title:null,//judul event/news
                description : '', // deskripsi event/news
                selectedItem: undefined, //item yang dipilih pada combobox
                selected1: null,
                placeName : '', //nama tempat yang di cari
                eventAddress : null,
                childKey : null, //menyimpan nama child setelah push
                dateStart : null,
                dateEnd : null,
                priceLength: 0, //menghitung jumlah pembayaran berdasarkan panjang karakter deskripsi
                duration : 0,
                results: {
                    items: []
                }
            }
        }
/***1***Fungsi untuk mengambil nilai pada combo box******/
        onValueChange (value: string) {
            this.setState({
              selectedItem : value
            });
        }
/***1***********END********************/

/***2***header untuk screen tambah event/news******/
        static navigationOptions = {
        title : "Premium Event"
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
    .catch(err => alert(err));
}

uploadEvent=()=>{
  if(this.state.date == null || this.state.title==null || this.state.description==null){
    alert("Please Fill All Field!");
  }
  else{
    var databaseJoinEventAre = firebase.database().ref("joinEventArea/"+this.state.adminArea);
    var slicestring = this.state.description;
    var descriptionSlice = slicestring.slice(0, 30);
    databaseJoinEventAre.push({
      eventTitle : this.state.title,
      eventDescription : descriptionSlice,
      eventLocation : this.state.eventAddress,
    }).then((snapshot)=>{
      //simpan key untuk dibawa ke folde event di database
      this.setState({
        childKey: snapshot.key
      });
    }).then(()=>{
      alert('tesssss');
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
    .catch(err => alert(err));
}


// komponen yang akan dipanggil ketika pertama kali file tambah.js dipanggil
componentDidMount(){
  // this.setState({
  //   myLatitude : this.props.navigation.state.params.myLatitude,
  //   myLongitude : this.props.navigation.state.params.myLongitude,
  // });
  // this.getAdminAreaBasedLocation();
 }

        render() {
           const { navigate } = this.props.navigation;
            return (
                <Container>
                  <Card style={{height:'100%'}}>
                        <CardItem style={{paddingBottom:'3%'}}>
                            <Left>
                                <Thumbnail source={{uri : this.props.navigation.state.params.userPhoto}} />
                                <Body>
                                    <Text style={{color:'#2f2f2f'}}>{this.props.navigation.state.params.user}</Text>
                                </Body>
                            </Left>
                        </CardItem>

                        <View style={{backgroundColor:'#2f2f2f', height:0.5, width:'90%', alignSelf:'center'}}></View>
                       <ScrollView>
                          <CardItem>
                              <Body>

                      {/* image yang dipilih dan tombol tambah untuk menambahkan gambar dari device*/}
                                <Image style={{height:200,width:200, resizeMode:"cover",alignSelf:'center'}} source={this.state.imagePath} />
                                <Button onPress={()=>this.GetImagePath()}
                                 style={{alignSelf:'center', backgroundColor:'#f39c12', marginTop: '6%'}}>
                                  <Text style={{fontSize:32, color: '#fff'}}>+</Text>
                                </Button>
                                {/*
                                <Text style={{marginTop: '6%'}}>Choose Category</Text>
                                <Picker
                                  mode="dropdown"
                                  style={{backgroundColor:'#f9f9f9', width:'100%', height: 40, marginTop: '1%'}}
                                  selectedValue={this.state.selected1}
                                  onValueChange={this.onValueChange.bind(this)}
                                >
                                  <Picker.Item label="Event" value="Event" style={{fontSize:10}}/>
                                  <Picker.Item label="News" value="News" style={{fontSize:10}}/>
                                </Picker >
                                */}
                              {/* MEMBUAT DATEPICKER */}
                                <Item regular style={{height:40, marginTop: '2%'}}>
                                  <Input maxLength={50} placeholder='Write a Title ... ' style={{fontSize:14}} onChangeText={(title)=>this.setState({title})}/>
                                </Item>

                                <Item regular style={{marginTop: '2%'}}>
                                  <Input onChangeText={(description)=>{
                                    this.setState({description});
                                    if(this.state.description.length <=20){
                                      this.setState({
                                        priceLength : 5000
                                      });
                                    }
                                    else{
                                      this.setState({
                                        priceLength : 10000
                                      });
                                    }
                                  }} style={{fontSize:14, height: 200}} placeholder='Write a Description ... '  multiline = {true} numberOfLines = {4}/>
                                </Item>

                                {/*menghitung panjang karakter*/}

                              </Body>


                          </CardItem>
                          <Item regular style={{height:40, marginLeft:'5%', marginRight:'5%', fontSize:14}}>
                           <Label style={{marginLeft:"2%"}}>Total Day to Promotion : </Label>
                           <Input onChangeText={(duration)=>this.setState({duration})} />
                           <Label style={{marginRight:'5%'}}> Days </Label>
                         </Item>

                           <Text style={{marginTop: '2%', marginLeft:'5%'}}>Event Date</Text>
                           <DatePicker
                             style={{width: 200, marginTop:"2%", marginLeft:'5%'}}
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
                             style={{width: 200, marginTop:"2%", marginLeft:'5%'}}
                             date={this.state.dateEnd}
                             mode="date"
                             placeholder="End Date"
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
                             onDateChange={(date) => {this.setState({dateEnd: date})}}
                           />
                          <Container>
                          <Text style={{marginLeft:'5%'}}>Set your event/news Location by search or drag the marker on Map</Text>
                            <Item regular style={{alignSelf:"center",height:40,width:"95%", marginTop: '2%', marginLeft:'5%'}}>
                                  <Input placeholder='Write a Place ... ' style={{fontSize:14}} onChangeText={(placeName)=>this.setState({placeName})}/>
                            </Item>
                            <Button style={{marginTop: '2%',alignSelf:'center', backgroundColor:'#f39c12'}}>
                                  <Text style={{fontSize:12, color: '#fff',alignSelf:'center',}} onPress={()=>this.searchLocation()}>Search</Text>
                            </Button>
                             {/** MapView START **/}
                            <MapView style={{height: '50%', width:width,marginTop: '2%'}}
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
                                title = "Your Event Location"
                              >
                              </MapView.Marker>
                              {/** membuat koordinat END **/}

                            </MapView>
                            <Button style={{marginTop: '2%',alignSelf:'center', backgroundColor:'#f39c12'}} onPress={()=>{
                              if(this.state.duration > 0){
                                  navigate('Share',{
                                  duration: this.state.duration,
                                  dateStart : this.state.dateStart,
                                  dateEnd : this.state.dateEnd,
                                  title : this.state.title ,
                                  description : this.state.description,
                                  priceLength : this.state.priceLength,
                                  imageUploadPath : this.state.imageUploadPath,
                                  locationLatitude : this.state.myLatitude,
                                  locationLongitude : this.state.myLongitude,
                                  eventLocation : this.state.eventAddress,
                                  adminArea : this.state.adminArea
                                  }
                                );
                              }
                              else{
                                alert(this.state.duration);

                              }

                            }}>
                                  <Text style={{fontSize:12, color: '#fff',alignSelf:'center',}} >Lets Share</Text>
                            </Button>
                            {/** MapView END **/}
                          </Container>
                        </ScrollView>
                   </Card>
              </Container>
            );
        }
}
