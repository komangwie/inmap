import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Animated,
  AsyncStorage,
  ListView,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  View,
  BackHandler
} from 'react-native';
import * as firebase from 'firebase';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import Drawer from 'react-native-drawer';
import { StackNavigator  } from 'react-navigation';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {Container, Input, Content,Button, Icon,Thumbnail, Fab, ListItem, Item,Body} from 'native-base';
import Carousel from 'react-native-snap-carousel';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import {
  SkypeIndicator,
  BarIndicator,
} from 'react-native-indicators';
var{width,height}=Dimensions.get('window');

var mapHeight = height + (height/10);
const horizontalMargin = 20;
const slideWidth = 280;
 
const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 100;
const fabPosition = slideWidth/1.8;
const snapContentWidth = itemWidth-70;

export default class Dashboard extends Component {
  static navigationOptions = {
      header : null
  };
	constructor(props){
      super(props);
      console.ignoredYellowBox = ['Setting a timer'];
      //this.getUserProfil();
  	  this.state={
          detail:[],
          region :new MapView.AnimatedRegion({
            latitude : -8.906789,
            longitude : 115.178232,
            latitudeDelta : 0.01,
            longitudeDelta : 0.01
          }),
          markers: [],
          currentIndex : 0,
          news : [],
          adminArea: "",
          myLatitude : -8.906789,
          myLongitude : 115.178232,
          error: null,
          animating : true,
          modalVisible : false,
          namauser:null,
          user_ID:null,
          userProfilPicture: null, //untuk mengambil URL photo Profil user dari storage
          userLogin : '',
          postAnimating : true,
          wellcomeAnimating : true,
          listSource : new ListView.DataSource({rowHasChanged : (row1, row2)=> row1 !== row2}),
          selected: false,
          loading : true
      };
      this.backButtonListener = null;
      this.currentRouteName = 'Main';
      this.lastBackButtonPress = null;

      //check gps is on or not
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
        ok: "YES",
        cancel: "NO",
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => ONLY GPS PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true // false => Directly catch method is called if location services are turned off
        }).then(function(success) {
        //alert(JSON.stringify(success)); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}

        }).catch((error) => {
            //alert(JSON.stringify(error.message)); // error.message => "disabled"
    });
    //check gps end
    
  }

 onSelect = data => {
    this.setState(data);
  };

 onPress = () => {
      const { navigate } = this.props.navigation;
      BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
      navigate("Choose",{user:this.state.namauser,
                            userPhoto:this.state.userProfilPicture,
                            myLatitude:this.state.myLatitude,
                            myLongitude:this.state.myLongitude, onSelect: this.onSelect });
      
  }

gotoDetail=(parmId, parmImage, parmTitle, parmUid, parmUsername)=>{
  const { navigate } = this.props.navigation;
  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  navigate("Detail",{id:parmId, photoProfil : parmImage, title : parmTitle, userUid : parmUid, username : parmUsername,myLatitude : this.state.myLatitude, myLongitude : this.state.myLongitude
    ,destinationLat : this.state.detail[this.state.currentIndex].latitude,destinationLong : this.state.detail[this.state.currentIndex].longitude, onSelect: this.onSelect });
}

gotoProfile=()=>{
  const { navigate } = this.props.navigation;
  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  navigate('userDashboard',{photoProfil:this.state.userProfilPicture, username : this.state.namauser, adminArea : this.state.adminArea, onSelect: this.onSelect });  
}

gotoNewsDashboard=(adminAr, id)=>{
  const { navigate } = this.props.navigation;
  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  navigate('NewsDashboard',{adminArea : adminAr,regency : id, onSelect: this.onSelect});
}


componentWillUpdate(){
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
}

 closeControlPanel = () => {
      this._drawer.close();
  };

  openControlPanel = () => {
      this._drawer.open();
  };

