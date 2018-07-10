import React from 'react';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps'

const testLocation = {
    latitude: 60.189862,
    longitude: 24.921628,
};

interface State {
    coordinates: Array<LatLng>;
}

interface Props {

}

export class MapStarterScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
           coordinates: [testLocation]
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
                "name":"Middle of nowhere - Test",
                "address":"Museokatu 32",
                "city":"Helsinki",
                "country":"Suomi",
                "type":"poi",
                "location":{
                    "lat":60.172585,
                    "lon":24.9260266
                }
            },
            "end":{
                "name":"Kyyti Office - Test",
                "address":"Kaisaniemenkatu 1",
                "city":"Helsinki",
                "country":"Suomi",
                "type":"poi",
                "location":{
                    "lat":60.1706234,
                    "lon":24.9440555
                }
            },
            "timeType":"departure",
            "routeModes":"kyyti:express,flex,smart",
            "passengers":{
                "count":1
            },
            "extraInfo":{
                "extraLuggageCount":0
            }
        }),
      }).then((response) => response.json())
      .then((responseJson => {
          let coordinates = [this.state.coordinates[0]];
          let initialCoords = responseJson.routes.kyyti[0].legs[0].shape;
          initialCoords.forEach(coord => {
              let coordinate = {
                  latitude: coord[0],
                  longitude: coord[1]
              }
              coordinates.push(coordinate);
          });
          this.setState({
              coordinates
          })
        }))
      .catch((error) => {
          console.log(error);
      });
  }
    

    static navigationOptions = {
        title: 'Starter',
    };

    render() {
        return (
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: 60.189862,
                    longitude: 24.921628,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}>
                    <Polyline
                    coordinates={this.state.coordinates}
                    strokeColor="red"
                    fillColor="red"
                    strokeWidth={1}/>
                    />
                
                <Marker
                    coordinate={testLocation}
                    title="Your location" />
            </MapView>
        );
    }
}