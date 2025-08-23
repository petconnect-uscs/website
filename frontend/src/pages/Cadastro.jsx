import banner from "@/img/banner.png";
import logo from "@/img/logo.png";

export function Cadastro() {
  return (
    <main className="container">
      <img className="banner" src={banner} />

      <div className="login-content cadastro-content">
        <img className="logo" src={logo} />

        <div className="titles-content">
          <h1>Começe aqui</h1>
          <h2>Crie uma nova conta</h2>
        </div>

        <form className="login-forms">
          <div className="login-email">
            <label id="email">Nome</label>
            <input
              className="input-login"
              type="email"
              id="email"
              placeholder="Bruno Reginaldo dos Santos"
            />
          </div>

          <div className="login-email">
            <label id="email">Email</label>
            <input
              className="input-login"
              type="email"
              id="email"
              placeholder="seuemail@gmail.com"
            />
          </div>

          <div className="login-senha">
            <label>Senha</label>
            <input
              className="input-login"
              type="password"
              id="senha"
              placeholder="**********"
            />
          </div>

          <label class="checkbox-container">
            <input type="checkbox" />
            <span class="checkmark"></span>
            Aceito os termos
          </label>

          <button className="login-button">Registrar-se</button>

          <div className="login-obs">
            <p>
              Já tem uma conta?{" "}
              <span className="login-cadastro">Fazer Login</span>
            </p>
          </div>

          <div className="obs-termos">
            <p>
              Continuando, você aceitara nossos{" "}
              <span>Termos de serviços e Politica de privacidade</span>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
