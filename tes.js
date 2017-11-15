import React, { Component } from 'react';
import {
    StyleSheet,
    AsyncStorage,
    Image,
    View,
    Modal,
    Button,
    Text,
    ActivityIndicator,
    BackHandler,
    ToastAndroid
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
export default class Tes extends Component{
  constructor(props) {
    super(props);
    this.state = ({
      modalVisible : true,
      userp : 'uri'
    });
  }

  ComponentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', function() {
      alert("asa");
     });
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
  }

  backHandle=()=>{
    this.setstate({
      modalVisible : false
    });
    return true;
  }

  tesbos=()=>{
   RNFetchBlob.config({
    // add this option that makes response data to be stored as a file,
    // this is much more performant.
    fileCache : true,
  })
  .fetch('GET', 'https://firebasestorage.googleapis.com/v0/b/inmap-2a392.appspot.com/o/inmap%2Fdefault-user-image.png?alt=media&token=6871fb42-ac36-4fff-9224-5024fb5efa56', {
    //some headers ..
  })
  .then((res) => {
    // the temp file path
    this.setState({
      userp : res.path()
    });
    alert(JSON.stringify(res.path()));
  })
  }

/******************************** Login Function END ************************************************/

  render(){
    return(
      <View>
        <Image style={{height : 200, width : 200}} source={{uri:this.state.userp}}/>
       <Button onPress={()=>this.tesbos()} title="click me"/>
      </View>
    );
   }
}
