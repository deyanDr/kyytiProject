import React from 'react';
import { View, Alert, Button } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';

import { testStartLocation, testEndLocation } from '../constants';
import { Icon } from 'react-native-elements';
import { ITravelOption } from './Helpers/Types';

interface State {
    startLocation: {
        latitude: number;
        longitude: number;
    }
    travelOption: ITravelOption;
    coordinates2DArray: Array<Array<LatLng>>;
    colorsObjectArray: Array<string>;
    travelTypeArray: Array<string>;
}

interface Props {
    travelOption: ITravelOption;
    startLocation: {
        latitude: number;
        longitude: number;
    }
}

export class MapScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            startLocation: props.startLocation,
            travelOption: props.travelOption,
            coordinates2DArray: Array<Array<LatLng>>(),
            colorsObjectArray: Array<string>(),
            travelTypeArray: Array<string>(),
        };
    }

    updateRoute(travelOption: ITravelOption) {
        let coordinates2DArray = Array<Array<LatLng>>();
        let colorsObjectArray = Array<string>();
        let travelTypeArray = Array<string>();

        travelOption.legs.forEach((leg: any) => {
            // Track coordinates of leg
            let coordinates = Array<LatLng>();

            leg.shape.forEach((coord: Array<number>) => {
                let coordinate = {
                    latitude: coord[0],
                    longitude: coord[1]
                }
                coordinates.push(coordinate);
            });
            // Get iconRefs
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
            <View style={{
                flex: 0.7,
                justifyContent: 'flex-end',

                margin: 0,
            }}>
                <MapView
                    onMapReady={() => this.updateRoute(this.state.travelOption)}
                    style={{
                        flex: 1,
                        borderTopColor: 'white',
                        borderTopWidth: 2,
                    }}
                    initialRegion={{
                        latitude: this.state.startLocation.latitude,
                        longitude: this.state.startLocation.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
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
