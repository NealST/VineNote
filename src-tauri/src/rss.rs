// process rss feed get and parse

use serde::{Deserialize, Serialize};
use serde_xml_rs::de::from_str;
use tauri::{AppHandle, Emitter};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct RssFeed {
    #[serde(rename = "channel")]
    pub channel: Channel,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Channel {
    pub title: String,
    pub link: String,
    #[serde(rename = "description")]
    pub description: String,
    #[serde(rename = "item")]
    pub items: Vec<Item>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Enclosure {
    #[serde(rename = "url", default)]
    pub url: Option<String>
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Item {
    pub title: String,
    pub link: String,
    #[serde(rename = "description")]
    pub description: String,
    #[serde(rename = "pubDate")]
    pub pub_date: String,
    #[serde(rename = "enclosure")]
    pub enclosure: Option<Enclosure>,
}

pub async fn fetch_and_parse_rss(app: AppHandle, url: &str) {
    // make the http request
    let response = reqwest::get(url).await.unwrap();
    // check the response status
    if !response.status().is_success() {
        println!("request fail, the status code is:{}", response.status());
    }
    // get the xml content
    let xml_content = response.text().await.unwrap();
    // parse the xml
    let feed: RssFeed = from_str(&xml_content).unwrap();
    println!("feed result: {}", feed.channel.title);
    // return the feed
    app.emit("rss-loaded", feed.channel).unwrap();
}
