# Real-Time Railway Train Tracking Application

## **Project Overview**
This project is a real-time railway train tracking system that fetches and displays train data from any selected city using the IRCTC API via RapidAPI. It is built using **FastAPI** for the backend and **React.js** for the frontend, with real-time updates powered by **Celery** and **Redis**. The application is deployed in a **Kubernetes cluster** with continuous deployment using **Azure DevOps** and **ArgoCD**.

---
## **Project Architecture**

![Screenshot from 2025-03-10 22-32-11](https://github.com/user-attachments/assets/bf302ee1-7e7e-489e-85cb-daad90fef3b0)


---

## **Features**
- **User Login** (Basic login without authentication)
![Screenshot from 2025-03-10 12-51-20](https://github.com/user-attachments/assets/02bc1178-3500-4a06-aa17-5349a4cb15fd)

- **City Selection** (Choose a city to track trains)
  ![Screenshot from 2025-03-10 12-53-55](https://github.com/user-attachments/assets/80a4fb25-853c-4c76-a2eb-7882490c8dd7)

- **Station Selection** (Choose a station within the selected city)
  ![Screenshot from 2025-03-10 15-06-25](https://github.com/user-attachments/assets/8c04f191-550e-4fea-865d-f04fd4081550)

- **Train Tracking for Stations** (Fetch train schedules and live tracking for one day)
  ![Screenshot from 2025-03-10 15-08-06](https://github.com/user-attachments/assets/b6515598-2a9c-4a78-8e49-48ba4b7ff223)

- **Real-Time Updates** (Celery tasks update train positions every minute)
  ![Screenshot from 2025-03-10 15-10-09](https://github.com/user-attachments/assets/a297edf7-7c3e-46b5-b425-b0b45ddf96ff)

- **Database Storage** (PostgreSQL hosted on AWS)
- **Continuous Deployment** (CI/CD with Azure DevOps and Kubernetes)
- **Monitoring & Alerts** (Azure DevOps pipeline monitoring with alerts)

---

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


### **4. Setting Up CI/CD with Azure DevOps**


#### **Step 1: Azure DevOps Pipeline**
1. Push Code to **Azure DevOps Repository**.
![Screenshot from 2025-03-10 22-00-02](https://github.com/user-attachments/assets/4eec4cb9-1241-4cee-817d-9e66dff174f1)

2. Create a **Pipeline YAML file** to build and deploy the application.
3. Use **Azure Virtual Machine** as the build agent.
4.**Unit Tests** for API endpoints.
5.**Integration Tests** for database and API response validation.
   ![Screenshot from 2025-03-10 20-26-03](https://github.com/user-attachments/assets/61f494cb-576e-4c4b-823b-d568b5340086)

6. Push the Docker image to **Azure Container Registry**.
   ![Screenshot from 2025-03-10 22-09-23](https://github.com/user-attachments/assets/e7620a03-345b-45f7-87c1-57baae2d8f58)

   ![Screenshot from 2025-03-10 22-09-29](https://github.com/user-attachments/assets/1a48caf4-d76a-4623-9173-1cfce627dbf2)


### **5. Monitoring and Alerts in Azure DevOps**
- Track pipeline execution in Azure DevOps.
  ![Screenshot from 2025-03-10 22-11-55](https://github.com/user-attachments/assets/049b0eed-00cc-4dd3-8812-38bb73d241fa)

- Set up **alerts for failed jobs**.
![Screenshot from 2025-03-10 18-58-34](https://github.com/user-attachments/assets/3c1eeeaf-59db-4190-b6c2-e087f1d1611f)

- Notify through email or webhook when issues arise.
### **6. Deploying to Kubernetes with ArgoCD**
- Install **ArgoCD** on the Kubernetes cluster.
- Monitor the deployment file for changes.
- Auto-deploy updated images.
- Run **three pods**:
  - **Backend (FastAPI)**
  - **Frontend (React.js)**
  - **Redis**
![Screenshot from 2025-03-10 18-40-45](https://github.com/user-attachments/assets/33e55c64-c263-4158-b030-01e38b6cbe31)



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



