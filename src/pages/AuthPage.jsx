
import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  CloudSun,
  Mail,
  LockKeyhole,
  UserRound,
  Eye,
  EyeOff,
  LoaderCircle,
  ArrowLeft,
} from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const { mode } = useParams();
  const navigate = useNavigate();

  const {
    user,
    loading,
    login,
    register,
    googleLogin,
  } = useAuth();

  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (mode !== "login" && mode !== "signup") {
    return <Navigate to="/auth/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoaderCircle
          className="animate-spin text-sky-300"
          size={32}
        />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      if (isSignup) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSuccess(response) {
    setError("");
    setSubmitting(true);

    try {
      if (!response.credential) {
        throw new Error(
          "Google did not return a credential."
        );
      }

      await googleLogin(response.credential);

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.message || "Google authentication failed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleGoogleError() {
    setError(
      "Google Sign-In failed. Please try again."
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-white">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to weather
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300">
              <CloudSun size={30} />
            </div>

            <h1 className="text-2xl font-bold">
              ShreySky
              <span className="text-sky-300">
                AI
              </span>
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {isSignup
                ? "Create your weather companion account"
                : "Welcome back to your weather companion"}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-1">
            <Link
              to="/auth/login"
              className={`rounded-lg py-2 text-center text-sm transition ${
                !isSignup
                  ? "bg-sky-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Login
            </Link>

            <Link
              to="/auth/signup"
              className={`rounded-lg py-2 text-center text-sm transition ${
                isSignup
                  ? "bg-sky-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign up
            </Link>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {isSignup && (
              <div>
                <label
                  htmlFor="auth-name"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={60}
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="mb-2 block text-sm text-slate-300"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="mb-2 block text-sm text-slate-300"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="auth-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete={
                    isSignup
                      ? "new-password"
                      : "current-password"
                  }
                  required
                  minLength={
                    isSignup ? 8 : undefined
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-sky-400"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 font-semibold transition hover:bg-sky-400 disabled:opacity-50"
            >
              {submitting && (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              )}

              {isSignup
                ? "Create account"
                : "Sign in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-slate-500">
              OR
            </span>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google Authentication */}
          <div
            className={`flex justify-center ${
              submitting
                ? "pointer-events-none opacity-50"
                : ""
            }`}
            aria-busy={submitting}
          >
            <GoogleLogin
              theme="filled_black"
              shape="pill"
              size="large"
              width="320"
              text={
                isSignup
                  ? "signup_with"
                  : "signin_with"
              }
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isSignup
              ? "Already have an account?"
              : "New to ShreySkyAI?"}{" "}
            <Link
              to={
                isSignup
                  ? "/auth/login"
                  : "/auth/signup"
              }
              className="font-semibold text-sky-300 hover:text-sky-200"
            >
              {isSignup
                ? "Sign in"
                : "Create account"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
