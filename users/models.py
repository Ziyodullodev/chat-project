from email.policy import default
from wsgiref.validate import validator
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name="userprofile")
    image = models.ImageField(default='default.png', upload_to="media/profil", 
    validators=[FileExtensionValidator(['png', 'jpg'])])

    def __str__(self):
        return self.user.username