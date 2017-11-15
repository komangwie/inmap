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
import { Header,Container, Input,Left, Right, Body, Content,Button, Icon,Tab,Tabs,Thumbnail,ListItem } from 'native-base';
var{width,height}=Dimensions.get('window');

export default class ListConfirmEvent extends Component {
  static navigationOptions = {
     header : null
  };
  constructor(props) {
  super(props);
  //var database = firebase.database().ref("userEvent/"+userId+"/unConfirmEvent");//langsung ke child
  this.state=({
        modalVisible : true,
        animating: true,
        refreshing : false,
        listSource : new ListView.DataSource({rowHasChanged : (row1, row2)=> row1 !== row2})
  });
  this.items=[];//array untuk menyimpan data listView
  }


//closeActivityIndicator = () => setTimeout(() => this.setState({animating:false}),20000)
//componentDidMount = () => this.closeActivityIndicator()

componentDidMount(){

  let userId = firebase.auth().currentUser.uid;
  var database = firebase.database().ref("userEvent/"+userId+"/unConfirmEvent");//langsung ke child
  //jika kosong
  database.on("value",(dataSnapshot)=>{
    if(dataSnapshot.val()===null){
      this.setState({modalVisible: false});
    }
    else{
    }
  });
      database.on("child_added", (dataSnapshot)=>{
      this.items.push({id:dataSnapshot.key, title:dataSnapshot.val().eventTitle,time:dataSnapshot.val().created_at, eventAdminArea : dataSnapshot.val().eventAdminArea});
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
       <ListView
        dataSource={this.state.listSource}
        renderRow={this.renderRow.bind(this)}
       />
      </View>
    );
  }

  renderRow(rowData){
    const { navigate } = this.props.navigation;
    return(
        <ListItem avatar onPress = {() =>navigate('ConfirmEvent',{eventKey : rowData.id,eventAdminArea:rowData.eventAdminArea})} >       
            <Body>
                <Text note>{rowData.title}</Text>
            </Body>
            <Right>
                <Text note style={{marginLeft:"10%"}}>{rowData.time}</Text>
            </Right>
        </ListItem>
      );
  }


}

