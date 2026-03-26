import { AcceptInvite } from './AcceptInvite';

export const metadata = {
  title: 'Accept Invitation',
};

export default function AcceptInvitePage({ params }: { params: { token: string } }) {
  return <AcceptInvite token={params.token} />;
}
