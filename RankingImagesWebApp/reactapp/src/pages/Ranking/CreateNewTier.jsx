import { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const CreateNewTier = ({ showModal, setShowModal, callOnCreate }) =>
{
	const starterInput = useRef(null);
	const [name, setName] = useState("");
	const [color, setColor] = useState("#000000");
	const [labelColor, setLabelColor] = useState("#ffffff");
	const [error, setError] = useState();
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

	function onCreateBtn()
	{
		if(name == null || name.length == 0)
		{
			setError("Please enter a Name");
			return;
		}

		toggleModal();
		callOnCreate(name, color, labelColor);
		setColor("#000000");
		setLabelColor("#ffffff");
		setName("");
	}

	return (
		<div>
			<Modal isOpen={showModal} toggle={toggleModal}>
				<ModalHeader toggle={toggleModal}>Add Tier</ModalHeader>
				<ModalBody>
					<div>
						<h4>Name: </h4>
						<input ref={starterInput} value={name} onChange={e => setName(e.target.value)} placeholder="Type Name Here" />
					</div>
					<div>
						<h4>Color: </h4>
						<input type="color" value={color} onChange={e => setColor(e.target.value)} />
					</div>
					<div>
						<h4>Label Color: </h4>
						<input type="color" value={labelColor} onChange={e => setLabelColor(e.target.value)} />
					</div>
					{
						error == null ? null :
							<h5 style={{ color: "red" }}>{error}</h5>
					}
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={onCreateBtn}>
						Add
					</Button>{' '}
					<Button color="secondary" onClick={toggleModal}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}

export default CreateNewTier;