"use client";

import { BlurredTable } from "@/components/blurred-table";

export default function Analysis() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-mono font-bold text-green-500">Neural Analysis</h1>
      </div>

      <BlurredTable />
    </div>
  );
}
