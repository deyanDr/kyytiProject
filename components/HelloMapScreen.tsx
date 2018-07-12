import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps'

import { testStartLocation, testInitialRegion } from '../constants';


export interface Props {
  navigation: NavigationScreenProp<any, any>
}

interface State {
}

export class HelloMapScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Hello Map',
      headerRight: (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate('SearchScreen')} >
          <Text style={{color: 'white'}}>Search Routes</Text>
        </TouchableOpacity>
      ),
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={testInitialRegion}>
          <Marker
            coordinate={testStartLocation}
            title="My Location" />
        </MapView>
      </View>
    );
  }
}
