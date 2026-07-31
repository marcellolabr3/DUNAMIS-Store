import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-3xl content-center gap-4 px-4 py-16">
      <h1 className="text-3xl font-bold text-secondary">Página não encontrada</h1>
      <p className="text-text-light">
        O endereço informado não existe na DUNAMIS STORE.
      </p>
      <Link
        className="inline-flex w-fit items-center rounded-md bg-primary px-4 py-2 font-semibold text-secondary hover:bg-primary-hover"
        to="/"
      >
        Voltar ao início
      </Link>
    </section>
  );
}
