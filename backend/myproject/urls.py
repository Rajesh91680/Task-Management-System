"""
URL configuration for myproject project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# 🔹 ADDED: Import your register_user function from the tasks app
from tasks.views import register_user 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/tasks/', include('tasks.urls')),

    # 🔹 ADDED: The exact URL React is looking for!
    path('api/register/', register_user, name='register'),

    # JWT Login Endpoints
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]