import "./Login.css";

export default function Login() {
  return (
    <div className="auth-page">
      <form className="auth-card">
        <h2>Iniciar sesión</h2>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Contraseña" />

        <button className="btn primary">Ingresar</button>

        <p className="auth-footer">
          ¿No tenés cuenta? <a href="/register">Registrate</a>
        </p>
      </form>
    </div>
  );
}
