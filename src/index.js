// Style
import '@/css/style.scss';

// Renderer
import Render from '@/render';

window.onload = () => {
  const render = new Render();
  const updater = () => {
    render.render();
    requestAnimationFrame(updater);
  };
  updater();

  window.addEventListener('resize', () => {
    render.onResize(
      window.innerWidth,
      window.innerHeight,
    );
  });
};
