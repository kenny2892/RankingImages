import React, { useState } from 'react';
import RankingSelection from './RankingSelection';
import RankingDisplay from './RankingDisplay';
import '../../css/RankingPage.css';

const RankingPage = () =>
{
	const [ranking, setRanking] = useState();
	
	return (
		<main>
			<RankingSelection ranking={ranking} setRanking={setRanking} />
			<RankingDisplay ranking={ranking} setRanking={setRanking} />
		</main>
	)
}

export default RankingPage;