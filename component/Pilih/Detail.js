import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Modal,
  ListView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  View,
  BackHandler
} from 'react-native';
import * as firebase from 'firebase';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import DatePicker from 'react-native-datepicker';
import FitImage from 'react-native-fit-image';
import PhotoView from 'react-native-photo-view';
import { StackNavigator  } from 'react-navigation';
import getDirections from 'react-native-google-maps-directions';
import { Picker, Label, Container,Footer, FooterTab, Form, Item, Input, Content, ListItem, CheckBox, Header, Left, Right, Body, Button, Icon, Title, Subtitle, Thumbnail, CardItem, Card , Fab} from 'native-base';
var{width,height}=Dimensions.get('window');
var arr = new Array();

export default class Detail extends Component {
  static navigationOptions = {
      header: null
  };
  constructor(props) {
  super(props);
  //var database = firebase.database().ref("userEvent/"+userId+"/unConfirmEvent");//langsung ke child
  this.state=({
        animating: true,
        eventKey : '',
        description : '',
        eventLocation : '',
        eventPicture : 'this is uri of picture',
        modalVisible : true,
        dateStart : '',
        dateEnd : '',
        address : '',
        modalImage : false
  });
  }

  //open google maps
  handleGetDirections = () => {
    const data = {
       source: {
        latitude: this.props.navigation.state.params.myLatitude,
        longitude: this.props.navigation.state.params.myLongitude
      },
      destination: {
        latitude: this.props.navigation.state.params.destinationLat,
        longitude:  this.props.navigation.state.params.destinationLong
      },
      params: [
        {
          key: "dirflg",
          value: "w"
        }
      ]
    }
 
    getDirections(data)
  }
  //open google maps end

/***1***Fungsi untuk mengambil nilai pada combo box******/
  onValueChange (value: string) {
      this.setState({
          selectedItem : value
      });
  }
/***1***********END********************/

componentWillMount(){
  BackHandler.addEventListener('hardwareBackPress', this.backPressed);
}

componentWillUnmount(){
  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
}

backPressed = () => {
  const { navigation } = this.props;
  navigation.goBack();
  navigation.state.params.onSelect({ selected: true });
  return true;
}

componentDidMount(){
  var database = firebase.database().ref("freeEvent/"+this.props.navigation.state.params.id);
  database.on("value", (dataSnapshot)=>{
    this.setState({
        eventPicture : dataSnapshot.val().eventPhoto,
        description : dataSnapshot.val().eventDescription,
        dateStart : dataSnapshot.val().eventDateStart,
        dateEnd : dataSnapshot.val().eventDateEnd,
        address : dataSnapshot.val().eventLocation,
        modalVisible : false
    });
  });
}

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{height : height, width : width, backgroundColor : 'white'}}>
           <View style={{width : width,height : 80, backgroundColor : 'white', borderBottomWidth : 0.3, flexDirection : 'row', paddingTop : 40}}>
                <TouchableOpacity onPress={()=>this.backPressed()}>
                    <Icon name="arrow-back" style={{color : 'black', marginLeft : 10}}/>
                </TouchableOpacity>
                <Text style={{color : "black", fontSize : 20, marginLeft : width/3.5}}>Event Detail</Text>
            </View>
          <Content>
            <View style={{width : width, flexDirection : 'row', marginTop : -20}}>
                 <Thumbnail source={{uri:this.props.navigation.state.params.photoProfil}} style={{marginTop : 30, marginLeft : 10}} />
                 <Text style={{marginLeft : 5, fontSize : 18, marginTop : 45}}>{this.props.navigation.state.params.username}</Text>
            </View>
            <View style={{marginLeft : 80,width : width-80, height : 1, backgroundColor : 'grey'}}></View>
            <View style={{height : 200, width: width, alignSelf:"center", marginTop : 20}}>
            {/*bagian image*/}
              <TouchableOpacity onPress={()=>{this.setState({modalImage:true});}}>
                  <Image
                  source={{uri : this.state.eventPicture}}
                    resizeMode="contain"
                  style={{height :200, width :width, alignSelf : "center"}}
                  />
              </TouchableOpacity>
                
                {/*menampilkan modal untuk melihat gambar lebih jelas*/}
                <Modal
                    animationType = {"fade"}
                    transparent   = {false}
                    visible       = {this.state.modalImage} onRequestClose ={()=>{this.setState({modalImage : false});}}
                >
                  <View style={{flex : 1, backgroundColor : "black", alignSelf:"center"}}>

                    <PhotoView
                    source={{uri : this.state.eventPicture}}
                    minimumZoomScale={0.5}
                    maximumZoomScale={3}
                    androidScaleType="center"r
                    style={{width: width, height: height}} />
                  </View>
                </Modal>
                {/*modal end*/}
              </View>
              <Text style={{marginTop:'2%', fontSize: 18,  color : "black", fontWeight: "bold", textAlign : "center", alignSelf : "center"}} >
                {this.props.navigation.state.params.title}
              </Text>

            <Text note style={{textAlign: 'justify',marginTop:'2%', marginLeft : 5, color : 'black'}}>
                {this.state.description}
            </Text>
            <View style={{width : width, height : 0.2, backgroundColor : 'grey', marginTop : 10}}></View>
            <View style={{flexDirection : 'row', marginTop : 10, marginLeft : 5}}>
              <Icon name="calendar" style={{fontSize : 40, color : 'orange'}}/>
              <Text note style={{textAlign: 'justify',marginTop:10,  color : "black", fontWeight: "bold", marginLeft : 5, fontSize : 16}}>
                  {this.state.dateStart} - {this.state.dateEnd}
              </Text>
            </View>

            <View style={{flexDirection : 'row', width : width-5, marginLeft : 5,paddingRight : 30}}>
              <Icon name="map" style={{fontSize : 40, color : 'orange'}}/>
              <Text note style={{textAlign: 'justify', marginLeft : 5, color : 'black', fontSize : 14, fontWeight : 'bold'}}>
                {this.state.address}
              </Text>
            
            </View>

            <TouchableOpacity onPress={()=>this.handleGetDirections()}>
              <View style={{marginTop : 10,width : width, height : 50, backgroundColor : 'orange', flexDirection : 'row', paddingLeft : width/3.2}}>
                  <Icon style={{color : 'white', fontSize : 40, marginTop : 5}} name='navigate'/>
                  <Text style={{color : 'white', fontSize : 18, marginTop : 15}}>Go to location</Text>
              </View>
            </TouchableOpacity>
          </Content>
      </View>
    );
  }

}

