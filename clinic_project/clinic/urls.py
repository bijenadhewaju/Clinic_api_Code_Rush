from django.urls import path

from .views import doctor_list,doctor_detail,patient_list,patient_detail,appointment_list,appointment_detail


urlpatterns = [

    path('doctors/',doctor_list),
    path('doctors/<int:pk>/',doctor_detail),
    path('patient/', patient_list),
    path('patient/<int:pk>/', patient_detail),
    path('appointment/', appointment_list),
    path('appointment/<int:pk>/', appointment_detail),
]