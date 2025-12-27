from decision_engine import analyze_labels

labels = [
    {"description": "pothole", "score": 0.92},
    {"description": "road", "score": 0.88},
    {"description": "night", "score": 0.81}
]

result = analyze_labels(labels)
print(result)
