const __initial_data__ = {
  url: 'https://developer.chrome.com/docs/extensions',
  int: 0.05,
  alarmName: 'Page Manager - Reload tab id:',
};

let currentTabId;
let alarmScheduledTime;

(function setDefaultValues(initialData) {
  // Check local storage for saved values in session storage
  chrome.storage.session.set({ url: initialData.url });
  chrome.storage.session.set({ int: initialData.int });
  chrome.storage.session.set({ state: null });
})(__initial_data__);

chrome.runtime.onMessage.addListener(async (req, sendRes) => {
  switch (req.msg?.info) {
    case 'open':
      handleOpenPage(__initial_data__);
      break;
    case 'start':
      handleStartPageReload(__initial_data__, currentTabId);
      break;
    case 'stop':
      handleStopPageReload(currentTabId);
      break;
    // case 'scheduled-time':
    //   handleScheduledTime();
    //   break;
    default:
      return;
  }
});

const handleOpenPage = async (initialData) => {
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
    handleResetPageReload(tabId);
  });

  sendMessage({ info: 'started' });

  chrome.storage.session.set({ state: 'started' });
};

const handleStartPageReload = async (initialData, tabId) => {
  const int =
    (await chrome.storage.session.get(['int'])).int || initialData.int;
  const alarmName = await createAlarm(initialData.alarmName, tabId, int);
  subscribeForAlarm(alarmName, tabId);

  sendMessage({ info: 'started' });

  chrome.storage.session.set({ state: 'started' });
};

const handleStopPageReload = (tabId) => {
  removeAlarm(tabId);

  sendMessage({ info: 'stopped' });

  chrome.storage.session.set({ state: 'stopped' });

  alarmScheduledTime = undefined;
};

const createAlarm = async (alarmName, tabId, interval) => {
  // const currentTabAlarmName = `${alarmName}${tabId}`;
  const currentTabAlarmName = `${alarmName}${tabId}; ID: ${Math.random()}`;

  const alarmInfo = { periodInMinutes: interval };

  await chrome.alarms.create(currentTabAlarmName, alarmInfo);

  return currentTabAlarmName;
};

const subscribeForAlarm = async (alarmName, tabId) => {
  const alarm = await chrome.alarms.get(alarmName);

  setScheduledTime(alarm.scheduledTime);

  await chrome.alarms.onAlarm.addListener(
    handleAlarm.bind(alarm, tabId, alarmName)
  );
};

const removeAlarm = (tabId) => {
  // chrome.alarms.clear(`${__initial_data__.alarmName}${tabId}`);
  chrome.alarms.clearAll();
};

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

const handleResetPageReload = (tabId) => {
  if (tabId === currentTabId) {
    chrome.storage.session.set({ state: null });
  }
};

const handleScheduledTime = () => {
  sendMessage({ info: 'alarm-schedule', data: alarmScheduledTime });
};

const sendMessage = (msg) => {
  chrome.runtime.sendMessage({ msg }).then().catch(console.error);
};
