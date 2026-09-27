import json
import os
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

# Initialize FastAPI App
app = FastAPI(
    title="KashiHolidays API",
    description="Backend service for KashiHolidays Cab & Tour Booking System in Varanasi",
    version="1.0.0"
)

# Enable CORS for local and web requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File Paths for Persistent Data
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
BOOKINGS_FILE = os.path.join(DATA_DIR, "bookings.json")

os.makedirs(DATA_DIR, exist_ok=True)
if not os.path.exists(BOOKINGS_FILE):
    with open(BOOKINGS_FILE, "w", encoding="utf-8") as f:
        json.dump([], f)


# --- Pydantic Data Schemas ---

class BookingRequest(BaseModel):
    service_type: str = Field(..., description="Service Type: One Way, Round Trip, Local, Airport")
    pickup_location: str = Field(..., description="Pickup address or landmark")
    drop_location: str = Field(..., description="Destination / drop location")
    pickup_datetime: str = Field(..., description="Pickup date and time string")
    vehicle: str = Field(..., description="Selected vehicle (Sedan, SUV, Innova Crysta, Tempo Traveller)")
    name: str = Field(..., description="Customer full name")
    phone: str = Field(..., description="10-digit mobile number for WhatsApp contact")
    notes: Optional[str] = Field(None, description="Additional customer notes or requests")


class BookingResponse(BaseModel):
    id: str
    service_type: str
    pickup_location: str
    drop_location: str
    pickup_datetime: str
    vehicle: str
    name: str
    phone: str
    status: str
    estimated_fare: str
    created_at: str
    whatsapp_link: str


class CabPackage(BaseModel):
    id: str
    name: str
    category: str
    tagline: str
    seating_capacity: str
    starting_rate: str
    image_url: str
    features: List[str]


class Testimonial(BaseModel):
    id: int
    name: str
    role: str
    comment: str
    rating: int
    created_at: Optional[str] = None


class TestimonialCreate(BaseModel):
    name: str = Field(..., min_length=2, description="Customer full name")
    role: Optional[str] = Field("Verified Traveler", description="Trip category or city (e.g. Family Tour - Delhi)")
    comment: str = Field(..., min_length=5, description="Review comment text")
    rating: Optional[int] = Field(5, ge=1, le=5, description="Star rating between 1 and 5")


# --- Database Helper Functions ---

