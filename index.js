'use strict';

//All dom elements

const textBtnEl = document.querySelector('.text-btn');
const scrollUpBtnEl = document.querySelector('.scroll-up-btn ');
const logoBtnEl = document.querySelector('.navigation-bar__logo');
const showModalBtnEl = document.querySelectorAll('.btn__show-modal');
const hideModalEl = document.querySelector('.signup-modal__hide');
const slideLeftBtnEl = document.querySelector('.btn-scroll__left');
const slideRightBtnEl = document.querySelector('.btn-scroll__right');

const headerEl = document.querySelector('.header');
const featuresSecEl = document.querySelector('#section1');
const navEl = document.querySelector('.navigation-bar');
const signUpModal = document.querySelector('.signup-modal');
const overlayEl = document.querySelector('.overlay');
const sections = document.querySelectorAll('.section');
const slideEls = document.querySelectorAll('.sliders__slider');

const lazyImgsEl = document.querySelectorAll('img[data-newsrc]');
const tabsEl = document.querySelector('.operations__tabs');
const tabEls = document.querySelectorAll('.operations__tab');
const dotContainerEl = document.querySelector('.dots-container');

//tasks

const showModal = (e) => {
  e.preventDefault();
  signUpModal.classList.remove('hidden');
  overlayEl.classList.remove('hidden');
};

const hideModal = (e) => {
  e.preventDefault();
  signUpModal.classList.add('hidden');
  overlayEl.classList.add('hidden');
};

overlayEl.addEventListener('click', hideModal);
showModalBtnEl.forEach((btn) => {
  btn.addEventListener('click', showModal);
});

hideModalEl.addEventListener('click', hideModal);

document.addEventListener('keydown', (e) => {
  e.key === 'Escape' && hideModal(e);
  if (e.key === 'ArrowRight') {
    slideRight(e);
  }

  if (e.key === 'ArrowLeft') {
    slideLeft(e);
  }
});

textBtnEl.addEventListener('click', (e) => {
  e.preventDefault();
  featuresSecEl.scrollIntoView({ behavior: 'smooth' });
});

logoBtnEl.addEventListener('click', (e) => {
  e.preventDefault();
  headerEl.scrollIntoView({ behavior: 'smooth' });
});

//Slider Functionality
let i = 0;
const slideRight = (e) => {
  if (i >= slideEls.length - 1) i = 0;
  else ++i;
  slide();
};

const slideLeft = (e) => {
  if (i === 0) i = slideEls.length - 1;
  else --i;
  slide();
};

const dotHandler = () => {
  dotContainerEl.querySelectorAll('div[data-num]').forEach((dot) => {
    if (+dot.dataset.num === i) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
};

const slide = () => {
  slideEls.forEach((slide, j) => {
    slide.style.transform = `translateX(${100 * j - i * 100}%)`;
  });
  dotHandler();
};

slideRightBtnEl.addEventListener('click', slideRight);
slideLeftBtnEl.addEventListener('click', slideLeft);

dotContainerEl.addEventListener('click', (e) => {
  const num = e.target.dataset.num;
  if (!num) return;
  i = +num;
  slide();
});

const createDot = (num) => {
  const dot = document.createElement('div');
  dot.className = 'dot';
  num === 0 && dot.classList.add('active');
  dot.dataset.num = num;
  return dot;
};

for (let i = 0; i < slideEls.length; i++) {
  dotContainerEl.appendChild(createDot(i));
}

const navLinkHoverHandler = function (e) {
  e.preventDefault();

  const hovered = e.target;
  if (
    !e.target.classList.contains('navigation-bar__link') &&
    !e.target.classList.contains('navigation-bar__logo')
  )
    return;
  const targetEls = [
    ...hovered
      .closest('.navigation-bar')
      .querySelectorAll('.navigation-bar__link'),
    logoBtnEl,
  ];
  targetEls.forEach((el) => {
    if (el !== hovered) {
      el.style.opacity = this;
    }
  });
};

navEl.addEventListener('mouseover', navLinkHoverHandler.bind(0.5));
navEl.addEventListener('mouseout', navLinkHoverHandler.bind(1));

navEl.addEventListener('click', (e) => {
  e.preventDefault();
  const clicked = e.target;
  if (!clicked.classList.contains('navigation-bar__link')) return;

  const targetId = clicked.getAttribute('href');
  document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
});

tabsEl.addEventListener('click', (e) => {
  e.preventDefault();
  const targetEl = e.target.closest('.operations__tab');
  if (!targetEl) return;

  targetEl.classList.add('active-tab');
  tabEls.forEach((ele) => {
    if (ele !== targetEl) ele.classList.remove('active-tab');
  });

  document.querySelectorAll('.operations__content').forEach((ele) => {
    ele.style.display = 'none';
  });
  document.querySelector(
    `.operations__content--${targetEl.dataset.tab}`
  ).style.display = 'grid';
});

scrollUpBtnEl.addEventListener('click', (e) => {
  e.preventDefault();
  headerEl.scrollIntoView({ behavior: 'smooth' });
});

//scroll observing functionality
const showNav = (entries) => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    navEl.classList.add('show-nav');
    scrollUpBtnEl.style.opacity = '0.5';
  } else {
    navEl.classList.remove('show-nav');
    scrollUpBtnEl.style.opacity = '0';
  }
};

const navObserver = new IntersectionObserver(showNav, {
  threshold: [0.1],
  rootMargin: `-${navEl.scrollHeight}px`,
});
navObserver.observe(headerEl);
const onScrollTranslation = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.style.transform = 'translateY(0)';
  entry.target.style.opacity = '1';
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(onScrollTranslation, {
  threshold: 0.1,
  rootMargin: '-80px',
});

sections.forEach((section) => {
  sectionObserver.observe(section);
});

const onScrollLazyLoad = (entries, observer) => {
  const [entry] = entries;
  if (entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.newsrc;
  entry.target.addEventListener('load', (e) => {
    entry.target.classList.remove('lazy');
  });
  observer.unobserve(entry.target);
};

const lazyImgObserver = new IntersectionObserver(onScrollLazyLoad, {
  threshold: 0,
  root: null,
  rootMargin: '200px',
});

lazyImgsEl.forEach((imgEl) => {
  lazyImgObserver.observe(imgEl);
});