/***1***Fungsi untuk mengambil username ******/
  getUserProfil = () => {
      var userId = firebase.auth().currentUser.uid;
      GLOBAL.user_kode = userId;
      var database = firebase.database().ref('users/'+userId);
      database.once('value', (snapshot) => {
          var name = snapshot.val().username;
          this.setState({namauser:name});
      },(error) => {
         // alert("disini"+error);
      });
      this.getUserphoto(userId); //kirim parameter userId ke fungsi getUserphoto untuk diambil photo profilnya
  }
/***1***********END********************/

/***2***Fungsi untuk mengambil photo profil user ******/
  getUserphoto=(userId)=>{
    let storage = firebase.storage().ref("users/"+userId+"/PhotoProfile/resizeImage").child(userId);
    storage.getDownloadURL().then((url)=>{
      this.setState({userProfilPicture:url});
    }).catch((error)=>{
      this.setState({userProfilPicture:"https://firebasestorage.googleapis.com/v0/b/inmap-2a392.appspot.com/o/inmap%2Fdefault-user-image.png?alt=media&token=6871fb42-ac36-4fff-9224-5024fb5efa56"});
    });
  }
/***2***********END********************/

//fungsi untuk menyimpan latlong dan latlongdelta ketika user menggeser map
onRegionChange = (region)=>{
  this.setState({region});
}

//close app when back button is pressed
backPressed = () => {
   // this.props.navigation.goBack();
     BackHandler.exitApp();
            return true;
    // var screenKey;
    // var key = this.props.navigation.state.key;
    //  AsyncStorage.multiGet(['dashboardKey']).then((data) => {
    //      screenKey = data[0][1];
    //      if (key == screenKey) {
    //         BackHandler.exitApp();
    //         return false;
    //      }
    // });

   
}

//hilangkan back handler
unmountBackhandler=()=>{
  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
}

//ambil screen key dari dashboard untuk proses close app
getScreenKey = () =>{
  var key = this.props.navigation.state.key;
  AsyncStorage.multiSet([
    ["dashboardKey", key]
  ]);
}


  componentWillMount(){
    //this.getScreenKey();
    //back button to close app
     BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    //memanggil fungsi untuk mengambil photoprofile user
    this.getUserProfil();

    //geolocation using getCurrentPosition
       navigator.geolocation.getCurrentPosition(
        (position)=>{
           this.setState({
                  myLongitude: position.coords.longitude,
                  myLatitude : position.coords.latitude
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
                  //alert(res[0].adminArea);
                  this.catchMarker(res[0].adminArea);
                })
                .catch(err => alert(err));

              //

        },(error) => this.setState({ error: error.message }),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    
      );
      //getCurrentPositionEnd

      /** Geolocation Navigator START **/
      this.watchId = navigator.geolocation.watchPosition(
          (position) => {
              this.setState({
                  myLongitude: position.coords.longitude,
                  myLatitude : position.coords.latitude
              });

              var area = {
                lat : this.state.myLatitude,
                lng : this.state.myLongitude
              };
              Geocoder.geocodePosition(area).then(res => {
                    // res is an Array of geocoding object (see below)
                    //jika admin area user berubah
                    if (this.state.adminArea != res[0].adminArea) {
                      this.catchMarker(res[0].adminArea);
                    }
                  
                })
                .catch(err => alert(err));

              // //
          },
          (error) => this.setState({ error: error.message }),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
      );
      /** Geolocation Navigator END **/
  }

  componentDidMount() {
      /** If User Open or Close The Application, Then Status Changed START **/
      let userRef = firebase.database().ref('users/'+GLOBAL.user_kode);
      let myConnectionsRef = firebase.database().ref('connections');
      let con = myConnectionsRef.child(GLOBAL.user_kode);

      // Add ourselves to presence list when online.
      let presenceRef = firebase.database().ref(".info/connected");
      presenceRef.on("value", (snap)=> {
          if (snap.val() === true) {
              // push connection
              userRef.once("value",(snapshot)=>{
                this.setState({
                  userLogin : snapshot.val().username
                });
              }).then(()=>{
                  con.set({
                      username: this.state.userLogin
                  });

              });

              // remove connection
              con.onDisconnect().remove();

              // update user status to offline, if disconnect
              userRef.onDisconnect().update({
                  status: "offline"
              });

              // update user status to online
              userRef.update({
                  status: "online"
              });
          }
      });

      // Number of online users is the number of objects in the presence list.
      //userRef.on("value", function(snap) {
        //console.log("# of online users = " + snap.numChildren());
      //});
      /** If User Open or Close The Application, Then Status Changed END **/

  }
  //mengambil data-data event free untuk ditampilkan dalam markers
