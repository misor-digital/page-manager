const url = 'https://developer.chrome.com/docs/extensions';
const genericAlarmName = 'Page Manager - Reload tab id:';
const interval = 0.05;

const handleActionClick = async (url, alarmName, interval) => {
  const tab = await chrome.tabs.create({ url, active: true });
  const currentTabAlarmName = `${alarmName}${tab.id}`;
  const alarmInfo = { periodInMinutes: interval };

  await chrome.alarms.create(currentTabAlarmName, alarmInfo);

  const alarm = await chrome.alarms.get(currentTabAlarmName);
  const tabReloadEventListener = await chrome.alarms.onAlarm.addListener(
    alarmEventListener.bind(alarm, tab, currentTabAlarmName)
  );

  chrome.tabs.onRemoved.addListener(async (tabId, removedInfo) => {
    if (tabId === tab.id) {
      await chrome.alarms.onAlarm.removeListener(tabReloadEventListener);
      await chrome.alarms.clear(currentTabAlarmName);
    }
  });
};

const alarmEventListener = function (tab, alarmName, alarm) {
  if (alarm.name === alarmName) {
    chrome.tabs.reload(tab.id);

    return this;
  }
};

const removeAlarmOnClosed = (curTabId, alarmName, tabIdWithAlarm) => {
  if (curTabId === tabIdWithAlarm) {
    chrome.alarms.clear(alarmName);
  }
};

chrome.action.onClicked.addListener(
  handleActionClick.bind(null, url, genericAlarmName, interval)
);
