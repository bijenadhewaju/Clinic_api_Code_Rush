from django.urls import path

from .views import register, profile,users_list

urlpatterns = [
    path('register/',register),
    path('profile/',profile),
    path('users/', users_list),

]