catchMarker=(area)=>{
 
  var userId = firebase.auth().currentUser.uid;

  var newsDatabase = firebase.database().ref("showNews/"+area);

  var userFollowing = firebase.database().ref().child("following/"+userId);

  var database = firebase.database().ref("showEvent/"+area+"/FreeEvent").orderByChild("sortTime");

  //mencari koordinat pin masing-masing subadminarea untuk menampilkan pin news
  // newsDatabase.on("child_added", (dataSnapshot)=>{
  //   var newsDatabaseLatLong = firebase.database().ref("newsSubAdminArea/"+dataSnapshot.key);
  //   newsDatabaseLatLong.on("value", (snapshot)=>{
  //     if(snapshot.val().latitude !== null || snapshot.val().longitude !== null){
  //       this.state.news = this.state.news.filter((x)=>x.id !== dataSnapshot.key);
  //       this.state.news.push({
  //         id : dataSnapshot.key,
  //         title : dataSnapshot.key,
  //         coordinates: {
  //               latitude : snapshot.val().latitude,
  //               longitude:  snapshot.val().longitude
  //         }
  //       });

  //     }
  //     else{
  //      alert("there is null");
  //     }
        
  //   });
  // });

  newsDatabase.on("child_added",(dataSnapshot)=>{
    //alert(JSON.stringify(dataSnapshot.key));
     Geocoder.geocodeAddress(dataSnapshot.key).then(res => {
        // res is an Array of geocoding object (see below)
        // this.setState({
        //   myLatitude : res[0].position.lat,
        //   myLongitude : res[0].position.lng,
        //   adminArea : res[0].adminArea,
        //   eventAddress : res[0].formattedAddress
        // });
        this.state.news.push({
          id : dataSnapshot.key,
          title : dataSnapshot.key,
          coordinates: {
                latitude : res[0].position.lat,
                longitude:  res[0].position.lng
          }
        });
        //alert(res[0].position.lat);

    })
    .catch(err => alert("Your Location Undetected"));
  });


  userFollowing.on("value", (snapshot)=>{

    database.on("child_added", (dataSnapshot)=>{

        if (snapshot.hasChild(dataSnapshot.val().userUid) || dataSnapshot.val().userUid == userId) {

          this.state.markers = this.state.markers.filter((x)=>x.id !== dataSnapshot.key);
          this.state.detail = this.state.detail.filter((x)=>x.id !== dataSnapshot.key);

            //cek apakah array masih kosong untuk melakukan fokus ke marker pertama
            if (this.state.detail.length == 0) {
              this.setState({
                 region : {
                  latitude : dataSnapshot.val().locationLatitude,
                  longitude : dataSnapshot.val().locatonLongitude,
                  latitudeDelta : 0.01,
                  longitudeDelta : 0.01
                }
              });

            }

            this.state.detail.push({
            id:dataSnapshot.key,
            title: dataSnapshot.val().eventTitle,
            description : dataSnapshot.val().eventDescription,
            image : dataSnapshot.val().userProfilPhoto,
            eventImage : dataSnapshot.val().imageResized,
            latitude : dataSnapshot.val().locationLatitude,
            longitude : dataSnapshot.val().locatonLongitude,
            userUid : dataSnapshot.val().userUid,
            username : dataSnapshot.val().username
            });

           
             this.state.markers.push({
              id:dataSnapshot.key,
              title: dataSnapshot.val().eventTitle,
              coordinates: {
                latitude:dataSnapshot.val().locationLatitude,
                longitude: dataSnapshot.val().locatonLongitude
              }
             });

            this.setState({
              modalVisible: false
            });
          //alert("follow "+dataSnapshot.val().username);
        }
        else{
          //alert("unfollow "+dataSnapshot.val().username);
        }
    });
   
  });
  this.setState({
    loading : false
  });
  database.on("child_removed", (dataSnapshot)=>{
    this.state.detail = this.state.detail.filter((x)=>x.id !== dataSnapshot.key);
    this.state.markers = this.state.markers.filter((x)=>x.id !== dataSnapshot.key);
  });

}

