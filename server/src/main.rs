mod api;
use std::{time::Duration, sync::Arc};
use actix_web::{App, HttpServer, middleware::Logger, web};
use actix_cors::Cors;
use api::routes::{calculate_route, AppState};
use reqwest::Client;
use env_logger;
use crate::api::encode_decode::{encode_route, decode_route};
use fred::prelude::*;
use fred::pool::RedisPool;
use dotenv;

fn build_reqwest_client() -> Client {
    match reqwest::ClientBuilder::new()
        .pool_max_idle_per_host(1) // Number of idle connections to keep per host
        .build() {
            Ok(x) => x,
            Err(_) => panic!("Cannot build reqwest client")
        }
}

fn build_redis_client() -> Arc<RedisPool> {
    let redis_url = dotenv::var("REDIS_SERVER_URL").unwrap();

    let config = match RedisConfig::from_url(&redis_url) {
        Ok(x) => x,
        Err(_) => panic!("Invalid redis URL")
    };

    let recon_policy = ReconnectPolicy::default();
    let perf_policy = PerformanceConfig::default();

    Arc::new(match RedisPool::new(config, Some(perf_policy), Some(recon_policy), 5) {
        Ok(x) => {
            x.connect();
            x
        },
        Err(_) => panic!("Unable to create Redis connection pool")
    })
}


#[actix_web::main]
async fn main() -> std::io::Result<()>  {
    dotenv::dotenv().ok();

    let reqwest_client = build_reqwest_client();
    let redis = build_redis_client();

    let app_state = web::Data::new(AppState {
        reqwest_client: reqwest_client.clone(),
        redis_client: redis
    });

    let client_url = dotenv::var("CLIENT_URL").unwrap();
    
    env_logger::init();
    std::env::set_var("RUST_LOG", "actix_web=trace");
    HttpServer::new(move || {
        let logger = Logger::default();
        let cors = Cors::default()
                    .allowed_origin(&client_url)
                    .allow_any_header()
                    .allow_any_method()
                    .expose_any_header();
        App::new()
        .app_data(app_state.clone())
        .wrap(cors)
        .wrap(logger)
        .service(calculate_route)
        .service(encode_route)
        .service(decode_route)
    })
    .keep_alive(Duration::from_secs(75))
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
