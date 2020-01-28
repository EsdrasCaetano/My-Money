import React, { useState, useEffect, useRef } from 'react'

import Rest from '../utils/rest'
import { Redirect } from 'react-router-dom'

const baseURL = 'https://mymoney-ec.firebaseio.com/'
const { useGet, usePost, useDelete, usePatch } = Rest(baseURL)

const Movimentacoes = ({ match }) => {
  const infoMes = useGet(`meses/${match.params.data}`)
  const [, alterarMes] = usePatch(`meses/${match.params.data}`)

  const movimentacoes = useGet(`movimentacoes/${match.params.data}`)
  const [, salvarNovaMovimentacao] = usePost(`movimentacoes/${match.params.data}`)

  const [, removerMovimentacao] = useDelete()
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const onChangeDescricao = evt => {
    setDescricao(evt.target.value)
  }

  const onChangeValor = evt => {
    setValor(evt.target.value)
  }

  const salvarMovimentacao = async () => {
    if (!isNaN(valor) && valor.search(/^[-]?\d+(\.)?\d+?$/) >= 0) {
      await salvarNovaMovimentacao({
        descricao,
        valor: parseFloat(valor)
      })
      setDescricao('')
      setValor(0)
      movimentacoes.refetch()
      setTimeout(() => {
        infoMes.refetch()
      }, 1000)
    }
  }

  const removerMovimentacaoClick = async (id) => {
    await removerMovimentacao(`movimentacoes/${match.params.data}/${id}`)
    movimentacoes.refetch()
    setTimeout(() => {
      infoMes.refetch()
    }, 1000)
  }

  const alterarPrevisaoEntrada = (evt) => {
    alterarMes({ previsao_entrada: evt.target.value })
    setIsEditing(false)
  }

  const alterarPrevisaoSaida = (evt) => {
    alterarMes({ previsao_saida: evt.target.value })
    setIsEditing(false)
  }
  const inputRef = useRef(null)
  const edit = () => setIsEditing(true)

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const masterheader = {
    width: '30vh',
    height: '30px',
    fontSize: '14px'
  }

  if (movimentacoes.error === 'Permission denied') {
    return <Redirect to='/login' />
  }

  return (
    <div className='container'>
      <div className='row align-items-center justify-content-between mb-2'>
        <h1>Movimentações {match.params.data}</h1>

        {
          !infoMes.loading && infoMes.data &&
            <div>
              Previsão de Entrada:<br />{
                !isEditing ? (
                  <input style={masterheader} className='btn btn-light btn-lg' type='text' ref={inputRef} defaultValue={infoMes.data.previsao_entrada} onBlur={alterarPrevisaoEntrada} />
                ) : (
                  <button onClick={edit}>{infoMes.data ? infoMes.data.previsao_entrada : 0}</button>
                )
              } <br />
              Previsão de Saída:<br />{
                !isEditing ? (
                  <input style={masterheader} className='btn btn-light btn-lg' type='text' ref={inputRef} defaultValue={infoMes.data.previsao_saida} onBlur={alterarPrevisaoSaida} />
                ) : (
                  <p onClick={edit}>{infoMes.data ? infoMes.data.previsao_saida : 0}</p>
                )
              }
              <br />
              Entradas:<br />
              <span style={masterheader} className='btn btn-outline-success'>{infoMes.data.entradas}</span><br />
              Saídas:<br />
              <span style={masterheader} className='btn btn-outline-danger'>{infoMes.data.saidas}</span><br />
              Saldo:<br />
              <span style={masterheader} className='btn btn-outline-warning'>{infoMes.data.entradas + infoMes.data.saidas ? infoMes.data.entradas + infoMes.data.saidas : 0}</span><br />
            </div>
        }
      </div>
      <div className=''>
        <table className='table'>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.data &&
              Object
                .keys(movimentacoes.data)
                .map(movimentacao => {
                  return (
                    <tr key={movimentacao}>
                      <td>{movimentacoes.data[movimentacao].descricao}</td>
                      <td>
                        {movimentacoes.data[movimentacao].valor} {' '}
                      </td>
                      <td>
                        <button className='btn btn-danger form-control' onClick={() => removerMovimentacaoClick(movimentacao)}>Remover</button>
                      </td>
                    </tr>
                  )
                })}
            <tr>
              <td>
                <input className='form-control' type='text' value={descricao} onChange={onChangeDescricao} placeholder='Descrição' />
              </td>
              <td className='text-right'>
                <input className='form-control' type='text' value={valor} onChange={onChangeValor} placeholder='Valor' />
              </td>
              <td>
                <button className='btn btn-success form-control' onClick={salvarMovimentacao}>Adicionar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Movimentacoes
