import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserPackages } from "@/lib/data";
import { PackageCard } from "@/components/PackageCard";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Sign in to view your dashboard.</p>
      </div>
    );
  }

  const userId = (session.user as any).id as string;
  const myPackages = await getUserPackages(userId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-500">Manage your published tools.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myPackages.map((pkg) => (
          <PackageCard key={pkg.name} {...pkg} />
        ))}
      </div>

      {myPackages.length === 0 && (
        <p className="mt-8 text-center text-slate-400">
          No packages yet.{" "}
          <Link href="/publish" className="text-blue-600 hover:underline">
            Publish your first tool
          </Link>
          .
        </p>
      )}
    </div>
  );
}
