use std::{io::{Write, Read}};
use actix_web::{post, web::{Json, self}, get};
use base64::{alphabet, engine::{general_purpose, GeneralPurpose}, Engine};
use flate2::{Compression, write::ZlibEncoder, read::ZlibDecoder};
use uuid::Uuid;
use crate::api::{schemas::DecodeResponse, routes::AppState};
use super::schemas::{EncodeRequest, LatLng};
use fred::prelude::*;

const B64_ENGINE: GeneralPurpose =
    GeneralPurpose::new(&alphabet::URL_SAFE, general_purpose::NO_PAD);

fn encode_coordinates(ll: &Vec<LatLng>) -> Result<String, Box<dyn std::error::Error>> {
// Converts vector of latlngs into a string of latlngs in the format `1.0,2.0;3.0,4.0`
    let coordinates_str = ll
                        .iter()
                        .map(|(lat, lng)| format!("{},{}", lat, lng))
                        .collect::<Vec<_>>()
                        .join(";");

// Compresses the coordinate string into a shorter one
    let mut encoder = ZlibEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(coordinates_str.as_bytes())?;
    let compressed_str =  encoder.finish()?;
  
// Returns encoded string
    Ok(B64_ENGINE.encode(compressed_str))

}

fn decode_coordinates(ll: &str) -> Result<Vec<LatLng>, Box<dyn std::error::Error>> {

    let compressed_bytes = B64_ENGINE.decode(ll)?;

    let mut decoder = ZlibDecoder::new(&compressed_bytes[..]);
    let mut decompressed_bytes = Vec::new();
    decoder.read_to_end(&mut decompressed_bytes)?;

    let coord_str = String::from_utf8(decompressed_bytes)?;

    let result = coord_str
                        .split(";")
                        .filter_map(|x| {
                            let parts = x.split(",").collect::<Vec<_>>();
                            if parts.len() != 2 { return None };
                            let lat = parts[0].parse::<f64>().ok()?;
                            let lng = parts[1].parse::<f64>().ok()?;
                            Some((lat, lng))
                        })
                        .collect::<Vec<LatLng>>();

    Ok(result)
}

fn decode_f64(f64_str: &str) -> Result<f64, Box<dyn std::error::Error>> {

    let decoded_bytes_vec = B64_ENGINE.decode(f64_str)?;

    if decoded_bytes_vec.len() < 8 {
        return Err("Invalid encoded f64: Insufficient bytes".into());
    }

    let decoded_bytes_arr = decoded_bytes_vec[..8].try_into()?;
    let result = f64::from_le_bytes(decoded_bytes_arr);

    Ok(result)

}

fn decode_str(r_str: &str) -> Result<String, Box<dyn std::error::Error>> {

    let decoded_str = B64_ENGINE.decode(r_str)?;
    let result = String::from_utf8(decoded_str)?;

    Ok(result)
}


#[post("/encode")]
pub async fn encode_route(request: Json<EncodeRequest>, app_state: web::Data<AppState>) -> Result<String, Box<dyn std::error::Error>> {

    let encoded_markers = encode_coordinates(&request.markers)?;
    let encoded_latlngs = encode_coordinates(&request.latlngs)?;
    let encoded_distance = B64_ENGINE.encode(request.distance.to_le_bytes());
    let encoded_type = B64_ENGINE.encode(request.route_type.as_bytes());

    let result = vec![encoded_markers, encoded_latlngs, encoded_distance, encoded_type].join("&");

    let id = Uuid::new_v4().to_string();

    let client = app_state.redis_client.clone();
    
    let _: () = client.set(&id, result, None, None, false).await?;

    Ok(id)
}

#[get("/decode/{name}")]
pub async fn decode_route(route: web::Path<String>, app_state: web::Data<AppState>) -> Result<Json<DecodeResponse>, Box<dyn std::error::Error>> {
    let key = route.to_string();

    let client = app_state.redis_client.clone();

    let to_decode: String = client.get(&key).await?;

    if to_decode.eq("nil") {
        return Err("Cannot find route".into());
    }

    let components = to_decode.split("&").into_iter().collect::<Vec<_>>();

    if components.len() < 4 { return Err("Incomplete Route".into()) };

    let decode_markers = components.get(0).unwrap();
    let decode_latlngs = components.get(1).unwrap();
    let decode_distance = components.get(2).unwrap();
    let decode_type = components.get(3).unwrap();

    let marker_coordinates = decode_coordinates(&decode_markers).map_err(|e| format!("Unable to decode marker coordinates {}", e))?;

    let latlngs_coordinates = decode_coordinates(&decode_latlngs).map_err(|e| format!("Unable to decode latlngs coordinates {}", e))?;

    let distance = decode_f64(&decode_distance).map_err(|e| format!("Unable to decode distance {}", e))?;

    let route_type = decode_str(&decode_type).map_err(|e| format!("Unable to decode route type {}", e))?;

    let result = DecodeResponse {
        markers: marker_coordinates,
        latlngs: latlngs_coordinates,
        distance,
        route_type
    };

    Ok(Json(result))

}