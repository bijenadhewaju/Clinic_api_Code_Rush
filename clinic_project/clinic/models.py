from django.utils import timezone

from django.db import models

from django.conf import settings


# Create your models here.
class Doctor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)
    experience = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username
class Patient(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10)
    phone = models.CharField(max_length=15)
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    address = models.TextField(blank=True)
    medical_conditions = models.TextField(blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    emergency_contact = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.user.username

class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=100,
                              choices=[
                                  ("pending","Pending"),
                                  ("approved","Approved"),
                                  ("rejected","Rejected")
                              ],default="pending")
    created_at = models.DateTimeField(default=timezone.now)
