import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps'
import { Icon, SearchBar } from 'react-native-elements'

import { testStartLocation, testInitialRegion } from '../constants';
import { MapScreen } from './MapScreen';
import { SearchScreen } from './SearchScreen';


export interface Props {
  navigation: NavigationScreenProp<any, any>
}

interface State {
  startLocation: {
    latitude: number,
    longitude: number
  };
}

export class HelloMapScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      startLocation: testStartLocation
    }
    props.navigation.setParams({ startLocation: testStartLocation })
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Hello Map',
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => navigation.navigate('SearchScreen')} >
          <Icon name="search" color="white" />
        </TouchableOpacity>
      ),
    }
  };

  onUserPinDragEnd(event) {
    this.setState({ startLocation: event.nativeEvent.coordinate })
    this.props.navigation.setParams({ startLocation: event.nativeEvent.coordinate })
    console.log(this.props.navigation.state)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1, zIndex: -1 }}
          initialRegion={testInitialRegion}>
          <Marker
            coordinate={testStartLocation}
            title="My Location"
            draggable
            onDragEnd={this.onUserPinDragEnd.bind(this)}
          />
        </MapView>
      </View>
    );
  }
}
