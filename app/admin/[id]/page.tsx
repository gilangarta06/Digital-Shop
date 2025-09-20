import { notFound } from 'next/navigation';

export default async function DashboardDetail({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.API_URL}/api/dashboard/${params.id}`);
  const data = await res.json();

  if (!data) {
    notFound(); // ✅ otomatis render not-found.tsx di folder yang sama
  }

  return <div>{data.title}</div>;
}
