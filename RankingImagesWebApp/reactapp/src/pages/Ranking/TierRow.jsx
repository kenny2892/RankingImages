import TierInfoChangeBtn from './TierInfoChangeBtn';

const TierRow = ({ tier, items, drop, allowDrop, moveTiers, changeTierInfo, callOnDelete }) =>
{
	function updateTierInfo(newName, newColor, newLabelColor)
	{
		changeTierInfo(tier.index, newName, newColor, newLabelColor);
	}

	function callToDeleteRow()
	{
		callOnDelete(tier.index);
	}

	// Need to get setItems and setTiers and possibly setRanking
	return (
		<div className="rank-row-wrapper" style={{ backgroundColor: tier.color }}>
			<div className="row-label" style={{ color: tier.labelColor }}><h4>{tier.name}</h4></div>
			<div className="rank-row" id={`tier-row-${tier.index}`} onDrop={drop} onDragOver={allowDrop}>
				{items}
			</div>
			<div className="rank-row-settings-wrapper">
				<button onClick={(e) => moveTiers(tier.index, true)}>▲</button>
				<TierInfoChangeBtn currName={tier.name} currColor={tier.color} currLabelColor={tier.labelColor} callOnSubmit={updateTierInfo} callOnDelete={callToDeleteRow} />
				<button onClick={(e) => moveTiers(tier.index, false)}>▼</button>
			</div>
		</div>
	);
}

export default TierRow;