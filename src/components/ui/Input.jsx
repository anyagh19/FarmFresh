import React, { useId } from 'react'

const Input = React.forwardRef( function Input ({
    label,
    type="text",
    className='',
    ...props
}, ref) {
    const id = useId();
    return (
        <div className=' w-full flex flex-col'>
            {label && <label className='inline-block font-medium text-gray-500' htmlFor={id}>{label}</label>}
            <input 
            type={type}
            className={`${className}`}
            id={id}
            ref={ref}
            {...props}
            />
        </div>
    )
})
export default Input