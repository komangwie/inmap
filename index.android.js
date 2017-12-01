
import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import MapView from 'react-native-maps';
import Login from './component/Login/Login';
import Signup from './component/Signup/Signup';
import Dashboard from './component/Dashboard/Dashboard';
import Tambah from './component/tambah/tambah';
import Choose from './component/Pilih/choose';
import Share from './component/Pilih/Share';
import ListConfirmEvent from './component/Pilih/ListConfirmEvent';
import FreeEvent from './component/Pilih/FreeEvent';
import ConfirmEvent from './component/Pilih/ConfirmEvent';
import Detail from './component/Pilih/Detail';
import userDashboard from './component/Pilih/userDashboard';
import Following from './component/Pilih/Following';
import addFollowing from './component/Pilih/addFollowing';
import ScrollViewExample from './component/Pilih/scroll';
import News from './component/Pilih/News';
import NewsDashboard from './component/Pilih/NewsDashboard';
import DetailNews from './component/Pilih/DetailNews';
import Tes from './tes';
console.disableYellowBox = true;
export default class inmap extends Component {
  static navigationOptions = {
      header : null
  };

  render() {
     const { navigation } = this.props;
     const { navigate } = this.props.navigation;
    return (
      <View style={{flex: 1,backgroundColor:'#e6e6e6'}}>
       {/* <Tes/>*/}
   <Login navigation={ navigation }/> 
      </View>
    );
  }
}
const SimpleApp = StackNavigator({
  Home: { screen: inmap},
  Signup :{screen: Signup},
  Dashboard :{screen:Dashboard},
  Tambah : {screen:Tambah},
  Choose : {screen:Choose},
  Share : {screen:Share},
  ListConfirmEvent : {screen: ListConfirmEvent},
  FreeEvent : {screen:FreeEvent},
  ConfirmEvent : {screen: ConfirmEvent},
  Detail : {screen : Detail},
  userDashboard : {screen : userDashboard},
  Following : {screen: Following},
  addFollowing : {screen : addFollowing},
  News : {screen : News},
  NewsDashboard : {screen : NewsDashboard},
  DetailNews : {screen : DetailNews}
});


const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('inmap', () => SimpleApp);
