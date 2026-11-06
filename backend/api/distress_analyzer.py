import numpy as np
import pandas as pd
from datetime import datetime, timedelta

class DistressTrendAnalyzer:
    """
    Explainable AI Trend & Baseline Deviation Analyzer.
    
    Adheres to ethical healthcare guidelines:
    - Provides non-diagnostic monitoring and early trend indicators.
    - Compares user's current metrics strictly against their own historical baseline.
    - Highlights explainable reasoning factors for authorized human counsellor review.
    """
    
    @staticmethod
    def calculate_checkin_score(mood: str, stress: int, sleep_hours: float, energy: int) -> float:
        """
        Calculates a composite well-being index (0-100) where 100 is optimal and < 40 indicates elevated distress.
        """
        mood_weights = {
            "great": 25,
            "good": 20,
            "okay": 15,
            "low": 8,
            "distressed": 2
        }
        mood_score = mood_weights.get(mood.lower(), 15)
        
        # Stress is 1 (low) to 10 (extreme). Inverse score:
        stress_score = max(0, 10 - stress) * 3.5  # up to 35 pts
        
        # Sleep: optimal is 7-9 hours.
        if 7.0 <= sleep_hours <= 9.0:
            sleep_score = 25
        elif 6.0 <= sleep_hours < 7.0 or 9.0 < sleep_hours <= 10.0:
            sleep_score = 18
        elif 4.5 <= sleep_hours < 6.0:
            sleep_score = 10
        else:
            sleep_score = 4
            
        # Energy: 1 to 10 scale (up to 15 pts)
        energy_score = (energy / 10.0) * 15.0
        
        total = mood_score + stress_score + sleep_score + energy_score
        return round(float(np.clip(total, 0, 100)), 1)

    @classmethod
    def evaluate_trend(cls, current_checkin: dict, history_checkins: list) -> dict:
        """
        Evaluates current checkin against recent history.
        Generates explainable factors, baseline variance, and flags for counsellor triage if needed.
        """
        stress = int(current_checkin.get("stress_level", 5))
        mood = str(current_checkin.get("mood", "okay"))
        sleep = float(current_checkin.get("sleep_hours", 7.0))
        energy = int(current_checkin.get("energy_level", 5))
        request_support = bool(current_checkin.get("request_support", False))
        
        current_composite = cls.calculate_checkin_score(mood, stress, sleep, energy)
        
        reasons = []
        requires_counsellor_review = False
        urgency = "low"  # "low", "moderate", "high", "urgent"
        
        # Explicit voluntary support request
        if request_support:
            reasons.append("Individual explicitly requested counsellor contact.")
            requires_counsellor_review = True
            urgency = "high"

        # Acute threshold check
        if stress >= 9:
            reasons.append(f"Elevated stress report ({stress}/10).")
            requires_counsellor_review = True
            urgency = max(urgency, "moderate", key=lambda x: ["low", "moderate", "high", "urgent"].index(x))
            
        if mood.lower() == "distressed":
            reasons.append("Reported acute emotional distress.")
            requires_counsellor_review = True
            urgency = "high"

        if sleep < 4.0:
            reasons.append(f"Severe sleep deficit reported ({sleep} hrs).")

        # Baseline comparison if historical records exist
        baseline_score = current_composite
        score_drop = 0.0
        
        if history_checkins and len(history_checkins) >= 3:
            df = pd.DataFrame(history_checkins)
            past_scores = []
            for _, row in df.iterrows():
                past_scores.append(cls.calculate_checkin_score(
                    row.get("mood", "okay"),
                    int(row.get("stress_level", 5)),
                    float(row.get("sleep_hours", 7.0)),
                    int(row.get("energy_level", 5))
                ))
            
            baseline_score = round(float(np.mean(past_scores)), 1)
            baseline_std = float(np.std(past_scores)) if len(past_scores) > 1 else 5.0
            score_drop = round(baseline_score - current_composite, 1)
            
            # Significant deviation from personal baseline (drop > 1.5 standard deviations or > 20 pts)
            if score_drop > 20.0 or (baseline_std > 0 and (score_drop / baseline_std) > 1.8):
                reasons.append(f"Well-being score dropped {score_drop} pts compared to personal historical baseline of {baseline_score}.")
                requires_counsellor_review = True
                urgency = max(urgency, "moderate", key=lambda x: ["low", "moderate", "high", "urgent"].index(x))
                
            # Consecutive low pattern check
            if len(past_scores) >= 2:
                last_two = past_scores[-2:]
                if all(s < 45 for s in last_two) and current_composite < 45:
                    reasons.append("Persistent emotional fatigue identified over 3 consecutive check-ins.")
                    requires_counsellor_review = True
                    urgency = "high"
        
        return {
            "current_score": current_composite,
            "baseline_score": baseline_score,
            "score_variance": score_drop,
            "requires_counsellor_review": requires_counsellor_review,
            "urgency": urgency,
            "explainable_factors": reasons if reasons else ["Well-being indices remain consistent with recent baseline."],
            "recommendation": (
                "Suggest gentle outreach or scheduled review."
                if requires_counsellor_review else
                "Routine monitoring; continue encouragement of healthy wellness practices."
            ),
            "generated_at": datetime.utcnow().isoformat()
        }
