import React, { useEffect, useState } from "react";
import { loginConfigService } from "../../service/loginConfigService";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";

const LoginConfiguration = () => {
  const [showSecretFacebook, setShowSecretFacebook] = useState(false);
  const [showSecretGoogle, setShowSecretGoogle] = useState(false);
  const [showSecretDiscord, setShowSecretDiscord] = useState(false);
  const [showSecretZalo, setShowSecretZalo] = useState(false);

  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    facebook: { appId: "", appSecret: "", redirectUri: "", active: false },
    google: { appId: "", appSecret: "", redirectUri: "", active: false },
    discord: { appId: "", appSecret: "", redirectUri: "", active: false },
    zalo: { appId: "", appSecret: "", redirectUri: "", active: false },
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await loginConfigService.getLoginConfig();
      const data = res?.data || res;
      if (data) {
        setConfig({
          facebook: {
            appId: data.facebook?.appId || "",
            appSecret: data.facebook?.appSecret || "",
            redirectUri: data.facebook?.redirectUri || "",
            active: data.facebook?.active || false,
          },
          google: {
            appId: data.google?.appId || "",
            appSecret: data.google?.appSecret || "",
            redirectUri: data.google?.redirectUri || "",
            active: data.google?.active || false,
          },
          discord: {
            appId: data.discord?.appId || "",
            appSecret: data.discord?.appSecret || "",
            redirectUri: data.discord?.redirectUri || "",
            active: data.discord?.active || false,
          },
          zalo: {
            appId: data.zalo?.appId || "",
            appSecret: data.zalo?.appSecret || "",
            redirectUri: data.zalo?.redirectUri || "",
            active: data.zalo?.active || false,
          },
        });
      }
    } catch (error) {
      console.error("Lỗi fetchConfig:", error);
      toast.error("Không thể tải cấu hình");
    }
  };

  const handleChange = (provider, field, value) => {
    setConfig((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginConfigService.updateLoginConfig(config);
      toast.success("Cập nhật cấu hình thành công");
    } catch (error) {
      console.error("Lỗi handleSubmit:", error);
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header-admin">
        <div className="page-title-admin">
          <h4>CẤU HÌNH ĐĂNG NHẬP</h4>
          <span>Quản lý cấu hình phương thức đăng nhập</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body p-20">
          <form className="form-login-configuration" onSubmit={handleSubmit}>
            {/* Facebook */}
            <div className="card mb-25">
              <div className="card-header">
                <h5 className="mb-0">Facebook Login</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="facebookAppId">
                        App ID<span>*</span>
                      </label>
                      <input
                        type="text"
                        id="facebookAppId"
                        value={config.facebook.appId}
                        onChange={(e) =>
                          handleChange("facebook", "appId", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <div className="input-group form-group">
                      <label htmlFor="facebookAppSecret">
                        App Secret<span>*</span>
                      </label>
                      <div className="w-100 relative">
                        <input
                          type={showSecretFacebook ? "text" : "password"}
                          id="facebookAppSecret"
                          value={config.facebook.appSecret}
                          onChange={(e) =>
                            handleChange(
                              "facebook",
                              "appSecret",
                              e.target.value,
                            )
                          }
                        />
                        {showSecretFacebook ? (
                          <FaRegEye
                            className="eye-icon"
                            onClick={() => setShowSecretFacebook(false)}
                          />
                        ) : (
                          <FaRegEyeSlash
                            className="eye-icon"
                            onClick={() => setShowSecretFacebook(true)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label htmlFor="facebookRedirectUri">
                        Redirect URL<span>*</span>
                      </label>
                      <input
                        type="text"
                        id="facebookRedirectUri"
                        value={config.facebook.redirectUri}
                        onChange={(e) =>
                          handleChange(
                            "facebook",
                            "redirectUri",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group d-flex align-items-center mb-0">
                      <input
                        type="checkbox"
                        id="facebookActive"
                        className="form-check-input"
                        checked={config.facebook.active}
                        onChange={(e) =>
                          handleChange("facebook", "active", e.target.checked)
                        }
                      />
                      <label htmlFor="facebookActive" className="mb-0 ms-2">
                        Kích hoạt
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google */}
            <div className="card mb-25">
              <div className="card-header">
                <h5 className="mb-0">Google Login</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="googleAppId">
                        App ID<span>*</span>
                      </label>
                      <input
                        type="text"
                        id="googleAppId"
                        value={config.google.appId}
                        onChange={(e) =>
                          handleChange("google", "appId", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <div className="input-group form-group">
                      <label htmlFor="googleAppSecret">
                        App Secret<span>*</span>
                      </label>
                      <div className="relative w-100">
                        <input
                          type={showSecretGoogle ? "text" : "password"}
                          id="googleAppSecret"
                          value={config.google.appSecret}
                          onChange={(e) =>
                            handleChange("google", "appSecret", e.target.value)
                          }
                        />
                        {showSecretGoogle ? (
                          <FaRegEye
                            className="eye-icon"
                            onClick={() => setShowSecretGoogle(false)}
                          />
                        ) : (
                          <FaRegEyeSlash
                            className="eye-icon"
                            onClick={() => setShowSecretGoogle(true)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label htmlFor="googleRedirectUri">
                        Redirect URL<span>*</span>
                      </label>
                      <input
                        type="text"
                        id="googleRedirectUri"
                        value={config.google.redirectUri}
                        onChange={(e) =>
                          handleChange("google", "redirectUri", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group d-flex align-items-center mb-0">
                      <input
                        type="checkbox"
                        id="googleActive"
                        className="form-check-input"
                        checked={config.google.active}
                        onChange={(e) =>
                          handleChange("google", "active", e.target.checked)
                        }
                      />
                      <label htmlFor="googleActive" className="mb-0 ms-2">
                        Kích hoạt
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Discord */}
            <div className="card mb-25">
              <div className="card-header">
                <h5 className="mb-0">Discord Login</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="discordAppId">
                        App ID<span>*</span>
                      </label>
                      <input
                        type="text"
                        id="discordAppId"
                        value={config.discord.appId}
                        onChange={(e) =>
                          handleChange("discord", "appId", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <div className="input-group form-group">
                      <label htmlFor="discordAppSecret">
                        App Secret<span>*</span>
                      </label>
                      <div className="relative w-100">
                        <input
                          type={showSecretDiscord ? "text" : "password"}
                          id="discordAppSecret"
                          value={config.discord.appSecret}
                          onChange={(e) =>
                            handleChange("discord", "appSecret", e.target.value)
                          }
                        />
                        {showSecretDiscord ? (
                          <FaRegEye
                            className="eye-icon"
                            onClick={() => setShowSecretDiscord(false)}
                          />
                        ) : (
                          <FaRegEyeSlash
                            className="eye-icon"
                            onClick={() => setShowSecretDiscord(true)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label htmlFor="discordRedirectUri">
                        Redirect URL<span>*</span>
                      </label>
                      <input
                        type="text"
                        id="discordRedirectUri"
                        value={config.discord.redirectUri}
                        onChange={(e) =>
                          handleChange("discord", "redirectUri", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group d-flex align-items-center mb-0">
                      <input
                        type="checkbox"
                        id="discordActive"
                        className="form-check-input"
                        checked={config.discord.active}
                        onChange={(e) =>
                          handleChange("discord", "active", e.target.checked)
                        }
                      />
                      <label htmlFor="discordActive" className="mb-0 ms-2">
                        Kích hoạt
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Zalo */}
            <div className="card mb-25">
              <div className="card-header">
                <h5 className="mb-0">Zalo Login</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="zaloAppId">
                        App ID<span>*</span>
                      </label>
                      <input
                        type="text"
                        id="zaloAppId"
                        value={config.zalo.appId}
                        onChange={(e) =>
                          handleChange("zalo", "appId", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <div className="input-group form-group">
                      <label htmlFor="zaloAppSecret">
                        App Secret<span>*</span>
                      </label>
                      <div className="relative w-100">
                        <input
                          type={showSecretZalo ? "text" : "password"}
                          id="zaloAppSecret"
                          value={config.zalo.appSecret}
                          onChange={(e) =>
                            handleChange("zalo", "appSecret", e.target.value)
                          }
                        />
                        {showSecretZalo ? (
                          <FaRegEye
                            className="eye-icon"
                            onClick={() => setShowSecretZalo(false)}
                          />
                        ) : (
                          <FaRegEyeSlash
                            className="eye-icon"
                            onClick={() => setShowSecretZalo(true)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label htmlFor="zaloRedirectUri">
                        Redirect URL<span>*</span>
                      </label>
                      <input
                        type="text"
                        id="zaloRedirectUri"
                        value={config.zalo.redirectUri}
                        onChange={(e) =>
                          handleChange("zalo", "redirectUri", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group d-flex align-items-center mb-0">
                      <input
                        type="checkbox"
                        id="zaloActive"
                        className="form-check-input"
                        checked={config.zalo.active}
                        onChange={(e) =>
                          handleChange("zalo", "active", e.target.checked)
                        }
                      />
                      <label htmlFor="zaloActive" className="mb-0 ms-2">
                        Kích hoạt
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12 mt-3">
              <button
                className="btn btn-submit primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Cập nhật cấu hình"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginConfiguration;
