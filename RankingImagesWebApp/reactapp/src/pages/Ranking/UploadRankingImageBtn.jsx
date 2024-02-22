import { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const UploadRankingImageBtn = ({ callOnCreate }) =>
{
	const starterInput = useRef(null);
	const [names, setNames] = useState("");
	const [namesCount, setNamesCount] = useState("");
	const [images, setImages] = useState();
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

	useEffect(() =>
	{
		if(names != null)
		{
			var splitNames = names.split(',');

			if(images != null && images.length > 1 && names.length > 0)
			{
				var text = `${splitNames.length} Name`;
				text = splitNames.length > 1 ? text + "s" : text;
				setNamesCount(text);
			}

			else
			{
				setNamesCount("");
			}
		}

	}, [names, images]);

	function onCreateBtn()
	{
		if(names == null || names.length == 0)
		{
			setError("Please enter a Name");
			return;
		}

		if(images == null)
		{
			setError("Please select at least 1 Image");
			return;
		}

		// Check if all files total to under 28 MB (anything over seems to crash)
		var fileSizeSum = 0;
		for(let i = 0; i < images.length && fileSizeSum <= 28000000; i++)
		{
			fileSizeSum += images[i].size;
		}

		if(fileSizeSum >= 28000000)
		{
			setError("Please select fewer files (there is a max upload limit of 28MB)");
			return;
		}

		toggleModal();
		callOnCreate(names, images);
		setNames("");
		setImages(null);
		setError(null);
	}

	return (
		<div>
			<button onClick={toggleModal}>Upload Images</button>

			<Modal isOpen={showModal} toggle={toggleModal}>
				<ModalHeader toggle={toggleModal}>Upload Image</ModalHeader>
				<ModalBody>
					<div style={{ marginBottom: 15 }}>
						<label style={{ marginRight: 15 }} title="Seperate names with a ',' for multiple files">Name:</label>
						<input ref={starterInput} value={names} onChange={e => setNames(e.target.value)} placeholder="Type Name Here" />
						<span>{namesCount}</span>
					</div>
					<div>
						<label style={{ marginRight: 15 }}>Images:</label>
						<input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} />
					</div>
					{
						error == null ? null :
							<h5 style={{ color: "red" }}>{error}</h5>
					}
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={onCreateBtn}>
						Upload
					</Button>{' '}
					<Button color="secondary" onClick={toggleModal}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}

export default UploadRankingImageBtn;