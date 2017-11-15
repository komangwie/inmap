import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Select,
  ScrollView,
  View
} from 'react-native';
import { Container, Content, Header, Title, Left, Body, Right, Button, Icon, Thumbnail, Text, Tabs, Tab, TabHeading, ListItem } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
export default class Kontak extends Component {
    render() {
        return (
            <Container style={{backgroundColor:'white'}}>
                <Content>
                    <Header style={{backgroundColor: '#2f2f2f'}}>
                        <Left>
                            <Button transparent>
                                <Icon name='arrow-back' style={{color: '#f39c12'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Kontak</Title>
                        </Body>
                        <Right />
                    </Header>
                    <View style={{ backgroundColor: '#2f2f2f',  height: 150 }}>
                        <Thumbnail style={{alignSelf:'center', height: 80, width: 80, marginTop:'5%'}} source={{uri:'https://firebasestorage.googleapis.com/v0/b/inmap-2a392.appspot.com/o/user.png?alt=media&token=e9490617-6452-4983-bb97-7e9a095a3bf6'}} />
                        <Body>
                            <Text style={{color:'#f2f2f2'}}>Agung Rahadian</Text>
                            <Text note style={{fontSize:10}}>@Agung Rahadian</Text>
                        </Body>
                    </View>
                    <Tabs>
                        <Tab tabStyle={{backgroundColor: '#2f2f2f'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#3f3f3f'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}} heading='Followers'>
                            <ListItem avatar onPress = {() => alert("item")}>
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
                        <Tab tabStyle={{backgroundColor: '#2f2f2f'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#3f3f3f'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}} heading="Following">
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
                        <Tab tabStyle={{backgroundColor: '#2f2f2f'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#3f3f3f'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}} heading="Attend">
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
                        <Tab tabStyle={{backgroundColor: '#2f2f2f'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#3f3f3f'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}} heading="Post">
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
                    </Tabs>
                </Content>
            </Container>
        );
    }
}