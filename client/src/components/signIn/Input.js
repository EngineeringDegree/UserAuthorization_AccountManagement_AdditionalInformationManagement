const Input = (props) => {
    let classes = props.classes
    if (props.error !== '') {
        classes += ' red-border'
    }

    return (
        <div>
            <label>
                {props.label}
                <input className={classes} type={props.type} value={props.value} checked={props.value} onChange={(e) => props.setter(e.target.value)} />
                {props.error}
            </label>
        </div>
    )
}

export default Input