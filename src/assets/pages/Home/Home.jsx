import "./Home.css";

import BannerSlider from "../../components/BannerSlider/BannerSlider";
export default function Home() {
  return (
    <div className="home">
      <BannerSlider />


      <h1>Rodadas y camaradería🏍️</h1>
      <h2>No importa la cilindrada, sos bienvenido</h2>

      <div className="home-actions">
        <a href="/login" className="btn primary">Ingresar</a>
        <a href="/register" className="btn secondary">Registrarse</a>
      </div>
    </div>
  );
}
