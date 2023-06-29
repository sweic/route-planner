

use actix_web::{post, web::{Json, self}};
use reqwest::{Client};
use fred::{pool::RedisPool};
use std::{sync::{Arc}};
use crate::api::schemas::{CalculateRouteRequest, CalculateRouteResponse, OSRMRouteResponse, Mode};
pub struct AppState {
    pub reqwest_client: Client,
    pub redis_client: Arc<RedisPool>,
}

#[post("/route")]
pub async fn calculate_route(app_state: web::Data<AppState>, request: Json<CalculateRouteRequest>) -> Result<Json<CalculateRouteResponse>, Box<dyn std::error::Error>>  {

    let mut coords_string = String::new();

    for (lat, lng) in &request.coords {
        coords_string.push_str(&format!("{},{};", &lng.to_string(), &lat.to_string()));
    }

    coords_string.pop();

    let base_url = match request.mode {
        Mode::Foot => "http://router.project-osrm.org/route/v1/foot",
        Mode::Bicycle => "http://router.project-osrm.org/route/v1/bicycle"
    };

    let endpoint_url = format!("{}/{}?steps=true", base_url, coords_string);

    let resp = app_state.reqwest_client.get(endpoint_url).send().await?.json::<OSRMRouteResponse>().await?;

    if let Some(elem) = resp.routes.get(0) {
        if let Some(ls) = polyline::decode_polyline(&elem.geometry, 5).ok() {
            let x = ls.into_inner();
            return Ok(Json(CalculateRouteResponse {
                coords: x.iter().map(|&point| (point.y, point.x)).collect(),
                distance: elem.distance
            }));
        } 
    } 

    Err("No Routes Found".into())
   
}

