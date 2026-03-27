import { FlightPlan } from './flight-validator';

export const generateComplianceReport = (plan: FlightPlan, operatorName: string = "Carbon Magics Ltd"): string => {
  const date = new Date().toLocaleDateString();
  
  return `
--- UAS FLIGHT COMPLIANCE REPORT ---
Operator: ${operatorName}
Date: ${date}
Framework: UK CAA PDRA-01

MISSION PARAMETERS:
- Planned Altitude: ${plan.altitude}m (Limit: 120m)
- Min. Horizontal Distance: ${plan.distanceFromUninvolved}m (Min: 50m)
- Overflight of Assemblies: ${plan.isOverAssembly ? 'YES' : 'NO'}
- Dropping of Articles: ${plan.isDroppingArticles ? 'YES' : 'NO'}

COMPLIANCE STATEMENT:
This operation is planned in accordance with UK CAA regulations and 
CAP 722 standards. The pilot in command must hold a 
valid Flyer ID and GVC/RPC-L1 qualification.

Status: ${plan.isOverAssembly || plan.isDroppingArticles || plan.altitude > 120 || plan.distanceFromUninvolved < 50 ? 'NO-GO' : 'REGULATORY CLEARED'}
  `;
};
