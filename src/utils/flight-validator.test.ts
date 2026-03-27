import { describe, it, expect } from 'vitest';
import { validateFlightPlan } from './flight-validator';

describe('UK CAA PDRA-01 Regulatory Validation', () => {
  it('should allow a standard legal flight', () => {
    const plan = {
      altitude: 100,
      distanceFromUninvolved: 60,
      isOverAssembly: false,
      isDroppingArticles: false,
      isInFRZ: false,
      hasATCPermission: false
    };
    const result = validateFlightPlan(plan);
    expect(result.isLegal).toBe(true);
  });

  it('should reject flights exceeding 120m altitude', () => {
    const plan = {
      altitude: 125,
      distanceFromUninvolved: 70,
      isOverAssembly: false,
      isDroppingArticles: false,
      isInFRZ: false,
      hasATCPermission: false
    };
    const result = validateFlightPlan(plan);
    expect(result.isLegal).toBe(false);
    expect(result.errors).toContain("Altitude exceeds legal limit of 120m.");
  });

  it('should reject flights within 50m of uninvolved persons', () => {
    const plan = {
      altitude: 50,
      distanceFromUninvolved: 20,
      isOverAssembly: false,
      isDroppingArticles: false,
      isInFRZ: false,
      hasATCPermission: false
    };
    const result = validateFlightPlan(plan);
    expect(result.isLegal).toBe(false);
    expect(result.errors).toContain("Horizontal separation must be at least 50m.");
  });

  it('should strictly prohibit dropping articles', () => {
    const plan = {
      altitude: 30,
      distanceFromUninvolved: 100,
      isOverAssembly: false,
      isDroppingArticles: true,
      isInFRZ: false,
      hasATCPermission: false
    };
    const result = validateFlightPlan(plan);
    expect(result.isLegal).toBe(false);
    expect(result.errors).toContain("Dropping articles or materials from the UAS is prohibited.");
  });
});
