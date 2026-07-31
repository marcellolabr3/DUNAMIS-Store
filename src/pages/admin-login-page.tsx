import { FormEvent, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';

import { TurnstileField } from '../components/turnstile-field';
import { useAdminAuth } from '../hooks/use-admin-auth';
import { loginAdmin } from '../services/admin-auth-service';

export function AdminLoginPage() {
  const history = useHistory();
  const { admin, setAdmin } = useAdminAuth();
  const [email, setEmail] = useState('admin@dunamisstore.local');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (admin) {
    return <Redirect to="/admin" />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setIsSubmitting(true);

    try {
      const authenticatedAdmin = await loginAdmin({
        email,
        password,
        turnstileToken
      });
      setAdmin(authenticatedAdmin);
      history.push('/admin');
    } catch {
      setError('E-mail ou senha invalidos.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid min-h-screen place-items-center bg-admin px-4 py-10">
      <form
        className="grid w-full max-w-md gap-5 rounded-md border border-border bg-surface p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div>
          <p className="text-sm font-bold uppercase text-primary-hover">
            Painel administrativo
          </p>
          <h1 className="mt-2 text-3xl font-black text-secondary">
            Entrar na DUNAMIS STORE
          </h1>
        </div>
        <label className="grid gap-2 text-sm font-bold text-secondary">
          E-mail
          <input
            className="h-11 rounded-md border border-border px-3 text-sm font-normal outline-none focus:border-primary"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-secondary">
          Senha
          <input
            className="h-11 rounded-md border border-border px-3 text-sm font-normal outline-none focus:border-primary"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        <TurnstileField onVerify={setTurnstileToken} />
        {error && <p className="text-sm font-semibold text-danger">{error}</p>}
        <button
          className="h-12 rounded-md bg-primary px-5 text-sm font-black text-secondary hover:bg-primary-hover disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-xs leading-5 text-text-light">
          Desenvolvimento: admin@dunamisstore.local / Dunamis@123
        </p>
        <Link
          className="text-center text-sm font-bold text-primary-hover hover:text-secondary"
          to="/"
        >
          Voltar para a loja
        </Link>
      </form>
    </section>
  );
}
