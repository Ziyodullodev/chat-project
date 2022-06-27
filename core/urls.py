from django.contrib import admin
from django.urls import path, include
from chat.views import home

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [

    path('admin/', admin.site.urls),
    path('chat/', include('chat.urls')),
    path('', include('users.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
