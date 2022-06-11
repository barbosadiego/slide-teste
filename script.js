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
  event.preventDefault();
  dist.startX = event.clientX;
  wrapper.addEventListener('mousemove', onMove);
  // console.log('entrou');
}

function onMove(event) {
  const slidePosition = updatePosition(event.clientX);
  moveSlide(slidePosition);
  // console.log(dist);
}

function onEnd(event) {
  wrapper.removeEventListener('mousemove', onMove);
  dist.finalPosition = dist.finalX;
  console.log(dist);
  // console.log('saiu');
}

wrapper.addEventListener('mousedown', onStart);
wrapper.addEventListener('mouseup', onEnd);
