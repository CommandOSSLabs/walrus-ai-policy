use std::time::Duration;

use anyhow::Result;
use diesel_async::AsyncPgConnection;
use diesel_async::pooled_connection::AsyncDieselConnectionManager;
use diesel_async::pooled_connection::bb8::Pool;
use url::Url;

pub type DbPool = Pool<AsyncPgConnection>;

pub async fn create_pool(database_url: Url) -> Result<DbPool> {
    let config = AsyncDieselConnectionManager::<AsyncPgConnection>::new(database_url.as_str());
    let pool = Pool::builder()
        .max_size(10)
        .connection_timeout(Duration::from_secs(30))
        .idle_timeout(Some(Duration::from_secs(600)))
        .max_lifetime(Some(Duration::from_secs(1800)))
        .build(config)
        .await?;
    Ok(pool)
}
