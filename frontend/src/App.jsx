// Location: frontend/src/App.jsx

import React, { useState, useEffect } from "react";
import {
  Shield,
  Upload,
  History,
  User,
  Users,
  LogOut,
  FileText,
  Briefcase,
} from "lucide-react";

import UploadView from "./components/UploadView";
import ResultsView from "./components/ResultsView";
import HistoryView from "./components/HistoryView";
import DoctorQueueView from "./components/DoctorQueueView";
import DoctorReviewView from "./components/DoctorReviewView";

export default function App() {
  // ==============================
  // Authentication State
  // ==============================

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("family"); // "family" or "doctor"

  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [activeView, setActiveView] = useState("upload");
  const [loading, setLoading] = useState(false);

  // ==============================
  // Patient / Family States
  // ==============================

  const [availableProfiles, setAvailableProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);

  // ==============================
  // Restore Session on Page Reload
  // ==============================

  useEffect(() => {
    const savedToken = localStorage.getItem("aimra_token");
    const savedRole = localStorage.getItem("aimra_role");
    const savedEmail = localStorage.getItem("aimra_email");
    const savedProfiles = localStorage.getItem("aimra_profiles");

    if (savedToken && savedRole) {
      setToken(savedToken);
      setUserRole(savedRole);
      setEmail(savedEmail || "");
      setIsAuthenticated(true);

      if (savedProfiles) {
        try {
          const parsed = JSON.parse(savedProfiles);

          setAvailableProfiles(parsed);

          // Select the first profile by default
          if (parsed.length > 0) {
            setSelectedProfileId(String(parsed[0].id));
          }
        } catch (error) {
          console.error("Failed to parse saved profiles:", error);
          setAvailableProfiles([]);
        }
      }

      setActiveView(
        savedRole === "doctor" ? "doctor-queue" : "upload"
      );
    }
  }, []);

  // ==============================
  // Login
  // ==============================

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(
        "http://localhost:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        // ------------------------------
        // Save Authentication Information
        // ------------------------------

        localStorage.setItem(
          "aimra_token",
          data.access_token
        );

        localStorage.setItem(
          "aimra_role",
          data.role
        );

        localStorage.setItem(
          "aimra_email",
          email
        );

        // ------------------------------
        // Patient Profiles
        // ------------------------------

        const profilesList =
          data.profiles || [
            {
              id: data.profile_id,
              name: "Amit Sharma (Self)",
            },
          ];

        localStorage.setItem(
          "aimra_profiles",
          JSON.stringify(profilesList)
        );

        setToken(data.access_token);
        setUserRole(data.role);
        setAvailableProfiles(profilesList);

        // Select first profile
        if (profilesList.length > 0) {
          setSelectedProfileId(
            String(profilesList[0].id)
          );
        }

        setIsAuthenticated(true);

        // ------------------------------
        // Redirect Based on Role
        // ------------------------------

        setActiveView(
          data.role === "doctor"
            ? "doctor-queue"
            : "upload"
        );
      } else {
        alert(
          data.detail ||
            "Authentication validation verification failed."
        );
      }
    } catch (err) {
      console.error(err);

      alert(
        "Cannot connect to FastAPI backend server. " +
          "Ensure python main.py is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Logout
  // ==============================

  const handleLogout = () => {
    localStorage.clear();

    setIsAuthenticated(false);
    setToken(null);
    setUserRole("family");

    setEmail("");
    setPassword("");

    setAvailableProfiles([]);
    setSelectedProfileId("");
    setSelectedReportId(null);

    setActiveView("upload");
  };

  // ============================================================
  // LOGIN VIEW
  // ============================================================

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <div className="bg-surface p-8 rounded-xl2 shadow-xl border border-slate-light/10 w-full max-w-md space-y-6">

          {/* Logo / Heading */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-paper rounded-full text-teal-600 mb-1">
              <Shield size={32} />
            </div>

            <h1 className="text-3xl font-display font-bold tracking-tight text-ink">
              CuraInsight AI
            </h1>

            <p className="text-xs text-slate">
              Sign In
            </p>
          </div>

          {/* Role Switching */}
          <div className="flex bg-paper p-1 rounded-xl border border-slate-light/30">

            {/* Patient / Family */}
            <button
              type="button"
              onClick={() => setUserRole("family")}
              className={`flex-1 py-2 text-xs font-body font-bold rounded-lg transition-all ${
                userRole === "family"
                  ? "bg-surface text-ink shadow-sm"
                  : "text-slate hover:text-ink"
              }`}
            >
              Patient Family
            </button>

            {/* Doctor */}
            <button
              type="button"
              onClick={() => setUserRole("doctor")}
              className={`flex-1 py-2 text-xs font-body font-bold rounded-lg transition-all ${
                userRole === "doctor"
                  ? "bg-surface text-ink shadow-sm"
                  : "text-slate hover:text-ink"
              }`}
            >
              Medical Doctor
            </button>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleLoginSubmit}
            className="space-y-4"
          >

            {/* Email */}
            <div>
              <label className="block text-[11px] font-body font-bold text-slate uppercase tracking-wider mb-2">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder={
                  userRole === "doctor"
                    ? "dr.rao@hospital.com"
                    : "name@patientportal.com"
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-light/50 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-body font-bold text-slate uppercase tracking-wider mb-2">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-light/50 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent hover:bg-accent-dark text-white rounded-xl font-body font-semibold transition-colors text-sm shadow-sm disabled:opacity-50"
            >
              {loading
                ? "Verifying Authorization Security..."
                : "Sign in to your account"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================
  // DOCTOR DASHBOARD
  // ============================================================

  if (userRole === "doctor") {
    return (
      <div className="min-h-screen bg-paper text-ink flex font-body">

        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-slate-light/20 flex flex-col justify-between p-4 sticky top-0 h-screen">

          <div className="space-y-6">

            {/* Logo */}
            <div className="flex items-center gap-3 px-2 py-3 border-b border-paper">

              <div className="p-2 bg-accent text-white rounded-xl shadow-md">
                <Briefcase size={20} />
              </div>

              <div>
                <h2 className="font-display font-bold text-lg text-ink tracking-tight">
                  CuraInsight AI
                </h2>

                <span className="text-[10px] bg-accent-light/20 text-accent-dark font-bold px-2 py-0.5 rounded-full">
                  Clinician View
                </span>
              </div>

            </div>

            {/* Navigation */}
            <nav className="space-y-1">

              <button
                type="button"
                onClick={() =>
                  setActiveView("doctor-queue")
                }
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeView === "doctor-queue"
                    ? "bg-paper text-accent-dark"
                    : "text-slate hover:bg-paper/50"
                }`}
              >
                <FileText size={18} />
                Review Task Board
              </button>

            </nav>
          </div>

          {/* Account */}
          <div className="border-t border-paper pt-4 space-y-2">

            <div className="flex items-center gap-3 px-2">
              <div className="truncate">
                <p className="text-xs font-semibold text-ink truncate">
                  {email}
                </p>

                <p className="text-[10px] text-slate">
                  Licensed System Signature
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut size={14} />
              Close Session
            </button>

          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto h-screen max-w-5xl">

          {/* Doctor Queue */}
          {activeView === "doctor-queue" && (
            <DoctorQueueView
              token={token}
              onSelectReport={(id) => {
                setSelectedReportId(id);
                setActiveView("doctor-review");
              }}
            />
          )}

          {/* Doctor Review */}
          {activeView === "doctor-review" && (
            <DoctorReviewView
              token={token}
              reportId={selectedReportId}
              onBack={() =>
                setActiveView("doctor-queue")
              }
            />
          )}

        </main>
      </div>
    );
  }

  // ============================================================
  // PATIENT / FAMILY DASHBOARD
  // ============================================================

  return (
    <div className="min-h-screen bg-paper text-ink flex font-body">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside className="w-64 bg-surface border-r border-slate-light/20 flex flex-col justify-between p-4 sticky top-0 h-screen">

        {/* Sidebar Top */}
        <div className="space-y-6">

          {/* Brand */}
          <div className="flex items-center gap-3 px-2 py-3 border-b border-paper">

            <div className="p-2 bg-accent text-white rounded-xl shadow-md">
              <Shield size={20} />
            </div>

            <div>
              <h2 className="font-display font-bold text-lg text-ink tracking-tight">
                CuraInsight AI
              </h2>

              <span className="text-[10px] bg-accent-light/20 text-accent-dark font-bold px-2 py-0.5 rounded-full">
                Patient Portal
              </span>
            </div>

          </div>

          {/* ==================================================
              Family History Directory
          ================================================== */}

          <div className="space-y-2">

            <div className="flex items-center gap-2 px-2">
              <Users size={15} className="text-accent" />

              <label className="text-[11px] font-body font-bold text-slate uppercase tracking-wider">
                Family History Directory
              </label>
            </div>

            <select
              value={selectedProfileId}
              onChange={(e) =>
                setSelectedProfileId(e.target.value)
              }
              className="w-full bg-paper border border-slate-light/30 rounded-xl px-3 py-2 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
            >

              {availableProfiles.length > 0 ? (
                availableProfiles.map((profile) => (
                  <option
                    key={profile.id}
                    value={profile.id}
                  >
                    {profile.name ||
                      profile.member_name ||
                      "Family Member"}
                  </option>
                ))
              ) : (
                <option value="">
                  No family profiles available
                </option>
              )}

            </select>
          </div>

          {/* ==================================================
              Navigation Matrix Tabs
          ================================================== */}

          <nav className="space-y-1">

            {/* Document Intake */}
            <button
              type="button"
              onClick={() =>
                setActiveView("upload")
              }
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                activeView === "upload"
                  ? "bg-paper text-accent-dark"
                  : "text-slate hover:bg-paper/50"
              }`}
            >
              <Upload size={18} />
              Document Intake
            </button>

            {/* Report History */}
            <button
              type="button"
              onClick={() =>
                setActiveView("history")
              }
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                activeView === "history"
                  ? "bg-paper text-accent-dark"
                  : "text-slate hover:bg-paper/50"
              }`}
            >
              <History size={18} />
              Report History
            </button>

          </nav>
        </div>

        {/* ==================================================
            Footer Account Actions
        ================================================== */}

        <div className="border-t border-paper pt-4 space-y-2">

          {/* Patient Email */}
          <div className="flex items-center gap-3 px-2">

            <div className="p-2 bg-paper rounded-lg">
              <User
                size={16}
                className="text-accent"
              />
            </div>

            <div className="truncate">
              <p className="text-xs font-semibold text-ink truncate">
                {email}
              </p>

              <p className="text-[10px] text-slate">
                Patient Session Token
              </p>
            </div>

          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut size={14} />
            Close Session
          </button>

        </div>
      </aside>

      {/* ======================================================
          PRIMARY CONTEXT CONTAINER
      ====================================================== */}

      <main className="flex-1 p-8 overflow-y-auto h-screen">

        {/* ==================================================
            DOCUMENT INTAKE
        ================================================== */}

        {activeView === "upload" && (
          <UploadView
            token={token}
            profileId={selectedProfileId}
            onUploadComplete={(id) => {
              setSelectedReportId(id);
              setActiveView("results");
            }}
          />
        )}

        {/* ==================================================
            REPORT RESULTS
        ================================================== */}

        {activeView === "results" && (
          <ResultsView
            token={token}
            reportId={selectedReportId}
          />
        )}

        {/* ==================================================
            REPORT HISTORY
        ================================================== */}

        {activeView === "history" && (
          <HistoryView
            token={token}
            profileFilter={selectedProfileId}
            onSelectReport={(id) => {
              setSelectedReportId(id);
              setActiveView("results");
            }}
          />
        )}

      </main>
    </div>
  );
}