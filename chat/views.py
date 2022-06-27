from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .serializer import Userserializer
from chat.models import Thread
# Create your views here.
from django.core import serializers
from users.models import UserProfile

@login_required
def home(request):
    threads = Thread.objects.by_user(user=request.user).prefetch_related('chatmessage_thread').order_by('timestamp')

    context = {
       "Threads": threads,
       
    }
    return render(request, 'message.html', context)



def test(request):
    return render(request, 'scroll.html')

def ChannelView(request):
    return render(request, 'channel.html')

def GroupView(request):
    return render(request, 'group.html')