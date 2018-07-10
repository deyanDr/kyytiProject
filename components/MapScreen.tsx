import React from 'react';
import { View, Alert } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps'

const testStartLocation = {
    latitude: 60.189862,
    longitude: 24.93939,
};
const testEndLocation = {
    latitude: 60.162788,
    longitude: 24.9440555
}

interface State {
    coordinates2DArray: Array<Array<LatLng>>;
    colorsObjectArray: Array<string>;
    travelTypeArray: Array<string>;
}

interface Props {

}

export class MapScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            colorsObjectArray: [],
            coordinates2DArray: [[]],
            travelTypeArray: []
        };
    }

    componentDidMount() {
        fetch('https://devapi.tuup.fi/routing/v1/routes', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "start":{
                    "location":{
                        "lat": testStartLocation.latitude,
                        "lon": testStartLocation.longitude
                    }
                },
                "end":{
                    "name":"Kyyti Office - Test",
                    "address":"Fredrikinkatu 47",
                    "city":"Helsinki",
                    "country":"Suomi",
                    "type":"poi",
                    "location":{
                        "lat": testEndLocation.latitude,
                        "lon": testEndLocation.longitude
                    }
                },
                "timeType":"departure",
                "routeModes":"publicTransport:bus,tram",
                "passengers":{
                    "count":1
                },
                "extraInfo":{
                    "extraLuggageCount":0
                }
            }),
        }).then((response) => response.json())
            .then((responseJson => {
                let publicTransportOptionsArray = responseJson.routes.publicTransport;
                let coordinates2DArray = Array<Array<LatLng>>();
                    let colorsObjectArray = Array<string>();
                    let travelTypeArray = Array<string>();
                publicTransportOptionsArray.forEach((publicTransportOption) => {
                    let legs = publicTransportOption.legs;
                    
                    legs.forEach(leg => {
                        let coordinates = Array<LatLng>();
                        leg.shape.forEach(coord => {
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
                })
                let legs = responseJson.routes.publicTransport[2].legs;
            }))
            .catch((error) => {
                console.log(error);
            });
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
                {this.state.coordinates2DArray.map((coordinates, index) => {
                    console.log(index);
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

{/* <Polyline
                    coordinates={this.state.coordinates}
                    strokeColor="red"
                    fillColor="red"
                    strokeWidth={1}/>
                    /> */}