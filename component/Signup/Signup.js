
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  AsyncStorage,
  Image
} from 'react-native';
import * as firebase from 'firebase';
import DatePicker from 'react-native-datepicker';
import { StackNavigator, navigate } from 'react-navigation';
import { Container, Picker,ListItem, Text, Title, Right, CheckBox, Header, Tabs, Tab, Content, InputGroup, Grid, Col, Form, Item, Input, Label, Badge, Footer, FooterTab, Card, CardItem, Thumbnail, Button, Icon, Left, Body } from 'native-base';
export default class Signup extends Component {
  constructor(props) {
      super(props);
      this.state = {
          date:"1997-06-16",
          email : null,
          fullname : null,
          phonenumber : null,
          username : null,
          password : null,
          repassword : null,
          selectedItem:"Male",
          selected1: 'java',
          results: {
              items: []
          }
      }
  }
   static navigationOptions = {
      header : null
  };
  onValueChange (value: string) {
      this.setState({
          selectedItem : value
      });
  }

  signupUser=()=>{
    if (this.state.email!=null || this.state.fullname!=null || this.state.phonenumber!=null || this.state.username!=null || this.state.password!=null || this.state.repassword!=null) {
      if (this.state.password==this.state.repassword) {
        //
         firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password).then(() => {
          //alert('create success');
           let today = new Date();
           let Times = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
   
           var user = firebase.auth().currentUser.uid;
           var database = firebase.database().ref("users/"+user);
           database.set({
              birthDate : this.state.date,
              created_at : Times,
              email : this.state.email,
              full_name : this.state.fullname,
              gender : this.state.selectedItem,
              locationUpdateLatitude : "-8.800",
              locationUpdateLongitude :"115.17779",
              phoneNumber : this.state.phonenumber,
              photoProfile : "https://firebasestorage.googleapis.com/v0/b/inmap-2a392.appspot.com/o/inmap%2Fdefault-user-image.png?alt=media&token=6871fb42-ac36-4fff-9224-5024fb5efa56",
              signIn : "false",
              status : "online",
              updated_at : Times,
              username : this.state.username

           }).then(()=>{
            this.login();
           });

          //this.login();
          }).catch((error) => {
              alert("error " + error.message );
          });
        //
      }
      else{
        alert("Make sure your password is correct");
      }
    }
    else{
      alert("Please fill all field");
    }
  }

  login(){
    const { navigate } = this.props.navigation;
      /** loading on START **/
      this.setState({modalVisible: true, animating: true});

      /** Firebase Login Auth START **/
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {

          /** ambil user id **/
          var user = firebase.auth().currentUser.uid;

          /** Set AsyncStorage START **/
          AsyncStorage.multiSet([
            ["email", this.state.email],
            ["password", this.state.password],
            ["user", user]
          ]);
          /** Set AsyncStorage END **/

          /** goto dashboard **/
          this.setState({modalVisible: false, animating: false});
          navigate('Dashboard',{user:user});
      }).catch((error) => {
          alert("error " + error.message );
          this.setState({modalVisible:false, animating:false});
      });
      /** Firebase Login Auth END **/
  }

  render() {
    return (
                <Container style={{backgroundColor:'white'}}>
                  <Image
                    source={require('./../../image/background.png')}
                    style={{
                      flex: 1,
                      width: null,
                      height: null,
                      resizeMode: 'cover'
                    }}>
                  <Content>
                    <Form>
                      <Item regular style={{marginLeft:'5%', marginTop:'8%', marginRight:'5%',  backgroundColor:'white'}}>
                          <Input placeholder='Email Address'
                            onChangeText={(email)=>this.setState({email})}
                          />
                      </Item>
                      <Item regular style={{marginLeft:'5%', marginTop:'3%', marginRight:'5%',  backgroundColor:'white'}}>
                          <Input placeholder='Full Name'
                            onChangeText={(fullname)=>this.setState({fullname})}
                          />
                      </Item>
                      <Item regular style={{marginLeft:'5%', marginTop:'3%', marginRight:'5%',  backgroundColor:'white'}}>
                          <Input placeholder='Phone Number'
                            onChangeText={(phonenumber)=>this.setState({phonenumber})}
                          />
                      </Item>
                      <Text style={{color :"white",fontSize:15, marginLeft:'5%', marginTop:'3%', marginRight:'5%'}}>Gender</Text>
                      <View style={{height: 50, marginLeft:'5%', marginTop:'1%', marginRight:'5%', borderWidth:1, borderColor: '#5f5f5f', borderColor : "white", backgroundColor : "white"}}>
                        <Picker 
                          mode="dropdown" 
                          selectedValue={this.state.selectedItem}
                          onValueChange={this.onValueChange.bind(this)}

                        > 
                          <Picker.Item label="Male" value="Male" style={{fontSize:10}}/> 
                          <Picker.Item label="Female" value="Female" style={{fontSize:10}}/> 
                        </Picker >
                      </View>
                      
                      <Text style={{color :"white",fontSize:15, marginLeft:'5%', marginTop:'3%', marginRight:'5%'}}>Birth Date</Text>
                      <DatePicker
                        style={{marginLeft:'5%', marginTop:'1%', marginRight:'5%', }}
                        date={this.state.date}
                        mode="date"
                        format="YYYY-MM-DD"
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
                        }}
                        onDateChange={(date) => {this.setState({date: date})}}
                      />
                      <Item regular style={{marginLeft:'5%', marginTop:'3%', marginRight:'5%',  backgroundColor:'white'}}>
                          <Input placeholder='Username'
                            onChangeText={(username)=>this.setState({username})}
                          />
                      </Item>
                      <Item regular style={{marginLeft:'5%', marginTop:'3%', marginRight:'5%',  backgroundColor:'white'}}>
                          <Input placeholder='Password'
                           secureTextEntry={true}
                            onChangeText={(password)=>this.setState({password})}
                          />
                      </Item>
                      <Item regular style={{marginLeft:'5%', marginTop:'3%', marginRight:'5%',  backgroundColor:'white'}}>
                          <Input placeholder='Reenter Password'
                            secureTextEntry={true}
                            onChangeText={(repassword)=>this.setState({repassword})}
                          />
                      </Item>
                      <Button login onPress={()=>this.signupUser()} style={{backgroundColor:'#ff8c00', alignSelf:'center', marginTop:'5%'}}><Text> Lets Sign Up </Text></Button>
                      <Text style={{color :"white",fontSize:13, marginLeft:'5%', marginTop:'1%'}}>By clicking Sign Up, you agree to our Terms and confirm</Text>
                      <View style={{height : 50}}></View>
                    </Form>
                  </Content>
                  </Image>
                </Container>

    );
  }
}
