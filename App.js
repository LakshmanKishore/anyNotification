/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  Platform,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PushNotification from "react-native-push-notification";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';
import Plus from './components/plus';
import Mybttn from './components/button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
    console.log("Working??");
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});
let notiflist = [{ title: 'Title', message: 'Notification Message', time: '24:30:21', key: '1' }]

const testNotfication = (title, message) => {
  PushNotification.localNotification({
    ongoing: true,
    autoCancel: false,
    /* iOS and Android properties */
    title: title,
    message: message,
  });
}

const cancelNotification = () => {
  PushNotification.cancelAllLocalNotifications();
  console.log(notiflist);
  for (let i = 1; i < notiflist.length; i++) {
    schedule(timeDifference(notiflist[i].time), notiflist[i].title, notiflist[i].message);
    console.log("scheduled")
  }
  alert("Deleted");
}

const schedule = (s, title, message) => {
  PushNotification.localNotificationSchedule({
    autoCancel: false,
    title: title,
    message: message, // (required)
    date: new Date(Date.now() + (s * 1000)),
  });
}

const timeDifference = (t1) => {
  let a = t1;
  let b = (new Date().toString().split(" ")[4]);
  let ah = (((parseInt(a[0]) * 10) + parseInt(a[1])));
  let bh = (((parseInt(b[0]) * 10) + parseInt(b[1])));
  let am = ah * 60 + (((parseInt(a[3]) * 10) + parseInt(a[4])));
  let bm = bh * 60 + (((parseInt(b[3]) * 10) + parseInt(b[4])));
  let as = ah * 60 + am * 60 + (((parseInt(a[6]) * 10) + parseInt(a[7])));
  let bs = bh * 60 + bm * 60 + (((parseInt(b[6]) * 10) + parseInt(b[7])));
  return (as - bs);
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

class App extends Component {
  constructor() {
    super();
    this.state = {
      sec: "10",
      selectedTime: '',
      show: false,
      mode: 'time',
      date: (new Date()),
      title: '',
      message: '',
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('notificationDetails')
      if (value !== null) {
        // value previously stored
        let parsed = JSON.parse(value);
        for (let i = 0; i < parsed.length; i++) {
          notiflist[i] = parsed[i];
        }
        for (let i = 0; i < parsed.length; i++) {
          if (notiflist[i].time <= ((new Date().toString().split(" ")[4]))) {
            notiflist.splice(i, 1);
            this.storeData(notiflist);
          }
        }
        console.log("From the getData :" + notiflist);
      }
    } catch (e) {
      // error reading value
      console.log("Error from getData " + e);
    }
  }

  storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('notificationDetails', jsonValue);
    } catch (e) {
      // saving error
      console.log(e);
    }
  }

  cacnelScheduledNotification = (message) => {
    PushNotification.cancelLocalNotifications({ message })
    console.log("Cancelled??");
    for (let i = 1; i < notiflist.length; i++) {
      if (message == notiflist[i].message) {
        notiflist.splice(i, 1);
        this.storeData(notiflist);
      }
    }
    console.log(notiflist);
  }

  render() {
    StatusBar.setBackgroundColor('orange');

    const barNotificationInput = () => {
      const [bartitle, setbartitle] = useState('Title');
      const [barmessage, setbarmessage] = useState('Notification Messsage')

      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.heading}>Bar notification</Text>
          <View>
            <Text style={styles.inptxt}>Enter title of the Notification</Text>
            <TextInput
              style={styles.textinp}
              onChangeText={title => setbartitle(title)}
              placeholder="Title" />
          </View>
          <View style={{ marginTop: 40 }}>
            <Text style={styles.inptxt}>Enter message of the Notification</Text>
            <TextInput
              style={styles.textinp}
              onChangeText={message => setbarmessage(message)}
              placeholder="Message"
              multiline={true} />
          </View>
          <Mybttn title="Set Notification"
            press={() => (testNotfication(bartitle, barmessage),
              Alert.alert(
                "Notification Created",
                "Title:" + bartitle + "\n" + "Message:" + barmessage,
                [
                  {
                    text: 'OK',
                  }
                ]
              ))} />
          <TouchableOpacity style={styles.del} onPress={cancelNotification}>
            <Text style={styles.delText}>DELETE</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const NotificationBar = () => {
      return (
        <Stack.Navigator headerMode='none'>
          <Stack.Screen name="barNotificationInput" component={barNotificationInput} />
        </Stack.Navigator>
      )
    }

    const alertNotificationInput = ({ navigation }) => {
      const [title, settitle] = useState('Title');
      const [message, setmessage] = useState('Notification message');
      const showTime = () => {
        this.setState({
          show: true,
          date: (new Date()),
          title: title,
          message: message,
        })
      }

      const change = (event, selectedDate) => {
        // const currentDate = selectedDate || this.state.date;
        const mdate = selectedDate;
        this.setState({
          show: (Platform.OS === 'ios')
        });
        if (mdate != undefined) {
          const selection = (new Date());
          if ((mdate - selection) < 0)
            alert("Select future time not past time");
          else {
            this.setState({
              sec: ((mdate - selection) / 1000),
              selectedTime: (mdate.toString().split(" "))[4]
            })
            schedule(this.state.sec, this.state.title, this.state.message);
            navigation.navigate('alertNotification');
            notiflist.push({ title: this.state.title, message: this.state.message, time: this.state.selectedTime, key: (new Date().toString()) })
            this.storeData(notiflist);
          }
        }
        console.log(this.state.sec);
        console.log(notiflist);
      }

      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.heading}>Alert Notification</Text>
          <View>
            <Text style={styles.inptxt}>Enter title of the Notification</Text>
            <TextInput
              style={styles.textinp}
              onChangeText={title => settitle(title)}
              placeholder="Title" />
          </View>
          <View style={{ marginTop: 40 }}>
            <Text style={styles.inptxt}>Enter message of the Notification</Text>
            <TextInput
              style={styles.textinp}
              onChangeText={message => setmessage(message)}
              placeholder="Message"
              multiline={true} />
          </View>
          <Mybttn title="Set Notification" press={showTime} />
          {this.state.show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={this.state.date}
              mode={this.state.mode}
              is24Hour={true}
              display='default'
              onChange={change}
            />
          )}
        </View>
      );
    }

    const render = ({ item }) => {

      const deleteHandler = () => {
        Alert.alert(
          "Delete Notification",
          "Title:" + item.title + "\n" + "Message:" + item.message + "\n" + "Time:" + item.time,
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            {
              text: 'Delete',
              onPress: () => this.cacnelScheduledNotification(item.message)
            }
          ],
        )
      }

      return (
        <TouchableOpacity style={styles.list} onPress={deleteHandler}>
          <View style={styles.listTimeTitle}>
            <Text style={styles.listTitle}>{item.title}</Text>
            <Text style={styles.listTime}>Time:{item.time}</Text>
          </View>
          <Text style={styles.listMessage}>{item.message}</Text>
        </TouchableOpacity>
      )
    }

    const alertNotification = ({ navigation }) => {

      return (
        <>
          <View style={styles.tabHeading} >
            <Text style={styles.tabHeadingTxt}>Alert Notification</Text>
            <View style={styles.listflat}>
              <FlatList
                data={notiflist}
                renderItem={render}
              />
            </View>
          </View>
          <View style={styles.plus}>
            <Plus press={() => navigation.navigate('alertNotificationInput')} />
          </View>
        </>
      );
    }

    const NotificationAlert = () => {
      return (
        <Stack.Navigator headerMode='none'>
          <Stack.Screen name="alertNotification" component={alertNotification} />
          <Stack.Screen name="alertNotificationInput" component={alertNotificationInput} />
        </Stack.Navigator>
      )
    }

    return (
      <NavigationContainer>
        <Tab.Navigator tabBarOptions={{
          activeTintColor: 'blue',
          tabStyle: { alignItems: 'center', justifyContent: 'center' },
          inactiveTintColor: 'gray',
        }}>
          <Tab.Screen
            name="NotificationAlert"
            component={NotificationAlert}
            options={{
              title: 'NotificationAlert'.toUpperCase(),
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="notifications" color={color} size={size} />
              ),
            }} />
          <Tab.Screen
            name="NotificationBar"
            component={NotificationBar}
            options={{
              title: 'NotificationBar'.toUpperCase(),
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="notifications-active" color={color} size={size} />
              ),
            }} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  sav: {
    flex: 1,
  },
  plus: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  tabHeading: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  tabHeadingTxt: {
    fontSize: 30,
    color: '#0496FF'
  },
  textinp: {
    padding: 0,
    borderBottomColor: '#00FFC5',
    borderBottomWidth: 2,
    fontSize: 25,
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  inptxt: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#CE8147',
  },
  list: {
    padding: 10,
    backgroundColor: '#F0C987',
    flex: 1,
    margin: 7,
  },
  listTitle: {
    fontSize: 20,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  listMessage: {
    fontSize: 20,
    textAlign: 'left',
  },
  listTime: {
    fontSize: 20,
    textAlign: 'right',
    marginRight: 20,
  },
  listTimeTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listflat: {
    marginTop: 40,
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height - 150)
  },
  heading: {
    fontSize: 30,
    paddingBottom: 50,
    color: '#357DED'
  },
  del: {
    backgroundColor: '#d11a2a',
    width: 250,
    height: 50,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  delText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  }
});

export default App;
