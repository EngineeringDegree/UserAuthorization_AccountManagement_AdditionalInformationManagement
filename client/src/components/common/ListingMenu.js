import PageMenu from "./PageMenu"
import Input from "./Input"

/**
 * Listing menu logic
 * @param {object} props 
 * @returns jsx for listing possibilities
 */
const ListingMenu = (props) => {
    const options = [
        {
            label: "1",
            value: "1",
        },
        {
            label: "5",
            value: "5",
        },
        {
            label: "10",
            value: "10",
        },
        {
            label: "30",
            value: "30",
        }
    ]

    return (
        <div className="d-lg-flex">
            <Input label={props.name} classes="username standard-input change-username" type="text" value={props.username} setter={props.setUsername} error={""} errorSetter={() => { }} />
            <PageMenu page={props.page} setPage={props.setPage} pages={props.pages} setPages={props.setPages} />
            <div className="align-self-center mb-4">
                <p className="orange-text">Records</p>
                <select className="d-block mobile-center" onChange={(e) => props.setRecordsPerPage(e.target.value)} value={props.recordPerPage}>
                    {options.map((option) => (
                        <option key={option.label} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default ListingMenu

