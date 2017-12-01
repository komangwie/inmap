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
  TouchableWithoutFeedback,
  View,
  BackHandler
} from 'react-native';
import * as firebase from 'firebase';
import { StackNavigator  } from 'react-navigation';
import PhotoView from 'react-native-photo-view';
var ImagePicker = require("react-native-image-picker");
import RNFetchBlob from 'react-native-fetch-blob';
import ImageResizer from 'react-native-image-resizer';
import { Picker, Label, Container,Footer, FooterTab, Form, Item, Input,Tab,Tabs, Content, ListItem, Header, Left, Right,Body, Button, Icon, Title, Subtitle, Thumbnail, CardItem, Card, TabHeading, Fab } from 'native-base';
var{width,height}=Dimensions.get('window');
const polyfill = RNFetchBlob.polyfill;

window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;

export default class userDashboard extends Component {
  static navigationOptions = {
      header: null
  };
  constructor(props) {
  super(props);
  //var database = firebase.database().ref("userEvent/"+userId+"/unConfirmEvent");//langsung ke child
  this.state=({
        animating: false,
        eventKey : '',
        description : '',
        eventLocation : '',
        eventPicture : '',
        modalVisible : false,
        modalMenu : false,
        modalListEvent : false,
        modalPhoto : "uri",
        modalTitle : '',
        adminArea : this.props.navigation.state.params.adminArea,
        dateStart : '',
        dateEnd : '',
        address : '',
        profilePhoto : this.props.navigation.state.params.photoProfil,
        imageUploadPath :"uri",
        imagePathTemporary : 'uri', // untuk menyimpan url foto sementara untuk dibandingkan dengan imageUploadPath
        resizeImageUploadPath : "uri",
        profileImage : "this is image thubnail",
        listSource : new ListView.DataSource({rowHasChanged : (row1, row2)=> row1 !== row2}),
        eventId : '',
        selected : false
  });
  this.items=[];
  this.userId = firebase.auth().currentUser.uid;
  }

   //handle back press on midle level
   onselectNewsDashboard = data => {
    this.setState(data);
  }

  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
  }

  gotoFollowing=()=>{
    const { navigate } = this.props.navigation;
    this.setState({modalMenu : false});
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    navigate("Following",{onselectNewsDashboard: this. onselectNewsDashboard});
  }

  componentWillUpdate(){
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
  }
  //handle back press end
  
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
  //list POST
      let userId = firebase.auth().currentUser.uid;
      var database = firebase.database().ref("userEvent/"+userId+"/freeEvent").orderByChild("sortTime");//langsung ke child
      database.on("child_added", (dataSnapshot)=>{
        this.items.push({
          id : dataSnapshot.key,
          title : dataSnapshot.val().eventTitle,
          description : dataSnapshot.val().eventDescription,
          time : dataSnapshot.val().created_at,
          eventPhoto : dataSnapshot.val().eventPhoto,
          sortTime : dataSnapshot.val().sortTime
        });

        this.setState({
        listSource : this.state.listSource.cloneWithRows(this.items),
        postAnimating : false
        });

        this.items.sort();

      });

      database.on("child_removed", (dataSnapshot)=>{
        this.items = this.items.filter((x)=>x.id !== dataSnapshot.key);
        this.setState({
        listSource : this.state.listSource.cloneWithRows(this.items),
        postAnimating : false
       });
        
      });
}

showProfile=()=>{
  let storage = firebase.storage().ref("users/"+this.userId+"/PhotoProfile/originalImage").child(this.userId);
    storage.getDownloadURL().then((url)=>{
      this.setState({
        modalVisible : true,
        imagePathTemporary : url,
        imageUploadPath : url
      });
    }).catch((error)=>{
      this.setState({userProfilPicture:"https://firebasestorage.googleapis.com/v0/b/inmap-2a392.appspot.com/o/inmap%2Fdefault-user-image.png?alt=media&token=6871fb42-ac36-4fff-9224-5024fb5efa56"});
    });
}

showEventModal=(photo, title, id)=>{
  this.setState({
    modalListEvent : true,
    modalPhoto : photo,
    modalTitle : title,
    eventId : id
  });
}

