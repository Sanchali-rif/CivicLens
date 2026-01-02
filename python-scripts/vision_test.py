import json
import sys
import os
from google.cloud import vision
from decision_engine import decide_priority


def get_labels(image_path):
    client = vision.ImageAnnotatorClient()

    with open(image_path, "rb") as img:
        content = img.read()

    image = vision.Image(content=content)
    response = client.label_detection(image=image)

    labels = []
    for label in response.label_annotations:
        labels.append((label.description.lower(), round(label.score, 2)))

    return labels


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing image path"}))
        sys.exit(1)

    image_path = sys.argv[1]

    labels = get_labels(image_path)
    decision = decide_priority(labels)

    output = {
        **decision,
        "detected_labels": [l[0] for l in labels],
        "ai_metadata": {
            "model": "Google Vision API",
            "decision_engine": "CivicLens Unified Logic v1.0"
        }
    }

    print(json.dumps(output))
