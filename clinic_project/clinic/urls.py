from django.urls import path

from .views import doctor_list,doctor_detail,patient_list,patient_detail,appointment_list,appointment_detail, patient_profile


urlpatterns = [

    path('doctors/',doctor_list),
    path('doctors/<int:pk>/',doctor_detail, name= 'doctor_detail'),
    path('patient/profile/', patient_profile, name='patient-profile'),
    path('patient/', patient_list, name='patient-list'), #comment this line for TDD
    path('patient/<int:pk>/', patient_detail),

    path('appointment/', appointment_list, name='appointment-list'),
    path('appointment/<int:pk>/', appointment_detail, name='appointment-detail'),
]