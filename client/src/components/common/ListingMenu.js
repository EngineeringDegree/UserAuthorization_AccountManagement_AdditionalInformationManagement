import PageMenu from "./PageMenu"

/**
 * Listing menu logic
 * @param {object} props 
 * @returns jsx for listing possibilities
 */
const ListingMenu = (props) => {

    return (
        <>
            Listing Menu
            <PageMenu page={props.page} setPage={props.setPage} pages={props.pages} setPages={props.setPages} />
        </>
    )
}

export default ListingMenu

