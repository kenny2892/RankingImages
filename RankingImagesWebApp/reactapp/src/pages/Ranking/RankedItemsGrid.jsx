import { useState } from 'react';
import TierRow from './TierRow';
import CreateNewTier from './CreateNewTier';

const RankedItemsGrid = ({ items, tiers, drag, allowDrop, drop, itemClick, moveTiers, changeTierInfo, createNewTier, callOnDelete }) =>
{
	const [showNewTierModal, setShowNewTierModal] = useState(false);
	const [newTiersIndex, setNewTiersIndex] = useState();

	function showAddNewTier(index)
	{
		setNewTiersIndex(index);
		setShowNewTierModal(true);
	}

	function createRankingGrid()
	{
		var tierRows = [];
		tiers.forEach((val, index, ara) =>
		{
			var itemsWithinRow = [];
			let itemsInThisTier = items.filter(item => item.rankingTier == val.index);
			if(itemsInThisTier.length > 0)
			{
				itemsInThisTier.sort((a, b) => a.rankingIndex - b.rankingIndex);
				itemsInThisTier.forEach(item => addItemToCollection(itemsWithinRow, item));
			}

			tierRows.push(
				<div>
					<div className="add-tier-row" key={`add-row-above-${val.index}`} onClick={(e) => showAddNewTier(val.index)}>
						<span className="add-tier-row-circle">+</span>
					</div>
					<TierRow key={`tier-${val.index}`} tier={val} items={itemsWithinRow} drop={drop} allowDrop={allowDrop} moveTiers={moveTiers} changeTierInfo={changeTierInfo} callOnDelete={callOnDelete} />
					{
						index !== ara.length -1 ? null :
							<div className="add-tier-row" key={`add-row-below-${val.index}`} onClick={(e) => showAddNewTier(val.index + 1)}>
								<span className="add-tier-row-circle">+</span>
							</div>
					}
				</div>
			);
		});

		return tierRows;
	}

	function addItemToCollection(currCollection, item)
	{
		currCollection.push(
			<div id={`item-wrapper-${item.filename}`} key={`item-wrapper-${item.filename}`} className="rank-cell" onDrop={drop} onDragOver={allowDrop}>
				{
					item != null ? <img className="rank-cell-img" title={item.name} id={`item-${item.filename}`} key={`item-${item.filename}`} src={`https://localhost:7268${item.imageRelativePath}`} draggable="true" onDragStart={drag} onClick={() => itemClick(item)} /> : null
				}
			</div>
		)
	}

	return (
		<div className="rankings">
			{createRankingGrid()}
			<CreateNewTier showModal={showNewTierModal} setShowModal={setShowNewTierModal} callOnCreate={(newTiersName, newTiersColor, newTiersLabelColor) => createNewTier(newTiersIndex, newTiersName, newTiersColor, newTiersLabelColor)} />
		</div>
	)
}

export default RankedItemsGrid;