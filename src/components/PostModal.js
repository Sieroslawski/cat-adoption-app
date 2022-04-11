import React, { Children } from 'react'
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from 'react';

// const [isOpen, setIsOpen] = useState({});

// const hideModal = (postId) => {
//     const oldIsOpen = isOpen
//     oldIsOpen[postId] = false
//     setIsOpen({ ...oldIsOpen })
//   };

function MyModal({children, title, hideModal, isOpen}) {
  return (
    <div>
          <Modal show={isOpen} onHide={hideModal}>
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {Children}
        </Modal.Body>
          <Modal.Footer>
            <button onClick={hideModal}>Close</button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default MyModal