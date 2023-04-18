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

  const port = chrome.runtime.connect({ name: 'page-manager' });
  port.onMessage.addListener((msg) => {
    if (msg.info === 'started') {
      fields.input.url.disabled = true;
      fields.input.interval.disabled = true;

      fields.button.open.disabled = true;
      fields.button.start.disabled = true;
      fields.button.stop.disabled = false;
    } else if (msg.info === 'stopped') {
      fields.input.url.disabled = true;
      fields.input.interval.disabled = false;

      fields.button.open.disabled = true;
      fields.button.start.disabled = false;
      fields.button.stop.disabled = true;
    } else if (msg.info === 'alarm-schedule') {
      prev = next;
      next = msg.data;

      fields.paragraph.prev.innerText = prev;
      fields.paragraph.next.innerText = next;
    }
  });

  fields.button.open.addEventListener('click', async () => {
    const url = fields.input.url.value;
    const int = parseInt(fields.input.interval.value);

    chrome.storage.session.set({ url });
    chrome.storage.session.set({ int: int / 60 });

    port.postMessage({ info: 'open' });
    port.postMessage({ info: 'scheduled-time' });
  });

  fields.button.start.addEventListener('click', async () => {
    const int = parseInt(fields.input.interval.value);

    chrome.storage.session.set({ int: int / 60 });

    port.postMessage({ info: 'start' });
    port.postMessage({ info: 'scheduled-time' });
  });

  fields.button.stop.addEventListener('click', async () => {
    port.postMessage({ info: 'stop' });
    next = '-';
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
});
