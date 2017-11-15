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
  View
} from 'react-native';
import * as firebase from 'firebase';
import { StackNavigator  } from 'react-navigation';
import { Header,Container, Input,Left, Right, Body, Content,Button, Icon,Tab,Tabs,Thumbnail,ListItem, Item, Picker } from 'native-base';
var{width,height}=Dimensions.get('window');
var arr = new Array();

export default class ConfirmEvent extends Component {
  static navigationOptions = {
      title : "Confirm Your Event"
  };
  constructor(props) {
  super(props);
  //var database = firebase.database().ref("userEvent/"+userId+"/unConfirmEvent");//langsung ke child
  this.state=({
        animating: true,
        eventKey : '',
        eventAdminArea : '',
        created_at : '',
        eventDuration : '',
        eventLocation : '',
        eventTitle : '',
        eventPrice : '',
        modalVisible : true,
        selectedItem: "BRI", 
        RekeningNumber : ''
  });
  }

/***1***Fungsi untuk mengambil nilai pada combo box******/
  onValueChange (value: string) {
      this.setState({
          selectedItem : value
      });
  }
/***1***********END********************/


//closeActivityIndicator = () => setTimeout(() => this.setState({animating:false}),20000)
//componentDidMount = () => this.closeActivityIndicator()

confirmPayMent=()=>{

  this.setState({
    modalVisible : true
  });

  let today = new Date();
  let Times = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let userId = firebase.auth().currentUser.uid;
  
  var database = firebase.database().ref("ConfirmEvent/"+this.props.navigation.state.params.eventKey);
  database.set({
    confirmAT : Times,
    RekeningNumber : this.state.RekeningNumber,
    InMapRekening : this.state.selectedItem,
    eventTitle : this.state.eventTitle,
    EventAdminArea : this.props.navigation.state.params.eventAdminArea,
   }).then(()=>{
      var database = firebase.database().ref("userEvent/"+userId+"/unConfirmEvent").child(this.props.navigation.state.params.eventKey);
      database.remove();
      this.setState({
      modalVisible : false
      });
      alert("Thanks for Your Purchase, We will Check Your Confirmation As Soon As we Can");
   });
}

DeleteList=()=>{
  let userId = firebase.auth().currentUser.uid;
  var database = firebase.database().ref("userEvent/"+userId+"/unConfirmEvent").child(this.props.navigation.state.params.eventKey);
  database.remove();
}

componentWillMount(){
  var database = firebase.database().ref("purchaseEventMin/"+this.props.navigation.state.params.eventAdminArea+"/"+this.props.navigation.state.params.eventKey);//langsung ke child
  database.on("value",(dataSnapshot)=>{
      this.setState({
        created_at : dataSnapshot.val().created_at,
        eventDuration : dataSnapshot.val().eventDuration,
        eventLocation : dataSnapshot.val().eventLocation,
        eventTitle : dataSnapshot.val().eventTitle,
        eventPrice : dataSnapshot.val().eventPrice,
        modalVisible : false
      });
  });
}

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
       <Modal
                animationType = {"slide"}
                transparent   = {true}
                visible       = {this.state.modalVisible} onRequestClose ={()=>{console.log('closed')}}
            >
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
          </Modal>
        <Text>Create At : {this.state.created_at}</Text>
        <Text>Event Duration : {this.state.eventDuration}</Text>
        <Text>Event Location : {this.state.eventLocation}</Text>
        <Text>Event Title : {this.state.eventTitle}</Text>
        <Text>Price Total : {this.state.eventPrice}</Text>
        
        <Item regular style={{height:40, marginTop: '2%'}}>
            <Input maxLength={50} placeholder='Rekenign Number' style={{fontSize:14}} onChangeText={(RekeningNumber)=>this.setState({RekeningNumber})}/>
        </Item>
        <Text>Send To Our Rekening Bellow :</Text>
        <Picker 
          mode="dropdown" 
          style={{backgroundColor:'#f9f9f9', width:'100%', height: 40, marginTop: '1%'}}
          selectedValue={this.state.selectedItem}
          onValueChange={this.onValueChange.bind(this)}
        > 
          <Picker.Item label="BRI (9543975947935)" value="BRI" style={{fontSize:10}}/> 
          <Picker.Item label="Mandiri (573485673485)" value="MANDIRI" style={{fontSize:10}}/> 
        </Picker >
         <Button onPress={()=>{this.confirmPayMent(); navigate('Dashboard');}} style={{marginTop: '2%',alignSelf:'center', backgroundColor:'#f39c12'}}>
            <Text style={{fontSize:12, color: '#fff',alignSelf:'center',}} >Confrim</Text>
        </Button>
        <Button onPress={()=>{this.DeleteList(); navigate('ListConfirmEvent');}} style={{marginTop: '2%',alignSelf:'center', backgroundColor:'#f39c12'}}>
            <Text style={{fontSize:12, color: '#fff',alignSelf:'center',}} >DELETE</Text>
        </Button>
      </View>
    );
  }

}

