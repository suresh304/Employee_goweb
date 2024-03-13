import React, { useState } from 'react'
import "../App.css";


const Model = ({title,children,submitHandler,setShowModel}) => {
    const handleCancel = ()=>{
        setShowModel(false)
    }
    
  return (
    <div className='model'>
        <div className='model__title'>{title}</div>
        <div className='model__content'>
            <center>

         {children}
            </center>
        </div>
        <div className='model__footer'>
          <button className='' onClick={submitHandler}>ok/submit</button>
          <button className = '' onClick={handleCancel}>cancel</button>
        </div>
    </div>
  )
}

export default Model