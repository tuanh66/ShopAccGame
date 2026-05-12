import React from "react";

const ConfirmDeleteModal = ({
  show,
  showEffect,
  onClose,
  onConfirm,
  title = "Xác nhận xoá",
  message = "Bạn có chắc chắn muốn xóa mục này không?",
  itemName = "",
}) => {
  if (!show) return null;

  return (
    <>
      <div
        className={`modal fade ${showEffect ? "show" : ""}`}
        style={{
          display: show ? "block" : "none",
        }}
        onClick={onClose}
      >
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">{title}</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              {message} {itemName && <b>{itemName}</b>}
              {itemName && " này không? Tất cả dữ liệu có liên quan đến nó sẽ biến mất khỏi hệ thống!"}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-submit red"
                onClick={onConfirm}
              >
                Xoá
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={onClose}
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop fade ${showEffect ? "show" : ""}`}></div>
    </>
  );
};

export default ConfirmDeleteModal;
