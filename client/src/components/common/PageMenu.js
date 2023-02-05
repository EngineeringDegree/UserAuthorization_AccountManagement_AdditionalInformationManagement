/**
 * Page menu logic
 * @param {object} props 
 * @returns jsx for page possibilities
 */
const PageMenu = (props) => {

    /**
     * Creates list of pages to display in select
     * @returns possible page options.
     */
    const createListOfPages = () => {
        let optionsJsx = []
        for (let i = 0; i < props.pages; i++) {
            optionsJsx.push(
                <option key={i} value={i + 1}>{i + 1}</option>
            )
        }

        return optionsJsx
    }

    return (
        <div className="d-flex justify-content-center m-4">
            <button className="standard-btn my-4" disabled={props.page == 1} onClick={() => props.setPage(props.page / 1 - 1)}>Previous</button>
            <select className="d-block mobile-center my-4 mx-4" onChange={(e) => props.setPage(e.target.value)} value={props.page}>
                {createListOfPages()}
            </select>
            <button className="standard-btn my-4" disabled={props.page == props.pages} onClick={() => props.setPage(props.page / 1 + 1)}>Next</button>

        </div>
    )
}

export default PageMenu

