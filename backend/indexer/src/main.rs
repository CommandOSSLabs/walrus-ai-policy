use anyhow::Result;
use archive_indexer::{processors::ArtifactPipeline, MIGRATIONS};
use clap::Parser;
use sui_indexer_alt_framework::cluster::{Args, IndexerCluster};
use sui_indexer_alt_framework::pipeline::sequential::SequentialConfig;
use url::Url;

#[derive(Parser, Debug)]
#[clap(name = "archive-indexer")]
struct Cli {
    #[clap(long, env = "DATABASE_URL")]
    database_url: Url,

    #[clap(long, env = "ARCHIVE_PACKAGE_ID")]
    package_id: String,

    #[clap(flatten)]
    args: Args,
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenvy::dotenv().ok();

    let cli = Cli::parse();

    let mut indexer = IndexerCluster::builder()
        .with_database_url(cli.database_url)
        .with_args(cli.args)
        .with_migrations(&MIGRATIONS)
        .build()
        .await?;

    indexer
        .sequential_pipeline(
            ArtifactPipeline { package_id: cli.package_id },
            SequentialConfig::default(),
        )
        .await?;

    indexer.run().await?.join().await?;

    Ok(())
}
