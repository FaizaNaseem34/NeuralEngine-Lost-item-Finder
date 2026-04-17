from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import numpy as np
import cv2
import base64

# -------------------------
# App setup
# -------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Load YOLO model
# -------------------------
model = YOLO("yolov8n.pt")


# -------------------------
# Extract ALL detections
# -------------------------
def extract_detections(results):
    detections = []

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            label = model.names[cls]
            conf = float(box.conf[0])

            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append({
                "label": label,
                "confidence": conf,
                "box": [x1, y1, x2, y2]
            })

    return detections


# -------------------------
# WebSocket endpoint
# -------------------------
@app.websocket("/ws/detect")
async def ws_detect(websocket: WebSocket):
    await websocket.accept()
    print("✅ Client connected")

    try:
        while True:
            data = await websocket.receive_json()

            image = data.get("image")
            if not image:
                continue

            # -------------------------
            # Decode base64 image
            # -------------------------
            img_str = image.split(",")[1]
            img_bytes = base64.b64decode(img_str)

            np_arr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                continue

            # -------------------------
            # YOLO inference
            # -------------------------
            results = model(frame)

            detections = extract_detections(results)

            # -------------------------
            # Send back results
            # -------------------------
            await websocket.send_json({
                "detections": detections
            })

    except WebSocketDisconnect:
        print("❌ Client disconnected")