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
        address : ''
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
                          <Thumbnail  source={{uri:this.props.navigation.state.params.photoProfil}} />
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
                          <Image style={{height: 250, width: '100%'}} source={{uri : this.state.newsPicture}} />
                          <Text style={{marginTop:'2%', fontSize: 20}} >
                              {this.props.navigation.state.params.title}
                          </Text>

                          <Text note style={{textAlign: 'justify',marginTop:'2%'}}>
                             {this.state.description}
                          </Text>

                          <Text note style={{textAlign: 'justify',marginTop:'2%'}}>
                             Post on : {this.state.newsPost}
                          </Text>

                          <Text note style={{textAlign: 'justify',marginTop:'2%'}}>
                            News Location : {this.state.address}
                          </Text>

                          
                      </Body>
                  </CardItem>
                   {/*   <Text style={{marginLeft:'5%'}}>Comment</Text>
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

