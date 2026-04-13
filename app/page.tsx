// app/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function RootPage() {
  const token = cookies().get('tc_jwt')?.value;
  redirect(token ? '/dashboard' : '/login');
}
