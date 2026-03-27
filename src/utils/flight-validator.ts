import { UK_CAA_DATA } from '@/data/uk-drone-regulations';

export interface FlightPlan {
  altitude: number;
  distanceFromUninvolved: number;
  isOverAssembly: boolean;
  isDroppingArticles: boolean;
  isInFRZ: boolean;
  hasATCPermission: boolean;
}

export interface FlightValidationResult {
  isLegal: boolean;
  errors: string[];
}

export const validateFlightPlan = (plan: FlightPlan): FlightValidationResult => {
  const pdra = UK_CAA_DATA.operational_authorisations.pdra_01;
  const errors: string[] = [];

  // 1. Altitude Check (Max 120m / 400ft) [cite: 439]
  if (plan.altitude > pdra.max_altitude_m) {
    errors.push(`Altitude exceeds legal limit of ${pdra.max_altitude_m}m.`);
  }

  // 2. Separation Check (Min 50m from uninvolved persons) [cite: 439]
  if (plan.distanceFromUninvolved < pdra.separation_distances.uninvolved_persons_m) {
    errors.push(`Horizontal separation must be at least ${pdra.separation_distances.uninvolved_persons_m}m.`);
  }

  // 3. Prohibited: Assemblies of People [cite: 447]
  if (plan.isOverAssembly) {
    errors.push("Overflight of assemblies of people is strictly prohibited under PDRA-01.");
  }

  // 4. Prohibited: Dropping Articles [cite: 443]
  if (plan.isDroppingArticles) {
    errors.push("Dropping articles or materials from the UAS is prohibited.");
  }

  // 5. FRZ Check [cite: 445]
  if (plan.isInFRZ && !plan.hasATCPermission) {
    errors.push("Operations within a Flight Restriction Zone (FRZ) require explicit ATC permission.");
  }

  return {
    isLegal: errors.length === 0,
    errors,
  };
};
