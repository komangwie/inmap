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
import DatePicker from 'react-native-datepicker';
import { StackNavigator  } from 'react-navigation';
import {Item, Input,Tab,Tabs, Content, ListItem, Header, Left, Right,Body, Button, Icon, Title, Subtitle, Thumbnail, CardItem, Card, Fab, Container} from 'native-base';
var{width,height}=Dimensions.get('window');
var arr = new Array();

export default class Following extends Component {
static navigationOptions = {
      header : null
       };
constructor(props) {
  super(props);
  //var database = firebase.database().ref("userEvent/"+userId+"/unConfirmEvent");//langsung ke child
  this.state=({
        modalVisible : true,
        animating: true,
        listSource : new ListView.DataSource({rowHasChanged : (row1, row2)=> row1 !== row2}),
        selected : false
  });
  this.items=[];
  }

//handle back start on top level
onselectFollowing = data => {
  this.setState(data);
}

gotoAddFollowing=()=>{
  const { navigate } = this.props.navigation;
  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  navigate("addFollowing",{onselectFollowing : this.onselectFollowing});
}

backPressed = () => {
  const { navigation } = this.props;
  navigation.goBack();
  navigation.state.params.onselectNewsDashboard({ selected: true });
  return true;
}

componentWillMount(){
  BackHandler.addEventListener('hardwareBackPress', this.backPressed);
}

componentWillUpdate(){
  BackHandler.addEventListener('hardwareBackPress', this.backPressed);
}

componentWillUnmount(){
  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
}
//handle back end

componentDidMount(){
  let userId = firebase.auth().currentUser.uid;
  var database = firebase.database().ref("following/"+userId);//langsung ke child
  database.on("value",(dataSnapshot)=>{
    if(dataSnapshot.val()==null){
      this.setState({modalVisible: false});
    }
    else{
    }
  });
     
  database.on("child_added", (dataSnapshot)=>{
  this.items.push({id:dataSnapshot.key, username : dataSnapshot.val().username, photoProfile : dataSnapshot.val().photoProfile});
  this.setState({
    listSource : this.state.listSource.cloneWithRows(this.items),
    modalVisible: false,
    textVisible:false
  });

 });

database.on("child_removed", (dataSnapshot)=>{
  this.items = this.items.filter((x)=>x.id !== dataSnapshot.key);
  this.setState({
    listSource : this.state.listSource.cloneWithRows(this.items),
    modalVisible: false,
    textVisible:false
  });
});

  componentDidMount = () => this.closeActivityIndicator();
}

  render() {
      const { navigate } = this.props.navigation;
    return (
    <Container style={{backgroundColor : "white"}}>
    
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
      <View style={{width : width,height : 70, backgroundColor : 'white', borderBottomWidth : 0.3, flexDirection : 'row', paddingTop : 30}}>
          <TouchableOpacity onPress={()=>this.backPressed()}>
              <Icon name="arrow-back" style={{color : 'black', marginLeft : 5}}/>
          </TouchableOpacity>
          <Text style={{color : "black", fontSize : 20, marginLeft : width/3}}>Following</Text>
      </View>
      <ListView
        style={{marginTop : "2%"}}
        dataSource={this.state.listSource}
        renderRow={this.renderRow.bind(this)}
       />
     
      <Fab style={{backgroundColor : "orange"}}
          onPress={()=>this.gotoAddFollowing()}
      >
          <Text>+</Text>
      </Fab>
    </Container>
    );
  }

  renderRow(rowData){
    const { navigate } = this.props.navigation;
    return(
        <View style={{marginTop : "2%"}}>
          <ListItem avatar >    

          <Thumbnail source={{uri:rowData.photoProfile}} />

          <Left>

             <Body>
                  <Text note>{rowData.username}</Text>
             </Body>

          </Left>   

          </ListItem>
        </View>

      );
  }

}

