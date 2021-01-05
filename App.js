import React, {Component} from 'react';
import {scale} from 'react-native-size-matters';
import Share from 'react-native-share';

import {
  StyleSheet,
  Platform,
  View,
  ActivityIndicator,
  FlatList,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
} from 'react-native';
import NotificationPopup from 'react-native-push-notification-popup';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      text: '',
      data: [],
    };
    this.arrayholder = [];
  }

  // GetItem (flower_name) {

  //  Alert.alert(flower_name);

  //  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: scale(5),
          width: '100%',
        }}
      />
    );
  };

  webCall = () => {
    var token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2MDAyNTUxOTIsImp0aSI6IkNmc0lJRmYxWm43TUNJdUJrS2pKVVEiLCJpc3MiOiJodHRwczpcL1wvcmVzb3VyY2VzLnZlZ2E2LmluZm9cLyIsIm5iZiI6MTYwMDI1NTIwMiwiZGF0YSI6eyJ1c2VyX2lkIjoiMSIsImFwcF91cmwiOiJOVWxsIn19.Y4UpB0--8kQWHFHrONhyJy_jGl3VmDZ93Y-qn7yD6tLZRmzktXeIf4YTdraNIMrYTucuVYLB6VrWVhN4TrZpaA';

    console.log('res');

    fetch('https://resources.vega6.info/get-photo/search', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => response.json())
      .then((quote) => {
        console.log(quote.data);
        var jsonArray = quote.data;
        var arr = [];
        var i;
        for (i in jsonArray) {
          arr.push({
            name: jsonArray[i].hasOwnProperty('name')
              ? jsonArray[i].name
              : 'not found',
            url: jsonArray[i].url,
          });
        }

        this.setState({
          dataSource: arr,
        });
        this.arrayholder = arr;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  searchData(text) {
    const newData = this.arrayholder.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      dataSource: newData,
      text: text,
    });
  }

  componentDidMount() {
    this.webCall();
  }

  OpenSocialApps (img, txt) {
    console.log(img);
    //const data = '';
    
    const shareOptions = {
      //message: txt,
      url : img,
      social: Share.Social.FACEBOOK,
      
    };
    try {
      const ShareResponse = Share.open(shareOptions);
    } catch (error) {
      console.log('Error ', error);
    }
  };

  // Render function
  renderCustomPopup = ({appIconSource, appTitle, timeText, title, body}) => (
    <View
      style={{
        backgroundColor: '#F8F9F9',
        borderWidth: scale(1.5),
        borderColor: '#000',
        borderRadius: scale(10),
      }}>
      <View
        style={{
          padding: scale(5),
          borderTopStartRadius: scale(10),
          borderTopEndRadius: scale(10),
          backgroundColor: '#CCD1D1',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text>{appTitle}</Text>
      </View>

      

        <View 
          style={{flexDirection: 'row', alignItems: 'center'}} 
         
          >
          <Image
            source={appIconSource}
            style={{width: scale(50), height: scale(50), margin: scale(10)}}
          />
          <Text style={{fontSize: scale(15)}}>{body}</Text>
          </View>
      
      
    </View>
  
  );

  render() {

    return (
      <View style={styles.MainContainer}>
        <View
          style={{
            height: scale(40),
            margin: scale(5),
            backgroundColor: 'white',
            borderColor: 'grey',
            borderRadius: scale(5),
            borderWidth: scale(1),
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: scale(10),
              alignItems: 'center',
            }}>
            <Image
              style={{width: scale(20), height: scale(20)}}
              source={require('./assets/search.png')}
            />
            <TextInput
              placeholder="Search by Name"
              style={styles.textInput}
              onChangeText={(text) => this.searchData(text)}
              value={this.state.text}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        <FlatList
          data={this.state.dataSource}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({item, index}) => (
            <View
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: scale(10),
                borderWidth: scale(1.5),
                borderColor: '#ccc',
                padding: scale(10),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.popup.show({
                    onPress:()=> this.OpenSocialApps(item.url, item.name),
                    appIconSource: {uri :item.url},
                    appTitle: 'Sample App',
                    timeText: 'Now',
                    title: 'Hello World',
                    body: item.name,
                    slideOutTime: 5000,
                  });
                }}
                style={{
                  flexDirection: 'row',
                }}>
                <Image
                  source={{uri: item.url}}
                  style={{width: scale(100), height: scale(100)}}
                />

                <Text
                  style={{
                    marginLeft: scale(5),
                    fontSize: scale(15),
                  }}>
                  {+item.hasOwnProperty('name') ? item.name : 'not found'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          extraData={true}
        />

        <NotificationPopup
          ref={(ref) => (this.popup = ref)}
          renderPopupContent={this.renderCustomPopup}
          shouldChildHandleResponderStart={true}
          shouldChildHandleResponderMove={true}
        />
      </View>
    );

  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: scale(5),
    marginTop: Platform.OS === 'android' ? scale(10) : scale(0),
  },
  textInput: {
    flex: 1,
    marginLeft: scale(5),
    fontSize: scale(15),
  },
});
