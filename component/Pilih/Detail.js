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
      <Container>
          <Content>
              <Card style={{ flex: 0 }}>
                  <CardItem>
                      <Left>
                          <Thumbnail source={{uri:this.props.navigation.state.params.photoProfil}} style={{marginTop : 10}} />
                          <Body>
                              <Text>{this.props.navigation.state.params.username}</Text>
                             {/* <Text note>April 15, 2016 20:10</Text>  */}
                          </Body>
                      </Left>
                  </CardItem>
                  <CardItem>
                    <Body style={{backgroundColor: '#f2f2f2', height: 2}}></Body>
                  </CardItem>
                  <CardItem>
                      <Body>
                        <View style={{height : 200, width: width, alignSelf:"center"}}>
                      {/*bagian image*/}
                        <TouchableOpacity onPress={()=>{this.setState({modalImage:true});}}>
                           <FitImage
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
                              androidScaleType="center"
                              onLoad={() => console.log("Image loaded!")}
                              style={{width: width, height: height}} />

                              <Fab 
                                onPress={()=>{this.setState({modalImage:false});}}
                                style={{
                                  backgroundColor : "rgb(255,165,0)",
                                  height : 40,
                                  width : 40
                                }}
                              >
                                 <Icon style={{color:'white', fontSize:15}} name='close' />
                              </Fab>
                            </View>
                          </Modal>
                          {/*modal end*/}

                        </View>
                       

                          
                          <Text style={{marginTop:'2%', fontSize: 20,  color : "black", fontWeight: "bold", textAlign : "center", alignSelf : "center"}} >
                              {this.props.navigation.state.params.title}
                          </Text>

                          <Text note style={{textAlign: 'justify',marginTop:'2%'}}>
                             {this.state.description}
                          </Text>

                          <Text note style={{textAlign: 'justify',marginTop:'2%',  color : "black", fontWeight: "bold"}}>
                             Start on : {this.state.dateStart} until {this.state.dateEnd}
                          </Text>

                          <Text note style={{textAlign: 'justify',marginTop:'2%'}}>
                            Event Location : {this.state.address}
                          </Text>
                          {/*}
                          <Button transparent textStyle={{color: '#87838B'}}>
                              <Icon name="bicycle" />
                              <Left>
                                <Text note style={{marginLeft: '2%'}}>1,926 attand</Text>
                              </Left>
                          </Button> */}
                      </Body>
                  </CardItem>
                  {/*
                    <Text style={{marginLeft:'5%'}}>Comment</Text>
                      <ListItem avatar >
                          <Left>
                          <Thumbnail source={{uri:'https://firebasestorage.googleapis.com/v0/b/inmap-2a392.appspot.com/o/user.png?alt=media&token=e9490617-6452-4983-bb97-7e9a095a3bf6'}} />
                          </Left>
                          <Body>
                            <Text>@Agung Rahadian</Text>
                            <Text note>Melali ke Danau Tempe</Text>
                          </Body>
                          <Right>
                              <Text note>3:43 pm</Text>
                          </Right>
                      </ListItem>
                  <CardItem>
                    <Body>
                      <Item regular style={{height:40, marginTop: '2%'}}>
                        <Input placeholder='Write a Title ... ' style={{fontSize:14}}/>
                      </Item>
                      <Button style={{marginTop: '2%', alignSelf:'flex-end', backgroundColor:'#f39c12'}}>
                        <Text style={{fontSize:10, color: '#fff'}}>Comment</Text>
                      </Button>
                    </Body>
                  </CardItem>*/}
               </Card>
          </Content>
            {/*<Footer>
              <FooterTab style={{backgroundColor:'#8f8f8f'}}>
                <Button>
                  <Image  style={{width: 40, height: 40}} />
                </Button>
              </FooterTab>
            </Footer> */}
      </Container>
    );
  }

}

