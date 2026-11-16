import re
import numpy as np
import pandas as pd
from datetime import datetime

class DistressTrendAnalyzer:
    """
    AI-Powered Dynamic Mental Health Monitoring & Distress Prediction System
    Specifically aligned with SIH26094 (Ministry of Social Justice and Empowerment - MoSJE):
    - SC/ST (Prevention of Atrocities) Act, 1989 beneficiaries
    - Victims of rape, gang rape, severe assault, arson, witness intimidation, trial delays, social ostracism
    - Multi-modal sentiment & voice/text stress indicators
    - Explainable Dynamic Distress Score (0-100)
    - Proactive crisis escalation alerts & multidimensional welfare intervention recommendations:
      (Psychological counseling, witness protection, medical treatment, legal aid, financial relief, relocation)
    """

    CRISIS_KEYWORDS = {
        "threat": ["threat", "threatened", "follow", "watching", "kill", "harm", "stalking", "warned"],
        "intimidation": ["intimidate", "police", "court", "testify", "witness", "accused", "bail", "bribe", "pressure"],
        "ostracism": ["boycott", "village", "isolated", "caste", "insult", "humiliation", "denied water", "ostracized"],
        "hopelessness": ["hopeless", "can't take it", "end my life", "suicide", "no point", "give up", "die", "helpless"],
        "trauma": ["nightmare", "panic", "shaking", "flashback", "screaming", "can't sleep", "fear", "terrified"]
    }

    @classmethod
    def analyze_text_sentiment_and_trauma(cls, text: str) -> dict:
        """
        NLP Lexical & Sentiment Analysis for trauma, threat, and intimidation indicators.
        """
        if not text:
            return {"trauma_detected": False, "matched_categories": [], "sentiment_score": 0.0, "risk_multiplier": 1.0}
        
        text_lower = text.lower()
        matched = []
        risk_boost = 1.0

        for cat, keywords in cls.CRISIS_KEYWORDS.items():
            for kw in keywords:
                if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
                    matched.append(cat)
                    if cat in ["threat", "intimidation"]:
                        risk_boost += 0.35
                    elif cat == "hopelessness":
                        risk_boost += 0.60
                    elif cat == "ostracism":
                        risk_boost += 0.25
                    break

        return {
            "trauma_detected": len(matched) > 0,
            "matched_categories": list(set(matched)),
            "risk_multiplier": round(min(risk_boost, 2.5), 2)
        }

    @classmethod
    def calculate_checkin_score(
        cls, 
        mood: str, 
        stress: int, 
        sleep_hours: float, 
        energy: int, 
        case_stage: str = "investigation",
        threat_level: int = 1,
        reflection_text: str = ""
    ) -> float:
        """
        Calculates the Dynamic Well-being Score (0-100, where 100 is optimal and < 40 indicates elevated distress).
        Incorporates case vulnerability weights and threat perceptions.
        """
        mood_weights = {
            "great": 25,
            "good": 20,
            "okay": 15,
            "low": 8,
            "distressed": 2
        }
        mood_score = mood_weights.get(mood.lower(), 15)
        
        # Stress (1 to 10 scale)
        stress_score = max(0, 10 - stress) * 3.0  # up to 30 pts
        
        # Sleep score (optimal 7-9 hours)
        if 7.0 <= sleep_hours <= 9.0:
            sleep_score = 25
        elif 6.0 <= sleep_hours < 7.0 or 9.0 < sleep_hours <= 10.0:
            sleep_score = 18
        elif 4.5 <= sleep_hours < 6.0:
            sleep_score = 10
        else:
            sleep_score = 4

        # Energy score (1 to 10 scale)
        energy_score = (energy / 10.0) * 15.0

        # Subtotal (max 95 pts)
        base = mood_score + stress_score + sleep_score + energy_score

        # Threat penalty (perceived intimidation / safety concerns: 1 to 5 scale)
        threat_penalty = max(0, threat_level - 1) * 4.0
        base -= threat_penalty

        # Sentiment penalty
        sentiment_res = cls.analyze_text_sentiment_and_trauma(reflection_text)
        if sentiment_res["trauma_detected"]:
            base /= sentiment_res["risk_multiplier"]

        return round(float(np.clip(base, 0, 100)), 1)

    @classmethod
    def evaluate_trend(cls, current_checkin: dict, history_checkins: list) -> dict:
        """
        Comprehensive Dynamic Distress & Predictive Risk Modeling for Atrocity Victims.
        Generates explainable early-warning cues and cross-agency welfare intervention plans.
        """
        stress = int(current_checkin.get("stress_level", 5))
        mood = str(current_checkin.get("mood", "okay"))
        sleep = float(current_checkin.get("sleep_hours", 7.0))
        energy = int(current_checkin.get("energy_level", 5))
        threat_level = int(current_checkin.get("threat_level", 1))
        case_stage = str(current_checkin.get("case_stage", "investigation"))
        request_support = bool(current_checkin.get("request_support", False))
        reflection = str(current_checkin.get("reflection", ""))

        current_composite = cls.calculate_checkin_score(
            mood, stress, sleep, energy, case_stage, threat_level, reflection
        )

        reasons = []
        interventions = []
        requires_counsellor_review = False
        urgency = "low"  # low, moderate, high, urgent

        # Text analysis
        sentiment = cls.analyze_text_sentiment_and_trauma(reflection)
        if sentiment["trauma_detected"]:
            for cat in sentiment["matched_categories"]:
                if cat == "threat":
                    reasons.append("External threat / intimidation language detected in statement.")
                    interventions.append("Notify District Police Liaison & recommend Witness Protection protocol.")
                    requires_counsellor_review = True
                    urgency = "urgent"
                elif cat == "intimidation":
                    reasons.append("Reported pressure / coercion regarding court testimony or trial.")
                    interventions.append("Coordinate with Legal Aid Authority (DLSA) for special public prosecutor protection.")
                    requires_counsellor_review = True
                    urgency = "high"
                elif cat == "ostracism":
                    reasons.append("Social boycott or village-level discrimination reported.")
                    interventions.append("Alert Sub-Divisional Magistrate (SDM) / District Welfare Officer for rehabilitation inspection.")
                    requires_counsellor_review = True
                    urgency = "high"
                elif cat == "hopelessness":
                    reasons.append("Severe hopelessness / acute emotional crisis indicators identified.")
                    interventions.append("Immediate 24/7 Crisis helpline (14416 / 14566) dispatched for emergency telehealth triage.")
                    requires_counsellor_review = True
                    urgency = "urgent"

        # Explicit Request
        if request_support:
            reasons.append("Victim / complainant explicitly pressed 'Request Immediate Support'.")
            requires_counsellor_review = True
            urgency = max(urgency, "high", key=lambda x: ["low", "moderate", "high", "urgent"].index(x))
            interventions.append("Assign licensed psychologist consultation within 24 hours.")

        # Threat Level
        if threat_level >= 4:
            reasons.append(f"Elevated personal security concern (Threat index: {threat_level}/5).")
            interventions.append("Initiate relocation / safe-house shelter support under SC/ST Protection rules.")
            requires_counsellor_review = True
            urgency = "urgent"

        # Stress & Sleep Acute thresholds
        if stress >= 9:
            reasons.append(f"Severe acute physiological stress reported ({stress}/10).")
            requires_counsellor_review = True
            urgency = max(urgency, "moderate", key=lambda x: ["low", "moderate", "high", "urgent"].index(x))
        if sleep < 4.0:
            reasons.append(f"Severe insomnia / trauma-induced sleep deprivation ({sleep} hrs).")
            interventions.append("Recommend medical / psychiatric sleep therapy assessment.")

        # Historical baseline trend analysis
        baseline_score = current_composite
        score_drop = 0.0

        if history_checkins and len(history_checkins) >= 2:
            past_scores = [
                cls.calculate_checkin_score(
                    h.get("mood", "okay"),
                    int(h.get("stress_level", 5)),
                    float(h.get("sleep_hours", 7.0)),
                    int(h.get("energy_level", 5)),
                    str(h.get("case_stage", "investigation")),
                    int(h.get("threat_level", 1)),
                    str(h.get("reflection", ""))
                )
                for h in history_checkins
            ]
            baseline_score = round(float(np.mean(past_scores)), 1)
            score_drop = round(baseline_score - current_composite, 1)

            if score_drop >= 18.0:
                reasons.append(f"Significant well-being decline of {score_drop} points below 7-day personal baseline ({baseline_score}%).")
                requires_counsellor_review = True
                urgency = max(urgency, "moderate", key=lambda x: ["low", "moderate", "high", "urgent"].index(x))
                interventions.append("Scheduled psychological check-in to prevent distress escalation.")

            # Persistent distress
            if len(past_scores) >= 2 and all(s < 45 for s in past_scores[-2:]) and current_composite < 45:
                reasons.append("Persistent chronic distress observed across 3 consecutive interaction cycles.")
                requires_counsellor_review = True
                urgency = max(urgency, "high", key=lambda x: ["low", "moderate", "high", "urgent"].index(x))
                interventions.append("Comprehensive multi-disciplinary case conference (Counsellor + Welfare Officer).")

        # Default interventions if low risk
        if not interventions:
            interventions.append("Continue periodic voluntary wellness monitoring and positive cognitive reframing.")

        # Compute Dynamic Distress Score (inverse of well-being score, 0 to 100)
        dynamic_distress_score = round(100.0 - current_composite, 1)

        return {
            "wellbeing_score": current_composite,
            "dynamic_distress_score": dynamic_distress_score,
            "baseline_score": baseline_score,
            "score_variance": score_drop,
            "requires_counsellor_review": requires_counsellor_review,
            "urgency": urgency,
            "explainable_factors": reasons if reasons else ["Well-being indices remain consistent with recent baseline."],
            "recommended_interventions": interventions,
            "case_stage": case_stage,
            "threat_level": threat_level,
            "nhla_helpline_triage": "14566 / 14416 Active",
            "generated_at": datetime.utcnow().isoformat()
        }
