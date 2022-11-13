/**
 * Prepares and displays input inside DOM.
 * @returns input JSX.
 */
const Input = (props) => {
    let classes = props.classes
    if (props.error !== '') {
        classes += ' red-border'
    }

    let input = undefined
    if (props.type === 'checkbox') {
        input = <input className={classes} type={props.type} checked={props.value} onChange={(e) => { props.setter(e.target.checked) }} />
    } else {
        input = <input className={classes} type={props.type} value={props.value} onChange={(e) => { props.setter(e.target.value) }} />
    }

    return (
        <div>
            <label>
                {props.label}
                {input}
                {props.error}
            </label>
        </div>
    )
}

export default Input