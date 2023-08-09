import "../src/leaflet.js"

export default class CityMarker extends L.Marker{

    constructor(coords,options,city){
        super(coords,options);
        this.city=city;
    }
}