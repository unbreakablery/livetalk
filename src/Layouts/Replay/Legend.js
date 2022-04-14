import React from 'react'
import './Legend.scss'

const Legend = ({ items, special = "" }) => {

    return (
        <div className="legend-wrapper">
            { items && items.length ?
                <div>
                    {items.map((item, i) => {
                        return <span className="legend-item" key={i}><span className="legend-color" style={{ backgroundColor: item.color }}></span>{item.text}</span>
                    })}
                </div> : <></>
            }
            {special ? <span className="special">{special}</span> : <></>}
        </div>
    )
}

export default Legend
