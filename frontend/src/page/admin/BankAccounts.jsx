import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { paymentService } from "../../service/paymentService";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Ghi đè hệ thống size mặc định của Quill để nó dùng px trực tiếp (inline css)
const Size = Quill.import("attributors/style/size");
Size.whitelist = [
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "32px",
  "48px",
];
Quill.register(Size, true);

const BankAccounts = () => {
  const [bankName, setBankName] = useState("0");
  const [bankNumber, setBankNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [bankSyntax, setBankSyntax] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [sepayToken, setSepayToken] = useState("");
  const [bankActive, setBankActive] = useState(false);
  const [bankAutoConfirm, setBankAutoConfirm] = useState(false);

  useEffect(() => {
    const getBankConfig = async () => {
      try {
        const res = await paymentService.readBankAccounts();
        if (res.data) {
          const config = res.data;
          setBankName(config.bank_name || "0");
          setBankNumber(config.account_number || "");
          setBankAccountName(config.bank_account_name || "");
          setBankBranch(config.bank_branch || "");
          setBankSyntax(config.bank_syntax || "");
          setNoteContent(config.bank_note || "");
          setSepayToken(config.sepay_access_token || "");
          setBankActive(config.bank_active || false);
          setBankAutoConfirm(config.bank_auto_confirm || false);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu cấu hình ngân hàng", error);
      }
    };
    getBankConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        bank_name: bankName,
        account_number: bankNumber,
        bank_account_name: bankAccountName,
        bank_branch: bankBranch,
        bank_syntax: bankSyntax,
        bank_note: noteContent,
        sepay_access_token: sepayToken,
        bank_active: bankActive,
        bank_auto_confirm: bankAutoConfirm,
      };
      const res = await paymentService.createBankAccount(payload);
      toast.success(res.message || "Cập nhật cấu hình thành công!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại!");
      console.error(error);
    }
  };

  // Cấu hình các công cụ soạn thảo cho ReactQuill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [
        {
          size: [
            "10px",
            "12px",
            "14px",
            "16px",
            "18px",
            "20px",
            "24px",
            "32px",
            "48px",
          ],
        },
      ],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>Quản lý tài khoản ngân hàng</h4>
          <span>Xem và quản lý tài khoản ngân hàng</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form className="form-bank-accounts" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-4 col-sm-4 col-12 form-group">
                <label htmlFor="bank-name">
                  Tên ngân hàng
                  <span>*</span>
                </label>
                <select name="bank-name" id="bank-name" value={bankName} onChange={(e) => setBankName(e.target.value)}>
                  <option value="0">-- Chọn ngân hàng --</option>
                  <option value="VietinBank">VietinBank</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="MBBank">MBBank</option>
                  <option value="ACB">ACB</option>
                  <option value="VPBank">VPBank</option>
                  <option value="TPBank">TPBank</option>
                  <option value="MSB">MSB</option>
                  <option value="NamABank">NamABank</option>
                  <option value="LienVietPostBank">LienVietPostBank</option>
                  <option value="VietCapitalBank">VietCapitalBank</option>
                  <option value="BIDV">BIDV</option>
                  <option value="Sacombank">Sacombank</option>
                  <option value="VIB">VIB</option>
                  <option value="HDBank">HDBank</option>
                  <option value="SeABank">SeABank</option>
                  <option value="GPBank">GPBank</option>
                  <option value="PVcomBank">PVcomBank</option>
                  <option value="PVcomBankPay">PVcomBankPay</option>
                  <option value="NCB">NCB</option>
                  <option value="ShinhanBank">ShinhanBank</option>
                  <option value="SCB">SCB</option>
                  <option value="PGBank">PGBank</option>
                  <option value="Agribank">Agribank</option>
                  <option value="Techcombank">Techcombank</option>
                  <option value="SaigonBank">SaigonBank</option>
                  <option value="DongABank">DongABank</option>
                  <option value="BacABank">BacABank</option>
                  <option value="StandardChartered">StandardChartered</option>
                  <option value="Oceanbank">Oceanbank</option>
                  <option value="VRB">VRB</option>
                  <option value="ABBANK">ABBANK</option>
                  <option value="VietABank">VietABank</option>
                  <option value="Eximbank">Eximbank</option>
                  <option value="VietBank">VietBank</option>
                  <option value="IndovinaBank">IndovinaBank</option>
                  <option value="BaoVietBank">BaoVietBank</option>
                  <option value="PublicBank">PublicBank</option>
                  <option value="SHB">SHB</option>
                  <option value="CBBank">CBBank</option>
                  <option value="OCB">OCB</option>
                  <option value="KienLongBank">KienLongBank</option>
                  <option value="CIMB">CIMB</option>
                  <option value="HSBC">HSBC</option>
                  <option value="DBSBank">DBSBank</option>
                  <option value="Nonghyup">Nonghyup</option>
                  <option value="HongLeong">HongLeong</option>
                  <option value="IBK Bank">IBK Bank</option>
                  <option value="Woori">Woori</option>
                  <option value="UnitedOverseas">UnitedOverseas</option>
                  <option value="KookminHN">KookminHN</option>
                  <option value="KookminHCM">KookminHCM</option>
                  <option value="COOPBANK">COOPBANK</option>
                </select>
              </div>
              <div className="col-lg-4 col-sm-4 col-12 form-group">
                <label htmlFor="bank-number">
                  Số tài khoản<span>*</span>
                </label>
                <input
                  type="text"
                  name="bank-number"
                  id="bank-number"
                  placeholder="Nhập số tài khoản"
                  value={bankNumber}
                  onChange={(e) => setBankNumber(e.target.value)}
                />
              </div>
              <div className="col-lg-4 col-sm-4 col-12 form-group">
                <label htmlFor="bank-account-name">
                  Tên tài khoản<span>*</span>
                </label>
                <input
                  type="text"
                  name="bank-account-name"
                  id="bank-account-name"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  placeholder="Nhập tên tài khoản"
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="bank-branch">
                  Chi nhánh<span>*</span>
                </label>
                <input
                  type="text"
                  name="bank-branch"
                  id="bank-branch"
                  placeholder="Nhập chi nhánh ngân hàng"
                  value={bankBranch}
                  onChange={(e) => setBankBranch(e.target.value)}
                />
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group">
                <label htmlFor="bank-syntax">
                  Cú pháp nạp tiền<span>*</span>
                </label>
                <input
                  type="text"
                  name="bank-syntax"
                  value={bankSyntax}
                  onChange={(e) => setBankSyntax(e.target.value)}
                  id="bank-syntax"
                  placeholder="Nhập tên cú pháp nạp tiền (ví dụ: naptien)"
                />
                <small className="text-link fz-13">
                  Cú pháp nạp tiền sẽ được dùng để tự động xác định người dùng
                  trong nội dung chuyển khoản. Ví dụ: naptien123 với 123 là ID
                  người dùng.
                </small>
              </div>
              <div className="col-lg-12 form-group">
                <label htmlFor="bank-note">
                  Ghi chú<span>*</span>
                </label>
                <ReactQuill
                  theme="snow"
                  name="bank-note"
                  id="bank-note"
                  value={noteContent}
                  onChange={setNoteContent}
                  modules={modules}
                  className="w-100 react-quill-editor"
                />
              </div>
              <div className="col-lg-12 form-group">
                <label htmlFor="sepay-access-token">
                  SePay Access Token<span>*</span>
                </label>
                <input
                  type="text"
                  name="sepay-access-token"
                  id="sepay-access-token"
                  placeholder="Nhập SePay Access Token"
                  value={sepayToken}
                  onChange={(e) => setSepayToken(e.target.value)}
                />
                <small className="text-link fz-13">
                  Token này được cung cấp bởi SePay.vn để kết nối API tự động
                  cộng tiền. Cần nhập nếu muốn sử dụng tính năng tự động cộng
                  tiền.
                </small>
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group d-flex align-items-center">
                <input
                  type="checkbox"
                  name="bank-active"
                  checked={bankActive}
                  onChange={(e) => setBankActive(e.target.checked)}
                  id="bank-active"
                  className="form-check-input"
                />
                <label htmlFor="bank-active" className="mb-0">
                  Kích hoạt tài khoản
                </label>
              </div>
              <div className="col-lg-6 col-sm-6 col-12 form-group d-flex align-items-center">
                <input
                  type="checkbox"
                  name="bank-auto-confirm"
                  id="bank-auto-confirm"
                  className="form-check-input"
                  checked={bankAutoConfirm}
                  onChange={(e) => setBankAutoConfirm(e.target.checked)}
                />
                <label htmlFor="bank-auto-confirm" className="mb-0">
                  Tự động xác nhận và cộng tiền
                </label>
              </div>
              <div className="col-lg-12">
                <button className="btn btn-submit primary me-2" type="submit">
                  Cập nhật
                </button>
                <Link
                  to="/admin/bank-accounts/history"
                  className="btn btn-cancel"
                >
                  Lịch sử Banking
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BankAccounts;