//fungsi untuk melakukan focus ke pin event
onSwipe=(slideIndex)=>{
     this.setState({
        region : {
            latitude : this.state.detail[slideIndex].latitude,
            longitude : this.state.detail[slideIndex].longitude,
            latitudeDelta : 0.01,
            longitudeDelta : 0.01
        },
        currentIndex : slideIndex
      });
}

//fungsi untuk focus ke lokasi user sekarang
focusToMyLocation=()=>{
   this.setState({
        region : {
            latitude : this.state.myLatitude,
            longitude : this.state.myLongitude,
            latitudeDelta : 0.1,
            longitudeDelta : 0.1
        },
      });
}

//fungsi untuk focus ke lokasi event yang aktif pada snap bar bawah
focusToActiveEvent=()=>{
 this.setState({
        region : {
            latitude : this.state.detail[this.state.currentIndex].latitude,
            longitude : this.state.detail[this.state.currentIndex].longitude,
            latitudeDelta : 0.01,
            longitudeDelta : 0.01
        },
      });
}

logout=()=>{

      var userId = firebase.auth().currentUser.uid;

      var database = firebase.database().ref().child("users/"+userId);
      database.update({
        signIn:false,
        status : "offline"
      });

      database = firebase.database().ref().child("connections/"+userId);
      database.remove();

      let keys = ['email', 'password', 'user'];
      AsyncStorage.multiRemove(keys, (err) => {
          alert("Logged out!");
      });

      firebase.auth().signOut();
  }

  componentWillUnmount() {
      firebase.auth().signOut();
      navigator.geolocation.clearWatch(this.watchId);
      BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  }
  render() {

    {/*bagian yang akan ditampilkanpada swiper detail di bawah map, menggunakan array detail*/}
    const slides = this.state.detail.map((entry, index) => {
        return (
          <View  key={`entry-${index}`} style={styles.slide}>
              {/*bagian untuk menampilkan photo profile user*/}
              <View style={styles.userProfile} >
                  <Thumbnail small source={{uri:entry.image}} />
              </View>

             {/*bagian untuk menampilkan image event*/}
              <View style={styles.eventImage} >
                   <TouchableOpacity onPress={()=>this.focusToActiveEvent()} style={{zIndex : 3}}>
                          <Image style={{height : 105, width : 65, alignSelf : "center", top : 2.5, zIndex : 1}} source={{uri:entry.eventImage}}/>
                    </TouchableOpacity>
                    <View style={{position : 'absolute', alignSelf : 'center', marginTop : 50, zIndex : 1}}>
                      < BarIndicator  count={5} color="orange" size={15}/>
                   </View>
              </View>
            
             {/*bagian snap bar detail yang bisa dklik untuk menampilkandetail event*/}
             <View style={styles.card}>
                <TouchableOpacity  onPress={()=>this.gotoDetail(entry.id, entry.image, entry.title, entry.userUid, entry.username)} >
                 
                  <View style={styles.snapContent}>
                    <Text style={{fontSize:14, color : "black", fontWeight: "bold",  textAlign : "center", alignSelf : "center"}} >{entry.title}</Text>
                    <Text style={{fontSize : 12}} note>{entry.description}</Text>
                  </View>
                    
                 </TouchableOpacity>
             </View>
           
          </View>
        );
    });

  {/*navigate yang digunakan untuk menangani perpindahan screen*/}
    const { navigate } = this.props.navigation;

    return (

        <Drawer
        /** Drawer Content START **/
        ref={(ref)=>this._drawer=ref}
        type="static"
        tapToClose={true}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        styles={drawerStyles}
        tweenHandler={(ratio) => ({
          main: { opacity:(2-ratio)/2 }
        })}

      /** Content START **/
        content={

      /** isi dari sidebar START **/
          <View style={styles.sideBar}>
            
      {/** Bagian profil user START**/}
            <View style={{alignItems:'center', height: 150, justifyContent:'center', backgroundColor:'#2f2f2f'}}>

              <TouchableOpacity onPress={()=>this.gotoProfile()} >
                <Image style={{alignSelf:'center', height: 80, width: 80, borderRadius : 90, borderWidth : 0.1, borderColor : "orange", marginTop : 10}} source={{uri:this.state.userProfilPicture}} />
              </TouchableOpacity>

              <Text style={{fontSize:18, color : "white"}}>
                {this.state.namauser} {/** cetak nama user**/}
              </Text>

            </View>
            {/** Bagian profil user END **/}

            <Container>
            <Item rounded style={{alignSelf:"center",height:40,width:"95%", marginTop: '2%'}}>
              <Icon style={{color:'orange'}} name="ios-search" />
                  <Input placeholder='Search' style={{fontSize:18}} onChangeText={(placeName)=>this.setState({placeName})}/>
            </Item>
            <ListItem avatar onPress={()=>{  this.logout(); navigate('Home'); }}>
              <FontAwesome style={{color:'orange', fontSize:18, marginLeft:'2%'}} >{Icons.signOut}</FontAwesome>
              <Body style={{marginRight:'2%'}}>
              <Text>Sign Out</Text>
              </Body>
            </ListItem>
            </Container>

          </View>
          /** isi dari sidebar END **/

        }
        /** Content END **/

      /** Drawer Content END **/
      >
        <Modal animationType = {"fade"} transparent   = {true} visible  = {this.state.loading} >
          <View style={{width : width, height : height, backgroundColor : "rgba(0, 0, 0, 0.5)"}}>
              <View style={{backgroundColor : 'white', height : 150, width : width-50, alignSelf : 'center', marginTop : height/2}}>
                  < BarIndicator count={5} color="orange" size={28}/>
                  <View style={{ position : 'absolute', alignSelf : 'center', marginTop : 100}}>
                    <Text style={{color : 'orange', fontSize : 18}}>Loading informations</Text>
                  </View>
              </View>
          </View>
        </Modal>
        {/* Button menu untuk membuka drawer */}
        <Button transparent light style={{zIndex:1,position:'absolute', marginTop:"2%", marginLeft: -2}} onPress={()=>this.openControlPanel()}>
          <Icon style={{color:'black', fontSize:30}} name='menu' />
        </Button>

        <View style={styles.container}>

          {/** MapView START **/}
          <MapView.Animated style={styles.map}
            region = {this.state.region}
            onRegionChange = {this.onRegionChange}
          >

            {/** membuat koordinat user START **/}
            <MapView.Marker
              coordinate ={{
                latitude:this.state.myLatitude,
                longitude:this.state.myLongitude,
              }}
              title = "Your Location"
            >

              {/** membuat tampilan point lokasi berbentuk lingkaran dan radius biru START **/}
                 {/** membuat tampilan point lokasi berbentuk lingkaran dan radius biru START **/}
              <View style={styles.radius}>
                <View style={styles.marker}>
                </View>
              </View>
              {/** membuat tampilan point lokasi berbentuk lingkaran dan radius biru END **/}
              {/** membuat tampilan point lokasi berbentuk lingkaran dan radius biru END **/}

            </MapView.Marker>
            {/** membuat koordinat user END **/}

            {/** menmpilkan pin news **/}
              {this.state.news.map(marker => (
                <MapView.Marker
                  key={marker.id}
                  coordinate={marker.coordinates}
                  title={marker.title}
                  onPress={()=>this.gotoNewsDashboard(this.state.adminArea, marker.id)}
                >
                <View style={styles.marker2}>
                  <View style={styles.marker1}>
                    <View style={styles.markerNews}>
                     <Text style={styles.content}>N</Text>
                    </View>
                  </View>
                 </View>
                </MapView.Marker>
              ))}

            {/** menmpilkan pin event **/}
            {this.state.markers.map(marker => (
                <MapView.Marker
                  key={marker.id}
                  coordinate={marker.coordinates}
                  title={marker.title}
                  
                >
                  <View style={styles.marker2}>
                  <View style={styles.marker1}>
                    <View style={styles.marker0}>
                     <Text style={styles.content}>E</Text>
                    </View>
                  </View>
                 </View>

                </MapView.Marker>
              ))}

            {/** membuat koordinat END image={require('./../../image/pin-event.png')}  **/}

          </MapView.Animated>

            <View style={styles.snapBar}>
               <Carousel
                  ref={(carousel) => { this._carousel = carousel; }}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  sliderHeight={200}
                  onSnapToItem={(slideIndex)=>{this.onSwipe(slideIndex);}}
                  activeSlideOffset = {0}
                >
                  { slides }
              </Carousel>
            </View>

            {/* Button Tambah event/news  */}
            <Fab onPress={()=>{ this.onPress();
          }
        }
             style={{bottom: itemHeight+5, right: fabPosition-5, width : 40, height: 40, backgroundColor : "transparent", zIndex : 10}}>
              <Image  source={require('./../../image/btn-add.png')}
                  style={{width: 40, height:40}}
              />
            </Fab>

            <Fab onPress={()=>this.focusToMyLocation()} style={{bottom: itemHeight+5, width : 40, height : 40, backgroundColor : "transparent", zIndex : 10}}>
              <Image  source={require('./../../image/btn-backtolocation.png')}
                 style={{width: 40, height:40}}
              />
            </Fab>
          
        </View>

    </Drawer>


    );
  }
}

