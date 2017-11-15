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
  View,
  BackHandler
} from 'react-native';

import { StackNavigator  } from 'react-navigation';
import { Header,Container, Left,Right, Body,ListItem, Card, CardItem, Input,Separator, Content,Button, Icon,Tab,Tabs,Thumbnail} from 'native-base';
var{width,height}=Dimensions.get('window');


export default class Choose extends Component {
  static navigationOptions = {
      header : null
  };

constructor(props){
  super(props);
  this.state = {
    selected: false,
    selectedNews : false
  };
}

backPressed = () => {
  const { navigation } = this.props;
  navigation.goBack();
  navigation.state.params.onSelect({ selected: true });
  return true;
}

gotoFreeEvent=()=>{
  const { navigate } = this.props.navigation;
  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  navigate('FreeEvent',{user:this.props.navigation.state.params.user,
    userPhoto:this.props.navigation.state.params.userPhoto,
    myLatitude:this.props.navigation.state.params.myLatitude,
    myLongitude:this.props.navigation.state.params.myLongitude, onSelect: this.onSelect});
}

gotoNews=()=>{
  const { navigate } = this.props.navigation;
  navigate('News',{user:this.props.navigation.state.params.user,
    userPhoto:this.props.navigation.state.params.userPhoto,
    myLatitude:this.props.navigation.state.params.myLatitude,
    myLongitude:this.props.navigation.state.params.myLongitude, onSelect: this.onSelectNews});
}

onSelect = data => {
  this.setState(data);
};

onselectNews = data => {
  this.setState(data);
}

componentWillUpdate(){
  BackHandler.addEventListener('hardwareBackPress', this.backPressed);
}

componentWillMount(){
  BackHandler.addEventListener('hardwareBackPress', this.backPressed);
}

componentWillUnmount(){
  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
}

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
      <Image style={{height:250, alignSelf:'center'}} source={require('./../../image/t4.png')}>
        <Text>{"\n\n\n\n"}</Text>
        <Text style={{color:'white', fontSize:30, alignSelf:'center'}}>What do you want to</Text>
        <Text style={styles.bigwhite}>share today?</Text>
      </Image>
  <Text>{""}</Text>
      <Content style={{backgroundColor:'white'}}>
     {/* <ListItem avatar onPress={()=>navigate('Tambah',{user:this.props.navigation.state.params.user,
        userPhoto:this.props.navigation.state.params.userPhoto,
        myLatitude:this.props.navigation.state.params.myLatitude,
        myLongitude:this.props.navigation.state.params.myLongitude})} >
               <Thumbnail style={{width:100, height:100, marginTop:'4%'}} source={require('./../../image/eventpre.png')}/>
               <Body style={{marginRight:'2%'}}>
                 <Text style={styles.bol}>Premium Event</Text>
                 <Text note>Share Your Event for More Than Others</Text>
               </Body>
        </ListItem>
        */}
        <ListItem avatar  onPress={()=>this.gotoFreeEvent()} >
               <Thumbnail style={{width:100, height:100, marginTop:'4%'}} source={require('./../../image/event icon.png')}/>
               <Body style={{marginRight:'2%'}}>
                 <Text style={styles.bol}>Free Event</Text>
                 <Text note>Share Your Event for Free, Let Your Friend to Know It</Text>
               </Body>
        </ListItem>
        <ListItem avatar onPress={()=>this.gotoNews()}>
             <Thumbnail style={{width:100, height:100, marginTop:'4%'}} source={require('./../../image/news.png')}/>
             <Body style={{marginRight:'2%'}}>
               <Text style={styles.bol}>News</Text>
                <Text note>Whats Happen Around You? Lets Share Your Information</Text>
              </Body>
        </ListItem>
      </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  radius: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 20 / 2,
    overflow: 'hidden',
    backgroundColor: '#007AFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
	transform: [{'translate': [0,0, 1]}]
  },
  tab:{
	  width:"100%",
	  backgroundColor: 'white',
  },
  sideBar:{
	  width: "100%",
	  height:"100%",
	  backgroundColor: 'white',
	  zIndex:100,
  },
  detail :{
    height : 150,
    width:width,
    backgroundColor : 'white',
    borderWidth:0,
	borderColor: '#1ECEB9',
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    shadowColor:'black',
    shadowOffset:{
    width:1,
    height:1
    },
    shadowRadius:1,
    shadowOpacity:1,
    elevation : 10,
	marginBottom:0,
	marginLeft:3,
  },
  user:{
    width: 120,
    height:130,
    borderWidth:0,
    alignItems: 'center',
  },
  user_text:{
    fontSize: 12,
  },
  user_img:{
    width : 50,
    height:50,
    marginTop:5,
  },
  map :{
    marginTop:-38,
    height : height,
    width: width,
  },
  profileImage:{
	  width:100,
	  height:100,
  },
  bigwhite: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    alignSelf:'center',
  },
  red: {
    color: 'red',
  },
  bol: {
    fontWeight: 'bold',
    fontSize:30,
  },
});
