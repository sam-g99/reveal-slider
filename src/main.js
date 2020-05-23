// localStorage Update elementX instead of value
const getItem = (item) => JSON.parse(localStorage.getItem(item));
if (localStorage.getItem('save') === null) {
  localStorage.setItem('save', false);
}

const storageToggle = document.getElementById('storage');

const changeStorageText = () => {
  const btnMsg = 'Local Storage';
  storageToggle.innerText = getItem('save')
    ? `Disable ${btnMsg}`
    : `Enable ${btnMsg}`;
};

changeStorageText();

storageToggle.addEventListener('click', () => {
  const save = getItem('save');

  localStorage.setItem('save', !save);

  changeStorageText();
});

const getSliderData = () => JSON.parse(localStorage.getItem('sliderData'));

const updateSliderData = (data) => {
  const update = JSON.stringify(data);
  localStorage.setItem('sliderData', update);
};

const savePlacement = (element) => {
  //   if (getSliderData() === null) {
  //   }
  //   const sliderData = getSliderData();
  //   const storageToggle = document.getElementById('storage');
};

savePlacement();

function imageSlider(container) {
  const slider = document.querySelector('.slider');

  const images = document.querySelectorAll('.img-thing');

  const currentX = () =>
    Number(
      slider.style.transform
        .match(/translateX(.*?)\)/g)[0]
        .replace(/[^0-9.]/g, '')
    );

  const getSliderEnd = () => container.offsetWidth - slider.offsetWidth;
  let sliderEnd = getSliderEnd();

  const moveSlider = (value) => {
    slider.style.transform = `translateX(${value}px)`;
    updateSliderData([{ element: slider, position: value }]);

    document.querySelector('.side-1').style.width = `${value}px`;
    document.querySelector('.side-2').style.width = `${sliderEnd - value}px`;
  };

  const checkValue = (value) => {
    const v = Math.round(value);
    if (v < 0) {
      moveSlider(0);
      return;
    }

    if (v > sliderEnd) {
      moveSlider(sliderEnd);
      return;
    }

    if (v >= 0 && v <= sliderEnd) moveSlider(v);
  };

  const sliderDataExists = getSliderData() !== null;

  if (sliderDataExists && getItem('save') === true) {
    checkValue(getSliderData()[0].position);
  } else {
    moveSlider(0);
  }

  const resizeImages = () => {
    images.forEach((img) => {
      img.style.width = `${container.offsetWidth}px`;
      document.querySelector('.side-2').style.width = `${
        sliderEnd - currentX()
      }px`;
    });
  };

  resizeImages();
  window.addEventListener('resize', () => {
    if (sliderEnd === getSliderEnd()) return;

    sliderEnd = getSliderEnd();

    resizeImages();
    if (currentX() > sliderEnd) moveSlider(sliderEnd);
  });

  const toggleActiveSlider = (e) => {
    const isTargeted = e.target === slider || e.target === container;

    if (isTargeted) container.focus();
  };

  window.addEventListener('touchstart', toggleActiveSlider);

  const moveWithMouse = (e) => {
    const boundingClient = container.getBoundingClientRect();
    const containerXPos = boundingClient.x || boundingClient.left;
    const touchX = e.touches ? e.touches[0].clientX : false;
    const mouseX = e.clientX || touchX;

    const newValue = mouseX - containerXPos - slider.offsetWidth / 2;

    checkValue(newValue);
  };

  container.addEventListener('mousedown', (e) => {
    moveWithMouse(e);
    document.onmousemove = moveWithMouse;
  });

  container.addEventListener('touchstart', (e) => {
    moveWithMouse(e);
    document.ontouchmove = moveWithMouse;
  });

  document.addEventListener('mouseup', () => {
    document.onmousemove = null;
  });

  document.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) document.ontouchmove = null;
  });

  window.addEventListener(
    'keydown',
    ({ keyCode }) => {
      const elActive = document.activeElement === container;
      if (!elActive) {
        return;
      }

      const isLeftKey = keyCode === 37;
      const isRightKey = keyCode === 39;

      if (!isLeftKey && !isRightKey) return;

      const newXValue = isRightKey ? currentX() + 15 : currentX() - 15;

      checkValue(newXValue);
    },
    false
  );

  document.getElementById('reset').addEventListener('click', () => {
    checkValue(sliderEnd / 2);
  });
}

(function generateSliders() {
  const exampleModule = document.getElementById('imageSliderModule');
  imageSlider(exampleModule);
})();
