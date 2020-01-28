import React, { useEffect, useState } from 'react'
import { usePost } from '../utils/rest'
import { Redirect } from 'react-router-dom'

const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBDpuxa2SKSfvuc1cFsXtnz5qajBklD8Zs'

const Login = () => {
  const [postDdata, signin] = usePost(url)
  const [logado, setLogado] = useState(false)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  useEffect(() => {
    if (Object.keys(postDdata.data).length > 0) {
      localStorage.setItem('token', postDdata.data.idToken)
      window.location.reload()
    }
  }, [postDdata])
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setLogado(true)
    }
  })
  const login = async () => {
    await signin({
      email,
      password: senha,
      returnSecureToken: true
    })
  }
  const onChangeEmail = evt => {
    setEmail(evt.target.value)
  }
  const onChangeSenha = evt => {
    setSenha(evt.target.value)
  }
  if (logado) {
    return <Redirect to='/' />
  }
  return (
    <div className='container'>
      <div className='d-flex flex-column mb-3 align-items-center'>
        <h1>Login</h1>
        {
          postDdata.error && postDdata.error.length > 0 &&
            <p>E-mail e/ou senha inválidos </p>
        }
        <div className='form-group col-5'>
          <input className='form-control' type='text' value={email} onChange={onChangeEmail} placeholder='Seu e-mail' />
        </div>
        <div className='form-group col-5'>
          <input className='form-control' type='password' value={senha} onChange={onChangeSenha} placeholder='Sua senha' />
        </div>
        <div className='form-group col-5'>
          <button className='form-control btn btn-outline-dark' onClick={login}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default Login
