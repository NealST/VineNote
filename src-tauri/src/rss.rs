// process rss feed get and parse

use reqwest::Error;
use serde::{Deserialize, Serialize};
use serde_xml_rs::de::from_str;

#[derive(Debug, Deserialize, Serialize)]
pub struct RssFeed {
  #[serde(rename = "channel")]
  pub channel: Channel
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Channel {
  pub title: String,
  pub link: String,
  #[serde(rename = "description")]
  pub description: String,
  #[serde(rename = "item")]
  pub items: Vec<Item>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Enclosure {
    #[serde(rename = "url", default)]
    pub url: Option<String>,
    #[serde(rename = "type", default)]
    pub r#type: Option<String>,
    #[serde(rename = "length", default)]
    pub length: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
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

pub async fn fetch_and_parse_rss(url: &str) -> Result<Channel, String> {
  // make the http request
  let response = reqwest::get(url).await.map_err(|e| e.to_string())?;
  // check the response status
  if !response.status().is_success() {
    return Err(format!("request fail, the status code is:{}", response.status()));
  }
  // get the xml content
  let xml_content = response.text().await.map_err(|e| e.to_string())?;
  // parse the xml
  let feed: RssFeed = from_str(&xml_content).map_err(|e| format!("parse fail: {}", e))?;
  // return the feed
  Ok(feed.channel)
}
