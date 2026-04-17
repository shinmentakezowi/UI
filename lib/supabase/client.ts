type AuthUser = {
  id: string;
  email: string;
  user_metadata: { display_name?: string };
};

type AuthChangeEvent = "SIGNED_IN" | "SIGNED_OUT" | "USER_UPDATED" | "PASSWORD_RECOVERY" | "TOKEN_REFRESHED";
type Session = { user: AuthUser } | null;
type AuthError = { message: string; status?: number } | null;

const FAKE_USER: AuthUser = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "demo@example.com",
  user_metadata: { display_name: "Demo User" },
};

const STORAGE_KEY = "hapuppy-ui:signed-in";

function isSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

function setSignedIn(v: boolean) {
  if (typeof window === "undefined") return;
  if (v) window.localStorage.setItem(STORAGE_KEY, "1");
  else window.localStorage.removeItem(STORAGE_KEY);
}

export function createClient() {
  return {
    auth: {
      async getUser(): Promise<{ data: { user: AuthUser | null }; error: AuthError }> {
        return { data: { user: isSignedIn() ? FAKE_USER : null }, error: null };
      },
      async getSession(): Promise<{ data: { session: Session }; error: AuthError }> {
        return { data: { session: isSignedIn() ? { user: FAKE_USER } : null }, error: null };
      },
      async signInWithPassword(
        _creds: { email: string; password: string }
      ): Promise<{ data: { user: AuthUser | null; session: Session }; error: AuthError }> {
        setSignedIn(true);
        return { data: { user: FAKE_USER, session: { user: FAKE_USER } }, error: null };
      },
      async signUp(
        _creds: { email: string; password: string; options?: unknown }
      ): Promise<{ data: { user: AuthUser | null; session: Session }; error: AuthError }> {
        setSignedIn(true);
        return { data: { user: FAKE_USER, session: { user: FAKE_USER } }, error: null };
      },
      async signInWithOAuth(
        _opts: { provider: string; options?: unknown }
      ): Promise<{ data: { url: string | null; provider: string }; error: AuthError }> {
        return { data: { url: null, provider: "github" }, error: null };
      },
      async signOut(): Promise<{ error: AuthError }> {
        setSignedIn(false);
        return { error: null };
      },
      async resetPasswordForEmail(
        _email: string,
        _opts?: unknown
      ): Promise<{ data: Record<string, unknown>; error: AuthError }> {
        return { data: {}, error: null };
      },
      async updateUser(
        _attrs: unknown
      ): Promise<{ data: { user: AuthUser | null }; error: AuthError }> {
        return { data: { user: FAKE_USER }, error: null };
      },
      onAuthStateChange(_cb: (event: AuthChangeEvent, session: Session) => void) {
        return { data: { subscription: { unsubscribe() {} } } };
      },
      async exchangeCodeForSession(
        _code: string
      ): Promise<{ data: { session: Session }; error: AuthError }> {
        setSignedIn(true);
        return { data: { session: { user: FAKE_USER } }, error: null };
      },
    },
  };
}
