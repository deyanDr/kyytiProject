import React from 'react';
import { View, Alert } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps'

import { testStartLocation, testEndLocation } from '../constants';
import { Icon } from 'react-native-elements';

interface State {
    startLocation: {
        latitude: number;
        longitude: number;
    }
    travelOption: any;
    coordinates2DArray: Array<Array<LatLng>>;
    colorsObjectArray: Array<string>;
    travelTypeArray: Array<string>;
}

interface Props {
    travelOption: any;
    startLocation: {
        latitude: number;
        longitude: number;
    }
}

export class MapScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        console.log(props.navigation.state.params.startLocation);
        this.state = {
            startLocation: props.navigation.state.params.startLocation,
            travelOption: props.navigation.state.params.travelOption,
            coordinates2DArray: Array<Array<LatLng>>(),
            colorsObjectArray: Array<string>(),
            travelTypeArray: Array<string>(),
        };
    }

    updateRoute(travelOption: any) {
        let coordinates2DArray = Array<Array<LatLng>>();
        let colorsObjectArray = Array<string>();
        let travelTypeArray = Array<string>();

        travelOption.legs.forEach((leg: any) => {

            let coordinates = Array<LatLng>();
            leg.shape.forEach((coord: Array<number>) => {
                let coordinate = {
                    latitude: coord[0],
                    longitude: coord[1]
                }
                coordinates.push(coordinate);
            });
            travelTypeArray.push(leg.iconRef);
            colorsObjectArray.push(leg.color);
            coordinates2DArray.push(coordinates);
        })
        this.setState({
            colorsObjectArray,
            coordinates2DArray,
            travelTypeArray
        })
    }

    onPolyPress(travelType: string) {
        Alert.alert(
            'Get the',
            travelType,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
        )
    }

    static navigationOptions = {
        title: 'Route',
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    onMapReady={() => this.updateRoute(this.state.travelOption)}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: this.state.startLocation.latitude,
                        longitude: this.state.startLocation.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}>
                    {this.state.coordinates2DArray.map((coordinates, index) => {
                        return <Polyline
                            key={index}
                            coordinates={coordinates}
                            strokeColor={this.state.colorsObjectArray[index]}
                            fillColor={this.state.colorsObjectArray[index]}
                            strokeWidth={2}
                            onPress={() => this.onPolyPress(this.state.travelTypeArray[index])}
                        />
                    })}
                    <Marker
                        coordinate={this.state.startLocation || testStartLocation}
                        title="Departure">
                        <Icon name="map-pin" type="font-awesome" color='red' />
                    </Marker>
                    <Marker
                        coordinate={testEndLocation}
                        title="Finish">
                        <Icon name="map-pin" type="font-awesome" color='blue' />
                    </Marker>
                </MapView>
            </View>
        );
    }
}
