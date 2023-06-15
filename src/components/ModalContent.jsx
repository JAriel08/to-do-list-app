import React, { useEffect } from 'react'

const ModalContent = ({modalContent, closeModal, type, tasks}) => {
    useEffect (() => {
        const timeout = setTimeout(() => {
            closeModal();
        }, 2500)
        return () => clearTimeout(timeout)
    }, [tasks])
    return (
        <div id={type}>
            <span>{modalContent}</span>
        </div>
    )
}

export default ModalContent
