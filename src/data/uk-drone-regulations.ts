import { DroneRegulations } from "@/types/regulations";

// Source: UK CAA 2026 mandates and fee schedules (see Carbon Magics reports)
export const UK_CAA_DATA: DroneRegulations = {
  region: "United Kingdom",
  authority: "Civil Aviation Authority (CAA)",
  effective_date: "2026-03-11",
  currency_requirements: {
    logged_time: "2 hours",
    period_days: 90,
    description: "Pilots must demonstrate currency to remain active for professional use."
  },
  pilot_certifications: [
    {
      id: "flyer_id",
      name: "Flyer ID",
      requirement: "Mandatory for remote pilots operating drones ≥100g", // [cite: 22, 26]
      cost_estimate: 0,
      validity_years: 5,
      status: "Active"
    },
    {
      id: "rpc_l1",
      name: "Remote Pilot Certificate Level 1 (RPC-L1)",
      requirement: "Modern standard for professional VLOS operations", // [cite: 187, 389]
      cost_estimate: 600,
      validity_years: 5,
      pathway: "Ladder to L2 (BVLOS) and L3/L4"
    },
    {
      id: "gvc",
      name: "General Visual Line of Sight Certificate (GVC)",
      requirement: "Legacy qualification; issuance stops December 2027; considered a 'dead-end' career path", // [cite: 171]
      cost_estimate: 700,
      validity_years: 5,
      status: "Legacy",
      notes: "Issuance stops December 2027; considered a 'dead-end' career path"
    }
  ],
  operational_authorisations: {
    pdra_01: {
      name: "Pre-Defined Risk Assessment 01",
      application_fee: 500, // [cite: 135, 675]
      renewal: "Annual",
      max_altitude_m: 120, // [cite: 439]
      max_visual_range_m: 500,
      separation_distances: {
        uninvolved_persons_m: 50, // [cite: 439]
        takeoff_landing_m: 30, // [cite: 439]
        assemblies_of_people: "Strictly prohibited" // [cite: 447]
      },
      prohibited_actions: [
        "Dropping articles or materials", // [cite: 443]
        "Carriage of dangerous goods", // [cite: 444]
        "Flying within an FRZ without ATC permission" // [cite: 445]
      ]
    }
  }
};
