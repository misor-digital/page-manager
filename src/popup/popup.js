window.addEventListener('DOMContentLoaded', async () => {
  const popupData = {};
  const fields = {
    input: {},
    button: {},
    paragraph: {},
  };
  let next;
  let prev;

  assignFields();
  await initPopup();

  chrome.runtime.onMessage.addListener(async (req, sendRes) => {
    switch (req.msg?.info) {
      case 'started':
        handleStarted();
        break;
      case 'stopped':
        handleStopped();
        break;
      case 'reset':
        handleReset();
        break;
      case 'alarm-schedule':
        handleScheduledTime(req.msg);
        break;
      default:
        return;
    }
  });

  fields.button.open.addEventListener('click', async () => {
    const url = sanitizeInput(fields.input.url.value);
    const int = parseInt(fields.input.interval.value);

    chrome.storage.session.set({ url });
    chrome.storage.session.set({ int: int / 60 });

    sendMessage({ info: 'open' });
    sendMessage({ info: 'scheduled-time' });
  });

  fields.button.start.addEventListener('click', async () => {
    const int = parseInt(fields.input.interval.value);

    chrome.storage.session.set({ int: int / 60 });

    sendMessage({ info: 'start' });
    sendMessage({ info: 'scheduled-time' });
  });

  fields.button.stop.addEventListener('click', async () => {
    sendMessage({ info: 'stop' });
  });

  async function initData() {
    popupData.url = (await chrome.storage.session.get(['url'])).url;
    popupData.int = (await chrome.storage.session.get(['int'])).int;
    popupData.state = (await chrome.storage.session.get(['state'])).state;
    prev = '-';
    next = '-';
  }

  function assignFields() {
    fields.input.url = document.getElementById('url');
    fields.input.interval = document.getElementById('interval');

    fields.button.open = document.querySelector('#open-url');
    fields.button.start = document.querySelector('#start');
    fields.button.stop = document.querySelector('#stop');

    fields.paragraph.prev = document.querySelector('#prev');
    fields.paragraph.next = document.querySelector('#next');
  }

  async function initPopup() {
    await initData();

    // Check local storage for saved values or load app defaults
    fields.input.url.value = popupData.url;
    fields.input.interval.value = popupData.int * 60;

    fields.paragraph.prev.innerText = prev;
    fields.paragraph.next.innerText = next;

    if (!popupData.state) {
      fields.button.open.disabled = false;
      fields.button.start.disabled = true;
      fields.button.stop.disabled = true;
    } else if (popupData.state === 'started') {
      fields.input.url.disabled = true;
      fields.input.interval.disabled = true;

      fields.button.open.disabled = true;
      fields.button.start.disabled = true;
      fields.button.stop.disabled = false;
    } else if (popupData.state === 'stopped') {
      fields.input.url.disabled = true;
      fields.input.interval.disabled = false;

      fields.button.open.disabled = true;
      fields.button.start.disabled = false;
      fields.button.stop.disabled = true;
    }
  }

  const handleStarted = () => {
    fields.input.url.disabled = true;
    fields.input.interval.disabled = true;

    fields.button.open.disabled = true;
    fields.button.start.disabled = true;
    fields.button.stop.disabled = false;
  };

  const handleStopped = () => {
    fields.input.url.disabled = true;
    fields.input.interval.disabled = false;

    fields.button.open.disabled = true;
    fields.button.start.disabled = false;
    fields.button.stop.disabled = true;

    next = '-';
    fields.paragraph.next.innerText = next;
  };

  const handleReset = () => {
    initPopup();
  };

  const handleScheduledTime = (msg) => {
    prev = next;
    next = msg.data;

    fields.paragraph.prev.innerText = prev;
    fields.paragraph.next.innerText = next;
  };

  const sendMessage = async (msg) => {
    const res = await chrome.runtime.sendMessage({ msg });
  };

  const sanitizeInput = (input) => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }
});
