use derive_more::Display;
use serde::{Serialize, Deserialize};

pub type LatLng = (f64, f64);

#[derive(Deserialize, Display)]
pub enum Mode {
    Foot,
    Bicycle
}
#[derive(Serialize)]
pub struct CalculateRouteResponse {
    pub coords: Vec<LatLng>,
    pub distance: f64
}
#[derive(Deserialize)]
pub struct CalculateRouteRequest {
    pub mode: Mode,
    pub coords: Vec<LatLng>,
}
#[derive(Debug, Deserialize)]
pub struct OSRMRouteResponse {
    pub code: String,
    pub routes: Vec<Route>
}
#[derive(Debug, Deserialize)]
pub struct Route {
    pub geometry: String,
    pub distance: f64
}

#[derive(Deserialize, Debug)]
pub struct EncodeRequest {
    pub latlngs: Vec<LatLng>,
    pub markers: Vec<LatLng>,
    pub distance: f64,
    pub route_type: String
}

#[derive(Serialize, Debug)]
pub struct DecodeResponse {
    pub latlngs: Vec<LatLng>,
    pub markers: Vec<LatLng>,
    pub distance: f64,
    pub route_type: String
}