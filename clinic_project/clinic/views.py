from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Doctor, Patient, Appointment
from .serializers import DoctorSerializer, PatientSerializer, AppointmentSerializer

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def doctor_list(request):
    if request.method == 'GET':
        doctors = Doctor.objects.select_related('user').all()
        data = [
            {
                "id": d.id,
                "username": d.user.username,
                "specialization": d.specialization,
                "experience": d.experience,
                "is_available": d.is_available
            }
            for d in doctors
        ]
        return Response(data)

@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated])
def doctor_detail(request, pk):
    try:
        doctor = Doctor.objects.get(pk=pk)
    except Doctor.DoesNotExist:
        return Response({"error": "Not Found"}, status=404)
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
        if user.role == 'doctor':
            # Doctors see patients who have booked them
            doctor = getattr(user, 'doctor', None)
            if doctor:
                patient_ids = Appointment.objects.filter(doctor=doctor).values_list('patient_id', flat=True)
                patients = Patient.objects.filter(id__in=patient_ids).select_related('user')
            else:
                patients = Patient.objects.none()
        elif user.role == 'admin':
            patients = Patient.objects.select_related('user').all()
        else:
            # Patients see only themselves
            patients = Patient.objects.filter(user=user).select_related('user')

        data = [
            {
                "id": p.id,
                "username": p.user.username,
                "age": p.age,
                "gender": p.gender,
                "phone": p.phone,
                "blood_group": p.blood_group
            }
            for p in patients
        ]
        return Response(data)

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

        #for admin doctor and patient appointment list
        if user.role == 'doctor':
            appointments = Appointment.objects.filter(doctor__user=user).select_related('doctor__user', 'patient__user')
        elif user.role == 'patient':
            appointments = Appointment.objects.filter(patient__user=user).select_related('doctor__user', 'patient__user')
        else:
            appointments = Appointment.objects.select_related('doctor__user', 'patient__user').all()
            
        data = [
            {
                "id": a.id,
                "doctor": a.doctor.user.username,
                "doctor_id": a.doctor.id,
                "patient": a.patient.user.username,
                "patient_id": a.patient.id,
                "date": a.date,
                "time": str(a.time),
                "status": a.status,
                "description": a.description
            }
            for a in appointments
        ]
        return Response(data)
        
    elif request.method == 'POST':
        # Automatically assign the logged-in patient if not provided
        data = request.data.copy()
        if request.user.role == 'patient' and 'patient' not in data:
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
    if user.role == 'patient' and appointment.patient.user != user:
        return Response({"error": "Unauthorized"}, status=403)

    if user.role == 'doctor' and appointment.doctor.user != user:
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



