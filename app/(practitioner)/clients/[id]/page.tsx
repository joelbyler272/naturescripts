import { ClientDetail } from './ClientDetail';

export const metadata = {
  title: 'Client Detail',
};

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  return <ClientDetail clientId={params.id} />;
}
