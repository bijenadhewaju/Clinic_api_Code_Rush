from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Doctor, Patient, Appointment, Availability
from .serializers import DoctorSerializer, PatientSerializer, AppointmentSerializer, AvailabilitySerializer
from datetime import datetime, timedelta

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_list(request):
    if request.method == 'GET':
        doctors = Doctor.objects.select_related('user').all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)

@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated])
def doctor_detail(request, pk):
    try:
        doctor = Doctor.objects.get(pk=pk)
    except Doctor.DoesNotExist:
        return Response({"error": "Not Found"}, status=404)

    user = request.user
    role = user.effective_role

    if request.method in ['PUT', 'DELETE']:
        if role == 'patient' or (role == 'doctor' and doctor.user != user):
            return Response({"error": "Unauthorized"}, status=403)

    if request.method == 'GET':
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)
    if request.method == 'PUT':
        serializer = DoctorSerializer(doctor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    if request.method == 'DELETE':
        doctor.delete()
        return Response({"message": "deleted"}, status=204)

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def patient_list(request):
    if request.method == 'GET':
        user = request.user
        role = user.effective_role
        if role == 'admin':
            patients = Patient.objects.select_related('user').all()
        elif role == 'doctor':
            doctor = getattr(user, 'doctor', None)
            if doctor:
                patient_ids = Appointment.objects.filter(doctor=doctor).values_list('patient_id', flat=True)
                patients = Patient.objects.filter(id__in=patient_ids).select_related('user')
            else:
                patients = Patient.objects.none()
        else:
            patients = Patient.objects.filter(user=user).select_related('user')

        serializer= PatientSerializer(patients, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated])
def patient_detail(request, pk):
    try:
        patient = Patient.objects.get(pk=pk)
    except Patient.DoesNotExist:
        return Response({"error": "Not Found"}, status=404)

    user = request.user
    role = user.effective_role

    # Patients cannot access other patients' profiles at all
    if role == 'patient' and patient.user != user:
        return Response({"error": "Unauthorized"}, status=403)
        
    # Doctors cannot delete/update patient profiles (only the patient themselves or admin)
    if role == 'doctor' and request.method in ['PUT', 'DELETE']:
        return Response({"error": "Unauthorized"}, status=403)

    if request.method == 'GET':
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = PatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
        
    if request.method == 'DELETE':
        patient.delete()
        return Response({"message": "deleted"}, status=204)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def appointment_list(request):
    if request.method == 'GET':
        user = request.user
        role = user.effective_role
        if role == 'doctor':
            appointments = Appointment.objects.filter(doctor__user=user).select_related('doctor__user', 'patient__user')
        elif role == 'patient':
            appointments = Appointment.objects.filter(patient__user=user).select_related('doctor__user', 'patient__user')
        else:
            appointments = Appointment.objects.select_related('doctor__user', 'patient__user').all()

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        # Automatically assign the logged-in patient if not provided
        data = request.data.copy()
        if request.user.effective_role == 'patient' and 'patient' not in data:
            try:
                patient = Patient.objects.get(user=request.user)
                data['patient'] = patient.id
            except Patient.DoesNotExist:
                return Response({"error": "Patient profile not found."}, status=404)

        serializer = AppointmentSerializer(data=data)
        if serializer.is_valid():
            doctor = serializer.validated_data['doctor']
            date = serializer.validated_data['date']
            time = serializer.validated_data['time']
            
            # Check availability constraints
            day_name = date.strftime('%A')
            try:
                availability = Availability.objects.get(doctor=doctor, day=day_name)
                # Ensure time is within start and end
                if not (availability.start_time <= time <= availability.end_time):
                    return Response({"error": f"Time outside doctor's available hours ({availability.start_time}-{availability.end_time})"}, status=400)
            except Availability.DoesNotExist:
                return Response({"error": f"Doctor is not available on {day_name}s."}, status=400)

            if Appointment.objects.filter(doctor=doctor, date=date, time=time, status__in=['pending', 'approved']).exists():
                return Response({"error": "Doctor already booked at this time"}, status=400)
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def appointment_detail(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({"error": "Not Found"}, status=404)

    #check authorization means only patient and doctor can update their appointment
    user = request.user
    role = user.effective_role
    if role == 'patient' and appointment.patient.user != user:
        return Response({"error": "Unauthorized"}, status=403)

    if role == 'doctor' and appointment.doctor.user != user:
        return Response({"error": "Unauthorized"}, status=403)

    #get appointment request by id for doctor and patient
    if request.method == 'GET':
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)

    #update and change status of  appointment request by doctor and patient
    if request.method in ['PUT', 'PATCH']:
        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    #delete appointment request
    if request.method == 'DELETE':
        appointment.delete()
        return Response({"message": "deleted"}, status=204)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def availability_list(request):
    user = request.user
    role = user.effective_role
    if role != 'doctor':
        return Response({"error": "Only doctors can manage availability"}, status=403)
        
    try:
        doctor = Doctor.objects.get(user=user)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor profile not found"}, status=404)
        
    if request.method == 'GET':
        availabilities = Availability.objects.filter(doctor=doctor)
        serializer = AvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        day = request.data.get('day')
        if Availability.objects.filter(doctor=doctor, day=day).exists():
            return Response({"error": f"Availability for {day} already exists."}, status=400)
            
        serializer = AvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(doctor=doctor)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def availability_detail(request, pk):
    user = request.user
    if user.effective_role != 'doctor':
        return Response({"error": "Only doctors can manage availability"}, status=403)
        
    try:
        doctor = Doctor.objects.get(user=user)
        availability = Availability.objects.get(pk=pk, doctor=doctor)
    except (Doctor.DoesNotExist, Availability.DoesNotExist):
        return Response({"error": "Not Found"}, status=404)
        
    if request.method == 'PUT':
        serializer = AvailabilitySerializer(availability, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
        
    elif request.method == 'DELETE':
        availability.delete()
        return Response({"message": "deleted"}, status=204)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def available_slots(request):
    doctor_id = request.query_params.get('doctor')
    date_str = request.query_params.get('date')
    if not doctor_id or not date_str:
        return Response({"error": "doctor and date are required"}, status=400)
    
    try:
        doctor = Doctor.objects.get(id=doctor_id)
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    except (Doctor.DoesNotExist, ValueError):
        return Response({"error": "Invalid doctor or date"}, status=400)
        
    day_name = date_obj.strftime('%A')
    try:
        availability = Availability.objects.get(doctor=doctor, day=day_name)
    except Availability.DoesNotExist:
        return Response({"slots": [], "message": f"Doctor not available on {day_name}s."}, status=200)
        
    start = datetime.combine(date_obj, availability.start_time)
    end = datetime.combine(date_obj, availability.end_time)
    
    slots = []
    current = start
    while current + timedelta(minutes=30) <= end:
        slots.append(current.time())
        current += timedelta(minutes=30)
        
    booked_appointments = Appointment.objects.filter(
        doctor=doctor, date=date_obj, status__in=['pending', 'approved']
    ).values_list('time', flat=True)
    
    available_time_slots = [slot.strftime('%H:%M:%S') for slot in slots if slot not in booked_appointments]
    
    return Response({
        "availability": {
            "day": day_name,
            "start": availability.start_time.strftime('%H:%M:%S'),
            "end": availability.end_time.strftime('%H:%M:%S')
        },
        "slots": available_time_slots
    }, status=200)
