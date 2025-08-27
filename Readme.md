# 🍔 FastFood Dixel — Monorepo (Frontend + Backend + K8s)

ระบบตัวอย่างสำหรับร้านฟาสต์ฟู้ด ประกอบด้วย **Frontend (React + Vite)**, **Backend (Node.js + Express + MongoDB/Mongoose)**, รองรับ **Docker/Kubernetes** และ **CI/CD (GitHub Actions)**

---

## 🧭 โครงสร้างโปรเจกต์

fastfood-dixel-main/
├─ Dockerfile
├─ src/                # backend แบบ monolithic
├─ frontend/           # React + Vite + TS
├─ backend/            # backend แบบโมดูลาร์
├─ k8s/                # manifests สำหรับ K8s
└─ .github/workflows/  # GitHub Actions CI/CD

---

## 🛠️ เทคโนโลยีหลัก
- **Frontend:** React + Vite + TypeScript  
- **Backend:** Node.js + Express, Mongoose (MongoDB)  
- **Infra:** Docker, Kubernetes (Deployment/Service/HPA), GitHub Actions  

---

## ⚡ การใช้งาน

### 1) Backend
```bash
cd backend
npm install
npm run dev   # ใช้ nodemon
```

ค่าเริ่มต้น:  
- API → http://localhost:3000  
- MongoDB → mongodb://localhost:27017/fastfood  

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

ค่าเริ่มต้น: http://localhost:5173

### 3) Docker
```bash
docker build -t fastfood-backend .
docker run -p 3000:3000 -e MONGO_URL="mongodb://host.docker.internal:27017/fastfood" fastfood-backend
```

### 4) Kubernetes
```bash
kubectl apply -f k8s/mongodb.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/hpa.yaml
```

---

## 🔌 API ที่มี
- POST /order — สร้างคำสั่งซื้อ  
- GET /orders — ดูคำสั่งซื้อทั้งหมด  
- POST /api/purchases — บันทึกการสั่งซื้อ (หลายรายการ)  
- GET /api/purchases/:userId — ประวัติการซื้อ  

---

## 🔁 CI/CD
Workflow (.github/workflows/ci-cd.yml) จะ build & push Docker image และ deploy ไปยัง Kubernetes cluster อัตโนมัติ  

---

## 🧰 Known Issues
- backend/server.js → import ของ purchaseRoutes ไม่ถูกต้อง ควรแก้เป็น ./purchaseRoutes.js  
- backend/db.js → ยัง fix ค่า Mongo URL ควรใช้ .env  
- k8s/backend.yaml → MongoDB service name ต้องแก้เป็น mongodb  
- Dockerfile → ต้องตรวจสอบให้ตรงกับ scripts/dependencies ของ root  

---

## 📄 License
ยังไม่พบไฟล์ LICENSE — แนะนำเพิ่ม MIT หรือ Apache-2.0  

---

## 📊 Load Testing
เราใช้สคริปต์ `loadtest/loadtest.js` สำหรับยิงโหลดไปยัง Backend

```bash
cd loadtest
node loadtest.js
```

การทดสอบนี้จะจำลองการสั่งซื้อพร้อมกันหลายครั้ง เพื่อตรวจสอบพฤติกรรมการ scaling ของระบบ  
**ผลลัพธ์:** เมื่อโหลดเพิ่มขึ้น HPA สามารถเพิ่มจำนวน Pod ของ backend ได้อัตโนมัติ

---

## 📈 Results
- ✅ Deployment สำเร็จบน Kubernetes cluster  
- ✅ GitHub Actions Pipeline ทำงานครบ (Build → Push → Deploy)  
- ✅ Load Test สามารถ trigger การทำงานของ HPA  
- ✅ ระบบ Auto-scaling เพิ่มจำนวน Pod ของ backend ได้ตามโหลด  
