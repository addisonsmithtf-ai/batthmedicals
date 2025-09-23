-- Create policies table for storing medical policies
CREATE TABLE public.policies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  version text NOT NULL DEFAULT '1.0',
  content text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

-- Create policies for policy access
-- Admins can do everything with policies
CREATE POLICY "Admins can manage all policies" 
ON public.policies 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Staff can only read active policies
CREATE POLICY "Staff can view active policies" 
ON public.policies 
FOR SELECT 
USING (
  has_role(auth.uid(), 'staff'::app_role) 
  AND status = 'active'
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_policies_updated_at
BEFORE UPDATE ON public.policies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the existing mock policies data
INSERT INTO public.policies (title, description, category, status, version, content, created_at, updated_at) VALUES
('Hand Hygiene Protocol', 'Comprehensive guidelines for proper hand hygiene procedures to prevent healthcare-associated infections.', 'Infection Control', 'active', '2.1', 'HAND HYGIENE PROTOCOL

1. PURPOSE
This policy establishes standardized hand hygiene procedures for all healthcare personnel to reduce the transmission of healthcare-associated infections.

2. SCOPE
This policy applies to all healthcare workers, including physicians, nurses, technicians, and support staff who have direct or indirect patient contact.

3. POLICY STATEMENT
All healthcare personnel must perform hand hygiene:
- Before patient contact
- Before aseptic procedures
- After body fluid exposure risk
- After patient contact
- After contact with patient surroundings

4. PROCEDURE
4.1 Hand Washing with Soap and Water:
- Wet hands with water
- Apply soap and rub hands together for at least 20 seconds
- Rinse thoroughly with water
- Dry hands completely with disposable towel
- Use towel to turn off faucet

4.2 Alcohol-Based Hand Sanitizer:
- Apply product to palm of one hand
- Rub hands together covering all surfaces
- Continue rubbing until hands are dry (approximately 20 seconds)

5. WHEN TO USE SOAP VS. SANITIZER
- Use soap and water when hands are visibly soiled
- Use alcohol-based sanitizer for routine decontamination
- Always use soap and water after contact with C. difficile

6. COMPLIANCE MONITORING
Hand hygiene compliance will be monitored through direct observation and reported monthly to the Infection Control Committee.

7. REFERENCES
- CDC Guidelines for Hand Hygiene in Healthcare Settings
- WHO Guidelines on Hand Hygiene in Healthcare', '2024-01-15T10:30:00Z', '2024-01-15T10:30:00Z'),

('Medication Administration Safety', 'Five rights of medication administration and safety protocols for preventing medication errors.', 'Medication Management', 'active', '3.0', 'MEDICATION ADMINISTRATION SAFETY POLICY

1. PURPOSE
To establish safe medication administration practices and reduce the risk of medication errors.

2. THE FIVE RIGHTS OF MEDICATION ADMINISTRATION
2.1 Right Patient
- Verify patient identity using two identifiers
- Check patient armband and ask patient to state name
- Verify allergies before administration

2.2 Right Medication
- Compare medication label with MAR three times
- Check medication before removing from storage
- Check again before preparing
- Check final time before administration

2.3 Right Dose
- Calculate dose carefully
- Have another nurse verify high-risk calculations
- Use appropriate measuring devices

2.4 Right Route
- Verify administration route on order
- Ensure route is appropriate for patient condition
- Use proper technique for each route

2.5 Right Time
- Administer medications within 30 minutes of scheduled time
- Document time of administration immediately
- Follow facility scheduling protocols

3. HIGH-ALERT MEDICATIONS
Special precautions required for:
- Insulin
- Heparin
- Warfarin
- Chemotherapy agents
- Opioids

4. DOCUMENTATION
- Document immediately after administration
- Include medication, dose, route, time, and patient response
- Report any adverse reactions immediately

5. ERROR REPORTING
All medication errors must be reported within 24 hours using the incident reporting system.', '2024-02-10T14:45:00Z', '2024-02-10T14:45:00Z'),

('Emergency Code Blue Response', 'Comprehensive protocol for responding to cardiac arrest emergencies in the hospital setting.', 'Emergency Procedures', 'active', '1.8', 'EMERGENCY CODE BLUE RESPONSE PROTOCOL

1. PURPOSE
To provide immediate, coordinated response to cardiac arrest situations.

2. ACTIVATION
Code Blue is activated when a patient is:
- Unresponsive
- Not breathing or gasping
- No palpable pulse

3. CALLING CODE BLUE
- Call extension 911 or press emergency button
- State: "Code Blue, [Location], Code Blue, [Location]"
- Stay with patient until help arrives

4. RESPONSE TEAM COMPOSITION
- Physician (Team Leader)
- ICU Nurse
- Respiratory Therapist
- Pharmacist
- Chaplain (if available)

5. INITIAL RESPONSE (First 2 minutes)
5.1 Immediate Actions:
- Ensure scene safety
- Check responsiveness
- Call for help and activate Code Blue
- Position patient on firm surface
- Begin CPR if no pulse

5.2 CPR Protocol:
- 30 chest compressions at 100-120/minute
- 2 rescue breaths
- Minimize interruptions
- Switch compressors every 2 minutes

6. ADVANCED CARDIAC LIFE SUPPORT
Follow current AHA ACLS guidelines for:
- Rhythm analysis
- Defibrillation
- Medication administration
- Airway management

7. DOCUMENTATION
- Record all interventions and times
- Complete Code Blue record
- Debrief with team post-event

8. QUALITY IMPROVEMENT
All Code Blue events will be reviewed for quality improvement opportunities.', '2024-01-28T09:15:00Z', '2024-01-28T09:15:00Z'),

('Patient Privacy and HIPAA Compliance', 'Guidelines for protecting patient health information and maintaining HIPAA compliance.', 'Documentation', 'active', '2.5', 'PATIENT PRIVACY AND HIPAA COMPLIANCE POLICY

1. PURPOSE
To ensure compliance with HIPAA regulations and protect patient health information.

2. PROTECTED HEALTH INFORMATION (PHI)
PHI includes any information that:
- Relates to individual''s health condition
- Is created or received by healthcare provider
- Could reasonably identify the individual

3. MINIMUM NECESSARY STANDARD
- Access only information needed for job function
- Disclose only minimum necessary information
- Request only information needed for specific purpose

4. PERMITTED USES AND DISCLOSURES
PHI may be used or disclosed for:
- Treatment purposes
- Payment activities
- Healthcare operations
- Patient authorization
- Legal requirements

5. PATIENT RIGHTS
Patients have the right to:
- Access their medical records
- Request amendments to records
- Request restrictions on use/disclosure
- File complaints about privacy practices

6. SECURITY SAFEGUARDS
6.1 Physical Safeguards:
- Lock medical records when not in use
- Position computer screens away from public view
- Secure disposal of PHI documents

6.2 Technical Safeguards:
- Use unique login credentials
- Automatic screen locks
- Secure data transmission

6.3 Administrative Safeguards:
- Privacy training for all staff
- Business associate agreements
- Incident response procedures

7. BREACH NOTIFICATION
Any suspected privacy breach must be reported to the Privacy Officer within 24 hours.

8. SANCTIONS
Violations of this policy may result in disciplinary action up to and including termination.', '2024-02-05T16:20:00Z', '2024-02-05T16:20:00Z'),

('Fall Prevention Protocol', 'Evidence-based strategies for preventing patient falls in healthcare facilities.', 'Patient Care', 'active', '2.2', 'FALL PREVENTION PROTOCOL

1. PURPOSE
To reduce the risk of patient falls and fall-related injuries through systematic assessment and intervention.

2. FALL RISK ASSESSMENT
All patients must be assessed for fall risk within 4 hours of admission using the Morse Fall Scale.

3. MORSE FALL SCALE FACTORS
- History of falling
- Secondary diagnosis
- Ambulatory aid requirements
- IV therapy/saline lock
- Gait and balance
- Mental status

4. RISK CATEGORIES
- Low Risk (0-24 points): Standard precautions
- Moderate Risk (25-44 points): Moderate precautions
- High Risk (45+ points): High precautions

5. INTERVENTIONS BY RISK LEVEL

5.1 Standard Precautions (All Patients):
- Orient patient to room and call light
- Keep bed in lowest position
- Ensure adequate lighting
- Clear pathways of obstacles
- Non-slip footwear

5.2 Moderate Risk Interventions:
- Hourly rounding
- Fall risk armband
- Bed/chair alarms as needed
- Encourage family involvement

5.3 High Risk Interventions:
- Every 30-minute monitoring
- Consider 1:1 sitter
- Physical therapy consultation
- Medication review for fall risk drugs

6. ENVIRONMENTAL MODIFICATIONS
- Remove or secure loose rugs
- Install grab bars in bathrooms
- Adequate lighting in all areas
- Clear floor surfaces

7. POST-FALL PROTOCOL
- Immediate assessment for injury
- Notify physician
- Complete incident report
- Review and modify care plan
- Family notification

8. STAFF EDUCATION
All staff must complete fall prevention training annually and demonstrate competency.', '2024-01-20T11:30:00Z', '2024-01-20T11:30:00Z');