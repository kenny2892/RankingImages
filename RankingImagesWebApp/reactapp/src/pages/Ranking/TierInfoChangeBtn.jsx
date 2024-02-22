import { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const TierInfoChangeBtn = ({ currName, currColor, currLabelColor, callOnSubmit, callOnDelete }) =>
{
	const starterInput = useRef(null);
	const [name, setName] = useState(currName);
	const [color, setColor] = useState(currColor);
	const [labelColor, setLabelColor] = useState(currLabelColor);
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

	function onCreateBtn()
	{
		if(name == null || name.length == 0)
		{
			setError("Please enter a Name");
			return;
		}

		toggleModal();
		callOnSubmit(name, color, labelColor);
	}

	function onDeleteBtn()
	{
		toggleModal();
		callOnDelete();
	}

	return (
		<div>
			<button onClick={toggleModal}>⚙</button>

			<Modal isOpen={showModal} toggle={toggleModal}>
				<ModalHeader toggle={toggleModal}>Edit Tier Info</ModalHeader>
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
					<div>
						<button onClick={onDeleteBtn}>Delete Row</button>
					</div>
					{
						error == null ? null :
							<h5 style={{ color: "red" }}>{error}</h5>
					}
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={onCreateBtn}>
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

export default TierInfoChangeBtn;