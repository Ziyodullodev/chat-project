from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from .models import ChatMessage
from users.models import UserProfile
class Userserializer(ModelSerializer):
    class Meta:
        model = User
        # fields = '__all__'
        fields = ['id','username']


class UserProfileserializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['image']

class ChatSerializer(ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id','message']