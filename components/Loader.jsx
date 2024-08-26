import React from 'react'

export default function Loader() {
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='h-1/3 w-1/3'>
            <img src="/loader.gif" alt="Loading..." />
            </div>
        </div>
    )
}