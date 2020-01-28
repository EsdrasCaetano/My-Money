import React, { useRef, useState } from 'react'
import { Redirect } from 'react-router-dom'

const minAno = 2020
const maxAno = 2023

const AdicionarMes = () => {
  const refAno = useRef()
  const refMes = useRef()
  const [redir, setRedir] = useState('')
  const anos = []
  const meses = []
  for (let i = minAno; i <= maxAno; i++) {
    anos.push(i)
  }
  for (let i = 1; i <= 12; i++) {
    meses.push(i)
  }
  const zeroPad = num => {
    if (num < 10) {
      return '0' + num
    }
    return num
  }
  const verMes = () => {
    setRedir(refAno.current.value + '-' + refMes.current.value)
  }
  if (redir !== '') {
    return <Redirect to={'/movimentacoes/' + redir} />
  }
  return (
    <>
      <h2>Adicionar mês</h2>
      <div className='row justify-content-between'>
        <div className='form-group col-4'>
          <select ref={refAno} className='form-control'>
            {anos.map(ano => <option key={ano} value={ano}>{ano}</option>)}
          </select>
        </div>
        <div className='form-group col-4'>
          <select ref={refMes} className='form-control'>
            {meses.map(zeroPad).map(mes => <option key={mes} value={mes}>{mes}</option>)}
          </select>
        </div>
        <div className='form-group col-2'>
          <button className='btn btn-outline-dark' onClick={verMes}>Adicionar mês</button>
        </div>
      </div>
      </>
  )
}

export default AdicionarMes
