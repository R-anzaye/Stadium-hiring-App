import React from 'react'
import { useParams } from 'react-router-dom'

export default function BookForm() {
    const {id} = useParams()
    
  return (

    <div>BookForm {id}</div>
    
  )
}