def load_testimonials() -> list:
    try:
        with open(TESTIMONIALS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_testimonials(testimonials: list):
    with open(TESTIMONIALS_FILE, "w", encoding="utf-8") as f:
        json.dump(testimonials, f, indent=2, ensure_ascii=False)


# --- Testimonials / User Reviews Routes ---

@app.get("/api/testimonials", response_model=List[Testimonial], summary="Get Traveler Reviews")
def get_testimonials():
    return load_testimonials()


@app.post("/api/testimonials", response_model=Testimonial, status_code=status.HTTP_201_CREATED, summary="Add Real Customer Review")
def add_testimonial(review: TestimonialCreate):
    testimonials = load_testimonials()
    new_id = max([t.get("id", 0) for t in testimonials], default=0) + 1
    created_time = datetime.now().strftime("%b %d, %Y")
    new_review = {
        "id": new_id,
        "name": review.name.strip(),
        "role": review.role.strip() if review.role else "Verified Traveler",
        "comment": review.comment.strip(),
        "rating": min(max(review.rating or 5, 1), 5),
        "created_at": created_time
    }
    testimonials.insert(0, new_review)
    save_testimonials(testimonials)
    return new_review


@app.delete("/api/testimonials/{review_id}", summary="Delete Customer Review")
def delete_testimonial(review_id: int):
    testimonials = load_testimonials()
    updated = [t for t in testimonials if t.get("id") != review_id]
    if len(updated) == len(testimonials):
        raise HTTPException(status_code=404, detail=f"Review ID {review_id} not found")
    save_testimonials(updated)
    return {"message": f"Review {review_id} deleted successfully"}

def load_bookings() -> list:
    try:
        with open(BOOKINGS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_bookings(bookings: list):
    with open(BOOKINGS_FILE, "w", encoding="utf-8") as f:
        json.dump(bookings, f, indent=2, ensure_ascii=False)


def calculate_estimated_fare(vehicle: str, service_type: str) -> str:
    vehicle_lower = vehicle.lower()
    if "sedan" in vehicle_lower or "dzire" in vehicle_lower:
        return "₹899"
    elif "suv" in vehicle_lower or "ertiga" in vehicle_lower:
        return "₹1,399"
    elif "innova" in vehicle_lower:
        return "₹1,899"
    elif "tempo" in vehicle_lower:
        return "₹2,999"
    return "₹999"


# --- API Routes ---

@app.get("/api/health", summary="Health Check")
def health_check():
    return {
        "status": "healthy",
        "service": "KashiHolidays FastAPI Backend",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED, summary="Create Cab Booking")
def create_booking(booking: BookingRequest):
    booking_id = f"KH-{uuid.uuid4().hex[:6].upper()}"
    fare = calculate_estimated_fare(booking.vehicle, booking.service_type)
    created_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    wa_msg = (
        f"Hi KashiHolidays, I want to confirm booking {booking_id}:\n"
        f"• Service: {booking.service_type}\n"
        f"• From: {booking.pickup_location}\n"
        f"• To: {booking.drop_location}\n"
        f"• Date/Time: {booking.pickup_datetime}\n"
        f"• Vehicle: {booking.vehicle}\n"
        f"• Name: {booking.name}\n"
        f"• Phone: {booking.phone}"
    )
    import urllib.parse
    wa_url = f"https://wa.me/918858852339?text={urllib.parse.quote(wa_msg)}"

    new_booking = {
        "id": booking_id,
        "service_type": booking.service_type,
        "pickup_location": booking.pickup_location,
        "drop_location": booking.drop_location,
        "pickup_datetime": booking.pickup_datetime,
        "vehicle": booking.vehicle,
        "name": booking.name,
        "phone": booking.phone,
        "status": "CONFIRMED",
        "estimated_fare": fare,
        "created_at": created_time,
        "whatsapp_link": wa_url
    }

    bookings = load_bookings()
    bookings.insert(0, new_booking)
    save_bookings(bookings)

    return new_booking


@app.get("/api/bookings", response_model=List[BookingResponse], summary="List All Bookings")
def list_bookings(phone: Optional[str] = Query(None, description="Filter by customer phone number")):
    bookings = load_bookings()
    if phone:
        bookings = [b for b in bookings if phone in b.get("phone", "")]
    return bookings


@app.get("/api/bookings/{booking_id}", response_model=BookingResponse, summary="Get Single Booking Details")
def get_booking(booking_id: str):
    bookings = load_bookings()
    for b in bookings:
        if b["id"].upper() == booking_id.upper():
            return b
    raise HTTPException(status_code=404, detail=f"Booking {booking_id} not found")


@app.delete("/api/bookings/{booking_id}", summary="Cancel Booking")
def cancel_booking(booking_id: str):
    bookings = load_bookings()
    updated = [b for b in bookings if b["id"].upper() != booking_id.upper()]
    if len(updated) == len(bookings):
        raise HTTPException(status_code=404, detail=f"Booking {booking_id} not found")
    save_bookings(updated)
    return {"message": f"Booking {booking_id} cancelled successfully."}


@app.get("/api/cabs", response_model=List[CabPackage], summary="Get Available Cab Fleet")
def get_cabs():
    return [
        CabPackage(
            id="sedan",
            name="Swift Dzire / Toyota Etios",
            category="Sedan (AC)",
            tagline="Comfortable 4-Seater AC Cab for Local & Outstation",
            seating_capacity="4 Passengers + 1 Driver",
            starting_rate="Rs. 899 / Ride",
            image_url="assets/car_dzire.jpg",
            features=["Clean AC Interiors", "Ample Boot Space", "Carrier Included", "24/7 Roadside Assistance"]
        ),
        CabPackage(
            id="suv",
            name="Maruti Ertiga / Carens",
            category="SUV (6 Seater)",
            tagline="Spacious Family SUV Cab for Comfort Travel",
            seating_capacity="6 Passengers + 1 Driver",
            starting_rate="Rs. 1,399 / Ride",
            image_url="assets/car_ertiga.jpg",
            features=["Extra Legroom", "Rear AC Vents", "Luggage Roof Carrier", "Punctual Professional Driver"]
        ),
        CabPackage(
            id="innova",
            name="Toyota Innova Crysta",
            category="Luxury SUV (7 Seater)",
            tagline="Premium Executive Ride for Kashi & Outstation Tours",
            seating_capacity="7 Passengers + 1 Driver",
            starting_rate="Rs. 1,899 / Ride",
            image_url="assets/car_innova.jpg",
            features=["Captain Seats", "Dual AC", "Soft Suspension", "VIP Ghat & Temple Drop"]
        ),
        CabPackage(
            id="tempo",
            name="Force Tempo Traveller",
            category="Mini Bus (12-17 Seater)",
            tagline="Ideal Group Travel Vehicle for Pilgrimage & Wedding Trips",
            seating_capacity="12 to 17 Passengers",
            starting_rate="Rs. 2,999 / Ride",
            image_url="assets/car_tempo.jpg",
            features=["Pushback Seats", "Sound System", "Large Luggage Space", "Experienced Highway Driver"]
        )
    ]



# --- Static Files & Frontend Fallback Serving ---

BASE_DIR = os.path.dirname(__file__)

if os.path.exists(os.path.join(BASE_DIR, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(BASE_DIR, "assets")), name="assets")


@app.get("/style.css")
def get_style():
    return FileResponse(os.path.join(BASE_DIR, "style.css"), media_type="text/css")


@app.get("/script.js")
def get_script():
    return FileResponse(os.path.join(BASE_DIR, "script.js"), media_type="application/javascript")


@app.get("/")
def get_index():
    return FileResponse(os.path.join(BASE_DIR, "index.html"), media_type="text/html")
