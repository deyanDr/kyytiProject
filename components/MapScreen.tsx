import React from 'react';
import { View, Alert } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps'

import { testEndLocation, testStartLocation } from '../constants';

interface Props {
    coordinates2DArray: Array<Array<LatLng>>;
    colorsObjectArray: Array<string>;
    travelTypeArray: Array<string>;
}

interface State {
    coordinates2DArray: Array<Array<LatLng>>;
    colorsObjectArray: Array<string>;
    travelTypeArray: Array<string>;
}

export class MapScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            colorsObjectArray: props.navigation.state.params.colorsObjectArray,
            coordinates2DArray: props.navigation.state.params.coordinates2DArray,
            travelTypeArray: props.navigation.state.params.travelTypeArray
        };
    }

    onPolyPress(travelType: string) {
        Alert.alert(
            'Get the',
            travelType,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
    }

    static navigationOptions = {
        title: 'Starter',
    };

    render() {
        return (
            <View  style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: 60.189862,
                    longitude: 24.921628,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}>
                {this.state.coordinates2DArray
                .map((coordinates, index) => {
                    console.log(coordinates);
                    console.log(this.state.colorsObjectArray[index]);
                    return <Polyline
                        key={index}
                        coordinates={coordinates}
                        strokeColor={this.state.colorsObjectArray[index]}
                        fillColor={this.state.colorsObjectArray[index]}
                        strokeWidth={2}
                        onPress={() => this.onPolyPress(this.state.travelTypeArray[index])}
                    />
                })
                }
                <Marker
                    coordinate={testStartLocation}
                    title="Departure" />
                <Marker
                    coordinate={testEndLocation}
                    title="Finish" />
            </MapView>
            </View>
        );
    }
}