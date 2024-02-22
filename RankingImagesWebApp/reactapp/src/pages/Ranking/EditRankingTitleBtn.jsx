import { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const EditRankingTitleBtn = ({ currTitle, callOnEdit }) =>
{
	const starterInput = useRef(null);
	const [title, setTitle] = useState(currTitle);
	const [error, setError] = useState();
	const [showModal, setShowModal] = useState(false);
	const toggleModal = () => setShowModal(!showModal);

	// This is to make the input focus when displayed
	useEffect(() =>
	{
		if(showModal)
		{
			setTimeout(() =>
			{
				if(starterInput.current != null)
				{
					starterInput.current.focus();
				}
			}, 100)
		}
	}, [showModal]);

	function onUpdateBtn()
	{
		if(title == null || title.length == 0)
		{
			setError("Please enter a Title");
			return;
		}

		toggleModal();
		callOnEdit(title);
	}

	return (
		<div>
			<button className="ranking-title-edit-btn" onClick={toggleModal}>
				<span className="pencil">&#9998;</span>
			</button>

			<Modal isOpen={showModal} toggle={toggleModal}>
				<ModalHeader toggle={toggleModal}>Edit Title</ModalHeader>
				<ModalBody>
					<h4>Title: </h4>
					<input ref={starterInput} value={title} onChange={e => setTitle(e.target.value)} placeholder="Type Title Here" />
					{
						error == null ? null :
							<h5 style={{ color: "red" }}>{error}</h5>
					}
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={onUpdateBtn}>
						Update
					</Button>{' '}
					<Button color="secondary" onClick={toggleModal}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}

export default EditRankingTitleBtn;