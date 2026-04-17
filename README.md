
# 🔍 NeuralEngine – Lost Item Finder

A real-time AI-powered web application that helps detect and locate everyday lost items (like keys, phone, wallet, etc.) using a webcam. It uses a pre-trained YOLO model for object detection and a React/Next.js frontend for live visualization.

---

## ✨ Features

* 🎥 Real-time webcam object detection
* 🧠 YOLOv8 pre-trained model integration
* 📦 Detects common objects (phone, keys, wallet, etc.)
* 🌐 Modern web interface (React / Next.js)
* ⚡ Fast backend with FastAPI
* 🔄 Live WebSocket frame streaming

---

## 🛠️ Tech Stack

### Backend

* Python 
* FastAPI
* OpenCV
* Ultralytics YOLOv8
* NumPy
* WebSockets

### Frontend

* React / Next.js
* JavaScript (ES6+)
* HTML5 Webcam API
* Tailwind CSS (optional)

---

## 🧠 How It Works

1. Webcam captures live video
2. Frames are sent to backend via WebSocket
3. YOLO model processes each frame
4. Objects are detected and labeled
5. Processed frames are sent back
6. UI displays real-time detection

---

## 🏗️ Project Architecture

```
Webcam (Frontend)
      ↓
React / Next.js UI
      ↓ (WebSocket)
FastAPI Backend
      ↓
YOLOv8 Model
      ↓
Processed Frames + Labels
      ↓
Frontend Display
```

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/FaizaNaseem34/NeuralEngine-Lost-item-Finder.git
cd NeuralEngine-Lost-item-Finder
```

---

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Run server:

```bash
uvicorn main:app --reload
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Requirements

Create `requirements.txt`:

```
fastapi
uvicorn
opencv-python
numpy
ultralytics
python-multipart
```

---

## 📸 Use Cases

* Finding lost keys 🔑
* Detecting phone on desk 📱
* Locating wallet 💼
* Smart object tracking system

---

## 🔮 Future Improvements

* Custom-trained dataset (keys, remotes, etc.)
* Mobile camera support
* Alert notifications when item is found
* Cloud deployment
* Improved tracking (DeepSORT / ByteTrack)

---

## 👩‍💻 Author

**Faiza Naseem**

GitHub:
👉 [https://github.com/FaizaNaseem34](https://github.com/FaizaNaseem34)

---

## 📄 License

This project is open-source and available under the MIT License.

---

