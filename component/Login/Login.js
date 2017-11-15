import React, { Component } from 'react';
import {
    StyleSheet,
    AsyncStorage,
    Image,
    View,
    Dimensions,
    StatusBar,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { StackNavigator, navigate } from 'react-navigation';
import * as firebase from 'firebase';
import * as GLOBAL from '../../global-string/GLOBAL';
import {
    Container, Content,Input, Text, Button, Form, Item
} from 'native-base';

var config = {
    apiKey: "AIzaSyDRf2U-8uMhD4uCivniCsYlFCpRqpdKMzY",
    authDomain: "inmap-2a392.firebaseapp.com",
    databaseURL: "https://inmap-2a392.firebaseio.com",
    projectId: "inmap-2a392",
    storageBucket: "inmap-2a392.appspot.com",
    messagingSenderId: "804704860207"
};
const firebaseApp = firebase.initializeApp(config);
var{width,height}=Dimensions.get('window');

export default class Login extends Component{
  constructor(props) {
      super(props);
      console.ignoredYellowBox = ['Setting a timer'];
      this.state = {
          email : null,
          password: null,
          uid: null,
          modalVisible : false,
          animating: true
      };

      const { navigate } = this.props.navigation;

      /** Get AsyncStorage START **/
      AsyncStorage.multiGet(['email', 'password']).then((data) => {
          let email = data[0][1];
          let password = data[1][1];
         
          if (email !== null) {
              this.setState({modalVisible: true, animating: true});

              firebaseApp.auth().signInWithEmailAndPassword(email, password).then(() => {
                  /*goto dashboard*/
                  this.setState({modalVisible : false,animating : false});
                  navigate('Dashboard');

              }).catch((error) => {
                  alert("error " + error.message );
                  this.setState({modalVisible:false, animating:false});
              });
          }
      });
      /** Get AsyncStorage END **/

  }

  closeActivityIndicator = () => setTimeout(() => this.setState({animating:false}),20000)
  componentDidMount = () => this.closeActivityIndicator()

/******************************** Login Function START ************************************************/

  signup(){
      firebaseApp.auth().createUserWithEmailAndPassword(this.state.email,this.state.password).then(() => {
          alert('create success');
          this.login();
      }).catch((error) => {
          alert("error " + error.message );
      });
  }

  login(){
      /** loading on START **/
      this.setState({modalVisible: true, animating: true});

      /** Firebase Login Auth START **/
      firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {

          /** Set AsyncStorage START **/
          AsyncStorage.multiSet([
            ["email", this.state.email],
            ["password", this.state.password]
          ]);
          /** Set AsyncStorage END **/

          /** goto dashboard **/
          this.setState({modalVisible: false, animating: false});
          navigate('Dashboard');
      }).catch((error) => {
          alert("error " + error.message );
          this.setState({modalVisible:false, animating:false});
      });
      /** Firebase Login Auth END **/
  }

  getUserIud(){
      var user = firebase.auth().currentUser;
      if (user != null) {
          GLOBAL.userId= user.uid;
          alert(GLOBAL.userId);
      } else {
          alert('user tidak login');
      }
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
      } else {
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


  getUserProfile = (params) => {
      var userId = params;
      var database = firebase.database().ref("users/"+userId+"");
      return database.once('value').then(function(snapshot){
          GLOBAL.username = snapshot.val().username;
      });
      alert(GLOBAL.username);
      return GLOBAL.username;
  }

  getInitialState(){
  this.watchId = navigator.geolocation.watchPosition(
      (position) => {
          this.setState({
              myLongitude: position.coords.longitude,
              myLatitude : position.coords.latitude,

          });
          var database = firebase.database().ref('users/'+GLOBAL.user_kode);
          database.update({
              locationUpdateLongitude: position.coords.longitude,
              locationUpdateLatitude: position.coords.latitude,
          });

          var area = {
            lat : this.state.myLatitude,
            lng : this.state.myLongitude
          };
          Geocoder.geocodePosition(area).then(res => {
                // res is an Array of geocoding object (see below)
                this.setState({
                  adminArea : res[0].adminArea,
                  //eventAddress : res[0].formattedAddress
                });
             alert(res[0].adminArea);
              this.catchMarker(res[0].adminArea);
            })
            .catch(err => alert(err));

          //
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
  );
}

/******************************** Login Function END ************************************************/

  render(){
    const { navigate } = this.props.navigation;
    return(
      <View style={styles.container}>

      <StatusBar
          backgroundColor = {"rgba(48, 18, 18, 0.2)"}
          translucent
       />

       <Image
        source={require('./../../image/background.png')}
        style={styles.backgroundImage}>
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

            <Content style={{width:width}}>
                <Image source={require('./../../image/logo.png')} style={{width:100, height : 150, alignSelf:"center", marginTop : "20%"}}/>
                <Input
                    placeholder='Email'
                    placeholderTextColor="#F9F9F9"
                    style={{color:'white', borderWidth:0.5,borderColor:'white', width : width-50, alignSelf : 'center', marginTop : 30}}
                    onChangeText={(email)=>this.setState({email})}
                />
                <Input
                    placeholder='Password'
                    placeholderTextColor="#F9F9F9"
                    style={{color:'white', borderWidth:0.5,borderColor:'white', width : width-50, alignSelf : 'center', marginTop : 20}}
                    secureTextEntry={true}
                    onChangeText={(password)=>this.setState({password})}
                />
                <Button login
                        style={{
                            backgroundColor:'#ff8c00',
                            alignSelf:'center',
                            marginTop:'5%',
                            width : width-50
                        }}

                        /** Button onPress START **/
                        onPress={()=>{
                            if(this.state.email == null || this.state.password == null){
                                alert('Make sure all filed is not empty!');
                            }
                            else {

                                /** loading on START **/
                                this.setState({modalVisible: true, animating: true});

                                /** Firebase Login Auth START **/
                                firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {

                                  let userLogin = firebase.auth().currentUser.uid;
                                  let userLoginPath = "/users/" + userLogin;
                                  firebase.database().ref(userLoginPath).once('value', (snapshot) => {

                                        
                                          /** Set AsyncStorage START **/
                                          AsyncStorage.multiSet([
                                            ["email", this.state.email],
                                            ["password", this.state.password]
                                          ]);
                                          /** Set AsyncStorage END **/

                                          /** goto dashboard **/
                                          this.setState({modalVisible: false, animating: false});
                                          navigate('Dashboard');
                                      
                                  });

                                }).catch((error) => {
                                    alert("error " + error.message );
                                    this.setState({modalVisible:false, animating:false});
                                });
                                /** Firebase Login Auth END **/
                            }
                        }}
                        /** Button onPress END **/

                    >
                        <Text style={{marginLeft : width/3}}>
                            Login
                        </Text>
                    </Button>
                    <Text style={{alignSelf:'center', marginTop:'3%', color:'white'}}>
                        OR
                    </Text>

                    <Button login onPress={()=>navigate('Signup')} style={{backgroundColor:'#2f2f2f', alignSelf:'center', marginTop:'3%', width : width-50}}><Text style={{marginLeft : width/3}}> Sign Up </Text></Button>
            </Content>   
    
        </Image>
      </View>
    );
   }
}

const styles = StyleSheet.create({
  backgroundImage : {
     flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
  },
  container :{
    flex : 1
  }
});