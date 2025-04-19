import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor= '',
    textColor = 'bg-black',
    className = '',
    ...props
}) {
  return (
    <button className={`px-4 py-2 ${className} ${bgColor} ${textColor} ${className} {...props}`}>{children}</button>
  )
}

export default Button