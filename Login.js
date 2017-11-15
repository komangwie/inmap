import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';
import { StackNavigator, navigate } from 'react-navigation';
import * as firebase from 'firebase';
import * as GLOBAL from './GLOBAL';
import Login_component from './login_component';
import { Container, Content, InputGroup, Grid, Col, Form, Item, Input, Label, Badge, Footer, FooterTab, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
var config = {
    apiKey: "AIzaSyDRf2U-8uMhD4uCivniCsYlFCpRqpdKMzY",
    authDomain: "inmap-2a392.firebaseapp.com",
    databaseURL: "https://inmap-2a392.firebaseio.com",
    projectId: "inmap-2a392",
    storageBucket: "inmap-2a392.appspot.com",
    messagingSenderId: "804704860207"
  };
 const firebaseApp = firebase.initializeApp(config);
 
export default class Login extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading : true,
      email : null,
      password:null,
      uid:null,
      modalVisible:false,
      animating : true
    };
  }
   signup(){
  firebaseApp.auth().createUserWithEmailAndPassword(this.state.email,this.state.password).then(() => {
      alert('create success');
      this.login();
    }).catch((error) => {
      alert("error " + error.message );
    });
}

 login(){
     firebaseApp.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then(() => {
      alert('login succuess');
    }).catch((error) => {
      alert("error " + error.message );
    });
  }
   
  logout(){
    firebase.auth().signOut().then(function() {
   alert("Logged out!")
    }, function(error) {
   console.log(error.code);
   console.log(error.message);
});
  }

  cekuser(){
    var user = firebase.auth().currentUser;
    var new_uid;
    if (user != null) {
       this.setState({
        uid:user.uid
      });
    new_uid= user.uid;
     this.writeDB(new_uid);
    }
    else{
      alert('user tidak login');
    }
    
  }

  cekuid(){
    alert(this.state.uid);
  }
  writeDB(a){
    alert(a);
    var database = firebase.database();
    database.ref('users').child(""+a+"").set({
      username : 'Komangwie'
    });
  }
  tes(){
    this.navigation.navigate('Signup');
  }
   render(){
    const { navigate } = this.props.navigation;
    return(
      <Container style={{alignItems:'center',backgroundColor:'#e6e6e6'}}>

      <Modal animationType={"slide"} transparent = {true} 
          visible ={this.state.modalVisible} onRequestClose ={()=>{console.log('closed')}}
        >
          <View style={{alignItems:'center',marginTop:'70%'}} >
             <ActivityIndicator
                animating={this.state.animating}
                color="#bc2b78"
                size = 'large'
             />
          </View>
        </Modal>

      <Content >
      <View>
             <Image style={{width: 330, height: 330}}
               source={{uri:'https://firebasestorage.googleapis.com/v0/b/inmap-2a392.appspot.com/o/logo.png?alt=media&token=743137b7-04a0-42c6-b745-70caf955a526'}}/>
      </View>
          <Form>
              <Item regular style={{backgroundColor:'#c0c0c0'}}>
                  <Input placeholder='email'style={{color:'white'}}
                  onChangeText={(email)=>this.setState({email})}
                  />
              </Item>
              <Item regular style={{backgroundColor:'#c0c0c0', marginTop:'5%'}}>
                  <Input placeholder='Password'style={{color:'white'}}
                    secureTextEntry={true}
                    onChangeText={(password)=>this.setState({password})}
                  />
              </Item>
                <Text style={{alignSelf:'center', marginTop:'2%'}}>Forgot Password? </Text>
              <Button login style={{backgroundColor:'#ff8c00', alignSelf:'center', marginTop:'2%'}}
               onPress={()=>{
                if(this.state.email==null || this.state.password==null){
                  alert('Pastikan Semua data telah terisi!');
                }
                else{
                  this.setState({modalVisible:true,animating:true});
                  firebaseApp.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then(() => {
                  this.setState({modalVisible:false, animating:false});
                  navigate('Signup');
                  }).catch((error) => {
                    alert("error " + error.message );
                    this.setState({modalVisible:false, animating:false});
                  });
                }
               }
             }
              ><Text> Login </Text></Button>
              <Text style={{alignSelf:'center', marginTop:'5%'}}> OR </Text>
              <Button login onPress={()=>navigate('Signup')} style={{backgroundColor:'black', alignSelf:'center', marginTop:'5%'}}><Text> Sign Up </Text></Button>
          </Form>
      </Content>
      </Container>
    );
   }
} 

