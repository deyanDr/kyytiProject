import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import { MapScreen } from './components/MapScreen';
import { SearchScreen } from './components/SearchScreen';
import { HelloMapScreen } from './components/HelloMapScreen';


const App = createStackNavigator({
  HelloMapScreen: { screen: HelloMapScreen},
  SearchScreen: { screen: SearchScreen },
  MapScreen: { screen: MapScreen },
},
{
  initialRouteName: 'HelloMapScreen',
  navigationOptions: {
    headerTintColor: 'white',
    headerTitleStyle: {
      color: 'white'
    },
    headerBackTitleStyle: {
      color: 'white'
    },
    headerStyle: {
      borderBottomWidth: 0,
      backgroundColor: '#3A3E42'
    },
  }
});


export default class KyytiProject extends React.Component {
  render() {
    StatusBar.setBarStyle('light-content', true);
    return (
      <App style={styles.container} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