//delete user event
deleteMyEvent=(id)=>{
  //alert(this.props.navigation.state.params.adminArea);
  var database = firebase.database().ref("showEvent/"+this.props.navigation.state.params.adminArea+"/FreeEvent").child(id);
  database.remove().then(()=>{
    database = firebase.database().ref("userEvent/"+this.userId+"/freeEvent/").child(id);
    database.remove().then(()=>{
      database = firebase.database().ref("freeEvent/").child(id);
      database.remove();
      this.setState({
        modalListEvent : false
      });
    });
 
  });
}

renderRow(rowData){
    const { navigate } = this.props.navigation;
    return(
        <View style={{marginTop : "1%", paddingRight : "2%"}}>
          <ListItem avatar onPress={()=>{this.showEventModal(rowData.eventPhoto,rowData.title, rowData.id);}} >

          <Thumbnail source={{uri:rowData.eventPhoto}} />

          <Left>
            <View style={{ width : "100%", borderBottom : "2", borderColor : "black"}}>
             <Body>
                  <Text note style={{fontSize:14, color : "black", fontWeight: "bold"}}>{rowData.title}</Text>
                  <Text note style={{fontSize:10}}>{rowData.description}</Text>
             </Body>
            </View>
          </Left>

          </ListItem>
        </View>

      );
  }

//fungsi untuk mengambil image utuk dijadikan photoProfil
 GetImagePath=()=>{
  ImagePicker.showImagePicker((response) => {
      if (response.error) {
        alert("An Error Occurred During Open Library"); // jika terjadi kesalahan saat menggunakan image picker
      }
      else if(response.didCancel) {
        console.log("canceled");
      }
      else {
        let source = { uri: response.uri };

        //resize image
        ImageResizer.createResizedImage(source.uri, 300, 300, "JPEG", 100,0, null).then((response) => {
        this.setState({
          resizeImageUploadPath : response.uri
        });
        }).catch((err) => {
          alert("Error has Occurred");
        });

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          imageUploadPath : source.uri //simpan alamat gambar untuk di upload ke firebase storage --url--
        });
      }
    });
 }

