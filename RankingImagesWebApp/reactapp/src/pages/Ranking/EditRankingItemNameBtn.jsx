import { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const EditRankingItemNameBtn = ({ item, callOnEdit }) =>
{
	const starterInput = useRef(null);
	const [name, setName] = useState(item.name);
	const [error, setError] = useState();
	const [showModal, setShowModal] = useState(false);
	const toggleModal = () => setShowModal(!showModal);

	// This is to ensure that the name displayed is always up to date.
	useEffect(() =>
	{
		if(item != null);
		{
			setName(item.name);
		}
	}, [item]);

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
		if(name == null || name.length == 0)
		{
			setError("Please enter a Name");
			return;
		}

		toggleModal();
		callOnEdit(name);
		setError(null);
	}

	return (
		<div>
			<button className="ranking-title-edit-btn" onClick={toggleModal}>
				<span className="pencil">&#9998;</span>
			</button>

			<Modal isOpen={showModal} toggle={toggleModal}>
				<ModalHeader toggle={toggleModal}>Edit Name</ModalHeader>
				<ModalBody>
					<h4>Name: </h4>
					<input ref={starterInput} value={name} onChange={e => setName(e.target.value)} placeholder="Type Name Here" />
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

export default EditRankingItemNameBtn;