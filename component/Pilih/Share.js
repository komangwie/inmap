import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import * as firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import { StackNavigator  } from 'react-navigation';
import { Header,Container, Input, Content,Button, Icon,Tab,Tabs,Thumbnail} from 'native-base';
var{width,height}=Dimensions.get('window');

const polyfill = RNFetchBlob.polyfill;

window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;

export default class Share extends Component {
  static navigationOptions = {
      title : "Share Yours"
  };
  constructor(props) {
    super(props);
    this.state = {
      childKey : '',
      imageUrl : ''
    };
  }

  uploadPremiumEvent=()=>{
      //ambil datetime now
      let today = new Date();
      let Times = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      
      let userId = firebase.auth().currentUser.uid;

      //upload data event ke node purchaseEventMin
      var database = firebase.database().ref("purchaseEventMin/"+this.props.navigation.state.params.adminArea);
      database.push({
        created_at : Times,
        eventDuration : this.props.navigation.state.params.duration,
        eventLocation : this.props.navigation.state.params.eventLocation,
        eventTitle : this.props.navigation.state.params.title,
        eventPrice : (this.props.navigation.state.params.duration*10000)+(this.props.navigation.state.params.priceLength)
      }).then((snapshot)=>{
        this.setState({
          childKey : snapshot.key //ambil kode event untuk nama image event/purchaseEvent/userEvent
        });
          //tambahkan ke node userevent untuk event premium
          var databaseUserEvent = firebase.database().ref("userEvent/"+userId+"/unConfirmEvent").child(snapshot.key);
          databaseUserEvent.set({
            created_at : Times,
            eventTitle : this.props.navigation.state.params.title,
            eventAdminArea : this.props.navigation.state.params.adminArea
          });

      }).then(()=>{
        //upload image ke storage
        let path =this.props.navigation.state.params.imageUploadPath;
        Blob.build(RNFetchBlob.wrap(path), { type : 'image/jpeg' })
            .then((blob) => firebase.storage()
                    .ref("users/"+userId+"/eventPhoto").child(this.state.childKey)
                    .put(blob, { contentType : 'image/png' })
            )
            .then((snapshot) => { 
                  //ambil url foto event yg di upload
                  let storage = firebase.storage().ref("users/"+userId+"/eventPhoto").child(this.state.childKey);
                  storage.getDownloadURL().then((url)=>{
                    //tambahkan ke database node purchaseEvent
                      var databasePremiumEvent = firebase.database().ref("purchaseEvent/").child(this.state.childKey);
                      databasePremiumEvent.set({
                      created_at : Times,
                      eventDateStart : this.props.navigation.state.params.dateStart,
                      eventDateEnd : this.props.navigation.state.params.dateEnd,
                      eventDescription : this.props.navigation.state.params.description,
                      eventLocation : this.props.navigation.state.params.eventLocation,
                      eventTitle : this.props.navigation.state.params.title,
                      eventPhoto : url,
                      locationLatitude : this.props.navigation.state.params.locationLatitude,
                      locationLongitude : this.props.navigation.state.params.locationLongitude
                    })
                  });
             });
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        
        <Text>Duration : {this.props.navigation.state.params.duration} Days = {this.props.navigation.state.params.duration*10000} </Text>
        <Text>Date : {this.props.navigation.state.params.dateStart} - {this.props.navigation.state.params.dateEnd}</Text>
        <Text>Character : {this.props.navigation.state.params.description.length} Char = Rp {this.props.navigation.state.params.priceLength}</Text>
        <Text>Total = Rp {(this.props.navigation.state.params.duration*10000)+(this.props.navigation.state.params.priceLength)} </Text>
        <Button style={{marginTop: '2%',alignSelf:'center', backgroundColor:'#f39c12'}} onPress={()=>{this.uploadPremiumEvent(); navigate('ListConfirmEvent');}}>
            <Text style={{fontSize:12, color: '#fff',alignSelf:'center',}} >Continue</Text>
        </Button>

      </View>
    );
  }
}