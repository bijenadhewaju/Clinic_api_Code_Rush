from django.urls import path

from .views import home, login_page, register, home_page, doctor_home,patient_home

urlpatterns = [
    path('',home),
    path('login/',login_page),
    path('home/', home_page),
    path('register/', register),
    path('doctor_home/', doctor_home),
    path('patient_home/', patient_home),

]