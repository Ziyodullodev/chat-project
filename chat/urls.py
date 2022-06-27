from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView, LoginView

urlpatterns = [
    path('', views.home , name='home'),
    path('test', views.test , name='test'),
    path('channel/', views.ChannelView , name='channel'),
    path('group/', views.GroupView , name='group'),
]