import banner from "@/img/banner.png";
import logo from "@/img/logo.png";

export function Senha() {
  return (
    <main className="container">
      <img className="banner" src={banner} />

      <div className="login-content">
        <img className="logo" src={logo} />

        <div className="title-senha">
          <h1>Esqueceu a Senha?</h1>
          <h2>Recupere a senha de sua conta</h2>
        </div>

        <form className="login-forms">
          <div className="login-email">
            <label id="email">Email</label>
            <input
              className="input-login"
              type="email"
              id="email"
              placeholder="seuemail@gmail.com"
            />
          </div>

          <button className="login-button">Enviar</button>
        </form>
      </div>
    </main>
  );
}
