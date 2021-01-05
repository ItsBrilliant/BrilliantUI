import './react-modal.css';
import Modal from '@trendmicro/react-modal';


export default function ({ size = 'sm', closeModal, ...props }) {
    return (
        <Modal {...props} size={size} onClose={closeModal}>
            <Modal.Header>
                <Modal.Title>
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body padding className="modal_body">
                {props.modalBody}
            </Modal.Body>
            <Modal.Footer>
                <button
                    onClick={props.onOk}
                >
                    Ok
            </button>
                <button
                    onClick={closeModal}
                >
                    Cancel
            </button>
            </Modal.Footer>
        </Modal>
    );
}