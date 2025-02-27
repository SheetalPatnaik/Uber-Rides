# 🚖 Uber Simulation Project  

## 📌 Overview  
This project is a **full-stack simulation of a ride-sharing platform** with core functionalities like **ride booking, driver management, billing, and real-time notifications**. It is built with **Django (backend) and React.js (frontend)** and leverages **Docker, Kubernetes, Redis, and WebSockets** for scalability and efficiency.  

This project demonstrates expertise in **microservices architecture, real-time communication, cloud deployment, and system orchestration**, making it highly relevant for roles in **backend engineering, cloud computing, and DevOps**.  

---

## 🎯 Features  
✔ **Customer & Driver Management** – Registration, login, and profile updates.  
✔ **Real-Time Ride Booking** – Instant ride allocation and status updates.  
✔ **WebSockets for Notifications** – Live ride status updates for drivers & customers.  
✔ **Automated Billing System** – Dynamic fare calculation and payment tracking.  
✔ **Redis Caching** – Optimized session storage & fast access to frequently used data.  
✔ **Docker & Kubernetes Integration** – Containerized deployment and orchestration.  

---


## Table of Contents
1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Setup Instructions](#setup-instructions)
4. [Docker Setup](#docker-setup)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Minikube Setup](#minikube-setup)
7. [Testing](#testing)
8. [Contributing](#contributing)


---

## Technology Stack
- **Backend**: Django, Django REST Framework
- **Frontend**: React.js
- **Database**: MySQL
- **Caching**: Redis
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Testing**: Postman, JMeter

---

## Setup Instructions

### Prerequisites
1. Install [Docker](https://www.docker.com/).
2. Install [Kubernetes CLI (kubectl)](https://kubernetes.io/docs/tasks/tools/).
3. Install [Minikube](https://minikube.sigs.k8s.io/docs/start/).
4. Install [Python 3.9+](https://www.python.org/).
5. Install [Node.js and npm](https://nodejs.org/).
6. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/uber-simulation.git
   cd uber-simulation
   ```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## Docker Setup

### Build Docker Images
1. Build the backend image:
   ```bash
   cd backend
   docker build -t uber-backend .
   ```
2. Build the frontend image:
   ```bash
   cd frontend
   docker build -t uber-frontend .
   ```

### Run Docker Containers
1. Start the MySQL and Redis containers:
   ```bash
   docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=uber_db -p 3306:3306 -d mysql:latest
   docker run --name redis-container -p 6379:6379 -d redis:latest
   ```
2. Run the backend container:
   ```bash
   docker run --name backend-container --link mysql-container --link redis-container -p 8000:8000 uber-backend
   ```
3. Run the frontend container:
   ```bash
   docker run --name frontend-container -p 3000:3000 uber-frontend
   ```

---

## Kubernetes Deployment

### Prerequisites
- Ensure `kubectl` is configured.
- Ensure a Kubernetes cluster is running.

### Create Kubernetes Manifests
1. Create a namespace:
   ```bash
   kubectl create namespace uber
   ```
2. Apply MySQL and Redis manifests:
   ```bash
   kubectl apply -f k8s/mysql-pv.yaml
   kubectl apply -f k8s/redis-deployment.yaml
   ```
3. Apply backend and frontend deployments:
   ```bash
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/frontend-deployment.yaml
   ```

### Verify Deployment
```bash
kubectl get pods -n uber
kubectl get services -n uber
```

---

## Minikube Setup

### Start Minikube
```bash
minikube start
```

### Deploy Application
1. Use Minikube to deploy the application:
   ```bash
   kubectl apply -f k8s/mysql-pv.yaml
   kubectl apply -f k8s/redis-deployment.yaml
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/frontend-deployment.yaml
   ```
2. Expose services using Minikube:
   ```bash
   minikube service backend-service -n uber
   minikube service frontend-service -n uber
   ```

---

## Testing

1. Use [Postman](https://www.postman.com/) for testing API endpoints.
2. Use [JMeter](https://jmeter.apache.org/) for load testing (e.g., simulate 100 users booking rides simultaneously).

---

## Contributing

Feel free to contribute by creating issues or submitting pull requests. For major changes, please discuss with the project maintainers first.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
