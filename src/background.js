const __initial_data__ = {
  url: 'https://developer.chrome.com/docs/extensions',
  int: 0.05,
  alarmName: 'Page Manager - Reload tab id:',
};

let currentTabId;
let bgPort;
let alarmScheduledTime;

(function setDefaultValues(initialData) {
  // Check local storage for saved values or load app defaults
  chrome.storage.session.set({ url: initialData.url });
  chrome.storage.session.set({ int: initialData.int });
  chrome.storage.session.set({ state: null });
})(__initial_data__);

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === 'page-manager');
  bgPort = port;
  port.onMessage.addListener(async (msg) => {
    if (msg.info === 'open') {
      handleOpenPage(__initial_data__);
    } else if (msg.info === 'start') {
      handleStartPageReload(__initial_data__, currentTabId);
    } else if (msg.info === 'stop') {
      handleStopPageReload(currentTabId);
    } else if (msg.info === 'scheduled-time') {
      handleScheduledTime();
    }
  });
});

async function handleOpenPage(initialData) {
  const url =
    (await chrome.storage.session.get(['url'])).url || initialData.url;
  const int =
    (await chrome.storage.session.get(['int'])).int || initialData.int;
  const { alarmName } = initialData;

  const tab = await chrome.tabs.create({ url, active: true });
  currentTabId = tab.id;

  const currentTabAlarmName = await createAlarm(alarmName, currentTabId, int);
  await subscribeForAlarm(currentTabAlarmName, currentTabId);

  chrome.tabs.onRemoved.addListener((tabId, removedInfo) => {
    removeAlarm(tabId);
    handleStopPageReload(tabId);
  });

  bgPort.postMessage({ info: 'started' });

  chrome.storage.session.set({ state: 'started' });
}

async function handleStartPageReload(initialData, tabId) {
  const int =
    (await chrome.storage.session.get(['int'])).int || initialData.int;
  const alarmName = await createAlarm(initialData.alarmName, tabId, int);
  subscribeForAlarm(alarmName, tabId);

  bgPort.postMessage({ info: 'started' });

  chrome.storage.session.set({ state: 'started' });
}

async function handleStopPageReload(tabId) {
  removeAlarm(tabId);

  bgPort.postMessage({ info: 'stopped' });

  chrome.storage.session.set({ state: 'stopped' });
}

async function createAlarm(alarmName, tabId, interval) {
  const currentTabAlarmName = `${alarmName}${tabId}`;

  const alarmInfo = { periodInMinutes: interval };

  await chrome.alarms.create(currentTabAlarmName, alarmInfo);

  return currentTabAlarmName;
}

async function subscribeForAlarm(alarmName, tabId) {
  const alarm = await chrome.alarms.get(alarmName);

  setScheduledTime(alarm.scheduledTime);

  handleScheduledTime();

  await chrome.alarms.onAlarm.addListener(
    handleAlarm.bind(alarm, tabId, alarmName)
  );
}

async function removeAlarm(tabId) {
  await chrome.alarms.clear(`${__initial_data__.alarmName}${tabId}`);
}

const handleAlarm = (tabId, alarmName, alarm) => {
  if (alarm.name === alarmName) {
    chrome.tabs.reload(tabId);
    chrome.tabs.onUpdated.addListener(handleTabUpdated);

    setScheduledTime(alarm.scheduledTime);

    handleScheduledTime();
  }
};

const handleTabUpdated = (tabId, changeInfo, tab) => {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['scripts/display-avatar.js'],
  });
};

const setScheduledTime = (scheduledTime) => {
  alarmScheduledTime = new Date(scheduledTime).toTimeString();
};

const handleScheduledTime = () => {
  bgPort.postMessage({ info: 'alarm-schedule', data: alarmScheduledTime });
};
