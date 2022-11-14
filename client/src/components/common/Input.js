/**
 * Prepares and displays input inside DOM.
 * @returns input JSX.
 */
const Input = (props) => {
    let classes = props.classes
    if (props.error !== '' && props.error) {
        classes += ' red-border'
    }

    let input = undefined
    if (props.type === 'checkbox') {
        input = <input className={classes} type={props.type} disabled={props.disabled} checked={props.checked} onClick={() => {
            if (props.errorSetter) {
                props.errorSetter('')
            }
        }} onChange={(e) => { props.setter(e.target.checked) }} />
    } else {
        input = <input className={classes} type={props.type} disabled={props.disabled} value={props.value} onFocus={() => {
            if (props.errorSetter) {
                props.errorSetter('')
            }
        }} onChange={(e) => { props.setter(e.target.value) }} />
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