const addClass = ( className, context ) => context.classList.add( className ),
  removeClass = ( className, context ) => context.classList.remove( className ),
  hasClass = ( className, context ) => context.classList.contains( className );
class iLayout {
  constructor( container ) {
    this.container = container;
    this.positionsContainer = container.querySelector( '.layout__positions' );
    this.actionButton = container.querySelector( '.layout__button' );
    this.result = container.querySelector( '.layout__result' );
    this.layout = {
      left: null,
      top: null,
      bottom: null
    };
    this.registerEvents();
  }
  
  registerEvents() {
    const layouts = this.positionsContainer.querySelectorAll('.layout__item');
    for (let layout of layouts) {
      layout.addEventListener('dragover', event => this.showLayout(event));
      layout.addEventListener('dragleave', event => this.hideLayout(event));
      layout.addEventListener('drop', event => this.showImage(event));
    }
    this.actionButton.addEventListener('click', () => this.showCollage());
  }
  
  showLayout(event) {
    event.preventDefault();
    addClass ('layout__item_active', event.currentTarget);
  }
  
  hideLayout(event) {
    event.preventDefault();
    if (event.relatedTarget) {
      removeClass ('layout__item_active', event.currentTarget);
    }
  }
  
  createImage(file) {
    return new Promise((done, fail) => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.addEventListener('load', event => done(event.currentTarget));
      img.addEventListener('error', error => fail(error.message)); 
    });
  }
  
  showImage(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const container = event.currentTarget;
    const imageTypeRegExp = /^image\//;

    if (imageTypeRegExp.test(file.type)) {
      this.createImage(file)
        .then(img => {
          URL.revokeObjectURL(img.src);

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = container.offsetWidth;
          canvas.height = container.offsetHeight;
          console.log(canvas.height);

          const imgWidth = img.width > canvas.width ? canvas.width : img.width, 
                imgHeight = img.height > canvas.height ? canvas.height : img.height;
          
          ctx.drawImage(img, 0, 0, imgWidth, imgHeight, 0, 0, imgWidth, imgHeight);
          img.src = canvas.toDataURL();

          const pos = Object.keys(this.layout).find(pos => hasClass(`layout__item_${pos}`, container));
          this.layout[pos] = canvas;

          addClass('layout__image', img);
          removeClass ('layout__item_active', container);
          container.innerHTML = '';
          container.appendChild(img);
        })
        .catch(error => console.error(error.message));
    } else {
      event.currentTarget.textContent = 'Файл не является изображением';
    }
  }

  showCollage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = this.positionsContainer.offsetWidth;
    canvas.height = this.positionsContainer.offsetHeight;
    const collage = document.createElement('img');
    Object.keys(this.layout).forEach(pos => {
      const img = this.layout[pos];
      const imgContainer = this.positionsContainer.querySelector(`.layout__item_${pos}`),
            imgWidth = img.width, 
            imgHeight = img.height,
            [x, y] = pos === 'left' ? [0, 0] : pos === 'top' ? [this.layout.left.width , 0] : [this.layout.left.width, this.layout.top.height];
            ctx.drawImage(img, 0, 0, img.width, img.height, x, y, img.width, img.height);
    });
    
    collage.src = canvas.toDataURL();
    this.result.value = collage.outerHTML;

    const textHint = this.container.querySelector('.layout__hint');
    textHint.textContent = 'Коллаж готов:';
    
    const imgResult = document.createElement('img');
    imgResult.src = collage.src;
    imgResult.style.border = 'solid blue';

    this.container.insertBefore(imgResult, this.positionsContainer),
    this.container.removeChild(this.positionsContainer);
  }
}

new iLayout( document.getElementById( 'layout' ));
