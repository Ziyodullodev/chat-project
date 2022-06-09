from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from chat.models import Thread
# Create your views here.

@login_required
def home(request):
    threads = Thread.objects.by_user(user=request.user).prefetch_related('chatmessage_thread').order_by('timestamp')
    context = {
       "Threads": threads
    }

    return render(request, 'message.html', context)

def login(request):
    request.user = logout
    return redirect('home')