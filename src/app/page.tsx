import ComplianceDashboard from '@/components/ComplianceDashboard';
import FlightSandbox from '@/components/FlightSandbox';
import PilotStreak from '@/components/PilotStreak';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">
            AIRSPACE TUTOR
          </h1>
          <p className="text-slate-500 font-medium">
            Regulator-Grade Drone Compliance | UK CAA Standards
          </p>
        </header>

        {/* Main Grid: Dashboard & Streak */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Tracks Phase 1: Flyer ID, Operator ID, and RPC-L1 */}
            <ComplianceDashboard />
          </div>
          <div className="space-y-6">
            {/* Tracks the 2-hour/90-day flight currency requirement */}
            <PilotStreak />
          </div>
        </div>

        {/* Simulator: PDRA-01 Validation */}
        <div className="pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
            PDRA-01 Flight Planning Simulator
          </h2>
          <FlightSandbox />
        </div>
      </div>
    </main>
  );
}
