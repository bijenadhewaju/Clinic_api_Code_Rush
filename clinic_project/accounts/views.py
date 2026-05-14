from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import RegistrationSerializer
from clinic.models import Doctor, Patient
from .models import User


# Create your views here.
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    print("check 11")
    print(request.data)

    serializer = RegistrationSerializer(data=request.data)

    print("check 22")
    print(serializer.is_valid())

    if serializer.is_valid():
        user = serializer.save()

        print("+++++++++++++++")
        print(user)
        print("USER CREATED:", user.username)

        # check for doctor or patient
        if user.role == "doctor":
            Doctor.objects.create(
                user=user,
                specialization=request.data['specialization'],
                experience=request.data['experience'],
                gender=request.data.get('gender', 'other'),
                phone=request.data.get('phone', '')
            )

        elif user.role == "patient":
            Patient.objects.create(
                user=user,
                age=request.data['age'],
                gender=request.data.get('gender', 'other'),
                phone=request.data.get('phone', '')
            )


        print("Doctor count:", Doctor.objects.count())
        print("Patient count:", Patient.objects.count())
        return Response({"message": "Registration successful"})
    else:
        print("ERRORS:", serializer.errors)


    return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    role = user.effective_role

    if request.method == 'GET':
        data = {
            "username": user.username,
            "email": user.email,
            "role": role,
        }
        
        if role == 'doctor':
            try:
                doctor = user.doctor
                data.update({
                    "specialization": doctor.specialization,
                    "experience": doctor.experience,
                    "gender": doctor.gender,
                    "phone": doctor.phone,
                    "is_available": doctor.is_available,
                })
            except Doctor.DoesNotExist:
                pass
        elif role == 'patient':
            try:
                patient = user.patient
                data.update({
                    "age": patient.age,
                    "gender": patient.gender,
                    "phone": patient.phone,
                    "blood_group": patient.blood_group,
                })
            except Patient.DoesNotExist:
                pass
                
        return Response(data)

    if request.method == 'PUT':
        # Update User data
        user.username = request.data.get('username', user.username)
        user.email = request.data.get('email', user.email)
        user.save()

        # Update Profile-specific data
        if role == 'doctor':
            doctor = getattr(user, 'doctor', None)
            if doctor:
                doctor.specialization = request.data.get('specialization', doctor.specialization)
                doctor.experience = request.data.get('experience', doctor.experience)
                doctor.gender = request.data.get('gender', doctor.gender)
                doctor.phone = request.data.get('phone', doctor.phone)
                doctor.is_available = request.data.get('is_available', doctor.is_available)
                doctor.save()
                
        elif role == 'patient':
            patient = getattr(user, 'patient', None)
            if patient:
                patient.age = request.data.get('age', patient.age)
                patient.gender = request.data.get('gender', patient.gender)
                patient.phone = request.data.get('phone', patient.phone)
                patient.blood_group = request.data.get('blood_group', patient.blood_group)
                patient.save()

        return Response({"message": "Profile updated successfully"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list(request):
    users = User.objects.all().values('id', 'username', 'role')
    return Response(list(users))

