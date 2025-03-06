from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import http.client
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from celery import Celery
import smtplib
from email.mime.text import MIMEText
import logging
#from dotenv import load_dotenv
import os

#load_dotenv() 
# Configure logging
logging.basicConfig(level=logging.INFO)

# IRCTC API Configuration
# RAPIDAPI_HOST="irctc1.p.rapidapi.com"
# RAPIDAPI_KEY="1552b2426amsh9d5abe17a4d69bdp1b926fjsna77944dc19dc"
RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST")
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")


HEADERS = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": RAPIDAPI_HOST
}

# Database Configuration

DATABASE_URL = os.getenv("DATABASE_URL")
#DATABASE_URL="postgresql://postgres:jinkalikki@database-1.c6h8a6myaxt5.us-east-1.rds.amazonaws.com:5432/postgres"
# SMTP Email Configuration
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT")
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_RECEIVER = os.getenv("EMAIL_RECEIVER")
# SMTP_SERVER="smtp.gmail.com"
# SMTP_PORT="587"
# EMAIL_SENDER="bhanuprakash.v@sigmoidanalytics.com"
# EMAIL_PASSWORD="prsnwxkcembfedjx"
# EMAIL_RECEIVER="bhanuu1903@gmail.com"

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Initialize Celery
celery_app = Celery(
    "tasks",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0"
)

# Function to establish a database connection
def get_db():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

# Function to create a table dynamically based on city name
def create_table(city_name: str):
    table_name = city_name.lower().replace(" ", "_")
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(f'''
                CREATE TABLE IF NOT EXISTS {table_name} (
                    id SERIAL PRIMARY KEY,
                    name TEXT,
                    eng_name TEXT,
                    code TEXT UNIQUE,
                    state_name TEXT
                )
            ''')
            conn.commit()
    return table_name

# Fetch station details and store in database
@app.get("/fetch_and_store/{city_name}")
def fetch_and_store(city_name: str):
    conn = http.client.HTTPSConnection(RAPIDAPI_HOST)
    conn.request("GET", f"/api/v1/searchStation?query={city_name}", headers=HEADERS)
    res = conn.getresponse()
    data = json.loads(res.read().decode("utf-8"))
    
    if data.get("status"):
        table_name = create_table(city_name)
        with get_db() as db_conn:
            with db_conn.cursor() as cur:
                for station in data["data"]:
                    cur.execute(f'''
                        INSERT INTO {table_name} (name, eng_name, code, state_name)
                        VALUES (%s, %s, %s, %s) 
                        ON CONFLICT (code) DO NOTHING
                    ''', (station["name"], station["eng_name"], station["code"], station["state_name"]))
            db_conn.commit()
        return {"message": f"Data stored successfully in {table_name}"}
    
    return {"error": "Failed to fetch data"}

# List all tables in the database
@app.get("/tables")
def list_tables():
    with get_db() as db_conn:
        with db_conn.cursor() as cur:
            cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
            tables = cur.fetchall()
    return {"tables": [table['table_name'] for table in tables]}

# Get station data from a specific table
@app.get("/table/{table_name}")
def get_table_data(table_name: str):
    with get_db() as db_conn:
        with db_conn.cursor() as cur:
            cur.execute(f"SELECT name, code, state_name FROM {table_name}")
            data = cur.fetchall()
    return {"data": data}

# Function to send email notification
def send_email(subject, body):
    try:
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = EMAIL_SENDER
        msg["To"] = EMAIL_RECEIVER

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_string())
        
        logging.info("Email sent successfully!")
    except Exception as e:
        logging.error(f"Error sending email: {str(e)}")

# Celery Task: Fetch train details for Goa stations every 10 minutes
@celery_app.task
def fetch_trains_for_goa_stations():
    try:
        logging.info("Starting Celery task: Fetching train details for Goa stations...")

        with get_db() as db_conn:
            with db_conn.cursor() as cur:
                cur.execute("SELECT code FROM goa")
                stations = cur.fetchall()

        for station in stations:
            station_code = station["code"]
            conn = http.client.HTTPSConnection(RAPIDAPI_HOST)
            conn.request("GET", f"/api/v3/getTrainsByStation?stationCode={station_code}", headers=HEADERS)
            res = conn.getresponse()
            data = json.loads(res.read().decode("utf-8"))

            if data.get("status"):
                table_name = f"trains_{station_code.lower()}"
                
                with get_db() as db_conn:
                    with db_conn.cursor() as cur:
                        cur.execute(f"DROP TABLE IF EXISTS {table_name}")

                        cur.execute(f'''
                            CREATE TABLE {table_name} (
                                id SERIAL PRIMARY KEY,
                                train_no TEXT UNIQUE,
                                train_name TEXT,
                                arrival_time TEXT,
                                departure_time TEXT,
                                classes TEXT
                            )
                        ''')

                        for train in data["data"]["passing"]:
                            cur.execute(f'''
                                INSERT INTO {table_name} (train_no, train_name, arrival_time, departure_time, classes)
                                VALUES (%s, %s, %s, %s, %s)
                                ON CONFLICT (train_no) DO NOTHING
                            ''', (train["trainNo"], train["trainName"], train["arrivalTime"], train["departureTime"], ','.join(train["classes"])))
                    db_conn.commit()

        send_email("Train Data Updated", "Old train data deleted and new data has been added successfully.")
        logging.info("Celery Task Completed: Train data updated successfully!")
        return "Train data updated successfully for all Goa stations"
    except Exception as e:
        logging.error(f"Error in Celery Task: {str(e)}")
        return str(e)

