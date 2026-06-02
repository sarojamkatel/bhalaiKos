export default function DashboardPage() {
  const vehicles = [
    {
      id: 1,
      type: "Bus",
      number: "BA 2 KHA 1234",
      rate: 3500,
      bluebook: "bluebook.pdf",
      insurance: "insurance.pdf",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      
      {/* MAIN CONTENT */}
      <div className="flex flex-col">

        {/* TOPBAR */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-8 py-5">
            
            {/* LEFT */}
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Home / <span className="text-blue-600">Dashboard</span>
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              
              {/* Notification */}
              <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50">
                🔔

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* New Registration */}
              <button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-medium text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98]">
                + New Registration
              </button>
            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="p-8">

          {/* DASHBOARD STATS */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            
            {/* Revenue */}
            <div className="rounded-3xl border border-white/30 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-800">
                    NPR 23,500
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                  💰
                </div>
              </div>

              <p className="text-sm text-slate-500">
                <span className="font-semibold text-green-600">↑ 12%</span>{" "}
                vs last month
              </p>
            </div>

            {/* Policies */}
            <div className="rounded-3xl border border-white/30 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active Policies</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-800">
                    4
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                  ✅
                </div>
              </div>

              <p className="text-sm text-slate-500">
                <span className="font-semibold text-green-600">↑ 2</span> this
                month
              </p>
            </div>

            {/* Clients */}
            <div className="rounded-3xl border border-white/30 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Clients</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-800">
                    5
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                  👥
                </div>
              </div>

              <p className="text-sm text-slate-500">
                <span className="font-semibold text-green-600">↑ 1</span> new
                this week
              </p>
            </div>

            {/* Vehicles */}
            <div className="rounded-3xl border border-white/30 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Vehicles Insured</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-800">
                    9
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-2xl">
                  🚗
                </div>
              </div>

              <p className="text-sm text-slate-500">
                Across all registrations
              </p>
            </div>
          </div>

          {/* RECENT REGISTRATIONS */}
          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
            
            {/* Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Recent Registrations
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest insurance registrations
                </p>
              </div>

              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50">
                View All
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="pb-4 text-sm font-semibold text-slate-500">
                      Ref ID
                    </th>
                    <th className="pb-4 text-sm font-semibold text-slate-500">
                      Client
                    </th>
                    <th className="pb-4 text-sm font-semibold text-slate-500">
                      Vehicles
                    </th>
                    <th className="pb-4 text-sm font-semibold text-slate-500">
                      Amount
                    </th>
                    <th className="pb-4 text-sm font-semibold text-slate-500">
                      Status
                    </th>
                    <th className="pb-4 text-sm font-semibold text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-5 font-medium text-slate-700">
                      #INS-1021
                    </td>

                    <td className="py-5 text-slate-600">
                      Himalayan Travels
                    </td>

                    <td className="py-5 text-slate-600">
                      3 Vehicles
                    </td>

                    <td className="py-5 font-semibold text-slate-800">
                      NPR 8,500
                    </td>

                    <td className="py-5">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Paid
                      </span>
                    </td>

                    <td className="py-5 text-slate-500">
                      May 03, 2026
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

         
          
        </main>
      </div>
    </div>
  );
}