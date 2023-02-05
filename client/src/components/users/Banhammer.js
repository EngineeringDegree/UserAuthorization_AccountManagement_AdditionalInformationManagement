import React, { useState } from "react"
import Input from "../common/Input"

/**
 * Prepares logic for displaying user ban.
 * @param {object} props 
 * @returns jsx for banhammer
 */
const Banhammer = (props) => {
    const [reason, setReason] = useState("")
    const [time, setTime] = useState("7")
    const options = [
        {
            label: "1",
            value: "1",
        },
        {
            label: "7",
            value: "7",
        },
        {
            label: "31",
            value: "31",
        },
        {
            label: "180",
            value: "180",
        }
    ]

    /**
     * Sends ban request.
     */
    const sendBanRequest = () => {
        if (time !== "" && props.id && reason !== "") {
            props.banUser(props.id, reason, time)
        }
    }

    return (
        <div className="d-lg-flex" onClick={(e) => e.preventDefault()}>
            <Input label="Reason" classes="reason standard-input change-reason mx-4" type="text" value={reason} setter={setReason} error={""} errorSetter={() => { }} />
            <label className="align-self-center">
                <p className="orange-text">Suspension days</p>
                <select className="d-block mobile-center" onChange={(e) => setTime(e.target.value)} value={time}>
                    {options.map((option) => (
                        <option key={option.label} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </label>
            <button className="ms-4 standard-btn my-4 ban-btn" onClick={sendBanRequest}>Ban user</button>
        </div>
    )
}

export default Banhammer