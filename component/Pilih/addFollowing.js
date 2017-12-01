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
  TouchableWithoutFeedback,
  View,
  BackHandler
} from 'react-native';
import * as firebase from 'firebase';
import { StackNavigator  } from 'react-navigation';
import { Picker, Label, Container,Footer, FooterTab, Form, Item, Input,Tab,Tabs, Content, ListItem, CheckBox, Header, Left, Right,Body, Button, Icon, Title, Subtitle, Thumbnail, CardItem, Card } from 'native-base';
var{width,height}=Dimensions.get('window');

export default class addFollowing extends Component {

static navigationOptions = {
     header : null
  };

constructor(props) {
  super(props);

   this.state=({
        modalVisible : false,
        animating: true,
        listSource : new ListView.DataSource({rowHasChanged : (row1, row2)=> row1 !== row2}),
        name :'',
        photoProfile : '',
        username : '',
        userKey : ''
  });

  this.items=[];

  }

//handle back start on top level
backPressed = () => {
  const { navigation } = this.props;
  navigation.goBack();
  navigation.state.params.onselectFollowing({ selected: true });
  return true;
}

componentWillMount(){
  BackHandler.addEventListener('hardwareBackPress', this.backPressed);
}

componentWillUnmount(){
  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
}
//handle back end

// serach user by username to add as following
searchFollowing=(name)=>{
 
 //jika nama user kosong
  if(name==''){

    this.items=[];

    this.setState({
        listSource : this.state.listSource.cloneWithRows(this.items),
      });

  }
  //jika nama user tidak kosong
  else{

    this.items=[];

    this.setState({
        listSource : this.state.listSource.cloneWithRows(this.items),
      });    

    var userId = firebase.auth().currentUser.uid;

    var database = firebase.database().ref().child("users").orderByChild("username").startAt(name).endAt(name+"\uf8ff");
    
    database.on("child_added",(dataSnapshot)=>{

      if (dataSnapshot.key === userId ) {
        //jika userUID sama sehingga tidak muncul/tdk bisa di polo
      }
      else{
       
        this.items = this.items.filter((x)=>x.id !== dataSnapshot.key);

        this.items.push({id:dataSnapshot.key, username : dataSnapshot.val().username, photoProfile : dataSnapshot.val().photoProfile});
        
        this.setState({
          listSource : this.state.listSource.cloneWithRows(this.items),
        });

      }


    });

  }
}

//untuk menyimpan url foto, username, dan user UID untuk ditampilkan pada modal
userDetail=(photo,username,id)=>{

  this.setState({
    photoProfile : photo,
    username : username,
    modalVisible : true,
    userKey : id
  });

}

// untuk melakukan following
follow=()=>{
  var userId = firebase.auth().currentUser.uid;

  var database = firebase.database().ref().child("following/"+userId);

  database.once("value",(snapshot)=>{

    if(snapshot.hasChild(this.state.userKey)){

      alert("You already following");

    }
    else{

      database = firebase.database().ref().child("following/"+userId+"/"+this.state.userKey);

      this.setState({
        modalVisible : false
      });

      database.set({
      photoProfile : this.state.photoProfile,
      username : this.state.username
      });

    }

  });

}

  render() {
    const { navigate } = this.props.navigation;
    return (
     <Container style={{backgroundColor : "white"}}>
     <Modal
       animationType = {"slide"}
       transparent   = {true}
       visible       = {this.state.modalVisible} onRequestClose ={()=>{this.setState({modalVisible : false});}}
     >
         <TouchableWithoutFeedback onPress={()=>{this.setState({modalVisible : false});}}>
          <View style={{ flex: 1,alignItems: 'center',backgroundColor: 'rgba(0, 0, 0, 0.56)'}}>
            <TouchableWithoutFeedback>
                  <View style={{
                      backgroundColor : 'white',
                      alignItems : "center",
                      width : width-100,
                      height : 150,
                      alignSelf : "center",
                      marginTop : "50%",
                      paddingTop : "2%"
                     
                  }} >

                     <Thumbnail source={{uri: this.state.photoProfile}} />

                     <Text>{this.state.username}</Text>

                     <View style={{width :width-100, height : 40, backgroundColor : "orange", position : "absolute", bottom :0, alignItems : "center", paddingTop :10 }}>
                      <TouchableOpacity onPress={()=>this.follow()}><Text style={{color : "white"}}>Follow</Text></TouchableOpacity>
                     </View>

                     
                  </View>
            </TouchableWithoutFeedback>

          </View>
         </TouchableWithoutFeedback>

     </Modal>
     <View style={{width : width,height : 70, backgroundColor : 'white', borderBottomWidth : 0.3, flexDirection : 'row', paddingTop : 30}}>
          <TouchableOpacity onPress={()=>this.backPressed()}>
              <Icon name="arrow-back" style={{color : 'black', marginLeft : 5}}/>
          </TouchableOpacity>
          <Text style={{color : "black", fontSize : 20, marginLeft : width/4}}>Add Following</Text>
      </View>
      <Item regular style={{alignSelf:"center",height:40,width:"95%", marginTop: '2%'}}>
            <Input onChangeText={(name)=>this.searchFollowing(name)} placeholder='Search... ' style={{fontSize:14}}/>
      </Item>

      <ListView
        style={{marginTop : "2%"}}
        dataSource={this.state.listSource}
        renderRow={this.renderRow.bind(this)}
       />
      
     </Container>
    );
  }

  renderRow(rowData){
    const { navigate } = this.props.navigation;
    return(
        <View style={{marginTop : "2%"}}>
         
          <ListItem avatar onPress={()=>this.userDetail(rowData.photoProfile, rowData.username, rowData.id)}>    

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

