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
  TouchableHighlight,
  TouchableOpacity,
  View,
  BackHandler
} from 'react-native';
import * as firebase from 'firebase';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import { StackNavigator  } from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import PhotoView from 'react-native-photo-view';
import { Picker, Label, Container,Footer, FooterTab, Form, Item, Input, Content, ListItem, CheckBox, Header, Left, Right, Body, Button, Icon, Title, Subtitle, Thumbnail, CardItem, Card } from 'native-base';
var{width,height}=Dimensions.get('window');
var arr = new Array();

export default class DetailNews extends Component {
  static navigationOptions = {
      header: null
  };
  constructor(props) {
  super(props);
  //var database = firebase.database().ref("userEvent/"+userId+"/unConfirmEvent");//langsung ke child
  this.state=({
        animating: true,
        newsKey : '',
        description : '',
        newsLocation : '',
        newsPicture : '',
        modalVisible : true,
        newsPost : '',
        address : '',
        modalImage : false
  });
  }

  //handle back start on top level
  backPressed = () => {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.onselectDetailNews({ selected: true });
    return true;
  }
  
  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  }
  //handle back end

componentDidMount(){
  var database = firebase.database().ref("news/"+this.props.navigation.state.params.id);
  database.once("value", (dataSnapshot)=>{
    this.setState({
        newsPicture : dataSnapshot.val().newsPhoto,
        description : dataSnapshot.val().newsDescription,
        newsPost : dataSnapshot.val().created_at,
        address : dataSnapshot.val().newsLocation,
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
            <Text style={{color : "black", fontSize : 20, marginLeft : width/3.5}}>News Detail</Text>
        </View>
      <Content>
        <View style={{width : width, flexDirection : 'row', marginTop : -20}}>
              <Thumbnail  source={{uri:this.props.navigation.state.params.photoProfil}}  style={{marginTop : 30, marginLeft : 10}} />
              <Text style={{marginLeft : 5, fontSize : 18, marginTop : 45}}>{this.props.navigation.state.params.username}</Text>
        </View>
        <View style={{marginLeft : 80,width : width-80, height : 1, backgroundColor : 'grey'}}></View>
        <View style={{height : 200, width: width, alignSelf:"center", marginTop : 20}}>
        {/*bagian image*/}
          <TouchableOpacity onPress={()=>{this.setState({modalImage:true});}}>
              <Image
              source={{uri : this.state.newsPicture}}
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
                source={{uri : this.state.newsPicture}}
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
               {this.state.newsPost}
          </Text>
        </View>

        <View style={{flexDirection : 'row', width : width-5, marginLeft : 5,paddingRight : 30}}>
          <Icon name="map" style={{fontSize : 40, color : 'orange'}}/>
          <Text note style={{textAlign: 'justify', marginLeft : 5, color : 'black', fontSize : 14, fontWeight : 'bold'}}>
             {this.state.address}
          </Text>
        
        </View>
      </Content>
  </View>
    );
  }

}

