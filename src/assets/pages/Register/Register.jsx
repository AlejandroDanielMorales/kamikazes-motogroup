import "./../Login/Login.css";

export default function Register() {
  return (
    <div className="auth-page">
      <form className="auth-card">
        <h2>Crear cuenta</h2>

        <input type="text" placeholder="Nombre" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Contraseña" />
        <input type="tel" placeholder="Teléfono" />

        <button className="btn primary">Registrarse</button>

        <p className="auth-footer">
          ¿Ya tenés cuenta? <a href="/login">Ingresá</a>
        </p>
      </form>
    </div>
  );
}
