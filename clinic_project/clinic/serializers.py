from rest_framework import serializers
from .models import Doctor, Patient, Appointment


#python to json -serializer
#json to python -deserrializer

class DoctorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Doctor
        fields = [
         'id',
         'user',
         'username',
         'specialization',
         'experience',
         'gender',
         'phone', 
         'bio',
         'is_available',
         'created_at'
        ]

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.username', read_only=True)
    patient_name = serializers.CharField(source='patient.user.username', read_only=True)
    doctor_info = serializers.StringRelatedField(source='doctor', read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'doctor', 'doctor_name', 'doctor_info', 'patient', 'patient_name', 'date', 'time', 'description', 'status', 'created_at', 'updated_at']