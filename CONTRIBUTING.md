# Contributing to Airspace Tutor 🛸

Thank you for your interest in helping digitize UK drone compliance! This project aims to bridge the gap between complex aerospace policy and accessible software tools.

## ⚖️ Regulatory Standards
All contributions must align with current **UK Civil Aviation Authority (CAA)** mandates.
* **Policy Alignment:** Ensure logic follows the latest **CAP 722** series guidance.
* **Category Focus:** Our primary focus is currently the **Specific Category (PDRA-01)**.
* **Certification:** Prioritize the **RPC-L1** (Remote Pilot Certificate Level 1) framework over legacy GVC paths.

## 🛠️ How to Contribute

### 1. Updating Regulations
If the CAA updates the **Scheme of Charges** or operational limits, please update `src/data/uk-drone-regulations.ts`.
* Example: Changes to the **Operator ID** annual fee (currently £11.79).
* Example: New **Remote ID** mandates for 2026.

### 2. Adding Scenarios
We welcome new "Go/No-Go" scenarios for the **Flight Sandbox**.
* Scenarios should reflect real-world South West infrastructure, such as the **National Grid Cotswolds** or **Hinkley Point C** logistics.
* Ensure scenarios account for **Flight Restriction Zones (FRZ)** and separation distances (e.g., 50m from uninvolved persons).

### 3. BVLOS Roadmap (RPC-L2/L3)
We are looking for contributors to help build the logic for **Beyond Visual Line of Sight (BVLOS)** operations.
* This includes implementing **ARC-a** (Isolated) and **ARC-c** (Integrated) airspace risk assessments.
* Logic must include the requirement for **2 hours of logged flight time every 90 days** for pilot currency.

## 🧪 Testing Requirements
Before submitting a Pull Request, you must run the test suite:
`npm test`
All new regulatory logic must be accompanied by unit tests in `src/utils/flight-validator.test.ts` to ensure safety barriers are mathematically sound.

---
**Maintained by:** Treyaksh Sharma  
**Context:** Aerospace Engineering with Pilot Studies, UWE Bristol  
**Industry Partner:** Carbon Magics Ltd
