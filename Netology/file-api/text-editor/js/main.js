const throttle = (handler, ms) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(handler, ms);
  }
};

class TextEditor {
  constructor(container, storageKey = '_text-editor__content' ) {
    this.container = container;
    this.contentContainer = container.querySelector('.text-editor__content');
    this.hintContainer = container.querySelector('.text-editor__hint');
    this.filenameContainer = container.querySelector('.text-editor__filename');
    
    this.hintMessage = this.hintContainer.querySelector('.text-editor__hint-content');
    
    this.storageKey = storageKey;
    this.registerEvents();
    this.load(this.getStorageData());
  }
  
  registerEvents() {
    const saveThrottle = throttle(this.save.bind(this), 1000);
    this.contentContainer.addEventListener('input', saveThrottle);   
    this.container.addEventListener('dragover', event => this.showHint(event));
    this.container.addEventListener('dragleave', event => this.hideHint(event));
    this.container.addEventListener('drop', event => this.loadFile(event)); 
  }

  loadFile(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const txtTypeRegExp = /^text\//;
    if (txtTypeRegExp.test(file.type)) {
      this.readFile(file);
      this.hideHint(event);
    } 
    else this.hintMessage.textContent = 'Необходим только *.txt файл';
  }
  
  readFile(file) {
    this.contentContainer.value = '';
    const reader = new FileReader();
    reader.addEventListener('load', event => {
      this.load(event.currentTarget.result)
    });
    reader.readAsText(file);
    this.setFilename(file.name);
  }
  
  setFilename(filename) {
    this.filenameContainer.textContent = filename;
  }
  
  showHint(event) {
    event.preventDefault();
    this.hintContainer.classList.add('text-editor__hint_visible');
    this.hintMessage.textContent = 'Перенесите и отпустите .txt файл для загрузки содержимого в редактор';
  }
  
  hideHint(event) {
    if (event.type == 'drop' || event.relatedTarget == null) {
      this.hintContainer.classList.remove('text-editor__hint_visible');
    }
  }
  
  load(value) {
    this.contentContainer.value = value;
  }
  
  getStorageData() {
    return localStorage[this.storageKey];
  }
  
  save() {
    localStorage[this.storageKey] = this.contentContainer.value;
  }
}

new TextEditor(document.getElementById('editor'));
