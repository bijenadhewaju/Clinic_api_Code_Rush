from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Doctor, Patient, Appointment
from .serializers import DoctorSerializer, PatientSerializer, AppointmentSerializer

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

    #update and change status of appointment request by doctor and patient
    if request.method in ['PUT', 'PATCH']:
        if user.role == 'doctor':
            DOCTOR_ALLOWED_STATUSES = ['approved', 'rejected', 'cancelled', 'rescheduled', 'completed']
            new_status = request.data.get('status')
            if new_status and new_status not in DOCTOR_ALLOWED_STATUSES:
                return Response({"error": "Invalid status"}, status=400)
        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    #delete appointment request
    if request.method == 'DELETE':
        appointment.delete()
        return Response({"message": "deleted"}, status=204)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_profile(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)

    serializer = PatientProfileSerializer(patient)
    return Response(serializer.data)