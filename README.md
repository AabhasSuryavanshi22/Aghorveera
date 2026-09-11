# Aghorveera

### A privacy-conscious wellness-support platform for uniformed personnel

[Aghorveera](https://aghorveera.ai.studio) is a web-based welfare-support platform that helps identify patterns associated with elevated stress and wellbeing concerns through short, voluntary wellness check-ins.

The project is developed as a **Smart India Hackathon 2026 prototype**.

Aghorveera is designed to support early, human-led welfare intervention. It does not diagnose medical or mental-health conditions, predict suicide, determine fitness for duty, or make disciplinary decisions.

## Live Application

Visit the deployed application:

**[Open Aghorveera](https://aghorveera.ai.studio)**

## Problem

Personnel serving in the armed forces, CAPF, police, and other uniformed services may work under demanding conditions, including:

- Long or irregular duty hours
- Disrupted sleep
- High workload
- Difficult deployments
- Isolation and transfers
- Operational pressure
- Limited opportunities to discuss personal difficulties

Early changes in wellbeing may not always be visible through manual observation. Personnel may also hesitate to report concerns because of stigma or fear of judgement.

Aghorveera provides a structured, privacy-conscious way to surface relevant wellbeing patterns while keeping human welfare professionals involved in the process.

## Solution

Aghorveera connects two role-based experiences.

### Personnel experience

Personnel can:

- Sign in securely
- Review and provide consent
- Complete a short voluntary wellness check-in
- View a wellness-support indicator
- Understand the contributing factors
- View recent wellbeing trends
- Access support resources
- Manage privacy and consent settings

### Welfare officer experience

Authorized welfare officers can:

- View overall wellbeing-support distribution
- Review recent trends
- Identify cases that may benefit from human follow-up
- View relevant contributing indicators
- Record follow-up status
- Monitor broad welfare patterns

The officer interface is intended to support professional judgement. It does not replace qualified welfare professionals.

## Core Features

### Voluntary wellness check-ins

Aghorveera uses a short check-in based on five simple indicators:

- Mood
- Sleep
- Energy
- Stress
- Workload

Each indicator uses a simple 1-to-5 scale so that the check-in remains quick and easy to complete.

### Explainable support indicators

The system provides one of three broad categories:

- Low
- Moderate
- High

The result also shows contributing indicators such as:

- Reduced sleep
- Low energy
- Elevated stress
- High workload
- Lower mood

The purpose is to make the result understandable rather than presenting an unexplained AI output.

### Supportive recommendations

After a check-in, the user receives a calm recommendation based on the submitted indicators.

For example:

> Your recent wellness indicators suggest you may benefit from additional support. Consider prioritizing rest, workload balance, and speaking with an authorized welfare resource if these concerns continue.

Recommendations are supportive and non-medical. They do not provide diagnosis or treatment instructions.

### Human-led follow-up

The welfare officer interface includes a simple follow-up process:

- Pending
- Contacted
- Closed

Aghorveera does not automatically punish, discipline, classify, or make decisions about a person’s service or employment.

### Trends

Personnel can view simple trends related to:

- Sleep
- Stress
- Workload
- Wellness-support indicators

The goal is to help users notice changes over time without overwhelming them with complex analytics.

### Support resources

The application can provide access to welfare-related resources, including:

- Authorized welfare officer contact
- Wellbeing support information
- Rest and recovery guidance
- Privacy and consent information

## How Aghorveera Works

```text
Secure sign-in
      |
      v
Consent review
      |
      v
Voluntary wellness check-in
      |
      v
Secure processing of submitted indicators
      |
      v
Explainable wellness-support indicator
      |
      +-----------------------------+
      |                             |
      v                             v
Personnel result and trends   Authorized welfare review
```

The output is intended to encourage appropriate support, not to label, diagnose, or penalize a person.

## Privacy and Responsible Use

Privacy is a central design principle of Aghorveera.

The prototype is designed around:

- Consent-based data collection
- Minimal wellness information
- Authenticated access
- Role-based permissions
- Separation between personnel and officer experiences
- Human review before follow-up
- Synthetic demonstration data
- No real military or police database integration

Personnel should only be able to access their own wellness information. Welfare officers should only access information authorized for welfare-support purposes.

The application should never be used to:

- Diagnose a medical or psychological condition
- Predict suicide
- Determine fitness for duty
- Make disciplinary or employment decisions
- Automatically alert commanders for punishment
- Replace professional welfare support

## Technology

Aghorveera is a cloud-connected web application using:

- Google AI Studio
- Firebase Authentication
- Cloud Firestore
- Firebase security controls
- Responsive web technologies
- Explainable rule-based wellness-support scoring
- Synthetic data for demonstration

The prototype prioritizes a working, understandable, and responsible product over unnecessary architectural complexity.

## Risk Assessment Approach

The current prototype uses a simple, deterministic scoring approach based on the five check-in inputs.

In general:

- Lower mood increases the support score.
- Lower sleep increases the support score.
- Lower energy increases the support score.
- Higher stress increases the support score.
- Higher workload increases the support score.

The system converts these inputs into a broad support indicator:

```text
LOW
MODERATE
HIGH
```

This approach is intentionally transparent and easy to explain during a prototype demonstration.

The result is not clinically validated. It must not be interpreted as a medical, psychiatric, employment, or fitness assessment.

## Prototype Demonstration

A typical demonstration can follow this sequence:

1. Open the [Aghorveera application](https://aghorveera.ai.studio).
2. Sign in as a personnel user.
3. Review the consent information.
4. Complete the wellness check-in.
5. View the generated wellness-support indicator.
6. Review the contributing factors and recommendation.
7. Open the trends or support section.
8. Sign out.
9. Sign in as an authorized welfare officer.
10. View the overall dashboard.
11. Review the attention queue.
12. Update a follow-up status.
13. Explain the privacy and human-in-the-loop safeguards.

## Current Limitations

Aghorveera is an educational prototype and has important limitations:

- The scoring approach is not clinically validated.
- The prototype does not represent a complete assessment of wellbeing.
- The five check-in indicators provide only a limited view of a person’s situation.
- Self-reported information may be incomplete or inaccurate.
- The system cannot understand personal context without human conversation.
- Demonstration data is synthetic.
- The application is not a substitute for professional welfare, medical, or emergency support.

## Future Scope

Future versions could explore:

- Multilingual support
- Offline-first operation for low-connectivity environments
- Approved institutional integration
- Longer-term trend analysis
- Bias and fairness evaluation
- Independent validation of the risk engine
- Improved audit logging
- Data retention and deletion controls
- Stronger enterprise identity management
- Authorized integration with professional welfare services
- Consent-aware wearable data integration

Any real-world deployment would require institutional authorization, privacy review, security testing, governance, and evaluation by qualified professionals.

## Responsible Product Statement

Aghorveera uses technology to help welfare teams notice potentially important patterns earlier.

It does not decide what a person needs.

Human beings remain responsible for understanding context, communicating respectfully, and providing appropriate support.

> Aghorveera supports people who serve by making early welfare support more visible, explainable, and responsible.

## Project Status

Aghorveera is currently a Smart India Hackathon 2026 prototype.

The prototype demonstrates:

- Role-based access
- Consent-aware wellness check-ins
- Explainable support indicators
- Personnel trend views
- Welfare officer monitoring
- Human-led follow-up tracking
- Privacy-conscious product design
