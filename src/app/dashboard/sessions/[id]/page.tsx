import DoctorSessionDetailPage from '@/components/dashboard/doctor-session-detail-page';

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DoctorSessionDetailPage sessionId={id} />;
}
