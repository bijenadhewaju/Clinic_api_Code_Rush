from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import RegistrationSerializer
from clinic.models import Doctor, Patient
from .models import User
from django.views.decorators.csrf import csrf_exempt
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
            Doctor.objects.create(user=user,specialization=request.data['specialization'],experience=request.data['experience'])

        elif user.role == "patient":
            print(request.user)
            print(request.data["age"])
            Patient.objects.create(user=user,age= request.data['age'])


        print("Doctor count:", Doctor.objects.count())
        print("Patient count:", Patient.objects.count())
        return Response({"message": "Registration successful"})
    else:
        print("ERRORS:", serializer.errors)


    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return Response({
        "username": request.user.username,
        "role": request.user.role
    })
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list(request):
    users = User.objects.all().values('id', 'username', 'role')
    return Response(list(users))
