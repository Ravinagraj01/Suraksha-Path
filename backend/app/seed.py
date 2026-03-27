from app.core.database import Base, SessionLocal, engine
from app.core.security import get_password_hash
from app.models import DamageReport, District, Shelter, SOSRequest, State, Volunteer
from app.models.user import User


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    state = db.query(State).filter(State.code == "ST001").first()
    if not state:
        state = State(code="ST001", name="Sample State")
        db.add(state)
        db.flush()

    district = db.query(District).filter(District.code == "DT001").first()
    if not district:
        district = District(code="DT001", name="Central District", state_id=state.id)
        db.add(district)
        db.flush()

    if not db.query(Shelter).filter(Shelter.name == "City Relief Camp").first():
        db.add(
            Shelter(
                state_id=state.id,
                district_id=district.id,
                name="City Relief Camp",
                address="Ward 4, Civic Hall",
                latitude=20.5937,
                longitude=78.9629,
                total_capacity=800,
                available_capacity=540,
                amenities={"water": True, "medical": True},
            )
        )

    if not db.query(User).filter(User.email == "admin@surakshapath.in").first():
        db.add(
            User(
                full_name="State Admin",
                email="admin@surakshapath.in",
                password_hash=get_password_hash("Admin@123"),
                role="ADMIN",
                state_id=state.id,
                district_id=district.id,
                status="active",
            )
        )

    if not db.query(User).filter(User.email == "user@surakshapath.in").first():
        db.add(
            User(
                full_name="Citizen User",
                email="user@surakshapath.in",
                password_hash=get_password_hash("User@123"),
                role="USER",
                state_id=state.id,
                district_id=district.id,
                status="active",
            )
        )

    db.commit()
    admin = db.query(User).filter(User.email == "admin@surakshapath.in").first()
    user = db.query(User).filter(User.email == "user@surakshapath.in").first()

    if user and not db.query(SOSRequest).first():
        db.add(
            SOSRequest(
                user_id=user.id,
                state_id=state.id,
                district_id=district.id,
                message="Flash flood near Riverside Block, 3 people stranded",
                severity="critical",
                status="open",
                latitude=20.61,
                longitude=78.94,
                meta={"people": 3, "water_level": "high"},
            )
        )

    if user and not db.query(DamageReport).first():
        db.add(
            DamageReport(
                user_id=user.id,
                state_id=state.id,
                district_id=district.id,
                title="House wall collapse",
                description="Rear wall collapsed after heavy rainfall overnight.",
                latitude=20.58,
                longitude=78.96,
                evidence_urls=[],
                status="submitted",
            )
        )

    if user and not db.query(Volunteer).first():
        db.add(
            Volunteer(
                user_id=user.id,
                state_id=state.id,
                district_id=district.id,
                full_name="Citizen User",
                phone="+91-9876543210",
                skills=["first_aid", "rescue_support"],
                availability="daily_evening",
                latitude=20.59,
                longitude=78.95,
                status="approved" if admin else "pending",
                assigned_task="Relief supply distribution",
            )
        )

    db.commit()
    db.close()


if __name__ == "__main__":
    seed()
