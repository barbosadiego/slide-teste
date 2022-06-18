'use strict';

const wrapper = document.querySelector('.js-wrapper');
const slides = document.querySelector('.js-slide');
let indexSlides = {};
const dist = {
  startX: 0,
  finalX: 0,
  moviment: 0,
  finalPosition: 0,
};

//ativa ou não a propriedade transition no style dos slides
function activeTransition(active){
  slides.style.transition = active ? "transform .3s" : ""
}

//move os slides
function moveSlide(moviment) {
  dist.finalX = moviment;
  slides.style.transform = `translate3d(${moviment}px, 0, 0)`;
}

//retorna a posição dos slides na tela
function updatePosition(clientX) {
  dist.moviment = (dist.startX - clientX) * 2;
  return dist.finalPosition - dist.moviment;
}

//quanto o click do mouse (ou toque na tela) é acionado 
//define o valor de startX e o tipo de evento
//e adiciona o onMove
function onStart(event) {
  let moveType;
  if (event.type === 'mousedown') {
    event.preventDefault();
    dist.startX = event.clientX;
    moveType = 'mousemove';
  } else {
    dist.startX = event.changedTouches[0].clientX;
    moveType = 'touchmove';
  }
  wrapper.addEventListener(moveType, onMove);
}

//durante o movimento do slide na tela define o tipo de evento
//define a posição do slide
//desativa a propriedade transition do style dos slides
//move o slide
function onMove(event) {
  const pointerEvents =
    event.type === 'mousemove'
      ? event.clientX
      : event.changedTouches[0].clientX;
  const slidePosition = updatePosition(pointerEvents);
  activeTransition(false)
  moveSlide(slidePosition);
}


//quando o clique do mouse é encerrado define o tipo de evento
//remove o Event Listener de acordo com o tipo
//ativa a propriedade transition do style dos slides
//chama a função que ativa o proximo slide ou o anterior
function onEnd(event) {
  const moveType = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
  wrapper.removeEventListener(moveType, onMove);
  dist.finalPosition = dist.finalX;
  activeTransition(true)
  changeActiveSlide();
}

//Slides config

//calcula a posição que o slide irá ter na tela para que seja no meio
function slidePosition(slide) {
  const margin = (document.body.offsetWidth - slide.offsetWidth) / 2;
  return -(slide.offsetLeft - margin);
}

//retorna um objeto com cada item do slide e a sua posição na tela
function slidesConfig() {
  const slideArray = [...slides.children].map((element) => {
    const position = slidePosition(element);
    return { position, element };
  });
  return slideArray;
}

//define qual item do slide é o ativo (atual), o anterior e o próximo
function slideIndexNav(index) {
  const last = slidesConfig().length - 1;
  indexSlides = {
    next: index === last ? undefined : index + 1,
    active: index,
    previous: index ? index - 1 : undefined,
  };
  return indexSlides;
}

//determina qual o item que será ativo por padrão
function changeSlide(index) {
  const activeSlide = slidesConfig()[index];
  moveSlide(activeSlide.position);
  slideIndexNav(index);
  dist.finalPosition = activeSlide.position;
}

//slide next and prev
//define o slide ativo no momento em que ocorre um movimento
function nextSlide() {
  if (indexSlides.next !== undefined) changeSlide(indexSlides.next);
}

function prevSlide() {
  if (indexSlides.previous !== undefined) changeSlide(indexSlides.previous);
}

//muda o slide ativo
function changeActiveSlide() {
  if (dist.moviment > 120 && indexSlides.next !== undefined) {
    nextSlide();
  } else if (dist.moviment < -120 && indexSlides.previous !== undefined) {
    prevSlide();
  } else {
    changeSlide(indexSlides.active);
  }
}

//eventos
wrapper.addEventListener('mousedown', onStart);
wrapper.addEventListener('touchstart', onStart);
wrapper.addEventListener('mouseup', onEnd);
wrapper.addEventListener('touchend', onEnd);

//definição de qual item será o ativo por padrão
changeSlide(0);
