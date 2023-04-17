const url = 'https://developer.chrome.com/docs/extensions';

const openNewTab = (url) => {
  return chrome.tabs.create({
    url,
    active: true,
  });
};

const handleActionClick = () => {
  openNewTab(url);
};

chrome.action.onClicked.addListener(handleActionClick);
