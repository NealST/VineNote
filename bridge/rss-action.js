import fetch from 'node-fetch';

const handleRss = async function(rssUrl) {
  const response = await fetch(rssUrl);
  const body = await response.text();
}

export default handleRss;
