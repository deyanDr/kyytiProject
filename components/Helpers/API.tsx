import { URLS, HEADERS, SEARCH_ROUTE, testStartLocation, testEndLocation } from "../../constants";

export const API = {
    async getPublicTransitRoutes(name = "Kyyti Office - Test",
        address = "Fredrikinkatu 47",
        startLocation = testStartLocation,
        endLocation = testEndLocation) {
            console.log(address);
        let result = await fetch(URLS.ROUTES, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({
                "start": {
                    "location": {
                        "lat": startLocation.latitude,
                        "lon": startLocation.longitude
                    }
                },
                "end": {
                    "name": name,
                    "address": address,
                    "city": "Helsinki",
                    "country": "Suomi",
                    "type": "poi",
                    "location": {
                        "lat": endLocation.latitude,
                        "lon": endLocation.longitude
                    }
                },
                "timeType": "departure",
                "routeModes": "publicTransport:bus,tram",
                "passengers": {
                    "count": 1
                },
                "extraInfo": {
                    "extraLuggageCount": 0
                }
            })
        })
        .then((response) => response.json());
        return result.routes.publicTransport;
    },
    async getDepartureLocations(text = "Linnanmaki", at = `${testStartLocation.latitude,testStartLocation.longitude}`) {
        let result = await fetch(`${URLS.PLACES}?text=${text}$at=${at}`, {
            method: 'GET',
            headers: HEADERS,
        })
        .then((response) => response.json());
        return result.search;
    },
}
