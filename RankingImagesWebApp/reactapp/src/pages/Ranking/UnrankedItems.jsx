import UnrankedItemsCell from './UnrankedItemsCell';

const UnrankedItems = ({items, drag, allowDrop, drop, itemClick}) =>
{
	return (
		<div className="items-not-ranked" onDrop={drop} onDragOver={allowDrop}>
			{
				items.map(item => item.rankingTier === -1 ?
					<UnrankedItemsCell key={`item-${item.filename}`} item={item} drag={drag} itemClick={itemClick} />
					: null)
			}
		</div>
	)
}

export default UnrankedItems;