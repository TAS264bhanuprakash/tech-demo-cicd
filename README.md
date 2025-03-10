# Real-Time Railway Train Tracking Application

## **Project Overview**
This project is a real-time railway train tracking system that fetches and displays train data from any selected city using the IRCTC API via RapidAPI. It is built using **FastAPI** for the backend and **React.js** for the frontend, with real-time updates powered by **Celery** and **Redis**. The application is deployed in a **Kubernetes cluster** with continuous deployment using **Azure DevOps** and **ArgoCD**.

---
![Screenshot from 2025-03-10 10-44-28](https://github.com/user-attachments/assets/5ab7c005-8db8-4997-88d0-95b06e345408)

---

## **Features**
- **User Login** (Basic login without authentication)
- **City Selection** (Choose a city to track trains)
- **Station Selection** (Choose a station within the selected city)
- **Train Tracking** (Fetch train schedules and live tracking for one day)
- **Real-Time Updates** (Celery tasks update train positions every minute)
- **Database Storage** (PostgreSQL hosted on AWS)
- **Continuous Deployment** (CI/CD with Azure DevOps and Kubernetes)
- **Monitoring & Alerts** (Azure DevOps pipeline monitoring with alerts)

---

## **Project Architecture**

### **Backend - FastAPI**
- Developed using **FastAPI**
- Uses **IRCTC API (RapidAPI)** for fetching train data
- Stores data in **PostgreSQL (AWS RDS)**
- Implements **Celery** for background tasks
- Uses **Redis** as a message broker

### **Frontend - React.js**
- User interface for city, station, and train selection
- Displays real-time train tracking information
- Fetches data from the backend API

### **Celery for Real-Time Updates**
- Fetches real-time train data every minute
- Uses **Redis** as a message queue

### **CI/CD Pipeline - Azure DevOps**
- **GitHub Actions** for unit and integration tests
- **Azure DevOps Pipeline** for automated builds and deployments
- **Azure Virtual Machine** as an agent to run pipelines
- **Azure Container Registry (ACR)** to store Docker images

### **Kubernetes Deployment**
- Uses **ArgoCD** for continuous deployment
- Deploys to a **Kubernetes cluster**
- Pods for:
  - **Backend (FastAPI)**
  - **Frontend (React.js)**
  - **Redis (Celery message broker)**

### **Monitoring & Alerts**
- **Azure DevOps monitoring** for pipeline execution
- **Automated alerts** for pipeline failures
- **ArgoCD** continuously monitors deployments for changes

---

## **Step-by-Step Implementation**

### **1. Setting Up the Backend (FastAPI)**
- Install required dependencies.
- Implement API endpoints:
  - **City Selection API**
  - **Station Selection API**
  - **Train Tracking API**
  - **Real-Time Updates API (Celery)**
- Configure **Celery** with Redis.
- Store data in **PostgreSQL (AWS RDS)**

### **2. Setting Up the Frontend (React.js)**
- Install dependencies and create the project.
- Develop UI for city, station, and train selection.
- Fetch and display train data from the backend.

### **3. Implementing Real-Time Updates with Celery & Redis**
- Fetch train data every minute using Celery.
- Store updates in **PostgreSQL**.
- Use **WebSockets or API polling** to update the frontend.

### **4. Setting Up CI/CD with Azure DevOps**
#### **Step 1: Configure GitHub Actions for Testing**
- Implement **Unit Tests** for API endpoints.
- Implement **Integration Tests** for database and API response validation.

#### **Step 2: Azure DevOps Pipeline**
1. Clone the GitHub repository to **Azure DevOps Repository**.
2. Create a **Pipeline YAML file** to build and deploy the application.
3. Use **Azure Virtual Machine** as the build agent.
4. Push the Docker image to **Azure Container Registry**.

### **5. Deploying to Kubernetes with ArgoCD**
- Install **ArgoCD** on the Kubernetes cluster.
- Monitor the deployment file for changes.
- Auto-deploy updated images.
- Run **three pods**:
  - **Backend (FastAPI)**
  - **Frontend (React.js)**
  - **Redis**

### **6. Monitoring and Alerts in Azure DevOps**
- Track pipeline execution in Azure DevOps.
- Set up **alerts for failed jobs**.
- Notify through email or webhook when issues arise.

---

## **Final Deployment**
1. **Commit changes** to GitHub.
2. **CI/CD pipeline triggers**.
3. **Build and push Docker images**.
4. **Update Kubernetes deployment file**.
5. **ArgoCD automatically deploys changes**.

---

## **Conclusion**
This real-time railway tracking application provides live updates on train movements in selected cities, leveraging a robust backend, real-time processing, and cloud-based deployment with Kubernetes. With continuous integration and monitoring, the system ensures reliability and efficiency.

---

## **Future Enhancements**
- Implement **OAuth authentication** for secure login.
- Improve **WebSocket integration** for real-time updates.
- Add **Sonarqube** for Code quality analysis .



