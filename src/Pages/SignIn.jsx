import { useState } from "react";
import { FaEye, FaEyeSlash, FaShieldAlt, FaAward, FaStore, FaBoxOpen, FaTags } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import logo from "../Pages/utils/logo2.png";

const SignIn = () => {
  const { setUser } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();
  const baseURL = "https://kwirkmart.expertech.dev";

  const handleTogglePassword = () => setPasswordVisible((v) => !v);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const res = await axios.post(`${baseURL}/api/auth/jwt/create/`, values);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      setUser(data.user);
      setRedirecting(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Login failed");
      setEmail("");
      setPassword("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  const responsiveStyles = `
    .km-page {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
    }
    @media (max-width: 900px) {
      .km-page {
        grid-template-columns: 1fr !important;
      }
      .km-left-panel {
        display: none !important;
      }
      .km-right-panel {
        padding: 1.5rem !important;
        min-height: 100vh;
      }
      .km-form-card {
        padding: 2rem 1.75rem 2.2rem !important;
      }
    }
    @media (max-width: 480px) {
      .km-right-panel {
        padding: 1rem !important;
        align-items: flex-start !important;
        padding-top: 2rem !important;
      }
      .km-form-card {
        padding: 1.5rem 1.2rem 1.8rem !important;
        border-radius: 14px !important;
      }
      .km-logo {
        height: 80px !important;
      }
      .km-form-title {
        font-size: 1.55rem !important;
      }
    }
  `;

  if (redirecting) {
    return (
      <div style={styles.redirectScreen}>
        <ImSpinner2 style={styles.redirectSpinner} className="animate-spin" />
        <p style={styles.redirectText}>Login Successful. Redirecting to Dashboard…</p>
      </div>
    );
  }

  return (
    <>
    <style>{responsiveStyles}</style>
    <div style={styles.page} className="km-page">
      {/* ── LEFT PANEL ── */}
      <div style={styles.leftPanel} className="km-left-panel">
        <div style={styles.circle1} />
        <div style={styles.circle2} />

        <div style={styles.leftInner}>
          {/* Headline */}
          <h1 style={styles.headline}>
            Everything&nbsp;You&nbsp;Need,<br />All&nbsp;in&nbsp;One&nbsp;Place.
          </h1>
          <p style={styles.subline}>
            Your one-stop shop for beverages, snacks, household essentials,
            personal care, and thousands of products — delivered fast and reliably.
          </p>

          {/* Feature pills */}
          <div style={styles.pillsWrap}>
            {[
              { icon: <FaStore />, label: "All Categories" },
              { icon: <FaBoxOpen />, label: "Wide Selection" },
              { icon: <FaTags />, label: "Best Prices" },
            ].map(({ icon, label }) => (
              <div key={label} style={styles.pill}>
                <span style={styles.pillIcon}>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

        
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={styles.rightPanel} className="km-right-panel">
        <div style={styles.formCard} className="km-form-card">
          {/* Top accent line */}
          <div style={styles.accentLine} />

          {/* Logo inside form card */}
          <div style={styles.logoWrap}>
            <img src={logo} alt="KwikMart" style={styles.logo} className="km-logo" />
          </div>

          <p style={styles.welcomeTag}>Welcome back</p>
          <h2 style={styles.formTitle} className="km-form-title">Admin Portal</h2>
          <p style={styles.formSubtitle}>
            Sign in to manage your store, orders, and inventory.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="admin@kwikmart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
                required
              />
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrap}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...styles.input, paddingRight: "3rem" }}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) =>
                    Object.assign(e.target.style, { ...styles.input, paddingRight: "3rem" })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  style={styles.eyeBtn}
                >
                  {passwordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              style={mutation.isPending ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn}
              onMouseEnter={(e) =>
                !mutation.isPending && Object.assign(e.target.style, styles.submitBtnHover)
              }
              onMouseLeave={(e) => Object.assign(e.target.style, styles.submitBtn)}
            >
              {mutation.isPending ? (
                <>
                  <ImSpinner2
                    size={18}
                    className="animate-spin"
                    style={{ marginRight: "0.5rem" }}
                  />
                  Signing In…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p style={styles.secureNote}>
            <FaShieldAlt style={{ marginRight: "0.4rem", color: YELLOW }} />
            Secured &amp; encrypted connection
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

/* ─────────────────────── Palette ─────────────────────── */
const BLACK  = "#111111";
const YELLOW = "#F5C100";
const OFF_WHITE = "#FFFDF5";

const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    minHeight: "100vh",
    fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
  },

  /* ── Left panel ── */
  leftPanel: {
    background: `linear-gradient(145deg, ${BLACK} 0%, #1a1a1a 55%, #262626 100%)`,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem",
  },
  circle1: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: `radial-gradient(circle, rgba(245,193,0,0.15) 0%, transparent 65%)`,
    top: "-150px",
    right: "-160px",
  },
  circle2: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: `radial-gradient(circle, rgba(245,193,0,0.10) 0%, transparent 65%)`,
    bottom: "-100px",
    left: "-100px",
  },
  leftInner: {
    position: "relative",
    zIndex: 1,
    maxWidth: "420px",
    width: "100%",
  },
  headline: {
    fontSize: "2.7rem",
    fontWeight: "800",
    lineHeight: "1.2",
    color: "#ffffff",
    marginBottom: "1.2rem",
    letterSpacing: "-0.5px",
  },
  subline: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.65)",
    lineHeight: "1.8",
    marginBottom: "2.5rem",
  },
  pillsWrap: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.85rem",
    marginBottom: "3rem",
  },
  pill: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    background: "rgba(255,255,255,0.05)",
    border: `1px solid rgba(245,193,0,0.35)`,
    borderRadius: "16px",
    padding: "1rem 0.75rem",
    color: "#fff",
    fontSize: "0.82rem",
    fontWeight: "500",
    textAlign: "center",
  },
  pillIcon: {
    color: YELLOW,
    fontSize: "1.4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  footerNote: {
    color: "rgba(255,255,255,0.25)",
    fontSize: "0.78rem",
  },

  /* ── Right panel ── */
  rightPanel: {
    background: OFF_WHITE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  formCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "2.5rem 2.8rem 2.8rem",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 24px 64px rgba(0,0,0,0.10)",
    position: "relative",
    overflow: "hidden",
  },
  accentLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${BLACK}, ${YELLOW})`,
    borderRadius: "20px 20px 0 0",
  },

  /* Logo on form side */
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.6rem",
    marginTop: "0.4rem",
  },
  logo: {
    height: "110px",
    objectFit: "contain",
  },

  welcomeTag: {
    fontSize: "0.78rem",
    fontWeight: "700",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    color: YELLOW,
    marginBottom: "0.4rem",
    textAlign: "center",
  },
  formTitle: {
    fontSize: "1.85rem",
    fontWeight: "800",
    color: BLACK,
    marginBottom: "0.4rem",
    letterSpacing: "-0.3px",
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: "0.88rem",
    color: "#6b7280",
    marginBottom: "1.8rem",
    lineHeight: "1.5",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.3rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#374151",
    letterSpacing: "0.3px",
  },
  input: {
    width: "100%",
    padding: "0.85rem 1rem",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "0.95rem",
    color: "#1f2937",
    background: "#fafafa",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  inputFocus: {
    border: `1.5px solid ${YELLOW}`,
    boxShadow: `0 0 0 3px rgba(245,193,0,0.18)`,
    background: "#ffffff",
    outline: "none",
  },
  passwordWrap: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    top: "50%",
    right: "1rem",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  submitBtn: {
    width: "100%",
    padding: "0.95rem",
    background: BLACK,
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s, transform 0.15s",
    marginTop: "0.4rem",
  },
  submitBtnHover: {
    background: YELLOW,
    color: BLACK,
    transform: "translateY(-1px)",
  },
  secureNote: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "1.5rem",
    fontSize: "0.78rem",
    color: "#9ca3af",
  },

  /* ── Redirect screen ── */
  redirectScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: BLACK,
    gap: "1rem",
  },
  redirectSpinner: {
    fontSize: "2.5rem",
    color: YELLOW,
  },
  redirectText: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
    fontSize: "1rem",
  },
};

export default SignIn;
