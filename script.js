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

function activeTransition(active){
  slides.style.transition = active ? "transform .3s" : ""
}

function moveSlide(moviment) {
  dist.finalX = moviment;
  slides.style.transform = `translate3d(${moviment}px, 0, 0)`;
}

function updatePosition(clientX) {
  dist.moviment = (dist.startX - clientX) * 2;
  return dist.finalPosition - dist.moviment;
}

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

function onMove(event) {
  const pointerEvents =
    event.type === 'mousemove'
      ? event.clientX
      : event.changedTouches[0].clientX;
  const slidePosition = updatePosition(pointerEvents);
  activeTransition(false)
  moveSlide(slidePosition);
}

function onEnd(event) {
  const moveType = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
  wrapper.removeEventListener(moveType, onMove);
  dist.finalPosition = dist.finalX;
  activeTransition(true)
  changeOnMoveSlide();
}

//Slides config

function slidePosition(slide) {
  const margin = (document.body.offsetWidth - slide.offsetWidth) / 2;
  return -(slide.offsetLeft - margin);
}

function slidesConfig() {
  const slideArray = [...slides.children].map((element) => {
    const position = slidePosition(element);
    return { position, element };
  });
  return slideArray;
}

function slideIndexNav(index) {
  const last = slidesConfig().length - 1;
  indexSlides = {
    next: index === last ? undefined : index + 1,
    active: index,
    previous: index ? index - 1 : undefined,
  };
  return indexSlides;
}

function changeSlide(index) {
  const activeSlide = slidesConfig()[index];
  moveSlide(activeSlide.position);
  slideIndexNav(index);
  dist.finalPosition = activeSlide.position;
}

//slide next and prev
//define o slide ativo no momento

function nextSlide() {
  if (indexSlides.next !== undefined) changeSlide(indexSlides.next);
}

function prevSlide() {
  if (indexSlides.previous !== undefined) changeSlide(indexSlides.previous);
}

function changeOnMoveSlide() {
  console.log(indexSlides);
  if (dist.moviment > 120 && indexSlides.next !== undefined) {
    nextSlide();
  } else if (dist.moviment < -120 && indexSlides.previous !== undefined) {
    prevSlide();
  } else {
    changeSlide(indexSlides.active);
  }
}

wrapper.addEventListener('mousedown', onStart);
wrapper.addEventListener('touchstart', onStart);
wrapper.addEventListener('mouseup', onEnd);
wrapper.addEventListener('touchend', onEnd);

changeSlide(0);
