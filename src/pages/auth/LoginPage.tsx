import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getAdminToken, setAdminToken } from "@/lib/auth";
import { getAdminMe, loginAdmin } from "@/services/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const token = getAdminToken();

  const sessionQuery = useQuery({
    queryKey: ["admin", "me"],
    queryFn: getAdminMe,
    enabled: !!token,
    retry: false,
  });
  useEffect(() => {
    if (sessionQuery.isSuccess) {
      void navigate({ to: "/dashboard", replace: true });
    }
  }, [navigate, sessionQuery.isSuccess]);

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: async (response) => {
      setAdminToken(response.token);
      queryClient.removeQueries({ queryKey: ["admin", "me"] });
      await navigate({ to: "/dashboard", replace: true });
    },
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setValidationError(null);
    if (!email.trim() || !password) {
      setValidationError("Email and password are required");
      return;
    }
    loginMutation.mutate({ email: email.trim(), password });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-white p-7 shadow-2xl">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-deep font-display text-xl text-white">
            T
          </div>
          <div>
            <h1 className="font-display text-2xl text-slate-900">TourFlow</h1>
            <p className="text-sm text-slate-500">Admin dashboard</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={submit} noValidate>
          <div>
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loginMutation.isPending}
            />
          </div>
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loginMutation.isPending}
            />
          </div>
          {(validationError || loginMutation.isError) && (
            <p className="text-sm text-rose-600">
              {validationError ||
                (loginMutation.error instanceof Error
                  ? loginMutation.error.message
                  : "Login failed")}
            </p>
          )}
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-teal-deep hover:bg-teal-deep/90"
          >
            {loginMutation.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
