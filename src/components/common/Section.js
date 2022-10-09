import React from 'react'

const Section = (props) => {
  const { size, hasContainer = true, children, className, style } = props
  return (
    <div
      className={`section p-t:${size || 10} p-b:${size} ${className || ''}`}
      style={style}
    >
      <div className={hasContainer && 'bx--grid'}>
        {children}
      </div>
    </div>
  )
}

export default Section
