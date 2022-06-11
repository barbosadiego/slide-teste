'use strict';

const wrapper = document.querySelector('.js-wrapper');
const slides = document.querySelector('.js-slide');
const dist = {
  startX: 0,
  finalX: 0,
  moviment: 0,
  finalPosition: 0,
};

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
  // console.log('entrou');
  // console.log(event);
}

function onMove(event) {
  const pointerEvents =
    event.type === 'mousemove'
      ? event.clientX
      : event.changedTouches[0].clientX;
  const slidePosition = updatePosition(pointerEvents);
  moveSlide(slidePosition);
  // console.log(event);
}

function onEnd(event) {
  const moveType = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
  wrapper.removeEventListener(moveType, onMove);
  dist.finalPosition = dist.finalX;
  // console.log(dist);
  // console.log('saiu');
}

wrapper.addEventListener('mousedown', onStart);
wrapper.addEventListener('touchstart', onStart);
wrapper.addEventListener('mouseup', onEnd);
wrapper.addEventListener('touchend', onEnd);
