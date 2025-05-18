// open the issue url

import { openUrl } from '@tauri-apps/plugin-opener';

const openIssue = function() {
  
  const issueUrl = 'https://github.com/NealST/VineNote/issues';
  openUrl(issueUrl);

};

export default openIssue;
