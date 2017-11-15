import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  ListView,
  Modal,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  View,
  BackHandler
} from 'react-native';
import * as firebase from 'firebase';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import Swiper from "react-native-deck-swiper";
import { StackNavigator  } from 'react-navigation';
import Carousel from 'react-native-snap-carousel';
import {Container, Icon,Thumbnail, Fab, Card, CardItem} from 'native-base';
var{width,height}=Dimensions.get('window');
var mapHeight = height + 10;
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
      
      this.state={
          detail:[],
          region : {
            latitude : -8.906789,
            longitude : 115.178232,
            latitudeDelta : 0.01,
            longitudeDelta : 0.01,
          },
          cardIndex : 0,
          index:0,
          swipedAllCards: false,
          swipeDirection: "",
          isSwipingBack: false,
          markers: [],
          adminArea: "",
          newsLatitude : -8.906789,
          newslongitude : 115.178232,
          newsLatitudeDelta : 0.01,
          newsLongitudeDelta : 0.01,
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
          leftSwipe : false,
          rightSwipe : true,
          identity : 0,
          rightIdentity : 0,
          selected : false
      };
  }

  //handle back press on midle level
  onselectDetailNews = data => {
    this.setState(data);
  }

  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
  }
  
  backPressed = () => {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.onSelect({ selected: true });
    return true;
  }

  gotoNewsDetail=(id, photo, title, userUid, username)=>{
    const { navigate } = this.props.navigation;
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    navigate("DetailNews",{id: id, photoProfil : photo, title : title, userUid : userUid, username : username, onselectDetailNews: this.onselectDetailNews});
  }

  componentWillUpdate(){
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
  }
  //handle back press end

  componentDidMount() {

    this.watchId = navigator.geolocation.watchPosition(
        (position) => {
            this.setState({
                myLongitude: position.coords.longitude,
                myLatitude : position.coords.latitude

            });
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );

    var userId = firebase.auth().currentUser.uid;

    var userFollowing = firebase.database().ref().child("following/"+userId);

    var database = firebase.database().ref("showNews/"+this.props.navigation.state.params.adminArea+"/"+this.props.navigation.state.params.regency);
    
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
            title: dataSnapshot.val().newsTitle,
            description : dataSnapshot.val().newsDescription,
            image : dataSnapshot.val().userProfilPhoto,
            newsImage : dataSnapshot.val().imageResized,
            latitude : dataSnapshot.val().locationLatitude,
            longitude : dataSnapshot.val().locatonLongitude,
            userUid : dataSnapshot.val().userUid,
            username : dataSnapshot.val().username
            });

             this.state.markers.push({
              id:dataSnapshot.key,
              title: dataSnapshot.val().newsTitle,
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

    database.on("child_removed", (dataSnapshot)=>{
      this.state.detail = this.state.detail.filter((x)=>x.id !== dataSnapshot.key);
      this.state.markers = this.state.markers.filter((x)=>x.id !== dataSnapshot.key);
    });

  }

onRegionChange=(region)=>{
  // this.setState({
  //   newsLatitude : region.latitude,
  //   newslongitude : region.longitude,
  //   newsLatitudeDelta : region.latitudeDelta,
  //   newslongitudeDelta : region.longitudeDelta
  // });
  this.setState({region});
}

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

  componentWillUnmount() {
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
                   <TouchableOpacity onPress={()=>this.focusToActiveEvent()}>
                          <Image style={{height : 105, width : 65, alignSelf : "center", top : 2.5}} source={{uri:entry.newsImage}}/>
                    </TouchableOpacity>
              </View>
            
             {/*bagian snap bar detail yang bisa dklik untuk menampilkandetail event*/}
             <View style={styles.card}>
                <TouchableOpacity  onPress={()=>this.gotoNewsDetail(entry.id, entry.image, entry.title, entry.userUid, entry.username)} >
                 
                  <View style={styles.snapContent}>
                    <Text style={{fontSize:14, color : "black", fontWeight: "bold",  textAlign : "center", alignSelf : "center"}} >{entry.title}</Text>
                    <Text style={{fontSize : 12}} note>{entry.description}</Text>
                  </View>
                    
                 </TouchableOpacity>
             </View>
           
          </View>
        );
    });
    const { navigate } = this.props.navigation;
    return (
       <View style={styles.container}>
        
         {/** MapView START **/}
          <MapView style={styles.map}
            region={this.state.region}

            onRegionChange={this.onRegionChange}
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
              <View style={styles.radius}>
                <View style={styles.marker}>
                </View>
              </View>
              {/** membuat tampilan point lokasi berbentuk lingkaran dan radius biru END **/}

            </MapView.Marker>
            {/** membuat koordinat user END **/}

            {/** menmpilkan pin news **/}
            {this.state.markers.map(marker => (
                <MapView.Marker
                  key={marker.id}
                  coordinate={marker.coordinates}
                  title={marker.title}
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


            {/** membuat koordinat END image={require('./../../image/pin-event.png')}  **/}

          </MapView>
          {/** MapView END **/}

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

            <Fab onPress={()=>this.focusToMyLocation()} style={{bottom: itemHeight+5, width : 40, height : 40, backgroundColor : "transparent", zIndex : 10}}>
              <Image  source={require('./../../image/btn-backtolocation.png')}
                 style={{width: 40, height:40}}
              />
            </Fab>

        
          {/** konten pada bagian detail view END **/}

       </View>
     
    );
  }
}

const styles = StyleSheet.create({
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
    bottom : 0,
  },
  slide: {
    width: itemWidth,
    height: 110,
    zIndex : 2,
    bottom : 0,
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
});