const drawerStyles = {
  drawer: { width:width,shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},

}

const styles = StyleSheet.create({
  snapContent : {
    height : 100,
    width : snapContentWidth,
    top : 25,
    alignItems : "center",
    paddingLeft : 5,
    paddingRight : 5
  },
  eventImage : {
    width: 70,
    height: 110,
    backgroundColor : "rgba(1, 0, 5, 0.1)",
    position : "absolute",
    bottom : 0,
    right : 0,
    zIndex : 3
  },
  card : {
    width: itemWidth,
    height: 90,
    backgroundColor : "white",
    zIndex : 1,
    bottom : 0,
    alignSelf : "center",
    position : "absolute",
    borderRadius : 5,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowRadius: 100,
    borderWidth : 2,
    borderColor : "#ddd"
  },
  userProfile : {
    zIndex : 2,
    position : "absolute",
    paddingTop : 4,
    height : 45,
    width : 45,
    borderRadius : 50,
    backgroundColor : "white",
    alignItems : "center"
  },
  snapBar : {
    height : 120,
    width : width,
    alignSelf : "center",
    position : "absolute",
    bottom : 0
  },
  slide: {
    width: itemWidth,
    height: 110,
    zIndex : 2,
    bottom : 0
    },
  title : {
   alignItems: 'center'
  },
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
  content : {
    color: 'white',
    fontWeight: "bold",
    transform: [{ rotate: '45deg'}],
    left : 4,
    top : 3
  },
  marker0:{
    height : 20,
    width : 20,
    backgroundColor:"#d6081d",
    borderRadius : 10,
    left : 4,
    top : 4
  },
   markerNews:{
    height : 20,
    width : 20,
    backgroundColor:"#f9d507",
    borderRadius : 10,
    left : 3,
    top : 5
  },
  marker1:{
    width : 30,
    height : 30,
    backgroundColor:"black",
    borderWidth: 1,
    borderColor: 'black',
    transform: [{ rotate: '-45deg'}],
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius : 50
  },
  marker2:{
    width : 40,
    height : 37,
    paddingLeft : 3,
    paddingRight : 3,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
    flex : 1
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
    height : mapHeight,
    width: width+4,
  },
  profileImage:{
	  width:100,
	  height:100,
  },
});
