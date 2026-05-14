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

# for patient profile
class PatientProfileSerializer(serializers.ModelSerializer):
    # read-only — patient cannot change their own username
    username   = serializers.CharField(source='user.username', read_only=True)
    # user fields
    email      = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name', allow_blank=True)
    last_name  = serializers.CharField(source='user.last_name', allow_blank=True)
 
    class Meta:
        model = Patient
        fields = [
            # from User
            'username', 'email', 'first_name', 'last_name',
            # from Patient 
            'age', 'gender', 'phone',
            'height', 'weight',
            'address', 'blood_group', 'medical_conditions',
        ]
 
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        # update User fields
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        # update Patient fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
 
        return instance