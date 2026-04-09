use anyhow::Result;
use archive_indexer::{processors::{ArtifactPipeline, ContributorPipeline}, MIGRATIONS};
use clap::Parser;
use sui_indexer_alt_framework::cluster::{Args, IndexerCluster};
use sui_indexer_alt_framework::pipeline::sequential::SequentialConfig;
use sui_types::base_types::ObjectID;
use url::Url;

#[derive(Parser, Debug)]
#[clap(name = "archive-indexer")]
struct Cli {
    #[clap(long, env = "DATABASE_URL")]
    database_url: Url,

    #[clap(long, env = "ARCHIVE_PACKAGE_ID")]
    package_id: String,

    #[clap(long, env = "OPENROUTER_API_KEY")]
    openrouter_api_key: String,

    #[clap(flatten)]
    args: Args,
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenvy::dotenv().ok();

    let cli = Cli::parse();

    let package_id: ObjectID = cli.package_id.trim().parse()?;

    let mut indexer = IndexerCluster::builder()
        .with_database_url(cli.database_url.clone())
        .with_args(cli.args)
        .with_migrations(&MIGRATIONS)
        .build()
        .await?;

    indexer
        .sequential_pipeline(
            ArtifactPipeline { package_id },
            SequentialConfig::default(),
        )
        .await?;

    indexer
        .sequential_pipeline(
            ContributorPipeline { package_id },
            SequentialConfig::default(),
        )
        .await?;

    // AI background worker: independent of Sui pipelines
    let ai_pool = diesel_async::pooled_connection::bb8::Pool::builder()
        .build(diesel_async::pooled_connection::AsyncDieselConnectionManager::<
            diesel_async::AsyncPgConnection,
        >::new(cli.database_url.as_str()))
        .await?;

    let worker = archive_indexer::ai::worker::AiWorker {
        pool:        ai_pool,
        ai_client:   archive_indexer::ai::openrouter::make_client(&cli.openrouter_api_key),
        http_client: reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(120))
            .build()?,
    };
    tokio::spawn(worker.run());

    indexer.run().await?.join().await?;

    Ok(())
}
