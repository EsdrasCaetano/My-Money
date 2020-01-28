import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import Rest from '../../utils/rest'

const baseURL = 'https://mymoney-ec.firebaseio.com/'
const { useGet } = Rest(baseURL)

const Meses = () => {
  const data = useGet('meses')
  if (data.loading) {
    return <span>Carregando...</span>
  }
  if (data.error && data.error === 'Permission denied') {
    return <Redirect to='/login' />
  }
  if (Object.keys(data.data).length > 0) {
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Mês</th>
            <th>Previsão Entrada</th>
            <th>Entrada</th>
            <th>Previsão Saida</th>
            <th>Saida</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {
            Object
              .keys(data.data)
              .map(mes => {
                return (
                  <tr className='btn-outline-light' key={mes}>
                    <td><Link to={`movimentacoes/${mes}`}>{mes}</Link></td>
                    <td className='btn-outline-secondary'>{data.data[mes].previsao_entrada}</td>
                    <td className='btn-outline-success'>{data.data[mes].entradas}</td>
                    <td className='btn-outline-secondary'>{data.data[mes].previsao_saida}</td>
                    <td className='btn-outline-danger'>{data.data[mes].saidas}</td>
                    <td className='btn-outline-warning'>{data.data[mes] ? data.data[mes].entradas + data.data[mes].saidas : 0}</td>
                  </tr>
                )
              })
          }
        </tbody>
      </table>
    )
  }
  return null
}

export default Meses
