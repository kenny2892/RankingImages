import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ItemDeleteConfirmation = ({ item, showModal, setShowModal, callOnConfirm }) =>
{
	const toggleModal = () => setShowModal(!showModal);

	function onConfirmBtn()
	{
		toggleModal();
		callOnConfirm();
	}

	return (
		item != null ?
			<div>
				<Modal isOpen={showModal} toggle={toggleModal}>
					<ModalHeader toggle={toggleModal}>Delete Image</ModalHeader>
					<ModalBody>
						<div className="item-deletion-preview">
							<h4>{item.name}</h4>
							<img className="item-deletion-preview-img" src={`https://localhost:7268${item.imageRelativePath}`} />
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={onConfirmBtn}>
							Delete
						</Button>{' '}
						<Button color="secondary" onClick={toggleModal}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
			: null
	);
}

export default ItemDeleteConfirmation;