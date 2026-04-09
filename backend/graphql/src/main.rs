use anyhow::Result;
use axum::Router;
use axum::routing::get;
use clap::Parser;
use tower_http::cors::CorsLayer;
use url::Url;

mod db;
mod loaders;
mod schema;

#[derive(Parser, Debug)]
#[clap(name = "archive-graphql")]
struct Cli {
    #[clap(long, env = "DATABASE_URL")]
    database_url: Url,

    #[clap(long, env = "PORT", default_value = "4000")]
    port: u16,

    #[clap(long, env = "OPENROUTER_API_KEY")]
    openrouter_api_key: Option<String>,
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();

    let cli = Cli::parse();
    let pool = db::create_pool(cli.database_url).await?;
    let embed_client = cli.openrouter_api_key.map(|key| archive_db::ai::make_client(&key));
    let schema = schema::build(pool, embed_client);

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
