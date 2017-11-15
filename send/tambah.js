/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Select,
  ScrollView,
  View
} from 'react-native';

import { Picker, Container, Item, Input, Content, ListItem, CheckBox, Header, Left, Right, Body, Button, Icon, Title, Subtitle, Thumbnail, CardItem, Card, Image } from 'native-base';
export default class tambah extends Component {
        constructor(props) {
            super(props);
            this.state = {
                selectedItem: undefined,
                selected1: 'java',
                results: {
                    items: []
                }
            }
        }
        onValueChange (value: string) {
            this.setState({
                selected1 : value
            });
        }

        render() {
            return (
                <Container>
                  <Header style={{backgroundColor: '#2f2f2f'}}>
                      <Left>
                          <Button transparent>
                              <Icon name='arrow-back' style={{color: '#f39c12'}}/>
                          </Button>
                      </Left>
                      <Body>
                          <Title>Create New</Title>
                      </Body>
                      <Right />
                  </Header>
                  <Card style={{height:'100%'}}>
                        <CardItem style={{paddingBottom:'3%'}}>
                            <Left>
                                <Thumbnail source={{uri:'https://firebasestorage.googleapis.com/v0/b/inmap-2a392.appspot.com/o/user.png?alt=media&token=e9490617-6452-4983-bb97-7e9a095a3bf6'}} />
                                <Body>
                                    <Text style={{color:'#2f2f2f'}}>Agung Rahadian</Text>
                                    <Text note style={{fontSize:10}}>@Agung Rahadian</Text>
                                </Body>
                            </Left>
                        </CardItem>

                        <View style={{backgroundColor:'#2f2f2f', height:0.5, width:'90%', alignSelf:'center'}}/>

                        <ScrollView>
                          <CardItem>
                              <Body>
                                <Button style={{alignSelf:'center', backgroundColor:'#f39c12', marginTop: '6%'}}>
                                  <Text style={{fontSize:32, color: '#fff'}}>+</Text>
                                </Button>
                                <Text style={{marginTop: '6%'}}> Pilih Kategori</Text>
                                <Picker 
                                  mode="dropdown" 
                                  style={{backgroundColor:'#f9f9f9', width:'100%', height: 40, marginTop: '1%'}}
                                  selectedValue={this.state.selected1}
                                  onValueChange={this.onValueChange.bind(this)}
                                > 
                                  <Picker.Item label="Java" value="java" style={{fontSize:10}}/> 
                                  <Picker.Item label="JavaScript" value="js" style={{fontSize:10}}/> 
                                </Picker >
                                <Item regular style={{height:40, marginTop: '2%'}}>
                                  <Input placeholder='Write a Title ... ' style={{fontSize:14}}/>
                                </Item>
                                <Item regular style={{marginTop: '2%'}}>
                                  <Input style={{fontSize:14, height: 200}} placeholder='Write a Description ... '  multiline = {true} numberOfLines = {4}/>
                                </Item>
                                <Button style={{marginTop: '2%', alignSelf:'flex-end', backgroundColor:'#f39c12'}}>
                                  <Text style={{fontSize:12, color: '#fff'}}>Let's Share</Text>
                                </Button>
                              </Body>
                          </CardItem>
                        </ScrollView>
                   </Card>
              </Container>
            );
        }
}

