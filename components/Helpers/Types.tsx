
export interface ITravelObject {
    travelMode: string;
    lineCode?: string;
    distance: number;
    duration: {
        min: number,
        max: number
    }
    color: string
}

export interface ITravelOption {
    departureTime: {
        time: string,
        isRealTime: boolean
    },
    totalPrice: {
        formattedPrice: string,
    }
    legs: Array<ILeg>,
}

export interface ILeg {
    shape: [Array<number>],
    iconRef: string,
    color: string
}