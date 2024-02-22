import { useState, useEffect } from 'react';
import { Collapse } from 'reactstrap';
import CreateRankingBtn from './CreateRankingBtn';
import '../../css/RankingSelection.css';

const RankingSelection = ({ ranking, setRanking }) =>
{
	const [rankings, setRankings] = useState([]);
	const [isOpen, setIsOpen] = useState(true);
	const toggleOpen = () => setIsOpen(!isOpen);

	useEffect(() =>
	{
		async function updateRankings()
		{
			await getListOfRankings();
		}

		updateRankings();
	}, [ranking]);

	async function getListOfRankings()
	{
		await fetch("api/Ranking/list",
			{
				method: "GET",
				credentials: "include"
			})
			.then(response => response.json())
			.then(data =>
			{
				var rankingsToUse = data;
				rankingsToUse.sort((a, b) =>
				{
					return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
				});
				setRankings(rankingsToUse);
			});
	}

	async function createRanking(title)
	{
		var response = await fetch("api/Ranking/create",
			{
				method: "POST",
				credentials: "include",
				headers:
				{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(title)
			});

		if(response.ok)
		{
			getListOfRankings();
		}
	}

	function selectRanking(ranking)
	{
		setRanking(ranking);

		var btns = document.getElementsByClassName("ranking-selection-btn");
		Array.from(btns).forEach((val) => val.classList.remove("active"));

		var btn = document.getElementById("rankingSelectionBtn" + ranking.id);
		btn.classList.add("active");

		setIsOpen(false);
	}

	return (
		rankings == null ? null :
			<div className="ranking-selection">
				<Collapse isOpen={isOpen} horizontal>
					<div className="ranking-selection-list">
						{
							rankings.map(ranking =>
								<button className="ranking-selection-btn" key={ranking.id} id={`rankingSelectionBtn${ranking.id}`} onClick={() => selectRanking(ranking)}>
									{ranking.title}
								</button>
							)
						}

						<CreateRankingBtn callOnCreate={createRanking} />
					</div>
				</Collapse>
				<button className="ranking-selection-collapse-btn" onClick={toggleOpen}>
					{
						isOpen ? <span>&lt;</span> : <span>&gt;</span>
					}
				</button>
			</div>
	);
}

export default RankingSelection;