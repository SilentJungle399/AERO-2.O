import React from 'react'

export default function Message(props) {
    var style = "";
    if (props.error)
        style = "text-red-500";
    if (props.success)
        style = "text-green-500"
    return (
        <div className={"text-center "+style}>
            {props.success}
            {props.error}
            {props.message.replace(/"/g, '')}
        </div>
    )
}
