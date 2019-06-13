const prop = ( data, name ) => data.map( item => item[ name ] ),
summ = data => data.reduce(( total, value ) => total + value, 0 );
  
class SpriteGenerator {
  constructor( container ) {
    this.uploadButton = container.querySelector( '.sprite-generator__upload' );

    this.submitButton = container.querySelector( '.sprite-generator__generate' );
    this.imagesCountContainer = container.querySelector( '.images__added-count-value' );
    this.codeContainer = container.querySelector( '.sprite-generator__code' );
    this.imageElement = container.querySelector( '.sprite-generator__result-image' );
    this.images = [];

    this.imagesCount = 0;

    this.registerEvents();
  }
  
  registerEvents() {
    this.uploadButton.addEventListener('change', event => this.uploadFiles(event));
    this.submitButton.addEventListener('click', () => this.generateSprite());
  }
  
  uploadFiles(event) {
    const files = Array.from(event.currentTarget.files);
    const imageTypeRegExp = /^image\//;
    files.forEach(file => {
      if (imageTypeRegExp.test(file.type)) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.addEventListener('load', event => {
          URL.revokeObjectURL(event.currentTarget.src);
          this.images.push(img);
          this.imagesCountContainer.textContent = this.images.length;
        });
      } 
      else {
        console.error('Неверный формат файла')
      }
    });
  }
  
  generateSprite() {
    const margin = {
      top: 0,
      left: 10,
      rigth: 0,
      bottom: 0
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = summ(prop(this.images, 'width')) + margin.left * (this.images.length - 1);
    canvas.height = Math.max(...prop(this.images, 'height'));
    
    let totalWidth = 0;
    let spriteStyle = '.icon {\n  display: inline-block; \n  background-image: url(img/sprite.png);\n}\n';
    
    this.images.forEach((img, index) => {
      const coordX = index === 0 ? 0 : totalWidth;
      const coordY = 0;
      totalWidth += (img.width + margin.left);
      ctx.drawImage(img, coordX, coordY, img.width, img.height);
      spriteStyle += `.icon_${index} {\n  background-position: ${coordX === 0 ? 0 : -coordX}px ${coordY}px; \n  width: ${img.width}px; \n  height: ${img.height}px;\n}\n`;
    });
    
    this.imageElement.src = canvas.toDataURL();
    this.codeContainer.textContent = spriteStyle;
  }
}

new SpriteGenerator( document.getElementById( 'generator' ));
