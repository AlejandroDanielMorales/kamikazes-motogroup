import "./BannerSlider.css";

export default function BannerSlider() {
  return (
    <section className="banner">
      <div className="slides">
        <div className="slide slide-1">
          <h1>Rodar es un ritual</h1>
        </div>
        <div className="slide slide-2">
          <h1>Eventos en ruta</h1>
        </div>
        <div className="slide slide-3">
          <h1>Destino compartido</h1>
        </div>
      </div>
    </section>
  );
}
