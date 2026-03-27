export interface PilotCert {
  id: string;
  name: string;
  requirement: string;
  cost_estimate: number;
  validity_years: number;
  status?: "Legacy" | "Active";
  pathway?: string;
  notes?: string;
}

export interface DroneRegulations {
  region: string;
  authority: string;
  effective_date: string;
  currency_requirements: {
    logged_time: string;
    period_days: number;
    description: string;
  };
  pilot_certifications: PilotCert[];
  operational_authorisations: {
    pdra_01: {
      name: string;
      application_fee: number;
      renewal: string;
      max_altitude_m: number;
      max_visual_range_m: number;
      separation_distances: {
        uninvolved_persons_m: number;
        takeoff_landing_m: number;
        assemblies_of_people: string;
      };
      prohibited_actions: string[];
    };
  };
}
