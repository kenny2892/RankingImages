
const Item = ({ item, drag, itemClick }) =>
{
	return (
		<div className="unranked-cell">
			<img title={item.name} id={`item-${item.filename}`} src={`https://localhost:7268${item.imageRelativePath}`} draggable="true" onDragStart={drag} onClick={() => itemClick(item)} />
		</div>
	)
}

export default Item;