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
    gender = models.CharField(max_length=10, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    address = models.TextField(blank=True,null=True)
    medical_conditions = models.TextField(blank=True,null=True)
    blood_group = models.CharField(max_length=5, blank=True,null=True)
    emergency_contact = models.CharField(max_length=15, blank=True,null=True)

    def __str__(self):
        return self.user.username
class Appointment(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("rescheduled", "Rescheduled"),
    ]

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)

    date = models.DateField()

    time = models.TimeField()

    description = models.TextField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(default=timezone.now)

    updated_at = models.DateTimeField(auto_now=True)

    cancelled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cancelled_appointments"
    )

    def _str_(self):
        return f"{self.patient} - {self.date}"