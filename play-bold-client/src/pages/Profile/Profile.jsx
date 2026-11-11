import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useProfile } from "../../context/ProfileContext";

const TABS = [
  { key: "info", label: "Personal Info" },
  { key: "password", label: "Change Password" },
  { key: "addresses", label: "My Addresses" },
  { key: "orders", label: "My Orders" },
  { key: "settings", label: "Settings" },
];

function Profile() {
  const {
    profile,
    loading,
    authError,
    updateProfile,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    fetchOrders,
    forgotPassword,
  } = useProfile();

  const [activeTab, setActiveTab] = useState("info");
  const navigate = useNavigate();

  // =========================================================
  // AUTH GUARD
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || authError) {
      navigate("/login", { replace: true });
    }
  }, [navigate, authError]);

  // =========================================================
  // PERSONAL INFO
  // =========================================================

  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
  });

  const [infoSaving, setInfoSaving] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        dob: profile.dob ? profile.dob.slice(0, 10) : "",
        gender: profile.gender || "",
      });
    }
  }, [profile]);

  const handleInfoSave = async (e) => {
    e.preventDefault();

    setInfoSaving(true);
    setInfoMsg("");

    const res = await updateProfile(form);

    setInfoMsg(
      res.success
        ? "Profile updated successfully"
        : res.message
    );

    setInfoSaving(false);
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");

  const handlePasswordSave = async (e) => {
    e.preventDefault();

    setPwMsg("");

    if (
      pwForm.newPassword !== pwForm.confirmPassword
    ) {
      setPwMsg("New passwords do not match");
      return;
    }

    if (pwForm.newPassword.length < 6) {
      setPwMsg(
        "New password must be at least 6 characters"
      );
      return;
    }

    setPwSaving(true);

    const res = await changePassword(
      pwForm.currentPassword,
      pwForm.newPassword
    );

    setPwMsg(
      res.success
        ? "Password changed successfully"
        : res.message
    );

    if (res.success) {
      setPwForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }

    setPwSaving(false);
  };

  // =========================================================
  // FORGOT PASSWORD
  // =========================================================

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSaving, setForgotSaving] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      setForgotMsg("Please enter your email address");
      return;
    }

    setForgotSaving(true);
    setForgotMsg("");

    const res = await forgotPassword(forgotEmail);

    setForgotMsg(
      res.success
        ? "Password reset instructions have been sent."
        : res.message
    );

    setForgotSaving(false);
  };

  // =========================================================
  // ADDRESS
  // =========================================================

  const emptyAddress = {
    label: "Home",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  };

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [editingAddressId, setEditingAddressId] =
    useState(null);

  const [addressForm, setAddressForm] =
    useState(emptyAddress);

  const [addressSaving, setAddressSaving] =
    useState(false);

  const [addressMsg, setAddressMsg] = useState("");

  const openNewAddressForm = () => {
    setAddressForm({ ...emptyAddress });
    setEditingAddressId(null);
    setAddressMsg("");
    setShowAddressForm(true);
  };

  const openEditAddressForm = (addr) => {
    setAddressForm({
      label: addr.label || "Home",
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      addressLine1: addr.addressLine1 || "",
      addressLine2: addr.addressLine2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      country: addr.country || "India",
    });

    setEditingAddressId(addr._id);
    setAddressMsg("");
    setShowAddressForm(true);
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();

    setAddressSaving(true);
    setAddressMsg("");

    const res = editingAddressId
      ? await updateAddress(
          editingAddressId,
          addressForm
        )
      : await addAddress(addressForm);

    setAddressSaving(false);

    if (res.success) {
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm({ ...emptyAddress });
      setAddressMsg(
        res.message || "Address saved successfully"
      );
    } else {
      setAddressMsg(res.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    const res = await deleteAddress(id);

    if (!res.success) {
      alert(res.message);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    const res = await setDefaultAddress(id);

    if (!res.success) {
      alert(res.message);
    }
  };

  // =========================================================
  // ORDERS
  // =========================================================

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] =
    useState(false);

  const [ordersLoaded, setOrdersLoaded] =
    useState(false);

  const loadOrders = async () => {
    setOrdersLoading(true);

    const res = await fetchOrders();

    if (res.success) {
      setOrders(res.orders || []);
    } else {
      setOrders([]);
    }

    setOrdersLoaded(true);
    setOrdersLoading(false);
  };

  useEffect(() => {
    if (
      activeTab === "orders" &&
      !ordersLoaded
    ) {
      loadOrders();
    }
  }, [activeTab, ordersLoaded]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");

    window.location.reload();
  };

  // =========================================================
  // RENDER GUARD
  // =========================================================

  const token = localStorage.getItem("token");

  if (!token || authError) {
    return null;
  }

  if (loading || !profile) {
    return (
      <div>
        <Navbar />

        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-lg font-medium text-gray-500">
            Loading...
          </p>
        </div>

        <Footer />
      </div>
    );
  }

  // =========================================================
  // COMMON STYLES
  // =========================================================

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black";

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold shrink-0">
            {profile.name?.charAt(0)?.toUpperCase() ||
              "U"}
          </div>

          <div>
            <h1 className="text-xl font-bold">
              {profile.name || "User"}
            </h1>

            <p className="text-gray-500 text-sm">
              {profile.email}
            </p>
          </div>
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid md:grid-cols-4 gap-8">
          {/* =================================================
              SIDEBAR
          ================================================= */}

          <div className="md:col-span-1">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() =>
                    setActiveTab(tab.key)
                  }
                  className={`w-full text-left px-4 py-3 text-sm font-medium border-b border-gray-100 transition-colors ${
                    activeTab === tab.key
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="md:col-span-3">
            {/* =================================================
                PERSONAL INFO
            ================================================= */}

            {activeTab === "info" && (
              <div className="border border-gray-200 rounded-xl p-6">
                <h2 className="font-bold text-lg mb-5">
                  Personal Information
                </h2>

                <form
                  onSubmit={handleInfoSave}
                  className="space-y-4 max-w-md"
                >
                  {/* NAME */}

                  <div>
                    <label className={labelClass}>
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label className={labelClass}>
                      Email
                    </label>

                    <input
                      type="email"
                      value={profile.email || ""}
                      disabled
                      className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`}
                    />

                    <p className="text-xs text-gray-400 mt-1">
                      Email cannot be changed here.
                    </p>
                  </div>

                  {/* PHONE (optional) */}

                  <div>
                    <label className={labelClass}>
                      Mobile Number
                    </label>

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="Optional"
                    />
                  </div>

                  {/* DATE OF BIRTH (optional) */}

                  <div>
                    <label className={labelClass}>
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          dob: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>

                  {/* GENDER (optional) */}

                  <div>
                    <label className={labelClass}>
                      Gender
                    </label>

                    <select
                      value={form.gender}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          gender: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="">
                        Prefer not to say
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">
                        Female
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* MESSAGE */}

                  {infoMsg && (
                    <p
                      className={`text-sm ${
                        infoMsg
                          .toLowerCase()
                          .includes("success")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {infoMsg}
                    </p>
                  )}

                  {/* SAVE */}

                  <button
                    type="submit"
                    disabled={infoSaving}
                    className="bg-black text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {infoSaving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* =================================================
                CHANGE PASSWORD
            ================================================= */}

            {activeTab === "password" && (
              <div className="border border-gray-200 rounded-xl p-6 overflow-hidden">
                <h2 className="font-bold text-lg mb-5">
                  Change Password
                </h2>

                {profile.googleId &&
                !profile.password ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Your account uses Google Sign-In,
                      so there is no password to change
                      here.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setShowForgotPassword(true)
                      }
                      className="text-sm font-semibold underline"
                    >
                      Need to set a password?
                    </button>
                  </div>
                ) : (
                  <div className="relative overflow-hidden">
                    {/* Slide container: password form + forgot-password form
                        slide left/right instead of just popping in/out. */}
                    <div
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{
                        width: "200%",
                        transform: showForgotPassword
                          ? "translateX(-50%)"
                          : "translateX(0%)",
                      }}
                    >
                      {/* ─── PANEL 1: Change password ─── */}
                      <div className="w-1/2 pr-2">
                        <form
                          onSubmit={handlePasswordSave}
                          className="space-y-4 max-w-md"
                        >
                          {/* CURRENT */}

                          <div>
                            <label className={labelClass}>
                              Current Password
                            </label>

                            <input
                              type="password"
                              value={
                                pwForm.currentPassword
                              }
                              onChange={(e) =>
                                setPwForm({
                                  ...pwForm,
                                  currentPassword:
                                    e.target.value,
                                })
                              }
                              className={inputClass}
                              required
                            />
                          </div>

                          {/* NEW */}

                          <div>
                            <label className={labelClass}>
                              New Password
                            </label>

                            <input
                              type="password"
                              value={pwForm.newPassword}
                              onChange={(e) =>
                                setPwForm({
                                  ...pwForm,
                                  newPassword:
                                    e.target.value,
                                })
                              }
                              className={inputClass}
                              required
                              minLength={6}
                            />
                          </div>

                          {/* CONFIRM */}

                          <div>
                            <label className={labelClass}>
                              Confirm New Password
                            </label>

                            <input
                              type="password"
                              value={
                                pwForm.confirmPassword
                              }
                              onChange={(e) =>
                                setPwForm({
                                  ...pwForm,
                                  confirmPassword:
                                    e.target.value,
                                })
                              }
                              className={inputClass}
                              required
                              minLength={6}
                            />
                          </div>

                          {/* FORGOT */}

                          <button
                            type="button"
                            onClick={() => {
                              setShowForgotPassword(true);
                              setForgotEmail(
                                profile.email || ""
                              );
                              setForgotMsg("");
                            }}
                            className="text-sm font-medium underline text-gray-600 hover:text-black"
                          >
                            Forgot Password?
                          </button>

                          {/* MESSAGE */}

                          {pwMsg && (
                            <p
                              className={`text-sm ${
                                pwMsg
                                  .toLowerCase()
                                  .includes("success")
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {pwMsg}
                            </p>
                          )}

                          {/* BUTTON */}

                          <button
                            type="submit"
                            disabled={pwSaving}
                            className="bg-black text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                          >
                            {pwSaving
                              ? "Updating..."
                              : "Update Password"}
                          </button>
                        </form>
                      </div>

                      {/* ─── PANEL 2: Forgot password ─── */}
                      <div className="w-1/2 pl-2">
                        <div className="max-w-md">
                          <div className="mb-5">
                            <h3 className="font-semibold text-base">
                              Reset Your Password
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              Enter your registered email
                              address to receive password
                              reset instructions.
                            </p>
                          </div>

                          <form
                            onSubmit={
                              handleForgotPassword
                            }
                            className="space-y-4"
                          >
                            <div>
                              <label
                                className={labelClass}
                              >
                                Email Address
                              </label>

                              <input
                                type="email"
                                value={forgotEmail}
                                onChange={(e) =>
                                  setForgotEmail(
                                    e.target.value
                                  )
                                }
                                className={inputClass}
                                required
                              />
                            </div>

                            {forgotMsg && (
                              <p
                                className={`text-sm ${
                                  forgotMsg
                                    .toLowerCase()
                                    .includes("sent")
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {forgotMsg}
                              </p>
                            )}

                            <div className="flex gap-3">
                              <button
                                type="submit"
                                disabled={
                                  forgotSaving
                                }
                                className="bg-black text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                              >
                                {forgotSaving
                                  ? "Sending..."
                                  : "Send Reset Link"}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setShowForgotPassword(
                                    false
                                  );
                                  setForgotMsg("");
                                }}
                                className="border border-gray-300 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50"
                              >
                                Back
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =================================================
                ADDRESSES
            ================================================= */}

            {activeTab === "addresses" && (
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-lg">
                    My Addresses
                  </h2>

                  {!showAddressForm && (
                    <button
                      onClick={openNewAddressForm}
                      className="bg-black text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      + Add New Address
                    </button>
                  )}
                </div>

                {/* ADDRESS MESSAGE */}

                {addressMsg && !showAddressForm && (
                  <p className="text-sm text-green-600 mb-4">
                    {addressMsg}
                  </p>
                )}

                {/* ADDRESS FORM */}

                {showAddressForm && (
                  <form
                    onSubmit={handleAddressSave}
                    className="border border-gray-200 rounded-lg p-4 mb-6 space-y-3 max-w-lg"
                  >
                    {/* LABEL */}

                    <div>
                      <label className={labelClass}>
                        Address Type
                      </label>

                      <select
                        value={addressForm.label}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            label: e.target.value,
                          })
                        }
                        className={inputClass}
                      >
                        <option value="Home">
                          Home
                        </option>
                        <option value="Work">
                          Work
                        </option>
                        <option value="Other">
                          Other
                        </option>
                      </select>
                    </div>

                    {/* NAME + PHONE */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          className={labelClass}
                        >
                          Full Name
                        </label>

                        <input
                          type="text"
                          value={
                            addressForm.fullName
                          }
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              fullName:
                                e.target.value,
                            })
                          }
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <label
                          className={labelClass}
                        >
                          Phone
                        </label>

                        <input
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              phone:
                                e.target.value,
                            })
                          }
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    {/* ADDRESS 1 */}

                    <div>
                      <label className={labelClass}>
                        Address Line 1
                      </label>

                      <input
                        type="text"
                        value={
                          addressForm.addressLine1
                        }
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            addressLine1:
                              e.target.value,
                          })
                        }
                        className={inputClass}
                        required
                      />
                    </div>

                    {/* ADDRESS 2 */}

                    <div>
                      <label className={labelClass}>
                        Address Line 2
                      </label>

                      <input
                        type="text"
                        value={
                          addressForm.addressLine2
                        }
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            addressLine2:
                              e.target.value,
                          })
                        }
                        className={inputClass}
                        placeholder="Apartment, landmark, etc. (Optional)"
                      />
                    </div>

                    {/* CITY STATE PINCODE */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label
                          className={labelClass}
                        >
                          City
                        </label>

                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              city: e.target.value,
                            })
                          }
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <label
                          className={labelClass}
                        >
                          State
                        </label>

                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              state:
                                e.target.value,
                            })
                          }
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <label
                          className={labelClass}
                        >
                          Pincode
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={
                            addressForm.pincode
                          }
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              pincode:
                                e.target.value.replace(
                                  /\D/g,
                                  ""
                                ),
                            })
                          }
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    {/* BUTTONS */}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={addressSaving}
                        className="bg-black text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {addressSaving
                          ? "Saving..."
                          : editingAddressId
                          ? "Update Address"
                          : "Save Address"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(
                            false
                          );
                          setEditingAddressId(null);
                          setAddressMsg("");
                        }}
                        className="border border-gray-300 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* EMPTY STATE */}

                {profile.addresses?.length === 0 &&
                  !showAddressForm && (
                    <div className="py-10 text-center">
                      <p className="text-sm text-gray-500">
                        No saved addresses yet.
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Add an address for faster
                        checkout.
                      </p>
                    </div>
                  )}

                {/* ADDRESS LIST */}

                <div className="space-y-3">
                  {profile.addresses?.map(
                    (addr) => (
                      <div
                        key={addr._id}
                        className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-start justify-between gap-4"
                      >
                        <div className="text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              {addr.label}
                            </span>

                            {addr.isDefault && (
                              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                DEFAULT
                              </span>
                            )}
                          </div>

                          <p className="text-gray-700">
                            {addr.fullName} •{" "}
                            {addr.phone}
                          </p>

                          <p className="text-gray-500 mt-1">
                            {addr.addressLine1}

                            {addr.addressLine2
                              ? `, ${addr.addressLine2}`
                              : ""}

                            , {addr.city},{" "}
                            {addr.state} -{" "}
                            {addr.pincode}
                          </p>
                        </div>

                        <div className="flex flex-row sm:flex-col gap-3 text-xs shrink-0">
                          <button
                            onClick={() =>
                              openEditAddressForm(
                                addr
                              )
                            }
                            className="underline text-gray-600 hover:text-black"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteAddress(
                                addr._id
                              )
                            }
                            className="underline text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>

                          {!addr.isDefault && (
                            <button
                              onClick={() =>
                                handleSetDefaultAddress(
                                  addr._id
                                )
                              }
                              className="underline text-gray-600 hover:text-black"
                            >
                              Set Default
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                MY ORDERS
            ================================================= */}

            {activeTab === "orders" && (
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-lg">
                    My Orders
                  </h2>

                  {ordersLoaded && (
                    <button
                      onClick={loadOrders}
                      className="text-sm underline text-gray-600 hover:text-black"
                    >
                      Refresh
                    </button>
                  )}
                </div>

                {ordersLoading ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-gray-500">
                      Loading orders...
                    </p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center">
                    <h3 className="font-semibold text-base">
                      No orders yet
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Your PlayBold orders will appear
                      here after you place an order.
                    </p>

                    <button
                      onClick={() =>
                        navigate("/")
                      }
                      className="mt-5 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      // trackingStatus (fake, computed live) is more accurate
                      // than the raw orderStatus for "in progress" orders.
                      const displayStatus =
                        order.orderStatus === "Cancelled"
                          ? "Cancelled"
                          : order.trackingStatus ||
                            order.orderStatus ||
                            "Processing";

                      return (
                        <div
                          key={order._id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-sm">
                                Order #{order._id}
                              </p>

                              {order.createdAt && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )}
                                </p>
                              )}
                            </div>

                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                displayStatus === "Cancelled"
                                  ? "bg-red-50 text-red-600"
                                  : displayStatus === "Delivered"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {displayStatus}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                              {order.items?.length ||
                                0}{" "}
                              item(s)
                            </p>

                            {order.totalAmount !=
                              null && (
                              <p className="font-semibold">
                                ₹
                                {Number(
                                  order.totalAmount
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              navigate(
                                `/orders/${order._id}`
                              )
                            }
                            className="mt-4 text-sm font-semibold underline"
                          >
                            View Order
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* =================================================
                SETTINGS
            ================================================= */}

            {activeTab === "settings" && (
              <div className="border border-gray-200 rounded-xl p-6">
                <h2 className="font-bold text-lg mb-5">
                  Account Settings
                </h2>

                <div className="space-y-4">
                  {/* NOTIFICATIONS */}

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-sm">
                      Notifications
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Manage your order updates, offers
                      and promotional notifications.
                    </p>

                    <span className="inline-block mt-3 text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>

                  {/* PRIVACY */}

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-sm">
                      Privacy
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Manage your account privacy and
                      personal information.
                    </p>

                    <span className="inline-block mt-3 text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>

                  {/* DELETE ACCOUNT */}

                  <div className="border border-red-100 rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-red-600">
                      Delete Account
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Permanently delete your PlayBold
                      account and account data.
                    </p>

                    <button
                      type="button"
                      disabled
                      className="mt-3 text-xs font-medium border border-red-200 text-red-400 px-3 py-1.5 rounded-lg cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  </div>

                  {/* LOGOUT */}

                  <div className="pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;