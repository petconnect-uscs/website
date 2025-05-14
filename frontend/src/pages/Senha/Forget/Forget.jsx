import banner from "@/img/banner.png"
import logo from "@/img/logo.png"
import '@/pages/Login/style.css'
import '@/pages/Senha/style.css'

export function Forget() {
    return (
      <main className="container">
        <img className="banner" src={banner}/>

        <div className="login-content">
          <img className="logo" src={logo}/>

          <div className="title-senha">
            <h1>Esqueceu a Senha?</h1>
            <h2>Recupere a senha de sua conta</h2>
          </div>

          <form className="login-forms">
            <div className="login-email">
              <label id="email">Nova Senha</label>
              <input className="input-login" type="password" id="password" placeholder="**********"/>
            </div>

            <div className="login-email">
              <label id="email">Confirmar Senha</label>
              <input className="input-login" type="password" id="password" placeholder="**********"/>
            </div>

            <button className="login-button">Alterar Senha</button>
          </form>
          
        </div>
      </main>
    )
  }