from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Doctor, Patient, Appointment
from .serializers import DoctorSerializer, PatientSerializer, AppointmentSerializer


# Create your views here.
#annotation

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def doctor_list(request):
    doctors = Doctor.objects.select_related('user').all()

    data = [
        {
            "id": d.id,
            "username": d.user.username,
            "specialization": d.specialization,
            "experience": d.experience
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
        return Response({"error : Not Found"},status=404)
    if request.method == 'GET':
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)
    if request.method == 'PUT':
        serializer = DoctorSerializer(doctor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    if request.method == 'DELETE':
        doctor.delete()
        return Response({"message" : "deleted"})

####################   patient         ###########

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def patient_list(request):
    if request.method == 'GET':

        patients = Patient.objects.select_related('user').all()

        data = [
            {
                "id": p.id,
                "username": p.user.username,
                "age": p.age,
                "gender": p.gender,
                "phone": p.phone,
                "height": p.height,
                "weight": p.weight,
                "address": p.address,
                "medical_conditions": p.medical_conditions,
                "blood_group": p.blood_group,
                "emergency_contact":p.emergency_contact
            }
            for p in patients
        ]

        return Response(data)
    if request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated])
def patient_detail(request, pk):
    try:
        patient = Patient.objects.get(pk=pk)
    except Patient.DoesNotExist:
        return Response({"error : Not Found"},status=404)
    if request.method == 'GET':
        serializer = PatientSerializer(patient)
        return Response(serializer.data)
    if request.method == 'PUT':
        serializer = PatientSerializer(patient, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    if request.method == 'DELETE':
        patient.delete()
        return Response({"message" : "deleted"})

##################### Appointment ##########################################

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def appointment_list(request):
    if request.method == 'GET':
        appointments = Appointment.objects.select_related('doctor__user', 'patient__user').all()
        data = [
            {
                "id": a.id,
                "doctor": a.doctor.user.username,
                "patient": a.patient.user.username,
                "date": a.date,
                "time": a.time
            }
            for a in appointments
        ]
        return Response(data)
    elif request.method == 'POST':
        serializer = AppointmentSerializer(data=request.data)

        if serializer.is_valid():
            doctor = serializer.validated_data['doctor']
            date = serializer.validated_data['date']
            time = serializer.validated_data['time']

            # to prevent double booking
            if Appointment.objects.filter(doctor=doctor, date=date, time=time).exists():
                return Response({"error": "Doctor already booked"}, status=400)
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def appointment_detail(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({"error : Not Found"}, status=404)
    if request.method == 'GET':
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)
    if request.method == 'PUT':
        serializer = AppointmentSerializer(appointment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    if request.method == 'DELETE':
        appointment.delete()
        return Response({"message": "deleted"})


