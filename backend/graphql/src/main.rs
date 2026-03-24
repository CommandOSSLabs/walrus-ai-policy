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

    #[clap(long, env = "PORT", default_value = "4000")]
    port: u16,
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

    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], cli.port));
    tracing::info!("Listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;
    Ok(())
}
