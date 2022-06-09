from django.urls import path
# from . import views
from django.contrib.auth.views import LogoutView, LoginView

urlpatterns = [
    path('logout/', LogoutView.as_view(), name='logout'),
    path('login/', LoginView.as_view(template_name='user/login.html'), name='login'),
    path('signup/', LoginView.as_view(template_name='user/login.html'), name='sign-up'),
]