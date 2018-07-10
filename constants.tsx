export const testStartLocation = {
    latitude: 60.189862,
    longitude: 24.93939,
};
export const testEndLocation = {
    latitude: 60.162788,
    longitude: 24.9440555
}

export const SEARCH_ROUTE = {
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
}

export const HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

export const URLS = {
    ROUTES: "https://devapi.tuup.fi/routing/v1/routes",
    PLACES: ""
}