// fungsi untuk merubah photo prolfe user
 saveChange=()=>{
  
  if (this.state.imageUploadPath === this.state.imagePathTemporary) {
    this.setState({
      modalVisible : false
    });
  }
  else{
    this.setState({animating : true});
    var path =this.state.imageUploadPath;
    Blob.build(RNFetchBlob.wrap(path), { type : 'image/jpeg' }).
    then((blob) => firebase.storage()
    .ref("users/"+this.userId+"/PhotoProfile/originalImage").child(this.userId)
    .put(blob, { contentType : 'image/png' })
    ).then(()=>{

      path = this.state.resizeImageUploadPath;
      Blob.build(RNFetchBlob.wrap(path), { type : 'image/jpeg' }).
      then((blob) => firebase.storage()
      .ref("users/"+this.userId+"/PhotoProfile/resizeImage").child(this.userId)
      .put(blob, { contentType : 'image/png' })
      ).then(()=>{
          this.setState({
                  animating : false,
                  modalVisible : false
          });
      });
    });
  }
 }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container style={{backgroundColor : "white"}}>
            <Modal
                animationType = {"fade"}
                transparent   = {true}
                visible       = {this.state.modalListEvent} onRequestClose ={()=>{this.setState({modalListEvent : false});}}
            >
              <TouchableWithoutFeedback onPress={()=>{this.setState({modalListEvent : false});}}>
               <View
                style={{
                  flex : 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.56)',
                }}>
                <TouchableWithoutFeedback>
                  <View 
                    style={{
                      backgroundColor : "white",
                      height : 300,
                      width : width-50,
                      alignSelf : "center",
                      marginTop : "40%"
                    }}>
                    <Image 
                     source={{uri:this.state.modalPhoto}}
                     style={{
                      width : width-60,
                      height : 200,
                      alignSelf : "center",
                      marginTop : "1%"
                    }}/>
                    <Text style={{
                      color : "black",
                      fontSize : 15,
                      alignSelf : "center",
                      textAlign : "center"
                    }}>{this.state.modalTitle}</Text>
                    <View style={{
                      backgroundColor : "orange",
                      width : width-50,
                      height : 50,
                      position : "absolute",
                      bottom : 0
                    }}>
                      <View style={{
                        backgroundColor : "orange",
                        width : (width-50)*1/2,
                        height : 50,
                        position : 'absolute',
                        right : 0
                      }}>
                       <TouchableOpacity>
                          <Text style={{
                            color : "black",
                            fontSize : 15,
                            alignSelf : "center",
                            marginTop : 15
                          }}>View</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={{
                        backgroundColor : "black",
                        width : (width-50)*1/2,
                        height : 50,
                        position : 'absolute',
                        left : 0
                      }}>
                        <TouchableOpacity onPress={()=>this.deleteMyEvent(this.state.eventId)}>
                          <Text style={{
                            color : "white",
                            fontSize : 15,
                            alignSelf : "center",
                            marginTop : 15
                          }}>Delete</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  </View>
                   </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <View style={{width : width,height : 80, backgroundColor : 'white', borderBottomWidth : 0.3, flexDirection : 'row', paddingTop : 40}}>
                <TouchableOpacity onPress={()=>this.backPressed()}>
                    <Icon name="arrow-back" style={{color : 'black', marginLeft : 10}}/>
                </TouchableOpacity>
                <Text style={{color : "black", fontSize : 20, marginLeft : width/3}}>Profile</Text>
                <View style={{position : 'absolute', right : 10, top : 40}}>
                <TouchableOpacity onPress={()=>this.setState({modalMenu : true})}>
                      <Icon name="menu" style={{color : 'black'}}/>
                </TouchableOpacity>
                </View>
            </View>

              <Card style={{ flex: 0 }}>
                <View style={{ width : 20, height : 25, position : 'absolute', zIndex : 1, right : 5, top : 20}}>
          
                    <Modal
                      animationType = {"fade"}
                      transparent   = {true}
                      visible       = {this.state.modalMenu} onRequestClose ={()=>{this.setState({modalMenu : false});}}
                     >
                     <TouchableWithoutFeedback onPress={()=>this.setState({modalMenu : false})}>
                      <View style={{width : width, height : height}}>
                          <TouchableWithoutFeedback>
                            <View style={{width : 150, height : 30, borderWidth : 0.3, borderRadius : 2, backgroundColor : "white", position : 'absolute', zIndex : 1, right : 8, borderColor : 'black', top : 20}}>
                                <TouchableOpacity onPress={()=>this.gotoFollowing()}>
                                  <Text style={{color : "black", fontSize : 18, marginLeft : 5}}>Following</Text>
                                </TouchableOpacity>
                            </View>
                          </TouchableWithoutFeedback>
                      </View>
                     </TouchableWithoutFeedback>
                     </Modal>
                </View>
                {/*photo profile user*/}
                <TouchableOpacity style={{alignSelf : 'center', width : 100 }}
                        onPress={()=>this.showProfile()}
                      >
                        <Image style={{alignSelf:'center',marginTop : 20, height : 100, width : 100, borderRadius : 100}} source={{uri:this.state.profilePhoto}} />
                </TouchableOpacity>

              {/*username disebelah photo profile*/}
                <Text style={{alignSelf:'center', marginLeft:'3%', fontSize:25}}>{this.props.navigation.state.params.username}</Text>
                
                  <CardItem style={{alignSelf:'center'}}>
                    {/*modal untuk menampilkan foto user dan menggantinya*/}
                    <Modal
                              animationType = {"fade"}
                              transparent   = {true}
                              visible       = {this.state.modalVisible} onRequestClose ={()=>{this.setState({modalVisible : false});}}
                    >
                      <TouchableWithoutFeedback onPress={()=>{this.setState({modalVisible : false});}}>
                          <View
                            style={{
                              flex : 1,
                              backgroundColor: 'rgba(0, 0, 0, 0.56)',
                            }}>
                              {/* bagian untuk menampilkan foto user dan mengganti foto user*/}
                              <TouchableWithoutFeedback>
                               <View 
                                  style={{
                                    backgroundColor : "white",
                                    height : 300,
                                    width : width-50,
                                    alignSelf : "center",
                                    marginTop : "40%"
                                  }}>
                                    <Image style={{height : 200, width : 200, borderRadius : 200, marginTop : "10%", alignSelf : "center"}} source={{uri:this.state.imageUploadPath}}/>

                                    <Fab onPress={()=>this.GetImagePath()} style={{backgroundColor : "orange", bottom : 70, right : 20}}>
                                      <Icon style={{color:'white', fontSize:25}} name='camera' />
                                    </Fab>
                                    <View style={{width : width-50, position : "absolute", bottom : 0}}>
                                      <Button onPress={()=>this.saveChange()} style={{ width : width-50, backgroundColor : "orange", alignContent : "center"}}>
                                        <View style={{alignItems : "center", width : width-50, position : "absolute"}}>
                                          <ActivityIndicator
                                            animating={this.state.animating}
                                            color="#bc2b78"
                                            size = 'small'
                                            style={{position: "absolute", left : 80}}
                                          />
                                          <Text style={{ color : "white", fontSize : 15}}>Save change</Text>
                                        </View>
                                      </Button>
                                    </View>
                                    
                                </View>
                              </TouchableWithoutFeedback>
                          </View>
                      </TouchableWithoutFeedback>
                    </Modal>
                    </CardItem>
               </Card>
               <Tabs >
                 {/* <Tab tabStyle={{backgroundColor: '#2f2f2f'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#3f3f3f'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}} heading={<TabHeading style={{backgroundColor:'#3a3838'}}><Text>1</Text></TabHeading>}>
                      <ListItem avatar>
                          <Left>
                          <Thumbnail source={{uri:'https://firebasestorage.googleapis.com/v0/b/inmap-2a392.appspot.com/o/user.png?alt=media&token=e9490617-6452-4983-bb97-7e9a095a3bf6'}} />
                          </Left>
                          <Body>
                              <Text>Kumar Pratik</Text>
                              <Text note>Doing what you like will always keep you happy . .</Text>
                          </Body>
                          <Right>
                              <Text note>3:43 pm</Text>
                          </Right>
                      </ListItem>
                  </Tab>
                  <Tab tabStyle={{backgroundColor: '#2f2f2f'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#3f3f3f'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}} heading={<TabHeading style={{backgroundColor:'#3a3838'}}><Text>2</Text></TabHeading>}>
                      <ListItem avatar>
                          <Left>
                          <Thumbnail source={{uri:'https://firebasestorage.googleapis.com/v0/b/inmap-2a392.appspot.com/o/user.png?alt=media&token=e9490617-6452-4983-bb97-7e9a095a3bf6'}} />
                          </Left>
                          <Body>
                              <Text>Kumar Pratik</Text>
                              <Text note>Doing what you like will always keep you happy . .</Text>
                          </Body>
                          <Right>
                              <Text note>3:43 pm</Text>
                          </Right>
                      </ListItem>
                  </Tab>*/}
                  <Tab tabStyle={{backgroundColor: '#2f2f2f'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#3f3f3f'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}} heading={<TabHeading style={{backgroundColor:'#3a3838'}}><Text style={{color : "white"}}>My Event</Text></TabHeading>}>
                      {/*event disini*/}
                  <Content>
                    <ListView
                    style={{marginTop : "2%"}}
                    dataSource={this.state.listSource}
                    renderRow={this.renderRow.bind(this)}
                    />

                    <ActivityIndicator
                    animating={this.state.postAnimating}
                    color="#bc2b78"
                    size = 'large'
                     />
                  </Content>
                   {/*
                      <ListItem avatar>
                          <Left>
                          <Thumbnail source={{uri:'https://firebasestorage.googleapis.com/v0/b/inmap-2a392.appspot.com/o/user.png?alt=media&token=e9490617-6452-4983-bb97-7e9a095a3bf6'}} />
                          </Left>
                          <Body>
                              <Text>Kumar Pratik</Text>
                              <Text note>Doing what you like will always keep you happy . .</Text>
                          </Body>
                          <Right>
                              <Text note>3:43 pm</Text>
                          </Right>
                      </ListItem> */}
                  </Tab>
                {/* <Tab tabStyle={{backgroundColor: '#2f2f2f'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#3f3f3f'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}} heading={<TabHeading style={{backgroundColor:'#3a3838'}}><Text>4</Text></TabHeading>}>
                      <ListItem avatar>
                        <Thumbnail style={{width:100, height:100, marginTop:'4%'}} source={require('./../../image/news.png')}/>
                        <Body style={{marginRight:'2%'}}>
                          <Text style={{fontWeight:'bold'}}>Points</Text>
                         <Text note>Earn Coints?</Text>
                       </Body>
                      </ListItem>
                  </Tab>*/} 
                </Tabs>
      </Container>
    );
  }

}