# API Endpoint to manually trigger the task
@app.get("/trigger_train_update")
def trigger_train_update():
    logging.info("Triggering Celery task: fetch_trains_for_goa_stations")
    fetch_trains_for_goa_stations.delay()
    return {"message": "Train update task has been scheduled"}

# Celery Beat Schedule (Every 10 minutes)
celery_app.conf.beat_schedule = {
    "fetch-trains-every-10-minutes": {
        "task": "main.fetch_trains_for_goa_stations",
        "schedule": 60.0,  # 10 minutes
    },
}

celery_app.conf.timezone = "UTC"

# Get train data from a specific station table
@app.get("/get_trains/{station_code}")
def get_trains_by_station(station_code: str):
    table_name = f"trains_{station_code.lower()}"
    try:
        with get_db() as db_conn:
            with db_conn.cursor() as cur:
                cur.execute(f"SELECT train_no, train_name, arrival_time, departure_time, classes FROM {table_name}")
                data = cur.fetchall()
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data for station {station_code}: {str(e)}")



from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class Station(BaseModel):
    si_no: int
    station_code: str
    station_name: str
    distance_from_source: int
    sta: str
    std: str
    eta: str
    etd: str
    halt: int
    arrival_delay: int
    platform_number: int
    stoppage_number: int


class FilteredTrainStatus(BaseModel):
    train_number: str
    train_name: str
    source: str
    destination: str
    source_stn_name: str
    dest_stn_name: str
    current_station_code: str
    current_station_name: str
    status: str
    platform_number: int
    upcoming_stations: List[Station] = []
    previous_stations: List[Station] = []


@app.get("/live-train-status/")
def get_live_train_status(train_no: str, start_day: int = 1):
    """
    Fetch live train status using the train number and filter the relevant data.
    If no upcoming stations are available, it uses `next_station_code` and `next_station_name`.
    """
    try:
        conn = http.client.HTTPSConnection(RAPIDAPI_HOST)
        headers = {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": RAPIDAPI_HOST
        }
        endpoint = f"/api/v1/liveTrainStatus?trainNo={train_no}&startDay={start_day}"
        conn.request("GET", endpoint, headers=headers)

        res = conn.getresponse()
        raw_data = res.read().decode("utf-8")
        full_response = json.loads(raw_data)

        if not full_response.get("status") or not full_response.get("data"):
            raise HTTPException(status_code=404, detail="Train data not found")

        train_data = full_response["data"]

        filtered_data = {
            "train_number": train_data.get("train_number", ""),
            "train_name": train_data.get("train_name", ""),
            "source": train_data.get("source", ""),
            "destination": train_data.get("destination", ""),
            "source_stn_name": train_data.get("source_stn_name", ""),
            "dest_stn_name": train_data.get("dest_stn_name", ""),
            "current_station_code": train_data.get("current_station_code", ""),
            "current_station_name": train_data.get("current_station_name", ""),
            "status": train_data.get("status", ""),
            "platform_number": train_data.get("platform_number", 0),
            "upcoming_stations": [],
            "previous_stations": []
        }

        # Process previous stations
        if "previous_stations" in train_data:
            filtered_previous_stations = [
                {
                    "si_no": station.get("si_no", 0),
                    "station_code": station.get("station_code", ""),
                    "station_name": station.get("station_name", ""),
                    "distance_from_source": station.get("distance_from_source", 0),
                    "sta": station.get("sta", ""),
                    "std": station.get("std", ""),
                    "eta": station.get("eta", ""),
                    "etd": station.get("etd", ""),
                    "halt": station.get("halt", 0),
                    "arrival_delay": station.get("arrival_delay", 0),
                    "platform_number": station.get("platform_number", 0),
                    "stoppage_number": station.get("stoppage_number", 0)
                }
                for station in train_data["previous_stations"]
            ]
            filtered_data["previous_stations"] = filtered_previous_stations

        # Process upcoming stations
        if "upcoming_stations" in train_data and train_data["upcoming_stations"]:
            filtered_upcoming_stations = [
                {
                    "si_no": station.get("si_no", 0),
                    "station_code": station.get("station_code", ""),
                    "station_name": station.get("station_name", ""),
                    "distance_from_source": station.get("distance_from_source", 0),
                    "sta": station.get("sta", ""),
                    "std": station.get("std", ""),
                    "eta": station.get("eta", ""),
                    "etd": station.get("etd", ""),
                    "halt": station.get("halt", 0),
                    "arrival_delay": station.get("arrival_delay", 0),
                    "platform_number": station.get("platform_number", 0),
                    "stoppage_number": station.get("stoppage_number", 0)
                }
                for station in train_data["upcoming_stations"]
            ]
            filtered_data["upcoming_stations"] = filtered_upcoming_stations
        else:
            # If upcoming stations are empty, use next_station_code and next_station_name
            next_station_code = train_data.get("next_station_code", "")
            next_station_name = train_data.get("next_station_name", "")
            if next_station_code and next_station_name:
                filtered_data["upcoming_stations"] = [
                    {
                        "si_no": 0,  # Default value
                        "station_code": next_station_code,
                        "station_name": next_station_name,
                        "distance_from_source": 0,  # Unknown
                        "sta": "",  # Unknown
                        "std": "",  # Unknown
                        "eta": "",  # Unknown
                        "etd": "",  # Unknown
                        "halt": 0,  # Unknown
                        "arrival_delay": 0,  # Unknown
                        "platform_number": 0,  # Unknown
                        "stoppage_number": 0  # Unknown
                    }
                ]

        return {"status": "success", "data": filtered_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health_check():
    return {"status": "ok"}