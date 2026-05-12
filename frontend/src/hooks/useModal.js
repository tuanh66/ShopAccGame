import { useState, useEffect } from "react";

export const useModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEffect, setShowEffect] = useState(false);

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setShowEffect(false);
    setTimeout(() => {
      setShowModal(false);
    }, 300);
  };

  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        setShowEffect(true);
      }, 10);
    }
  }, [showModal]);

  return {
    showModal,
    showEffect,
    openModal,
    closeModal,
  };
};
