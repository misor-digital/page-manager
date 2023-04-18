const dialog = document.createElement('dialog');
const div = document.createElement('div');

dialog.appendChild(div);
div.style.width = '500px';
div.style.height = '500px';
div.style.backgroundImage = `url('https://api.dicebear.com/6.x/adventurer/svg?seed=${Math.random()}')`;

document.body.appendChild(dialog);
dialog.showModal();
