import banner from "@/img/banner.png"
import logo from "@/img/logo.png"
import '@/pages/Login/style.css'

export function Login() {
    return (
      <main className="container">
        <img className="banner" src={banner}/>

        <div className="login-content">
          <img className="logo" src={logo}/>

          <div className="titles-content">
            <h1>Bem vindo!</h1>
            <h2>Faça o login em sua conta</h2>
          </div>

          <form className="login-forms">
            <div className="login-email">
              <label id="email">Email</label>
              <input className="input-login" type="email" id="email" placeholder="seuemail@gmail.com"/>
            </div>

            <div className="login-senha">
              <div className="lembrar-senha">
                <label id="senha">Senha</label>
                <a>Lembrar senha</a>
              </div>
              <input className="input-login" type="password" id="senha" placeholder="**********"/>
            </div>

            <button className="login-button">Fazer Login</button>
            
            <div className="login-obs">
              <p>Não tem uma conta? <span className="login-cadastro">Cadastre-se agora</span></p>
            </div>
          </form>
          
        </div>
      </main>
    )
  }