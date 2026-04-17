ITEM_MAP = {
    "phone": ["cell phone"],
    "bottle": ["bottle"],
    "bag": ["backpack", "handbag"],
    "wallet": ["handbag", "backpack"],
    "keys": []  # not supported in YOLO
}


def filter_detections(results, model, target_item=None):
    detections = []

    # if no filter → show all useful objects
    if target_item and target_item in ITEM_MAP:
        allowed = ITEM_MAP[target_item]
    else:
        allowed = None

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            label = model.names[cls]

            # filter logic
            if allowed is not None:
                if label not in allowed:
                    continue

            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = float(box.conf[0])

            detections.append({
                "label": label,
                "confidence": conf,
                "box": [x1, y1, x2, y2]
            })

    return detections