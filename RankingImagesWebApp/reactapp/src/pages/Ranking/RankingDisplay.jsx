import React, { useState, useEffect } from 'react';
import UploadRankingImageBtn from './UploadRankingImageBtn';
import RankedItemsGrid from './RankedItemsGrid';
import UnrankedItems from './UnrankedItems';
import EditRankingTitleBtn from './EditRankingTitleBtn';
import EditRankingItemNameBtn from './EditRankingItemNameBtn';
import ItemDeletionBox from './ItemDeletionBox';
import ItemDeleteConfirmation from './ItemDeleteConfirmation';
import DeleteRankingBtn from './DeleteRankingBtn';

const RankingDisplay = ({ ranking, setRanking }) =>
{
	const [items, setItems] = useState([]);
	const [tiers, setTiers] = useState([]);
	const [previewItem, setPreviewItem] = useState();
	const [itemSetForDeletion, setItemSetForDeletion] = useState();
	const [showItemDeletionModal, setShowItemDeletionModal] = useState(false);

	function drag(event)
	{
		event.dataTransfer.setData("text", event.target.id);
	}

	function allowDrop(event)
	{
		event.preventDefault();
	}

	function drop(event)
	{
		event.preventDefault();
		const targetElement = event.target;

		// Drag onto existing item
		if(targetElement.classList.contains("rank-cell-img"))
		{
			var itemId = event.dataTransfer.getData("text").substring(5);

			// Get Item's ID that will be moved over to the left
			var itemIdToReplace = targetElement.id.replace("item-", "");

			// Get the item
			var itemToReplace = items.find(item => item.filename === itemIdToReplace);

			// Get that item's original index and their tier
			var rowTier = itemToReplace.rankingTier;
			var index = itemToReplace.rankingIndex;

			// Increase the index of all items with an index greater than the 'index' variable
			const transformedCollection = items.map(item =>
			{
				if(item.filename === itemId)
				{
					return { ...item, rankingTier: rowTier, rankingIndex: index };
				}

				else if(item.rankingIndex >= index)
				{
					return { ...item, rankingIndex: item.rankingIndex + 1 };
				}

				return { ...item, rankingIndex: item.rankingIndex };
			});

			setItems(transformedCollection);
		}

		// Drag back into the un-ranked section
		else if(targetElement.classList.contains("items-not-ranked"))
		{
			var itemId = event.dataTransfer.getData("text").substring(5);
			const transformedCollection = items.map(item =>
				item.filename === itemId ? { ...item, rankingTier: -1, rankingIndex: -1 } : { ...item, rankingIndex: item.rankingIndex });
			setItems(transformedCollection);
		}

		// Drag onto row
		else if(targetElement.classList.contains("rank-row"))
		{
			var itemId = event.dataTransfer.getData("text").substring(5);
			var itemBeingDragged = items.find(item => item.filename === itemId);

			// Find out the row's tier
			var rowTier = parseInt(targetElement.id.replace("tier-row-", ""));

			// If the element is already within the row, remove it and reset all rankingIndex for that row
			if(itemBeingDragged.rankingTier == rowTier)
			{
				// Find out how many items are in the row
				var newIndex = items.filter(item => item.rankingTier === rowTier).length - 1;

				// Get the old index #
				var oldIndex = itemBeingDragged.rankingIndex;

				const transformedCollection = items.map(item =>
				{
					if(item.filename === itemId)
					{
						return { ...item, rankingTier: rowTier, rankingIndex: newIndex };
					}

					else if(item.rankingTier === rowTier && item.rankingIndex > oldIndex)
					{
						return { ...item, rankingTier: rowTier, rankingIndex: item.rankingIndex - 1 };
					}

					return item;
				});

				setItems(transformedCollection);
			}

			else
			{
				// Find out how many elements are already in the row
				var itemCount = targetElement.childNodes.length;

				// Update the Item
				const transformedCollection = items.map(item =>
					item.filename === itemId ? { ...item, rankingTier: rowTier, rankingIndex: itemCount } : { ...item, rankingIndex: item.rankingIndex });
				setItems(transformedCollection);
			}
		}

		// Drag into Trash
		else if(targetElement.classList.contains("item-deletion"))
		{
			var itemId = event.dataTransfer.getData("text").substring(5);
			var itemBeingDragged = items.find(item => item.filename === itemId);

			if(itemBeingDragged != null)
			{
				setItemSetForDeletion(itemBeingDragged);
				setShowItemDeletionModal(true);
			}
		}
	}

	// If Items gets updated, then send that to the server
	useEffect(() =>
	{
		async function updateRankingItems()
		{
			const formData = new FormData();
			formData.append("RankingId", ranking.id);
			formData.append("ItemJson", JSON.stringify(items));

			var response = await fetch("api/Ranking/update-items",
				{
					method: "POST",
					credentials: "include",
					body: formData
				});

			if(!response.ok)
			{
				console.error("ERROR: Unable to save item changes to server!");
			}
		}

		if(items != null && ranking != null)
		{
			updateRankingItems();
		}

		// Also need to update Preview Item
		if(previewItem != null)
		{
			var prevItem = items.find(item => item.filename === previewItem.filename);

			if(prevItem != null)
			{
				setPreviewItem(prevItem);
			}
		}
	}, [items])

	// If Tiers gets updated, then send that to the server
	useEffect(() =>
	{
		async function updateRankingTiers()
		{
			const formData = new FormData();
			formData.append("RankingId", ranking.id);
			formData.append("TierJson", JSON.stringify(tiers));

			var response = await fetch("api/Ranking/update-tiers",
				{
					method: "POST",
					credentials: "include",
					body: formData
				});

			if(!response.ok)
			{
				console.error("ERROR: Unable to save tier changes to server!");
			}
		}

		if(tiers != null && ranking != null)
		{
			updateRankingTiers();
		}
	}, [tiers])

	async function updateRankingTitle(newTitle)
	{
		const formData = new FormData();
		formData.append("RankingId", ranking.id);
		formData.append("Title", newTitle);

		var response = await fetch("api/Ranking/update-title",
			{
				method: "POST",
				credentials: "include",
				body: formData
			});

		if(!response.ok)
		{
			console.error("ERROR: Unable to save title changes to server!");
		}

		else
		{
			var udpatedRanking = { ...ranking, title: newTitle };
			setRanking(udpatedRanking);
		}
	}

	// Resetting all Items
	function resetItems()
	{
		var updatedItems = items.map((item) =>
		{
			item.rankingTier = -1;
			item.rankingIndex = -1;
			return item;
		})

		setItems(updatedItems);
	}

	// Upload new images
	async function onImageUpload(names, images)
	{
		const formData = new FormData();
		formData.append("Names", names);
		formData.append("RankingId", ranking.id);

		for(let i = 0; i < images.length; i++)
		{
			formData.append("Images", images[i]);
		}

		var response = await fetch("api/Ranking/upload-images",
			{
				method: "POST",
				credentials: "include",
				body: formData
			});

		if(response.ok)
		{
			var json = await response.json();
			setItems(JSON.parse(json.updatedItems));
		}
	}

	// Change the Tier Order
	function moveTiers(tierIndexToChange, goingUp)
	{
		// Find largest Tier Index
		var maxIndex = tiers.reduce((prev, current) =>
		{
			return (prev && prev.index > current.index) ? prev : current;
		}).index;

		// If going up, but already at the top OR going down, but already at the bottom
		if((goingUp && tierIndexToChange == 0) || (!goingUp && tierIndexToChange == maxIndex))
		{
			return;
		}

		var toAdd = goingUp ? -1 : 1;

		// Update the Tiers
		var updatedTiers = tiers.map(tier =>
		{
			if(tier.index === tierIndexToChange)
			{
				return { ...tier, index: tierIndexToChange + toAdd };
			}

			else if(tier.index === tierIndexToChange + toAdd)
			{
				return { ...tier, index: tierIndexToChange };
			}

			return tier;
		});

		updatedTiers.sort((a, b) => a.index - b.index);

		// Update the Items
		var updateItems = items.map(item =>
		{
			if(item.rankingTier === tierIndexToChange)
			{
				return { ...item, rankingTier: tierIndexToChange + toAdd };
			}

			else if(item.rankingTier === tierIndexToChange + toAdd)
			{
				return { ...item, rankingTier: tierIndexToChange };
			}

			return item;
		});

		setTiers(updatedTiers);
		setItems(updateItems);
	}

	// Change Tier Info
	function changeTierInfo(tierIndexToChange, newName, newColor, newLabelColor)
	{
		var updatedTiers = tiers.map(tier =>
		{
			if(tier.index === tierIndexToChange)
			{
				return { ...tier, name: newName, color: newColor, labelColor: newLabelColor };
			}

			return tier;
		});

		setTiers(updatedTiers);
	}

	// Update the Items and Tiers using the new Ranking
	useEffect(() =>
	{
		async function getTiers()
		{
			var response = await fetch("api/Ranking/get-tiers",
				{
					method: "POST",
					credentials: "include",
					headers:
					{
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(ranking.id)
				});

			if(!response.ok)
			{
				console.error("ERROR: Unable to get tiers from the server!");
			}

			else
			{
				var tiersModel = await response.json();
				var tiersToUse = JSON.parse(tiersModel.json);
				tiersToUse.sort((a, b) => a.index - b.index);
				setTiers(tiersToUse);
			}
		}

		async function getItems()
		{
			var response = await fetch("api/Ranking/get-items",
				{
					method: "POST",
					credentials: "include",
					headers:
					{
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(ranking.id)
				});

			if(!response.ok)
			{
				console.error("ERROR: Unable to get items from the server!");
			}

			else
			{
				var itemsModel = await response.json();
				var itemsToUse = JSON.parse(itemsModel.json);
				setItems(itemsToUse == null ? [] : itemsToUse);
			}
		}

		if(ranking != null)
		{
			getItems();
			getTiers();
			document.title = ranking == null ? "Ranking Images" : `${ranking.title} - Ranking Images`;
		}

		else
		{
			setItems([]);
			setTiers([]);
		}

		setPreviewItem(null);
	}, [ranking]);

	// Double Click to Preview
	function previewTheItem(item)
	{
		setPreviewItem(item);
	}

	async function editTitle(newTitle)
	{
		if(newTitle != null && newTitle !== ranking.title && newTitle.length > 0)
		{
			await updateRankingTitle(newTitle);
		}
	}

	async function editItemName(newName)
	{
		if(newName != null && newName !== previewItem.name && newName.length > 0)
		{
			var updatedItems = items.map(item =>
			{
				if(item.filename === previewItem.filename)
				{
					return { ...item, name: newName };
				}

				return item;
			});

			setItems(updatedItems);
		}
	}

	function deleteItem()
	{
		if(itemSetForDeletion != null)
		{
			var indexToRemove = items.indexOf(itemSetForDeletion);

			if(indexToRemove > -1)
			{
				var deletedItemTier = itemSetForDeletion.rankingTier;
				var deletedItemIndex = itemSetForDeletion.rankingIndex;

				// Remove the item
				var updatedItems = items.toSpliced(indexToRemove, 1);

				// Update the ranking indexes
				updatedItems = updatedItems.map(item =>
				{
					if(item.rankingTier === deletedItemTier && item.rankingIndex > deletedItemIndex)
					{
						return { ...item, rankingIndex: item.rankingIndex - 1};
					}

					return item;
				});

				setItems(updatedItems);
			}
		}
	}

	function createNewTier(newTiersIndex, newTiersName, newTiersColor, newTiersLabelColor)
	{
		// If the new index is already used by an existing Tier, then increase the existing (and all greater than) by 1
		// And then adjust all items to also have their Tiers increased

		if(tiers.length <= newTiersIndex)
		{
			var updatedTiers = [...tiers];
			updatedTiers.push({ index: newTiersIndex, name: newTiersName, color: newTiersColor, labelColor: newTiersLabelColor });
			setTiers(updatedTiers);
		}

		else
		{
			var updatedTiers = tiers.map(tier =>
			{
				if(tier.index >= newTiersIndex)
				{
					return { ...tier, index: tier.index + 1 };
				}

				return tier;
			});

			updatedTiers.push({ index: newTiersIndex, name: newTiersName, color: newTiersColor, labelColor: newTiersLabelColor });
			updatedTiers.sort((a, b) => a.index - b.index);

			var updatedItems = items.map(item =>
			{
				if(item.rankingTier >= newTiersIndex)
				{
					return { ...item, rankingTier: item.rankingTier + 1 };
				}

				return item;
			});

			setTiers(updatedTiers);
			setItems(updatedItems);
		}
	}

	function deleteTier(tierIndexToDelete)
	{
		if(tierIndexToDelete < tiers.length)
		{
			var tierToRemove = tiers.find(tier => tier.index === tierIndexToDelete);

			if(tierToRemove != null)
			{
				var indexToRemove = tiers.indexOf(tierToRemove);
				var updatedTiers = tiers.toSpliced(indexToRemove, 1);
				updatedTiers = updatedTiers.map(tier =>
				{
					if(tier.index > tierIndexToDelete)
					{
						return { ...tier, index: tier.index - 1 };
					}

					return tier;
				});

				var updatedItems = items.map(item =>
				{
					if(item.rankingTier === tierIndexToDelete)
					{
						return { ...item, rankingTier: -1, rankingIndex: -1 };
					}

					return item;
				});

				setTiers(updatedTiers);
				setItems(updatedItems);
			}
		}
	}

	async function deleteRanking()
	{
		var response = await fetch("api/Ranking/delete",
			{
				method: "POST",
				credentials: "include",
				headers:
				{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(ranking.id)
			});

		if(!response.ok)
		{
			console.error("ERROR: Unable to delete ranking!");
		}

		else
		{
			setRanking(null);
		}
	}

	return (
		ranking == null ? null : 
			<div>
				<div className="ranking-title-wrapper">
					<h3 className="ranking-title">{ranking.title}</h3>
					<EditRankingTitleBtn currTitle={ranking.title} callOnEdit={editTitle} />
					<DeleteRankingBtn callOnDelete={deleteRanking} />
				</div>
				<div className="ranking-button-row">
					<UploadRankingImageBtn callOnCreate={onImageUpload} />
					<button onClick={resetItems}>Reset All</button>
				</div>
				<RankedItemsGrid items={items} tiers={tiers} drag={drag} allowDrop={allowDrop} drop={drop} itemClick={previewTheItem} moveTiers={moveTiers} changeTierInfo={changeTierInfo} createNewTier={createNewTier} callOnDelete={deleteTier} />
				<UnrankedItems items={items} drag={drag} allowDrop={allowDrop} drop={drop} itemClick={previewTheItem} />
				<ItemDeletionBox allowDrop={allowDrop} drop={drop} />
				<ItemDeleteConfirmation item={itemSetForDeletion} showModal={showItemDeletionModal} setShowModal={setShowItemDeletionModal} callOnConfirm={deleteItem} />
				{
					previewItem != null ?
						<div className="ranking-grid-preview-img-wrapper">
							<div style={{display: "flex"}}>
								<h5>{previewItem.name}</h5>
								<EditRankingItemNameBtn item={previewItem} callOnEdit={editItemName} />
							</div>
							<img className="ranking-grid-preview-img" src={`https://localhost:7268${previewItem.imageRelativePath}`} />
						</div>
						: null
				}
			</div>
	);
}

export default RankingDisplay;