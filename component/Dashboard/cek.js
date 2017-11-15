<Tabs style={styles.tab}>
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
  </Tab>
  <Tab tabStyle={{backgroundColor: '#2f2f2f'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#3f3f3f'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}} heading="Post">

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

  </Tab>
</Tabs>
