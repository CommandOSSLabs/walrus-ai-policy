use anyhow::Result;
use axum::Router;
use axum::routing::get;
use clap::Parser;
use tower_http::cors::CorsLayer;
use url::Url;

mod db;
mod schema;

#[derive(Parser, Debug)]
#[clap(name = "archive-graphql")]
struct Cli {
    #[clap(long, env = "DATABASE_URL")]
    database_url: Url,

    #[clap(long, env = "LISTEN_ADDR", default_value = "0.0.0.0:4000")]
    listen: std::net::SocketAddr,
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();

    let cli = Cli::parse();
    let pool = db::create_pool(cli.database_url).await?;
    let schema = schema::build(pool);

    let app = Router::new()
        .route("/health", get(|| async { "ok" }))
        .route("/graphql", get(schema::graphql_playground))
        .route("/graphql", axum::routing::post(schema::graphql_handler))
        .with_state(schema)
        .layer(CorsLayer::permissive());

    tracing::info!("Listening on {}", cli.listen);
    let listener = tokio::net::TcpListener::bind(cli.listen).await?;
    axum::serve(listener, app).await?;
    Ok(())
}
