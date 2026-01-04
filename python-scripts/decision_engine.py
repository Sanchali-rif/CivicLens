def decide_priority(detected_labels):
    """
    detected_labels: list of tuples -> [(label_name, confidence), ...]
    """

    
    label_scores = {name.lower(): score for name, score in detected_labels}
    label_names = set(label_scores.keys())
    max_confidence = round(max(label_scores.values()), 2) if label_scores else 0.0

    

    NIGHT_CONTEXT = {
        "night", "darkness", "midnight", "low light",
        "street light", "security lighting", "lighting",
        "electricity", "lens flare"
    }

    PUBLIC_CONTEXT = {
        "road", "street", "highway", "bridge", "junction",
        "pavement", "sidewalk", "asphalt", "tar", "concrete",
        "road surface", "path", "trail",
        "manhole", "storm drain", "sewer"
    }

    PRIVATE_CONTEXT = {
        "selfie", "face", "person", "bedroom", "kitchen",
        "interior", "food", "pet", "animal", "toy",
        "furniture", "plate", "cup"
    }

    HIGH_PRIORITY = {
        "pothole", "sinkhole", "road collapse",
        "flood", "flooding", "waterlogging", "puddle",
        "landslide", "mudslide", "erosion",
        "fallen tree", "tree", "branch",
        "traffic collision", "accident", "crash",
        "fire", "explosion",
        "earthquake", "rubble", "building collapse",
        "electric pole fallen", "live wire"
    }

    MEDIUM_PRIORITY = {
        "garbage", "waste", "trash", "litter",
        "sewage", "drain", "storm drain",
        "blocked drain", "sewer",
        "construction debris", "debris", "scrap",
        "broken street light", "street light broken",
        "electric pole damaged",
        "fallen signboard"
    }

    LOW_PRIORITY = {
        "graffiti", "poster", "wall writing",
        "muddy road", "mud", "dust",
        "minor crack", "pavement crack",
        "uneven pavement", "peeling paint"
    }

    NATURAL_SCENERY = {
        "mountain", "hill", "valley", "forest",
        "highland", "rural area", "soil",
        "geological phenomenon"
    }

   

    
    if label_names & PRIVATE_CONTEXT and not (label_names & PUBLIC_CONTEXT):
        return _reject("Private or irrelevant image", label_names)

   
    if (
        label_names & NATURAL_SCENERY
        and not (
            label_names & HIGH_PRIORITY
            or label_names & MEDIUM_PRIORITY
            or label_names & LOW_PRIORITY
            or label_names & PUBLIC_CONTEXT
        )
    ):
        return _reject("Natural landscape without civic issue", label_names)

    

   
    if label_names & HIGH_PRIORITY:
        return _accept(
            "Public Safety Hazard",
            "HIGH",
            "Life-threatening or critical public safety issue detected",
            label_names,
            max_confidence
        )

   
    if label_names & MEDIUM_PRIORITY:
        return _accept(
            "Civic Infrastructure / Sanitation Issue",
            "MEDIUM",
            "Public infrastructure or sanitation issue detected",
            label_names,
            max_confidence
        )

   
    if label_names & LOW_PRIORITY:
        return _accept(
            "Minor Civic Issue",
            "LOW",
            "Non-urgent civic issue detected",
            label_names,
            max_confidence
        )

   
    if label_names & PUBLIC_CONTEXT:
        return _accept(
            "Road Infrastructure Issue",
            "MEDIUM",
            "Road-related public infrastructure issue detected",
            label_names,
            max_confidence
        )

    
    return _reject(
        "No actionable public infrastructure issue detected",
        label_names
    )




def _accept(issue_type, priority, reason, detected_labels, confidence):
    return {
        "status": "ACCEPTED",
        "issue_type": issue_type,
        "priority": priority,
        "confidence": confidence,
        "reason": reason,
        "detected_labels": sorted(list(detected_labels))
    }


def _reject(reason, detected_labels):
    return {
        "status": "REJECTED",
        "issue_type": None,
        "priority": None,
        "confidence": 0.0,
        "reason": reason,
        "detected_labels": list(detected_labels)
    }
